import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SurvivalBarrierScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const ruinY = 760;
  const shieldGlow = 0.65 + 0.35 * Math.sin(frame * 0.09);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Solid Protected Survival Line */}
        <line x1="180" y1={ruinY} x2="1740" y2={ruinY} stroke={COLORS.white} strokeWidth="5" opacity={shieldGlow} filter="url(#soft-glow)" />

        {/* Danger Zone Below Ruin Line */}
        <rect x="180" y={ruinY + 4} width="1560" height="175" fill="rgba(255,255,255,0.03)" />
        <text x="960" y={ruinY + 95} textAnchor="middle" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="28" fontWeight="800" letterSpacing="0.22em">
          RUIN · GAME OVER ($0)
        </text>

        {/* Protagonist Standing Safely Above the Ruin Line */}
        <PawnCharacter x={960} y={ruinY - 8} scale={1.15} glowIntensity={0.95} showFloorHalo haloProgress={1} />

        <text x="960" y="340" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="32" fontWeight="800" letterSpacing="0.16em">
          STAY IN THE GAME = UNLIMITED SHOTS
        </text>
      </svg>

      <PillBadge text="NEVER RISK RUIN" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
