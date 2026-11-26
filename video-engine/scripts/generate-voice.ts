import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENGINE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(ENGINE_ROOT, '..');

dotenv.config({ path: path.join(WORKSPACE_ROOT, '.env') });

const apiKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_BACKUP].filter(
  (k): k is string => Boolean(k && k.trim())
);
if (apiKeys.length === 0) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

interface GenericStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: string;
    durationSec: number;
    narration: string;
    [key: string]: unknown;
  }>;
}

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function synthesizeText(
  text: string,
  voiceName: string,
  timeoutMs = 150_000
): Promise<{ pcm: Buffer; sampleRate: number }> {
  const prompt = [
    'Read the following narration in a calm, clear, authoritative documentary explainer tone.',
    'Keep crisp pacing with brief natural pauses between sentences, matching a modern minimalist video essay.',
    'Do not add any extra words or commentary.',
    '',
    text,
  ].join('\n');

  let lastErr: unknown;
  for (let kIdx = 0; kIdx < apiKeys.length; kIdx++) {
    const ai = new GoogleGenAI({ apiKey: apiKeys[kIdx] });
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          }),
          timeoutMs,
          'Gemini TTS request'
        );

        const audioPart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
        if (!audioPart?.inlineData?.data) {
          throw new Error('No audio data returned by Gemini TTS.');
        }

        const mimeType = audioPart.inlineData.mimeType ?? 'audio/L16;rate=24000';
        const rawBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
        const sampleRateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = sampleRateMatch ? Number(sampleRateMatch[1]) : 24000;
        const isWav = rawBuffer.subarray(0, 4).toString('ascii') === 'RIFF';
        const pcm = isWav ? rawBuffer.subarray(44) : rawBuffer;
        return { pcm, sampleRate };
      } catch (err) {
        lastErr = err;
        const msg = String(err);
        if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
          console.warn(`API key #${kIdx + 1} hit quota (429), rotating if backup available...`);
          break;
        }
        if (attempt === 1) {
          console.warn(`Attempt 1 failed (${msg.slice(0, 140)}), retrying in 3s...`);
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    }
  }
  throw lastErr ?? new Error('Gemini TTS failed on all keys.');
}

async function main() {
  const storyboardPath =
    process.argv[2] ?? path.join(ENGINE_ROOT, 'src', 'data', 'opening-demo.json');
  const voiceName = process.argv[3] ?? 'Kore';
  const chunksArg = Number(process.argv[4] ?? '1'); // Default 1 single request to save free-tier RPD quota!

  const storyboard: GenericStoryboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
  const baseName = path.basename(storyboardPath, path.extname(storyboardPath));
  const outDir = path.join(ENGINE_ROOT, 'public', 'audio');
  const cacheDir = path.join(outDir, '.cache');
  fs.mkdirSync(cacheDir, { recursive: true });

  const numChunks = Math.max(1, Math.min(chunksArg, storyboard.scenes.length));
  const chunkSize = Math.ceil(storyboard.scenes.length / numChunks);
  const chunks: Array<GenericStoryboard['scenes']> = [];
  for (let i = 0; i < storyboard.scenes.length; i += chunkSize) {
    chunks.push(storyboard.scenes.slice(i, i + chunkSize));
  }

  console.log(
    `Generating Gemini TTS voiceover for ${baseName} (voice: ${voiceName}, ${chunks.length} request${chunks.length > 1 ? 's' : ''})...`
  );

  const pcmParts: Buffer[] = [];
  let sampleRate = 24000;

  for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
    const chunkScenes = chunks[cIdx];
    const chunkScript = chunkScenes.map((s) => s.narration.trim()).join(' ');
    const cacheFile = path.join(cacheDir, `${baseName}-c${chunks.length}-${cIdx + 1}.pcm`);

    let pcm: Buffer;
    if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 1000) {
      console.log(`Using cached chunk ${cIdx + 1}/${chunks.length}...`);
      pcm = fs.readFileSync(cacheFile);
    } else {
      console.log(`Synthesizing chunk ${cIdx + 1}/${chunks.length} (${chunkScenes.length} scenes)...`);
      const res = await synthesizeText(chunkScript, voiceName);
      pcm = res.pcm;
      sampleRate = res.sampleRate;
      fs.writeFileSync(cacheFile, pcm);
    }

    pcmParts.push(pcm);

    const chunkDurationSec = pcm.length / (sampleRate * 2);
    const wordCounts = chunkScenes.map(
      (s) => s.narration.trim().split(/\s+/).filter(Boolean).length
    );
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);
    let allocated = 0;

    chunkScenes.forEach((scene, idx) => {
      if (idx === chunkScenes.length - 1) {
        scene.durationSec = Number(Math.max(1.5, chunkDurationSec - allocated).toFixed(2));
      } else {
        const dur = Number(((wordCounts[idx] / totalWords) * chunkDurationSec).toFixed(2));
        scene.durationSec = dur;
        allocated += dur;
      }
    });

    if (cIdx < chunks.length - 1) {
      const pauseBytes = Math.round(sampleRate * 0.2) * 2;
      pcmParts.push(Buffer.alloc(pauseBytes));
      chunkScenes[chunkScenes.length - 1].durationSec = Number(
        (chunkScenes[chunkScenes.length - 1].durationSec + 0.2).toFixed(2)
      );
    }
  }

  const combinedPcm = Buffer.concat(pcmParts);
  const wavBuffer = pcmToWav(combinedPcm, sampleRate, 1, 16);

  const wavFileName = `${baseName}.wav`;
  const outWavPath = path.join(outDir, wavFileName);
  fs.writeFileSync(outWavPath, wavBuffer);

  const totalDurationSec = Number((combinedPcm.length / (sampleRate * 2)).toFixed(2));
  console.log(`Saved ${outWavPath} (${totalDurationSec}s @ ${sampleRate}Hz)`);

  storyboard.audioFile = `audio/${wavFileName}`;
  fs.writeFileSync(storyboardPath, JSON.stringify(storyboard, null, 2) + '\n', 'utf-8');
  console.log(`Updated ${storyboardPath} with synced scene durations.`);
}

main().catch((err) => {
  console.error('Gemini TTS failed:', err);
  process.exit(1);
});
