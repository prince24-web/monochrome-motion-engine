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

export const SinkingShipScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sinkT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const waterY = 660;
  const shipY = 585 + sinkT * 145;
  const shipTilt = -4 - sinkT * 18;
  const hoursLost = Math.round(120 + sinkT * 880);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: -40 },
    { t: 0.36, scale: 1.32, x: -240, y: 30 },
    { t: 0.68, scale: 1.42, x: 60, y: 110 },
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
          {/* Dimming volumetric spotlight over the sinking ship & protagonist */}
          <SpotlightCone
            topX={960}
            topWidth={160}
            bottomX={960}
            bottomY={waterY}
            bottomWidth={540}
            opacity={0.7 - sinkT * 0.38}
          />
          <SpotlightCone
            topX={290}
            topWidth={95}
            bottomX={290}
            bottomY={waterY}
            bottomWidth={280}
            opacity={0.65}
          />

          {/* Wireframe Sinking Ship Hull */}
          <g transform={`translate(960, ${shipY}) rotate(${shipTilt})`} filter="url(#soft-glow)">
            <polygon
              points="-240,-20 240,-20 175,90 -175,90"
              fill="#0A0A0E"
              stroke={COLORS.white}
              strokeWidth="3.5"
            />
            <line x1="0" y1="-20" x2="0" y2="-210" stroke={COLORS.white} strokeWidth="3.5" />
            <polygon
              points="0,-200 135,-85 0,-55"
              fill="rgba(255,255,255,0.12)"
              stroke={COLORS.white}
              strokeWidth="2.5"
            />
          </g>

          {/* Protagonist standing on pier watching the ship go down */}
          <PawnCharacter
            x={290}
            y={waterY}
            scale={0.86}
            glowIntensity={0.68 - sinkT * 0.2}
            showFloorHalo
            haloProgress={0.8}
            armPose="reachRight"
          />

          {/* Waterline Masking Lower Hull */}
          <rect
            x="0"
            y={waterY}
            width={VIDEO_CONFIG.width}
            height="420"
            fill="#07070A"
            opacity="0.86"
          />
          <line
            x1="140"
            y1={waterY}
            x2="1780"
            y2={waterY}
            stroke={COLORS.white}
            strokeWidth="3"
            strokeDasharray="14 12"
            strokeDashoffset={-frame * 1.4}
          />

          <text
            x="960"
            y="815"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            PAST EFFORT IS ALREADY GONE
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE SUNK COST TRAP" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="HOURS SUNK"
        value={hoursLost}
        suffix="H"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="ABANDON SHIP."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
