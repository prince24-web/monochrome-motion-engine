import React from 'react';
import { COLORS } from '../theme/tokens';

interface ProductBoxProps {
  x: number;
  y: number; // Bottom-center position
  size?: number;
  opacity?: number;
  glow?: boolean;
}

export const ProductBox: React.FC<ProductBoxProps> = ({
  x,
  y,
  size = 86,
  opacity = 1,
  glow = true,
}) => {
  const half = size / 2;
  const lidY = -size * 0.74;
  const starCenterY = -size * 0.37;
  const rOuter = size * 0.16;
  const rInner = size * 0.068;

  const starPoints = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    return `${(Math.cos(angle) * r).toFixed(2)},${(starCenterY + Math.sin(angle) * r).toFixed(2)}`;
  }).join(' ');

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      filter={glow ? 'url(#soft-glow)' : undefined}
    >
      {/* Box outer shell */}
      <rect
        x={-half}
        y={-size}
        width={size}
        height={size}
        rx={6}
        fill="#0B0B0E"
        stroke={COLORS.white}
        strokeWidth="3"
      />
      {/* Top flap seam */}
      <line x1={-half} y1={lidY} x2={half} y2={lidY} stroke={COLORS.white} strokeWidth="2.5" />
      <line x1={0} y1={-size} x2={0} y2={lidY} stroke={COLORS.white} strokeWidth="2.5" />
      {/* Center 5-point star */}
      <polygon points={starPoints} fill={COLORS.white} />
    </g>
  );
};
