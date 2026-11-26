import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const InvisibleShieldScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Glowing Hexagonal Reputation Shield */}
        <polygon
          points={`${cx},${cy - 240} ${cx + 210},${cy - 120} ${cx + 210},${cy + 120} ${cx},${cy + 240} ${cx - 210},${cy + 120} ${cx - 210},${cy - 120}`}
          fill="#09090D"
          stroke={COLORS.white}
          strokeWidth="4"
          filter="url(#soft-glow)"
        />

        {/* Deflected Critic / Rumor Arrows bouncing off shield */}
        {[-120, 0, 120].map((dy, i) => {
          const cycle = ((frame * 0.03 + i * 0.33) % 1);
          const ax = 360 + cycle * 350;
          const deflect = cycle > 0.7 ? (cycle - 0.7) * 260 : 0;
          return (
            <g key={i} opacity={1 - deflect / 110}>
              <line
                x1={ax - 55}
                y1={cy + dy + deflect * (i === 0 ? -1 : 1)}
                x2={ax}
                y2={cy + dy + deflect * (i === 0 ? -1 : 1)}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        <PawnCharacter x={cx} y={cy + 95} scale={1.04} glowIntensity={0.9} showFloorHalo haloProgress={1} />

        <text x={cx} y="905" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          YOUR HISTORY DEFENDS YOU LOUDER THAN EXCUSES
        </text>
      </svg>

      <PillBadge text="THE INVISIBLE SHIELD" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
