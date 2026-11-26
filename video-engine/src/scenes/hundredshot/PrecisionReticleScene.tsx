import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
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
  const cy = 560;
  const shotNum = clampedInterpolate(frame, [8, durationInFrames - 16], [70, 100], EASING.smoothOut);

  // Rhythmic bullseye shockwaves firing every 26 frames
  const pulseCycle = (frame % 26) / 26;
  const reticleScale = 1 + Math.sin(frame * 0.14) * 0.03;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
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

      <RollingCounter label="SHOT NUMBER" value={shotNum} prefix="#" x={350} y={560} fontSize={88} labelSize={19} />
      <RollingCounter label="ACCURACY" value={98} suffix="%" x={1570} y={560} fontSize={88} labelSize={19} />
      <PillBadge text="BULLSEYE LOCKED" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
