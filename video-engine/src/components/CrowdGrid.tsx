import React from 'react';
import { COLORS } from '../theme/tokens';

interface CrowdGridProps {
  x: number; // Top-left x of grid
  y: number; // Top-left y of grid
  rows?: number;
  cols?: number;
  cellWidth?: number;
  cellHeight?: number;
  highlightIndex?: number; // 0-based index of THE 1% person
  dimOthersProgress?: number; // 0 = all bright, 1 = others dimmed
  highlightBoost?: number; // 0..1 extra scale & glow for highlighted person
  showHeart?: boolean;
  heartOpacity?: number;
  opacity?: number;
}

export const CrowdGrid: React.FC<CrowdGridProps> = ({
  x,
  y,
  rows = 10,
  cols = 10,
  cellWidth = 62,
  cellHeight = 62,
  highlightIndex = 46,
  dimOthersProgress = 0,
  highlightBoost = 0,
  showHeart = false,
  heartOpacity = 0,
  opacity = 1,
}) => {
  const total = rows * cols;
  const baseOtherOpacity = 0.85 - dimOthersProgress * 0.65;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {Array.from({ length: total }, (_, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = col * cellWidth + cellWidth / 2;
        const cy = row * cellHeight + cellHeight / 2;
        const isHighlighted = idx === highlightIndex;

        const personScale = isHighlighted ? 1 + highlightBoost * 0.42 : 1;
        const personOpacity = isHighlighted ? 1 : baseOtherOpacity;
        const fill = isHighlighted ? COLORS.white : COLORS.softWhite;

        return (
          <g
            key={idx}
            transform={`translate(${cx}, ${cy}) scale(${personScale})`}
            opacity={personOpacity}
            filter={isHighlighted && highlightBoost > 0.15 ? 'url(#strong-glow)' : undefined}
          >
            {/* Mini pawn silhouette */}
            <circle cx="0" cy="-14" r="6.2" fill={fill} />
            <path
              d="M -6.5 -5
                 Q 0 -7.5 6.5 -5
                 Q 9 -3.5 10 2
                 L 11.5 16
                 Q 12 19 9 19
                 L -9 19
                 Q -12 19 -11.5 16
                 L -10 2
                 Q -9 -3.5 -6.5 -5 Z"
              fill={fill}
            />

            {/* Floating heart icon above the 1% buyer */}
            {isHighlighted && showHeart && heartOpacity > 0.01 && (
              <path
                d="M 0 -24 C 0 -24 -7 -29 -7 -33.5 C -7 -36.5 -4.5 -38.5 -2 -38.5 C -0.6 -38.5 0 -37.2 0 -37.2 C 0 -37.2 0.6 -38.5 2 -38.5 C 4.5 -38.5 7 -36.5 7 -33.5 C 7 -29 0 -24 0 -24 Z"
                fill={COLORS.white}
                opacity={heartOpacity}
                transform="translate(0, -4) scale(1.1)"
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

interface MoneyArcProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  controlX: number;
  controlY: number;
  progress: number; // 0..1 stream progress
  opacity?: number;
  billCount?: number;
}

function quadPoint(
  t: number,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number
) {
  const mt = 1 - t;
  const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
  const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
  const dx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx);
  const dy = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle };
}

export const MoneyArc: React.FC<MoneyArcProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  controlX,
  controlY,
  progress,
  opacity = 1,
  billCount = 7,
}) => {
  if (progress <= 0.01 || opacity <= 0.01) return null;

  const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  return (
    <g opacity={opacity}>
      {/* Dashed trajectory curve */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="2.5"
        strokeDasharray="8 10"
      />

      {/* Flying dollar bills along the curve */}
      {Array.from({ length: billCount }, (_, i) => {
        const rawT = (progress * 1.65 - i * 0.14) % 1;
        if (rawT <= 0.02 || rawT >= 0.98) return null;
        // Only spawn bills that have actually started
        if (progress * 1.65 < i * 0.14) return null;

        const pt = quadPoint(rawT, fromX, fromY, controlX, controlY, toX, toY);
        const edgeFade = Math.min(rawT * 8, (1 - rawT) * 8, 1);

        return (
          <g
            key={i}
            transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle})`}
            opacity={edgeFade}
            filter="url(#soft-glow)"
          >
            <rect
              x="-22"
              y="-12"
              width="44"
              height="24"
              rx="4"
              fill="#0B0B0E"
              stroke={COLORS.white}
              strokeWidth="2.4"
            />
            <circle cx="0" cy="0" r="5" fill="none" stroke={COLORS.white} strokeWidth="1.8" />
          </g>
        );
      })}
    </g>
  );
};
