import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const HorizonArchitectScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 18], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Horizon vanishing point at (960, 565)
  const vpX = 960;
  const vpY = 565;

  // Perspective grid lines scrolling smoothly toward viewer
  const scrollT = (frame * 0.015) % 1;

  // Orbiting geometric system nodes around protagonist
  const orbitNodes = [
    { label: 'CODE', angleOffset: 0 },
    { label: 'MEDIA', angleOffset: (Math.PI * 2) / 3 },
    { label: 'SYSTEMS', angleOffset: (Math.PI * 4) / 3 },
  ];

  const headline1Op = clampedInterpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 1.2)], [0, 1], EASING.expoOut);
  const headline2Op = clampedInterpolate(frame, [Math.round(fps * 1.6), Math.round(fps * 2.3)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Soft glowing horizon sun / vanishing point aura */}
        <circle cx={vpX} cy={vpY} r="360" fill="url(#hero-aura)" opacity="0.52" />

        {/* Horizon baseline */}
        <line
          x1="0"
          y1={vpY}
          x2={VIDEO_CONFIG.width}
          y2={vpY}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2.5"
        />

        {/* Perspective Radiating Grid Lines from Vanishing Point to Bottom Edge */}
        {Array.from({ length: 17 }, (_, i) => {
          const frac = (i - 8) / 8;
          const bottomX = vpX + frac * 1700;
          return (
            <line
              key={`rad-${i}`}
              x1={vpX}
              y1={vpY}
              x2={bottomX}
              y2={VIDEO_CONFIG.height + 20}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.6"
            />
          );
        })}

        {/* Perspective Horizontal Depth Lines scrolling toward camera */}
        {Array.from({ length: 9 }, (_, i) => {
          const raw = (i + scrollT) / 9;
          const y = vpY + Math.pow(raw, 2.2) * (VIDEO_CONFIG.height - vpY);
          return (
            <line
              key={`hor-${i}`}
              x1="0"
              y1={y}
              x2={VIDEO_CONFIG.width}
              y2={y}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.6"
              opacity={0.25 + raw * 0.75}
            />
          );
        })}

        {/* Volumetric center spotlight onto the Architect Protagonist */}
        <SpotlightCone
          topX={vpX}
          topWidth={130}
          bottomX={vpX}
          bottomY={925}
          bottomWidth={440}
          opacity={0.95}
        />

        {/* Orbiting System Nodes (CODE, MEDIA, SYSTEMS) feeding into the Architect */}
        {orbitNodes.map((node, i) => {
          const angle = frame * 0.018 + node.angleOffset;
          const ox = vpX + Math.cos(angle) * 410;
          const oy = 685 + Math.sin(angle) * 95;
          return (
            <g key={i}>
              <line
                x1={ox}
                y1={oy}
                x2={vpX}
                y2={780}
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="2"
                strokeDasharray="7 9"
              />
              <g transform={`translate(${ox}, ${oy})`} filter="url(#soft-glow)">
                <rect
                  x="-68"
                  y="-24"
                  width="136"
                  height="48"
                  rx="24"
                  fill="#0A0A0E"
                  stroke={COLORS.white}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  fill={COLORS.white}
                  fontFamily={FONT_FAMILY}
                  fontSize="18"
                  fontWeight="800"
                  letterSpacing="0.16em"
                >
                  {node.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Foreground Architect Protagonist standing calmly overlooking the system */}
        <PawnCharacter
          x={vpX}
          y={915}
          scale={1.15}
          glowIntensity={0.95}
          showFloorHalo
          haloProgress={1}
          armPose="celebrate"
        />
      </svg>

      {/* Finale Headlines */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 205,
          transform: `translate(-50%, -50%) translateY(${(1 - headline1Op) * 18}px)`,
          opacity: headline1Op,
          fontFamily: FONT_FAMILY,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        STOP RENTING YOUR TIME.
      </div>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 295,
          transform: `translate(-50%, -50%) translateY(${(1 - headline2Op) * 20}px)`,
          opacity: headline2Op,
          fontFamily: FONT_FAMILY,
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255, 255, 255, 0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        BUILD LEVERAGE.
      </div>
    </div>
  );
};
