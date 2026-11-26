import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const NoiseToSignalWaveScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Morphs from chaotic jagged static -> razor-clean pure sine wave!
  const cleanT = clampedInterpolate(frame, [16, durationInFrames - 22], [0, 1], EASING.expoInOut);
  const cy = 560;
  const pts: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const u = i / 140;
    const x = 180 + u * 1560;
    const noise =
      Math.sin(i * 2.7 + frame * 0.35) * 95 +
      Math.cos(i * 6.3 - frame * 0.25) * 65 +
      Math.sin(i * 11.1) * 45;
    const pure = Math.sin(u * Math.PI * 4 - frame * 0.08) * 145;
    const y = cy + noise * (1 - cleanT) + pure * cleanT;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="180" y1={cy} x2="1740" y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="10 10" />
        <polyline points={pts.join(' ')} fill="none" stroke={COLORS.white} strokeWidth={3 + cleanT * 2.5} filter="url(#soft-glow)" />
        <text x="960" y="890" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          {cleanT > 0.5 ? 'CLEAR STANDARDS CREATE PURE SIGNAL' : '10,000 SYNTHETIC VARIATIONS OF STATIC'}
        </text>
      </svg>

      <PillBadge text="SIGNAL OVER NOISE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
