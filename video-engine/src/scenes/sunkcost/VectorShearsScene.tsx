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

export const VectorShearsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cutFrame = Math.round(durationInFrames * 0.44);
  const tensionT = clampedInterpolate(frame, [6, cutFrame], [0, 1], EASING.smoothInOut);
  const cutT = clampedInterpolate(
    frame,
    [cutFrame, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );
  const sparkT =
    frame >= cutFrame
      ? clampedInterpolate(frame - cutFrame, [0, 26], [0, 1], EASING.smoothOut)
      : 0;
  const vibration = frame < cutFrame ? Math.sin(frame * 1.1) * tensionT * 3.5 : 0;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.5, x: 0, y: 0 },
    { t: 0.42, scale: 1.54, x: 0, y: 0 },
    { t: 0.68, scale: 1.24, x: -160, y: -40 },
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
          {/* Volumetric spotlight over protagonist & cut zone */}
          <SpotlightCone
            topX={350}
            topWidth={100}
            bottomX={350}
            bottomY={865}
            bottomWidth={310}
            opacity={0.55 + cutT * 0.4}
          />

          {/* Protagonist stepping free as the rope snaps */}
          <PawnCharacter
            x={350}
            y={865}
            scale={0.9}
            glowIntensity={0.65 + cutT * 0.3}
            showFloorHalo
            haloProgress={0.85}
            armPose={frame >= cutFrame ? 'celebrate' : 'reachRight'}
          />

          {/* Upper & Lower Rope Halves Snapping Apart on Cut */}
          <line
            x1={960 + vibration}
            y1="200"
            x2={960 + vibration}
            y2={530 - cutT * 135}
            stroke={COLORS.white}
            strokeWidth="6"
            strokeDasharray="14 10"
            filter="url(#soft-glow)"
          />
          <line
            x1={960 - vibration}
            y1={530 + cutT * 210}
            x2={960 - vibration}
            y2={860 + cutT * 155}
            stroke={COLORS.midGrey}
            strokeWidth="6"
            strokeDasharray="14 10"
            opacity={1 - cutT * 0.68}
          />

          {/* Horizontal Razor Cut Flash */}
          {sparkT > 0.01 && sparkT < 0.98 && (
            <g filter="url(#strong-glow)">
              <line
                x1={960 - sparkT * 380}
                y1="530"
                x2={960 + sparkT * 380}
                y2="530"
                stroke={COLORS.white}
                strokeWidth="5"
                opacity={1 - sparkT}
              />
              <circle
                cx="960"
                cy="530"
                r={18 + sparkT * 105}
                fill="none"
                stroke={COLORS.white}
                strokeWidth="3"
                opacity={1 - sparkT}
              />
            </g>
          )}

          <text
            x="960"
            y="870"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            STRATEGIC QUITTING IS PRECISION
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="CUT THE ROPE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="CUT IT CLEAN."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
