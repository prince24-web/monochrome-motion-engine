import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const EffortlessFlowFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.45), Math.round(fps * 1.15)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.35), Math.round(fps * 2.1)], [0, 1], EASING.expoOut);

  // Camera: start intimate on hero -> pull back to reveal harmonious geometric environment frame
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: 185 },
    { t: 0.44, scale: 1.24, x: 0, y: 80 },
    { t: 0.82, scale: 1.0, x: 0, y: 0 },
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
          <SpotlightCone
            topX={960}
            topWidth={140}
            bottomX={960}
            bottomY={940}
            bottomWidth={520}
            opacity={0.75 + sweepT * 0.25}
          />

          {/* Clean Geometric Room Frame */}
          <rect
            x="480"
            y="450"
            width="960"
            height="455"
            rx="22"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.5"
            strokeDasharray="12 12"
            strokeDashoffset={-frame * 0.6}
          />

          <PawnCharacter
            x={960}
            y={890}
            scale={1.14}
            glowIntensity={0.85 + sweepT * 0.15}
            showFloorHalo
            haloProgress={0.75 + sweepT * 0.25}
            sunburstOpacity={0.3 + sweepT * 0.55}
            armPose="celebrate"
          />
        </svg>
      </CameraRig>

      {/* Finale Headlines outside CameraRig */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 200,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        STOP FIGHTING YOURSELF.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 298,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 80,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        DESIGN YOUR ENVIRONMENT.
      </div>
    </div>
  );
};
