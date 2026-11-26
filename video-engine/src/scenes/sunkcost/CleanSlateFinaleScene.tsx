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

export const CleanSlateFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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
            topWidth={175}
            bottomX={960}
            bottomY={935}
            bottomWidth={720}
            opacity={0.55 + bloomT * 0.45}
          />
          <line
            x1="220"
            y1="880"
            x2="1700"
            y2="880"
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter="url(#soft-glow)"
          />
          <circle
            cx="960"
            cy="750"
            r={165 + Math.sin(frame * 0.1) * 14}
            fill="url(#hero-aura)"
            opacity={0.55 + bloomT * 0.35}
          />

          {/* Protagonist standing tall on the clean-slate horizon */}
          <PawnCharacter
            x={960}
            y={880}
            scale={1.08}
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
          top: 255,
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
        HONOR YOUR FUTURE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 350,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 78,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        NOT YOUR SUNK COSTS.
      </div>
    </div>
  );
};
