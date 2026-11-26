import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PrismFilterScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const passT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const filterX = 920;
  const cy = 540;
  const crystalX = filterX + 120 + passT * 420;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -390, y: 0 },
    { t: 0.36, scale: 1.46, x: -20, y: 0 },
    { t: 0.7, scale: 1.42, x: 390, y: 0 },
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
          {/* Volumetric spotlight following the emerging 1% crystal */}
          <SpotlightCone
            topX={crystalX}
            topWidth={110}
            bottomX={crystalX}
            bottomY={860}
            bottomWidth={380}
            opacity={0.35 + passT * 0.62}
          />

          {/* Incoming Stream of Grey Noise Cubes on Left (deterministic sine-hash seeds) */}
          {Array.from({ length: 10 }, (_, i) => {
            const phase = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
            const speed = 0.018 + (Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1) * 0.012;
            const dy = Math.sin(i * 45.164) * 155;
            const prog = (frame * speed + phase) % 1;
            const x = 160 + prog * (filterX - 220);
            return (
              <rect
                key={i}
                x={x}
                y={cy + dy - 16}
                width="32"
                height="32"
                rx="5"
                fill="#121218"
                stroke="rgba(255,255,255,0.34)"
                strokeWidth="2"
                opacity={1 - prog * 0.35}
              />
            );
          })}

          {/* Vertical Magnetic Filter Gate */}
          <line
            x1={filterX}
            y1="230"
            x2={filterX}
            y2="830"
            stroke={COLORS.white}
            strokeWidth="5"
            strokeDasharray="16 10"
            strokeDashoffset={-frame * 2.2}
            filter="url(#soft-glow)"
          />

          {/* Single Isolated Blazing 1% Crystal Emerging on Right */}
          <g transform={`translate(${crystalX}, ${cy})`} filter="url(#strong-glow)">
            <circle
              cx="0"
              cy="0"
              r={125 + Math.sin(frame * 0.14) * 12}
              fill="url(#hero-aura)"
              opacity="0.88"
            />
            <polygon points="0,-64 52,0 0,64 -52,0" fill={COLORS.white} />
          </g>

          <text
            x="520"
            y="855"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            99% REJECTED NOISE
          </text>
          <text
            x="1360"
            y="855"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            1% RARE SIGNAL
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE SIGNAL FILTER" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ONLY 1% SURVIVES."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
