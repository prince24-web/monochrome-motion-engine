import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SkewedBellCurveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const morphT = clampedInterpolate(frame, [20, durationInFrames - 26], [0, 1], EASING.expoInOut);
  const baseY = 800;

  // Build normal bell curve vs. right-skewed fat-tail outlier curve
  const normalPts: string[] = [];
  const fatTailPts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const u = i / 100;
    const x = 220 + u * 1480;
    const bell = Math.exp(-Math.pow((u - 0.36) / 0.13, 2)) * 380;
    const tail = Math.exp(-Math.pow((u - 0.25) / 0.09, 2)) * 310 + Math.exp(-Math.pow((u - 0.78) / 0.16, 2)) * 185 * u;
    normalPts.push(`${x.toFixed(1)},${(baseY - bell).toFixed(1)}`);
    fatTailPts.push(`${x.toFixed(1)},${(baseY - (bell * (1 - morphT) + tail * morphT)).toFixed(1)}`);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="200" y1={baseY} x2="1720" y2={baseY} stroke={COLORS.midGrey} strokeWidth="2.5" />
        <polyline points={normalPts.join(' ')} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeDasharray="8 8" />
        <polyline points={fatTailPts.join(' ')} fill="none" stroke={COLORS.white} strokeWidth="4.5" filter="url(#soft-glow)" />

        <g opacity={morphT}>
          <circle cx="1420" cy={baseY - 140} r="105" fill="url(#hero-aura)" opacity="0.65" />
          <text x="1420" y={baseY - 185} textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="800" letterSpacing="0.16em">
            OUTLIER TAIL (100X)
          </text>
        </g>

        <text x="960" y="905" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="21" fontWeight="700" letterSpacing="0.18em">
          ONE OUTLIER DEFINES THE ENTIRE DECADE
        </text>
      </svg>

      <PillBadge text="FAT-TAIL OUTCOMES" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
