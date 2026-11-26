import React from 'react';
import { COLORS, FONT_FAMILY } from '../theme/tokens';

interface ProgressRingProps {
  cx: number;
  cy: number;
  radius?: number;
  strokeWidth?: number;
  percent: number; // 0..100
  showOuterTarget?: boolean;
  outerTargetOpacity?: number;
  targetLabel?: string;
  opacity?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  cx,
  cy,
  radius = 172,
  strokeWidth = 22,
  percent,
  showOuterTarget = false,
  outerTargetOpacity = 0,
  targetLabel = 'TARGET: 100 %',
  opacity = 1,
}) => {
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);
  const outerRadius = radius + 34;

  return (
    <g opacity={opacity}>
      {/* Outer dashed target ring */}
      {showOuterTarget && outerTargetOpacity > 0.01 && (
        <g opacity={outerTargetOpacity}>
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
            strokeDasharray="10 9"
          />
          {/* Target micro-label on upper right */}
          <text
            x={cx + outerRadius + 32}
            y={cy - outerRadius * 0.52}
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            {targetLabel}
          </text>
        </g>
      )}

      {/* Dark grey background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={COLORS.darkGrey}
        strokeWidth={strokeWidth}
      />

      {/* Glowing active progress arc */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={COLORS.white}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#soft-glow)"
      />
    </g>
  );
};
