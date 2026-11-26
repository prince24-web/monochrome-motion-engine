import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const KeystonePullScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Keystone slides out at 30% -> entire tower tilts & fractures!
  const pullFrame = Math.round(durationInFrames * 0.28);
  const pullT = clampedInterpolate(frame, [pullFrame, pullFrame + 32], [0, 1], EASING.expoOut);
  const collapseSpring =
    frame >= pullFrame + 16
      ? spring({ frame: frame - (pullFrame + 16), fps, config: { damping: 12, stiffness: 80, mass: 1.2 } })
      : 0;

  const baseY = 850;
  const cx = 960;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="480" y1={baseY} x2="1440" y2={baseY} stroke="rgba(255,255,255,0.34)" strokeWidth="3" />

        {/* Upper Tower Tilting & Splitting Apart */}
        <g transform={`translate(${cx + 120}, ${baseY - 52}) rotate(${collapseSpring * 26}) translate(${-(cx + 120)}, ${-(baseY - 52)})`}>
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <rect
              key={row}
              x={cx - 140 + (row % 2 === 0 ? collapseSpring * 24 : -collapseSpring * 18)}
              y={baseY - (row + 1) * 52 + collapseSpring * row * 4}
              width="280"
              height="44"
              rx="6"
              fill="#0B0B10"
              stroke="rgba(255,255,255,0.58)"
              strokeWidth="2.5"
              opacity={1 - collapseSpring * 0.35}
            />
          ))}
        </g>

        {/* Bottom Pulled Keystone ("1 SHORTCUT") */}
        <g transform={`translate(${cx - 140 - pullT * 260}, ${baseY - 50})`} filter="url(#soft-glow)">
          <rect x="0" y="0" width="280" height="46" rx="6" fill={COLORS.white} />
          <text x="140" y="30" textAnchor="middle" fill={COLORS.bg} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="900" letterSpacing="0.14em">
            1 SHORTCUT
          </text>
        </g>

        <text x={cx} y="925" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          YEARS TO BUILD · SECONDS TO COLLAPSE
        </text>
      </svg>

      <PillBadge text="DROPS LIKE A CLIFF" x={cx} y={136} enterFrame={pullFrame + 8} />
    </div>
  );
};
