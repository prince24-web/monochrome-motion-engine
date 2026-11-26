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

export const AutopilotRailScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 12], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const glideT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const capsuleX = 280 + glideT * 1340;

  // Camera: track protagonist & autopilot capsule gliding smoothly left to right -> wide rail reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -500, y: 20 },
    { t: 0.42, scale: 1.32, x: -40, y: 15 },
    { t: 0.74, scale: 1.38, x: 460, y: 15 },
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
          {/* Tracking Volumetric Spotlight over gliding protagonist */}
          <SpotlightCone
            topX={capsuleX}
            topWidth={115}
            bottomX={capsuleX}
            bottomY={675}
            bottomWidth={340}
            opacity={0.78}
          />

          {/* Parallel Magnetic Levitation Rails */}
          <line
            x1="140"
            y1="635"
            x2="1780"
            y2="635"
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />
          <line
            x1="140"
            y1="661"
            x2="1780"
            y2="661"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.5"
            strokeDasharray="14 14"
            strokeDashoffset={-frame * 10}
          />

          {/* Protagonist riding effortlessly atop the autopilot capsule */}
          <PawnCharacter
            x={capsuleX}
            y={542}
            scale={0.76}
            glowIntensity={0.88}
            bob={false}
          />

          {/* Effortless Gliding Capsule */}
          <g transform={`translate(${capsuleX}, 577)`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="120" fill="url(#hero-aura)" opacity="0.65" />
            <rect
              x="-115"
              y="-34"
              width="230"
              height="68"
              rx="34"
              fill="#0B0B10"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text
              x="0"
              y="9"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="900"
              letterSpacing="0.16em"
            >
              AUTOPILOT
            </text>
          </g>

          <text
            x="960"
            y="765"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            ZERO MENTAL FRICTION · EFFORTLESS EXECUTION
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="RUNS ON AUTOPILOT" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ZERO WILLPOWER SPENT."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
