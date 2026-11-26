import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BrickTowerScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const rows = 9;
  const cols = 3;
  const totalBricks = rows * cols;
  const stepF = Math.max(6, Math.floor((durationInFrames - 40) / totalBricks));
  const yearsVal = clampedInterpolate(frame, [0, durationInFrames - 20], [1, 10], EASING.smoothOut);

  const brickW = 112;
  const brickH = 44;
  const baseY = 860;
  const startX = 960 - (cols * brickW) / 2;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="560" y1={baseY} x2="1360" y2={baseY} stroke="rgba(255,255,255,0.34)" strokeWidth="3" />

        {Array.from({ length: totalBricks }, (_, idx) => {
          const dropF = idx * stepF;
          if (frame < dropF) return null;
          const pop = spring({ frame: frame - dropF, fps, config: { damping: 16, stiffness: 200 } });
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const stagger = row % 2 === 0 ? 0 : 18;
          const bx = startX + col * brickW + stagger - 9;
          const targetY = baseY - (row + 1) * brickH;
          const y = targetY - (1 - pop) * 70;
          return (
            <rect
              key={idx}
              x={bx + 4}
              y={y + 4}
              width={brickW - 8}
              height={brickH - 8}
              rx="5"
              fill={row === rows - 1 ? 'rgba(255,255,255,0.22)' : '#0B0B10'}
              stroke={row >= rows - 2 ? COLORS.white : 'rgba(255,255,255,0.55)'}
              strokeWidth="2.5"
              opacity={pop}
            />
          );
        })}

        <text x="960" y="925" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
          ONE KEPT PROMISE AT A TIME
        </text>
      </svg>

      <RollingCounter label="YEARS BUILDING" value={yearsVal} prefix="YR " x={390} y={540} fontSize={84} labelSize={19} />
      <PillBadge text="BUILT LIKE AN ELEVATOR" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
