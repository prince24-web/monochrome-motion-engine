import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../theme/tokens';

interface PawnCharacterProps {
  x: number;
  y: number; // Bottom-center feet position (typically LAYOUT.groundY)
  scale?: number;
  opacity?: number;
  glowIntensity?: number;
  showFloorHalo?: boolean;
  haloProgress?: number;
  armPose?: 'none' | 'reachRight' | 'celebrate';
  sunburstOpacity?: number;
  bob?: boolean;
}

export const PawnCharacter: React.FC<PawnCharacterProps> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  glowIntensity = 0.65,
  showFloorHalo = false,
  haloProgress = 1,
  armPose = 'none',
  sunburstOpacity = 0,
  bob = true,
}) => {
  const frame = useCurrentFrame();
  const idleY = bob ? Math.sin(frame * 0.08) * 2.5 : 0;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {/* Concentric dashed elliptical floor halo */}
      {showFloorHalo && haloProgress > 0.01 && (
        <g opacity={haloProgress}>
          <ellipse
            cx="0"
            cy="2"
            rx={116 * haloProgress}
            ry={18 * haloProgress}
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2"
            strokeDasharray="7 8"
          />
          <ellipse
            cx="0"
            cy="2"
            rx={164 * haloProgress}
            ry={25 * haloProgress}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
          />
        </g>
      )}

      {/* Optional soft radial sunburst rays behind protagonist */}
      {sunburstOpacity > 0.01 && (
        <g transform="translate(0, -108)" opacity={sunburstOpacity * 0.75}>
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 360) / 16 + frame * 0.12;
            return (
              <polygon
                key={i}
                points="-3,0 3,0 14,-230 -14,-230"
                fill="url(#hero-aura)"
                opacity="0.32"
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>
      )}

      {/* Ambient radial white aura behind character */}
      {glowIntensity > 0.01 && (
        <circle
          cx="0"
          cy={-105 * scale}
          r={165 * scale}
          fill="url(#hero-aura)"
          opacity={glowIntensity}
        />
      )}

      {/* Character body anchored at feet (0, 0) */}
      <g
        transform={`translate(0, ${idleY}) scale(${scale})`}
        filter={glowIntensity > 0.35 ? 'url(#soft-glow)' : undefined}
      >
        {/* Head */}
        <circle cx="0" cy="-168" r="30" fill={COLORS.white} />

        {/* Torso (rounded trapezoid pawn silhouette) */}
        <path
          d="M -27 -122
             Q 0 -132 27 -122
             Q 38 -117 42 -96
             L 56 -12
             Q 58 0 46 0
             L -46 0
             Q -58 0 -56 -12
             L -42 -96
             Q -38 -117 -27 -122 Z"
          fill={COLORS.softWhite}
        />

        {/* Arms */}
        {armPose === 'reachRight' && (
          <path
            d="M 32 -98 Q 62 -92 86 -94"
            fill="none"
            stroke={COLORS.white}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}

        {armPose === 'celebrate' && (
          <>
            <path
              d="M -30 -96 Q -62 -128 -82 -162"
              fill="none"
              stroke={COLORS.white}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 30 -96 Q 62 -128 82 -162"
              fill="none"
              stroke={COLORS.white}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </g>
  );
};
