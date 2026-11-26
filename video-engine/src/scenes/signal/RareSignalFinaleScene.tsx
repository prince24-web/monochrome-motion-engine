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

export const RareSignalFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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
    { t: 0.0, scale: 1.4, x: 0, y: 105 },
    { t: 0.45, scale: 1.2, x: 0, y: 35 },
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
            bottomY={940}
            bottomWidth={740}
            opacity={0.55 + bloomT * 0.45}
          />

          {/* Dark Sea of Grey Average Cubes Along Bottom */}
          {Array.from({ length: 16 }, (_, i) => (
            <rect
              key={i}
              x={160 + i * 102}
              y={860}
              width="82"
              height="82"
              rx="10"
              fill="#0D0D13"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="2"
            />
          ))}

          {/* Blazing Suspended 1% Crystal Above Protagonist */}
          <g
            transform={`translate(960, ${545 + Math.sin(frame * 0.06) * 8})`}
            filter="url(#strong-glow)"
          >
            <circle
              cx="0"
              cy="0"
              r={155 + bloomT * 30}
              fill="url(#hero-aura)"
              opacity={0.65 + bloomT * 0.3}
            />
            <polygon points="0,-78 62,0 0,78 -62,0" fill={COLORS.white} />
          </g>

          {/* Protagonist standing above the grey average cubes */}
          <PawnCharacter
            x={960}
            y={860}
            scale={0.96}
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
          top: 205,
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
        AVERAGE IS FREE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 300,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        TASTE IS PRICELESS.
      </div>
    </div>
  );
};
