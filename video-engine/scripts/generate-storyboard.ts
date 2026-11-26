import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import type { VideoStoryboard } from '../src/schema/storyboard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENGINE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(ENGINE_ROOT, '..');

dotenv.config({ path: path.join(WORKSPACE_ROOT, '.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const VALID_TYPES = new Set([
  'one-percent-buyer',
  'progress-ring-goal',
  'failing-gauge',
  'morphing-shape',
  'majority-crowd',
  'wireframe-globe',
  'nested-zoom-grid',
  'buyer-queue',
  'timeline-scrubber',
  'wireframe-calculator',
  'tribe-scale',
  'growth-curve',
]);

const SYSTEM_PROMPT = `You are a motion-graphics director for dark-monochrome 16:9 (1920x1080, 60fps) explainer videos in the @cryothum style.
Given a topic or raw narration script, output a single valid JSON object matching the VideoStoryboard schema.

Available scene types and their exact props:
1. "one-percent-buyer": { counterLabel, counterStart, counterMid, counterEnd, counterPrefix?, pillText, highlightIndex? }
2. "progress-ring-goal": { pillText, counterLabel, percentStart, percentEnd, targetLabel }
3. "failing-gauge": { pillText, leftLabel, rightLabel, ignoredLabel, ignoredCount }
4. "morphing-shape": { versionStart, versionEnd, lovedStart, lovedEnd, pillText }
5. "majority-crowd": { leftLabel, majorityLabel, majorityPercent, pillText }
6. "wireframe-globe": { topLabelA, countA, pillA, topLabelB, countB, pillB }
7. "nested-zoom-grid": { outerPill, outerCounterLabel, outerCounterValue, bottomCaption, innerPill }
8. "buyer-queue": { counterLabel, counterStart, counterEnd, pillText }
9. "timeline-scrubber": { leftMetricLabel, leftMetricValue, rightMetricLabel, moneyStart, moneyEnd, pillText, startAge?, endAge? }
10. "wireframe-calculator": { screenHeader, line1, line2, resultLine, sideBoxTitle, sideBoxSubtitle, pillText }
11. "tribe-scale": { introPill, groupPill, groupSizeLabel, rejectedEnd, everyonePill, scalePill, leftPanLabel, rightPanLabel, warningLabel }
12. "growth-curve": { counterLabel, moneyStart, moneyEnd, headlineText, crowdPillText, axisLabel? }

Rules:
- Output ONLY raw JSON: { "title": string, "fps": 60, "width": 1920, "height": 1080, "scenes": [...] }.
- Each scene has: { "id": string, "type": <one of the 12 types>, "durationSec": number (3.0 to 7.0), "narration": string, "props": {...} }.
- Keep pillText and micro-labels punchy, uppercase, 2-4 words max.
- Keep narration crisp, punchy, documentary-style (1-2 sentences per scene), flowing smoothly from hook to climax.
- End on a strong "growth-curve" finale whenever appropriate.`;

async function main() {
  const inputTopicOrScript = process.argv[2];
  const outPath =
    process.argv[3] ?? path.join(ENGINE_ROOT, 'src', 'data', 'generated-storyboard.json');

  if (!inputTopicOrScript) {
    console.error('Usage: npm run storyboard -- "<topic or script>" [output-json-path]');
    process.exit(1);
  }

  console.log(`Generating storyboard with Gemini for: "${inputTopicOrScript.slice(0, 80)}"...`);
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `Create a 6-to-12 scene dark-monochrome explainer storyboard for:\n\n${inputTopicOrScript}` }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text?.trim();
  if (!text) {
    console.error('Error: Empty response from Gemini.');
    process.exit(1);
  }

  const parsed = JSON.parse(text) as VideoStoryboard;
  if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    console.error('Error: Generated JSON has no scenes.');
    process.exit(1);
  }

  for (const scene of parsed.scenes) {
    if (!VALID_TYPES.has(scene.type)) {
      console.error(`Error: Unknown scene type "${scene.type}" in generated storyboard.`);
      process.exit(1);
    }
  }

  parsed.fps = 60;
  parsed.width = 1920;
  parsed.height = 1080;

  const resolvedOut = path.resolve(outPath);
  fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
  fs.writeFileSync(resolvedOut, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
  console.log(`Saved ${parsed.scenes.length}-scene storyboard to ${resolvedOut}`);
}

main().catch((err) => {
  console.error('Storyboard generation failed:', err);
  process.exit(1);
});
