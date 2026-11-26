import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BuoyantRiseScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const riseT = clampedInterpolate(frame, [8, durationInFrames - 18], [0, 1], EASING.expoOut);
  const heroY = 760 - riseT * 310;
  const anchorY = 780 + riseT * 240;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Sinking Dead Weight Anchor Fading Out Below */}
        <g transform={`translate(960, ${anchorY})`} opacity={Math.max(0, 0.7 - riseT * 0.7)}>
          <line x1="0" y1="-40" x2="0" y2="44" stroke={COLORS.midGrey} strokeWidth="5" />
          <path d="M -56 12 Q 0 68 56 12" fill="none" stroke={COLORS.midGrey} strokeWidth="5" />
        </g>

        {/* Protagonist Rising Effortlessly into Bright Aura */}
        <PawnCharacter x={960} y={heroY} scale={1.1} glowIntensity={0.95} armPose="celebrate" />

        <text x="960" y="905" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          DROP DEAD WEIGHT → RISE INSTANTLY
        </text>
      </svg>

      <PillBadge text="INSTANT BUOYANCY" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
