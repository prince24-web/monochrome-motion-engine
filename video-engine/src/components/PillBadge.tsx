import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY } from '../theme/tokens';

interface PillBadgeProps {
  text: string;
  x: number;
  y: number;
  enterFrame?: number;
  exitFrame?: number;
  scale?: number;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  text,
  x,
  y,
  enterFrame = 0,
  exitFrame,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const enterProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 16, stiffness: 220, mass: 0.7 },
  });

  const exitProgress =
    exitFrame !== undefined && frame >= exitFrame
      ? spring({
          frame: frame - exitFrame,
          fps,
          config: { damping: 18, stiffness: 240, mass: 0.6 },
        })
      : 0;

  const visibility = Math.max(0, enterProgress * (1 - exitProgress));
  if (visibility <= 0.005) return null;

  const translateY = (1 - enterProgress) * 18 - exitProgress * 14;
  const currentScale = scale * (0.88 + 0.12 * visibility);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${currentScale})`,
        opacity: visibility,
        backgroundColor: COLORS.pillBg,
        color: COLORS.pillText,
        fontFamily: FONT_FAMILY,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '11px 28px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        boxShadow: '0 0 32px rgba(255, 255, 255, 0.45), 0 0 12px rgba(255, 255, 255, 0.25)',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};
