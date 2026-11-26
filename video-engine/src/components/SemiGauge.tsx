import React from 'react';
import { COLORS, FONT_FAMILY } from '../theme/tokens';

interface FallingBadge {
  x: number;
  y: number;
  opacity: number;
  scale?: number;
}

interface SemiGaugeProps {
  cx: number;
  cy: number;
  radius?: number;
  needleAngle: number; // -90 (full FAILING left) to +90 (full WORKING right), 0 = straight up
  leftLabel?: string;
  rightLabel?: string;
  fallingBadges?: FallingBadge[];
  ignoredCountText?: string;
  ignoredCountOpacity?: number;
  opacity?: number;
}

export const SemiGauge: React.FC<SemiGaugeProps> = ({
  cx,
  cy,
  radius = 275,
  needleAngle,
  leftLabel = 'FAILING',
  rightLabel = 'WORKING',
  fallingBadges = [],
  ignoredCountText,
  ignoredCountOpacity = 0,
  opacity = 1,
}) => {
  const tickCount = 12;

  // Semi-circle path from left (-radius, 0) to right (+radius, 0) curving up
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  // Needle points up at 0 deg; rotate around (cx, cy)
  const needleLen = radius * 0.82;

  return (
    <g opacity={opacity}>
      {/* Main gauge arc */}
      <path
        d={arcPath}
        fill="none"
        stroke={COLORS.softWhite}
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#soft-glow)"
      />

      {/* Radial tick marks along the inner edge */}
      {Array.from({ length: tickCount + 1 }, (_, i) => {
        const angleDeg = -180 + (i * 180) / tickCount;
        const rad = (angleDeg * Math.PI) / 180;
        const isMajor = i % 3 === 0;
        const innerR = radius - (isMajor ? 28 : 16);
        const x1 = cx + Math.cos(rad) * radius;
        const y1 = cy + Math.sin(rad) * radius;
        const x2 = cx + Math.cos(rad) * innerR;
        const y2 = cy + Math.sin(rad) * innerR;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? COLORS.softWhite : COLORS.midGrey}
            strokeWidth={isMajor ? 3 : 2}
            opacity={isMajor ? 0.9 : 0.65}
          />
        );
      })}

      {/* Left / Right Micro-Labels */}
      <text
        x={cx - radius}
        y={cy + 46}
        textAnchor="middle"
        fill={COLORS.softWhite}
        fontFamily={FONT_FAMILY}
        fontSize="21"
        fontWeight="700"
        letterSpacing="0.16em"
      >
        {leftLabel}
      </text>
      <text
        x={cx + radius}
        y={cy + 46}
        textAnchor="middle"
        fill={COLORS.softWhite}
        fontFamily={FONT_FAMILY}
        fontSize="21"
        fontWeight="700"
        letterSpacing="0.16em"
      >
        {rightLabel}
      </text>

      {/* Animated Needle */}
      <g transform={`translate(${cx}, ${cy}) rotate(${needleAngle})`} filter="url(#soft-glow)">
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={-needleLen}
          stroke={COLORS.white}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="0" cy="0" r="11" fill={COLORS.white} />
      </g>

      {/* Falling / Stacked (X) rejection badges */}
      {fallingBadges.map((b, i) => {
        if (b.opacity <= 0.01) return null;
        const s = b.scale ?? 1;
        return (
          <g
            key={i}
            transform={`translate(${b.x}, ${b.y}) scale(${s})`}
            opacity={b.opacity}
            filter="url(#soft-glow)"
          >
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="#0B0B0E"
              stroke={COLORS.white}
              strokeWidth="3"
            />
            <line
              x1="-9"
              y1="-9"
              x2="9"
              y2="9"
              stroke={COLORS.white}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="9"
              y1="-9"
              x2="-9"
              y2="9"
              stroke={COLORS.white}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* "3 IGNORED" caption under stacked badges */}
      {ignoredCountText && ignoredCountOpacity > 0.01 && (
        <text
          x={cx}
          y={cy + 148}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.18em"
          opacity={ignoredCountOpacity}
        >
          {ignoredCountText}
        </text>
      )}
    </g>
  );
};
