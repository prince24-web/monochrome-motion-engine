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

export const AsymmetricFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const arrowT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.45), Math.round(fps * 1.15)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.35), Math.round(fps * 2.1)], [0, 1], EASING.expoOut);

  // Camera: start tight on protagonist & hard floor -> rise with uncapped arrow -> wide hero reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 0, y: 230 },
    { t: 0.44, scale: 1.28, x: 0, y: 75 },
    { t: 0.82, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  const tipY = 880 - arrowT * 375;

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
            topWidth={160}
            bottomX={960}
            bottomY={935}
            bottomWidth={560}
            opacity={0.75 + arrowT * 0.25}
          />

          {/* Solid Flat Floor */}
          <line
            x1="400"
            y1="880"
            x2="1520"
            y2="880"
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />

          {/* Rising Uncapped Arrow */}
          <line
            x1="960"
            y1="880"
            x2="960"
            y2={tipY}
            stroke={COLORS.white}
            strokeWidth="7"
            filter="url(#strong-glow)"
          />
          <polygon
            points={`960,${tipY - 36} 930,${tipY + 10} 990,${tipY + 10}`}
            fill={COLORS.white}
            filter="url(#soft-glow)"
          />

          {/* Recurring Protagonist standing triumphantly on the capped floor */}
          <PawnCharacter
            x={730}
            y={880}
            scale={1.02}
            glowIntensity={0.85 + arrowT * 0.15}
            showFloorHalo
            haloProgress={0.8 + arrowT * 0.2}
            sunburstOpacity={0.25 + arrowT * 0.5}
            armPose="celebrate"
          />
        </svg>
      </CameraRig>

      {/* Finale Headlines outside CameraRig */}
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
        CAP YOUR DOWNSIDE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 302,
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
        UNCAP YOUR UPSIDE.
      </div>
    </div>
  );
};
