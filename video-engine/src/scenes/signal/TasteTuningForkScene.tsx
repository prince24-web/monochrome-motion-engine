import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
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

  const resT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cx = 960;
  const cy = 530;
  const vib = Math.sin(frame * 0.85) * (2.5 + resT * 2.5);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.52, x: 0, y: -95 },
    { t: 0.36, scale: 1.32, x: -200, y: 20 },
    { t: 0.68, scale: 1.24, x: 0, y: -15 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Volumetric spotlight over tuning fork resonance field */}
          <SpotlightCone
            topX={cx}
            topWidth={130}
            bottomX={cx}
            bottomY={860}
            bottomWidth={500}
            opacity={0.45 + resT * 0.45}
          />

          {/* Protagonist tuned into the pure harmonic signal */}
          <PawnCharacter
            x={300}
            y={870}
            scale={0.86}
            glowIntensity={0.62 + resT * 0.32}
            showFloorHalo
            haloProgress={0.85}
          />

          {/* Expanding Pure Harmonic Rings */}
          {[0, 1, 2, 3, 4].map((i) => {
            const r = 70 + ((frame * 4.2 + i * 76) % 380);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy - 60}
                r={r}
                fill="none"
                stroke={COLORS.white}
                strokeWidth="2.5"
                opacity={Math.max(0, 1 - r / 450) * (0.45 + resT * 0.4)}
              />
            );
          })}

          {/* Minimalist Wireframe Tuning Fork */}
          <g transform={`translate(${cx}, ${cy})`} filter="url(#soft-glow)">
            <circle cx="0" cy="-60" r={130 + resT * 40} fill="url(#hero-aura)" opacity={0.35 + resT * 0.4} />
            <path
              d={`M ${-54 + vib} -175 L ${-54 + vib} -10 A 54 54 0 0 0 ${54 - vib} -10 L ${54 - vib} -175`}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="44"
              x2="0"
              y2="215"
              stroke={COLORS.white}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="0" cy="215" r="14" fill={COLORS.white} />
          </g>

          <text
            x={cx}
            y="855"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            HUMAN TASTE KNOWS WHAT FEELS UNMISTAKABLY REAL
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="HUMAN TASTE" x={cx} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="FEEL THE SIGNAL."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
