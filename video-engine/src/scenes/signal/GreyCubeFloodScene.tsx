import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const GreyCubeFloodScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const floodT = clampedInterpolate(frame, [8, durationInFrames - 20], [0, 1], EASING.smoothOut);
  const priceVal = 100 * (1 - floodT);

  const cols = 12;
  const rows = 5;
  const total = cols * rows;
  const visible = Math.floor(floodT * total);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {Array.from({ length: visible }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 300 + col * 112;
          const y = 780 - row * 102;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="92"
              height="86"
              rx="10"
              fill="#0E0E14"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
            />
          );
        })}

        <text x="960" y="935" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          INFINITE SUPPLY → PRICE COLLAPSES TO ZERO
        </text>
      </svg>

      <RollingCounter label="VALUE OF AVERAGE" prefix="$" value={priceVal} x={960} y={248} fontSize={92} labelSize={20} />
      <PillBadge text="INFINITE SUPPLY" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
