import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TasteTuningForkScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const cy = 540;
  const vib = Math.sin(frame * 0.85) * 3.5;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Expanding Pure Harmonic Rings */}
        {[0, 1, 2, 3].map((i) => {
          const r = 70 + ((frame * 4.2 + i * 95) % 380);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy - 60}
              r={r}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="2.5"
              opacity={Math.max(0, 1 - r / 450) * 0.65}
            />
          );
        })}

        {/* Minimalist Wireframe Tuning Fork */}
        <g transform={`translate(${cx}, ${cy})`} filter="url(#soft-glow)">
          <path
            d={`M ${-54 + vib} -175 L ${-54 + vib} -10 A 54 54 0 0 0 ${54 - vib} -10 L ${54 - vib} -175`}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line x1="0" y1="44" x2="0" y2="215" stroke={COLORS.white} strokeWidth="8" strokeLinecap="round" />
          <circle cx="0" cy="215" r="14" fill={COLORS.white} />
        </g>

        <text x={cx} y="895" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          HUMAN TASTE KNOWS WHAT FEELS UNMISTAKABLY REAL
        </text>
      </svg>

      <PillBadge text="HUMAN TASTE" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
