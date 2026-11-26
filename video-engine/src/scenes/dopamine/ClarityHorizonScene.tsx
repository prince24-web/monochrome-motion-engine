import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ClarityHorizonScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Smooth calm elevated sine wave above zero baseline
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = 140 + (i / 100) * 1640;
    const y = 690 + Math.sin(i * 0.16 - frame * 0.06) * 22;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 1.2)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 2.2)], [0, 1], EASING.expoOut);

  const pillars = [
    { label: 'FOCUS', x: 460 },
    { label: 'CREATE', x: 960 },
    { label: 'BUILD', x: 1460 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone topX={960} topWidth={140} bottomX={960} bottomY={940} bottomWidth={520} />

        {/* Elevated Calm Sine Wave */}
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke={COLORS.white}
          strokeWidth="4"
          opacity="0.7"
          filter="url(#soft-glow)"
        />

        {/* Ignited Magnetic Habit Nodes */}
        {pillars.map((p, idx) => {
          const op = clampedInterpolate(frame, [16 + idx * 14, 42 + idx * 14], [0, 1], EASING.expoOut);
          return (
            <g key={p.label} transform={`translate(${p.x}, 540)`} opacity={op} filter="url(#soft-glow)">
              <rect x="-95" y="-32" width="190" height="64" rx="32" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3" />
              <text
                x="0"
                y="9"
                textAnchor="middle"
                fill={COLORS.white}
                fontFamily={FONT_FAMILY}
                fontSize="22"
                fontWeight="800"
                letterSpacing="0.18em"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        <PawnCharacter
          x={960}
          y={915}
          scale={1.12}
          glowIntensity={0.95}
          showFloorHalo
          haloProgress={1}
          armPose="celebrate"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 205,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        RESET YOUR BASELINE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 295,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 80,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 40px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        RECLAIM YOUR DRIVE.
      </div>
    </div>
  );
};
