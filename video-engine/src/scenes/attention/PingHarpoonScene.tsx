import React from 'react';
import { spring, useCurrentFrame } from 'remotion';
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

export const PingHarpoonScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Ping hits at 32% of scene -> violently yanks diving bell from y=790 straight back up to y=300!
  const pingFrame = Math.round(durationInFrames * 0.32);
  const yankSpring =
    frame >= pingFrame
      ? spring({
          frame: frame - pingFrame,
          fps: 60,
          config: { damping: 13, stiffness: 120, mass: 0.9 },
        })
      : 0;

  const bellY = 790 - yankSpring * 490;
  const pingWave =
    frame >= pingFrame
      ? clampedInterpolate(frame - pingFrame, [0, 42], [0, 1], EASING.smoothOut)
      : 0;

  // Camera: start deep with diving bell -> snap up to surface as 1 PING yanks it back -> wide shock reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 0, y: 235 },
    { t: 0.3, scale: 1.42, x: 0, y: 210 },
    { t: 0.56, scale: 1.44, x: 0, y: -215 },
    { t: 0.88, scale: 1.0, x: 0, y: 0 },
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
          {/* Volumetric spotlight beam along winch line */}
          <SpotlightCone
            topX={960}
            topWidth={105}
            bottomX={960}
            bottomY={bellY + 110}
            bottomWidth={310}
            opacity={0.72}
          />

          {/* Surface & Deep lines */}
          <line
            x1="220"
            y1="290"
            x2="1700"
            y2="290"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.5"
            strokeDasharray="10 10"
          />
          <line
            x1="220"
            y1="810"
            x2="1700"
            y2="810"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />

          {/* Notification Bell Icon at Surface */}
          <g transform="translate(960, 210)" filter="url(#soft-glow)">
            {pingWave > 0.01 && pingWave < 0.98 && (
              <circle
                cx="0"
                cy="0"
                r={36 + pingWave * 160}
                fill="none"
                stroke={COLORS.white}
                strokeWidth="3"
                opacity={1 - pingWave}
              />
            )}
            <rect
              x="-76"
              y="-26"
              width="152"
              height="52"
              rx="26"
              fill={frame >= pingFrame ? COLORS.white : '#0B0B10'}
              stroke={COLORS.white}
              strokeWidth="3"
            />
            <text
              x="0"
              y="8"
              textAnchor="middle"
              fill={frame >= pingFrame ? COLORS.bg : COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="900"
              letterSpacing="0.14em"
            >
              1 PING
            </text>
          </g>

          {/* Winch Cable Yanking Bell Up */}
          <line
            x1="960"
            y1="238"
            x2="960"
            y2={bellY - 56}
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />

          {/* Diving Bell with Protagonist Inside Yanked Back to Surface */}
          <g transform={`translate(960, ${bellY})`} filter="url(#soft-glow)">
            <path
              d="M -60 52 L -60 -16 A 60 60 0 0 1 60 -16 L 60 52 Z"
              fill="#0A0A0E"
              stroke={COLORS.white}
              strokeWidth="3.5"
            />
            <PawnCharacter x={0} y={42} scale={0.36} glowIntensity={0.8} bob={false} />
          </g>

          <text
            x="960"
            y="870"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            5-SECOND CHECK → BACK TO ZERO DEPTH
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="INSTANT RESET" x={960} y={96} enterFrame={pingFrame + 4} />

      <PunchlineCallout
        text="ONE PING RESETS."
        subtext="BACK TO ZERO DEPTH IN A SECOND"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
