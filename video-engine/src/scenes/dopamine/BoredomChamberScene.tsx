import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BoredomChamberScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Calm progress: chaotic noise rings dissolve outward as 72 hours tick up
  const calmT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const hoursVal = calmT * 72;

  const cx = 960;
  const cy = 585;

  const noiseTags = [
    { label: 'FEEDS', angle: 0.4 },
    { label: 'ALERTS', angle: 2.1 },
    { label: 'SCROLLING', angle: 3.7 },
    { label: 'NOISE', angle: 5.2 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Minimalist Wireframe Silence Chamber */}
        <circle
          cx={cx}
          cy={cy}
          r={235}
          fill="#09090D"
          stroke={COLORS.white}
          strokeWidth="3"
          opacity={0.45 + calmT * 0.55}
          filter="url(#soft-glow)"
        />
        <circle
          cx={cx}
          cy={cy}
          r={285}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2"
          strokeDasharray="10 12"
        />

        {/* Orbiting Noise Tags drifting outward and dissolving into silence */}
        {noiseTags.map((tag, i) => {
          const orbitR = 320 + calmT * 360;
          const a = tag.angle + frame * 0.015 * (1 - calmT * 0.6);
          const nx = cx + Math.cos(a) * orbitR;
          const ny = cy + Math.sin(a) * orbitR * 0.55;
          const op = Math.max(0, 0.85 - calmT * 0.85);
          return (
            <g key={i} transform={`translate(${nx}, ${ny})`} opacity={op}>
              <rect x="-78" y="-22" width="156" height="44" rx="22" fill="#0B0B10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <text
                x="0"
                y="7"
                textAnchor="middle"
                fill={COLORS.softWhite}
                fontFamily={FONT_FAMILY}
                fontSize="18"
                fontWeight="700"
                letterSpacing="0.16em"
              >
                {tag.label}
              </text>
            </g>
          );
        })}

        {/* Calm Protagonist centered in stillness */}
        <PawnCharacter
          x={cx}
          y={cy + 95}
          scale={1.08}
          glowIntensity={0.45 + calmT * 0.5}
          showFloorHalo
          haloProgress={0.5 + calmT * 0.5}
        />
      </svg>

      <RollingCounter
        label="DELIBERATE SILENCE"
        value={hoursVal}
        suffix=" HRS"
        x={960}
        y={235}
        fontSize={80}
        labelSize={19}
      />

      <PillBadge text="DELIBERATE BOREDOM" x={960} y={132} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
