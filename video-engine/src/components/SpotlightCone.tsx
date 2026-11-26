import React from 'react';
import { useCurrentFrame } from 'remotion';

interface SpotlightConeProps {
  topX: number;
  topWidth?: number;
  bottomX: number;
  bottomY: number;
  bottomWidth?: number;
  opacity?: number;
  breathe?: boolean;
}

export const SpotlightCone: React.FC<SpotlightConeProps> = ({
  topX,
  topWidth = 110,
  bottomX,
  bottomY,
  bottomWidth = 380,
  opacity = 1,
  breathe = true,
}) => {
  const frame = useCurrentFrame();
  const pulse = breathe ? 0.92 + 0.08 * Math.sin(frame * 0.06) : 1;

  const x1 = topX - topWidth / 2;
  const x2 = topX + topWidth / 2;
  const x3 = bottomX + bottomWidth / 2;
  const x4 = bottomX - bottomWidth / 2;

  return (
    <polygon
      points={`${x1},-40 ${x2},-40 ${x3},${bottomY} ${x4},${bottomY}`}
      fill="url(#spotlight-grad)"
      filter="url(#spotlight-blur)"
      opacity={opacity * pulse}
    />
  );
};
