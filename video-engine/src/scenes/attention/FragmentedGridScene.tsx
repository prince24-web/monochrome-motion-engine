import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FragmentedGridScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const revealBottom = clampedInterpolate(frame, [Math.round(durationInFrames * 0.46), Math.round(durationInFrames * 0.72)], [0, 1], EASING.expoOut);

  const barX = 240;
  const barW = 1440;
  const slivers = 32;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Top Bar: 8 Hours Sliced into 32 Interrupted Slivers */}
        <text x={barX} y="340" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="21" fontWeight="700" letterSpacing="0.18em">
          8 SCATTERED HOURS (0 DEEP BLOCKS)
        </text>
        {Array.from({ length: slivers }, (_, i) => {
          const sw = barW / slivers - 6;
          const sx = barX + i * (barW / slivers);
          return (
            <rect
              key={i}
              x={sx}
              y="365"
              width={sw}
              height="110"
              rx="5"
              fill="#0C0C12"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="2"
            />
          );
        })}

        {/* Bottom Bar: 2 Unbroken Luminous 90-Minute Deep Blocks */}
        <g opacity={revealBottom}>
          <text x={barX} y="625" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            2 × 90-MIN UNBROKEN BLOCKS (3× OUTPUT)
          </text>
          {[0, 1].map((idx) => {
            const bx = barX + idx * 750;
            return (
              <g key={idx} filter="url(#soft-glow)">
                <rect
                  x={bx}
                  y="650"
                  width={690 * revealBottom}
                  height="130"
                  rx="16"
                  fill="rgba(255,255,255,0.18)"
                  stroke={COLORS.white}
                  strokeWidth="3.5"
                />
                <text x={bx + 345} y="726" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="28" fontWeight="800" letterSpacing="0.14em">
                  DEEP BLOCK {idx + 1} · 90 MIN
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <PillBadge text="UNBROKEN BLOCKS WIN" x={960} y={136} enterFrame={Math.round(fps * 0.8)} />
    </div>
  );
};
