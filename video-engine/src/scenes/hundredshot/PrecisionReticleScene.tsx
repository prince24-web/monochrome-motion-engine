import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PrecisionReticleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 540;
  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const shotNum = 70 + sweepT * 30;
  const accuracyPct = 82 + sweepT * 16;

  // Rhythmic bullseye shockwaves firing every 26 frames
  const pulseCycle = (frame % 26) / 26;
  const reticleScale = 1 + Math.sin(frame * 0.14) * 0.03;

  // Camera: wide target acquisition -> tight optical lock-in -> hold on shockwaves -> crisp pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.08, x: 0, y: 0 },
    { t: 0.35, scale: 1.48, x: 0, y: 0 },
    { t: 0.7, scale: 1.32, x: 0, y: 0 },
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
          <circle cx={cx} cy={cy} r="220" fill="url(#hero-aura)" opacity="0.65" />

          {/* Rhythmic Bullseye Shockwave Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={24 + pulseCycle * 260}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="3.5"
            opacity={(1 - pulseCycle) * 0.85}
          />

          {/* Optical Precision Reticle */}
          <g transform={`translate(${cx}, ${cy}) scale(${reticleScale})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="190" fill="none" stroke={COLORS.white} strokeWidth="3" />
            {/* 4 Corner Lock Brackets */}
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <path d="M -55 -235 L 0 -235 L 0 -190" fill="none" stroke={COLORS.white} strokeWidth="4" />
                <line x1="0" y1="-165" x2="0" y2="-48" stroke={COLORS.white} strokeWidth="3" />
              </g>
            ))}
            <circle cx="0" cy="0" r="18" fill={COLORS.white} />
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="BULLSEYE LOCKED" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="SHOT NUMBER"
        value={shotNum}
        prefix="#"
        x={100}
        y={158}
        fontSize={114}
        labelSize={20}
        align="left"
      />
      <RollingCounter
        label="ACCURACY"
        value={accuracyPct}
        suffix="%"
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="PRECISION EARNED."
        subtext="REPETITION BECOMES AUTOMATIC"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
