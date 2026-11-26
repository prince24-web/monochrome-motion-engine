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

export const SeenWinsFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const bloomT = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );
  const h1 = clampedInterpolate(
    frame,
    [Math.round(fps * 0.4), Math.round(fps * 1.1)],
    [0, 1],
    EASING.smoothOut
  );
  const h2 = clampedInterpolate(
    frame,
    [Math.round(fps * 1.25), Math.round(fps * 2.0)],
    [0, 1],
    EASING.smoothOut
  );

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.38, x: 0, y: 120 },
    { t: 0.45, scale: 1.18, x: 0, y: 40 },
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
            topWidth={190}
            bottomX={960}
            bottomY={960}
            bottomWidth={820}
            opacity={0.55 + bloomT * 0.45}
          />
          <circle
            cx="960"
            cy="600"
            r={185 + Math.sin(frame * 0.1) * 14}
            fill="url(#hero-aura)"
            opacity={0.6 + bloomT * 0.32}
          />
          <polygon
            points="960,485 988,548 1056,548 1002,588 1022,652 960,614 898,652 918,588 864,548 932,548"
            fill={COLORS.white}
            filter="url(#strong-glow)"
          />

          {/* Protagonist standing triumphant in full spotlight */}
          <PawnCharacter
            x={960}
            y={925}
            scale={1.06}
            glowIntensity={0.7 + bloomT * 0.3}
            showFloorHalo
            haloProgress={0.5 + bloomT * 0.5}
            armPose="celebrate"
            sunburstOpacity={bloomT}
          />
        </svg>
      </CameraRig>

      {/* HUD Finale Headlines (unclipped outside CameraRig) */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 215,
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
        BUILD SOMETHING GREAT.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 310,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 74,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        MAKE IT IMPOSSIBLE TO MISS.
      </div>
    </div>
  );
};
