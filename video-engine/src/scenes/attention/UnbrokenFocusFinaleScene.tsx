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

export const UnbrokenFocusFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const beamT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 1.2)], [0, 1], EASING.smoothOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.3), Math.round(fps * 2.1)], [0, 1], EASING.smoothOut);

  // Camera: track razor beam shooting across from left -> center on illuminated protagonist -> wide majestic pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: -420, y: 120 },
    { t: 0.36, scale: 1.34, x: 0, y: 95 },
    { t: 0.7, scale: 1.2, x: 0, y: 50 },
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
          {/* Volumetric spotlight crowning protagonist at the center of unbroken focus */}
          <SpotlightCone
            topX={960}
            topWidth={130}
            bottomX={960}
            bottomY={915}
            bottomWidth={440}
            opacity={0.45 + beamT * 0.45}
          />

          {/* Single Razor-Sharp Unbroken Horizontal Focus Beam */}
          <line
            x1="0"
            y1="620"
            x2={VIDEO_CONFIG.width * beamT}
            y2="620"
            stroke={COLORS.white}
            strokeWidth="6"
            filter="url(#strong-glow)"
          />
          <circle cx={960} cy={620} r="185" fill="url(#hero-aura)" opacity={beamT * 0.9} />
          <circle cx={960} cy={620} r="18" fill={COLORS.white} filter="url(#strong-glow)" opacity={beamT} />

          {/* Protagonist standing grounded in unbroken focus */}
          <PawnCharacter
            x={960}
            y={890}
            scale={0.96}
            glowIntensity={0.6 + beamT * 0.35}
            showFloorHalo
            haloProgress={beamT}
            sunburstOpacity={beamT * 0.8}
          />
        </svg>
      </CameraRig>

      {/* Finale Headline Layer (outside CameraRig) */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 280,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        PROTECT YOUR DEPTH.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 375,
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
        UNBROKEN FOCUS WINS.
      </div>
    </div>
  );
};
