import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DivingBellScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const descendT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const bellY = 270 + descendT * 510;
  const depthMeters = descendT * 1000;

  const bands = [
    { label: 'SURFACE · NOISE', y: 310 },
    { label: 'SHALLOW WORK', y: 495 },
    { label: 'FLOW ZONE', y: 675 },
    { label: 'DEEP WORK', y: 835 },
  ];

  // Camera: track diving bell from noisy surface down through flow zone into deep work -> wide depth pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: -230 },
    { t: 0.36, scale: 1.36, x: 0, y: -15 },
    { t: 0.72, scale: 1.4, x: 0, y: 215 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
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
          {/* Volumetric spotlight descending down the deep-work shaft */}
          <SpotlightCone
            topX={960}
            topWidth={110}
            bottomX={960}
            bottomY={bellY + 120}
            bottomWidth={340}
            opacity={0.45 + descendT * 0.4}
          />

          {/* Depth Bands */}
          {bands.map((b) => {
            const passed = bellY >= b.y - 25;
            return (
              <g key={b.label}>
                <line
                  x1="220"
                  y1={b.y}
                  x2="1700"
                  y2={b.y}
                  stroke={passed ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)'}
                  strokeWidth="2"
                  strokeDasharray="10 12"
                />
                <text
                  x="1690"
                  y={b.y - 12}
                  textAnchor="end"
                  fill={passed ? COLORS.white : COLORS.midGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="0.16em"
                >
                  {b.label}
                </text>
              </g>
            );
          })}

          {/* Vertical Tether Cable */}
          <line
            x1="960"
            y1="160"
            x2="960"
            y2={bellY - 58}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="3"
          />

          {/* Wireframe Deep-Sea Diving Bell with Protagonist Inside */}
          <g transform={`translate(960, ${bellY})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="125" fill="url(#hero-aura)" opacity={0.3 + descendT * 0.6} />
            <path
              d="M -60 52 L -60 -16 A 60 60 0 0 1 60 -16 L 60 52 Z"
              fill="#0A0A0E"
              stroke={COLORS.white}
              strokeWidth="3.5"
            />
            <PawnCharacter x={0} y={42} scale={0.36} glowIntensity={0.85} bob={false} />
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DESCENDING INTO FLOW" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="FOCUS DEPTH"
        value={depthMeters}
        suffix=" M"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="DEPTH TAKES TIME."
        subtext="REAL WORK LIVES BELOW THE NOISE"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
