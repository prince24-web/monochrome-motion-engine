import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const WeightedCoinSimScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // 16 flips: mostly -1 losses, with 3 huge +20 wins!
  const flips = [-1, -1, -1, -1, 20, -1, -1, -1, -1, -1, 20, -1, -1, -1, 20, -1];
  const progress = clampedInterpolate(frame, [10, durationInFrames - 18], [0, flips.length], EASING.smoothInOut);
  const count = Math.floor(progress);

  const leftX = 240;
  const rightX = 1680;
  const zeroY = 760;

  let equity = 0;
  const pts: string[] = [`${leftX},${zeroY}`];
  for (let i = 0; i < count; i++) {
    equity += flips[i];
    const x = leftX + ((i + 1) / flips.length) * (rightX - leftX);
    const y = zeroY - equity * 9.5;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1={leftX} y1={zeroY} x2={rightX} y2={zeroY} stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" strokeDasharray="10 10" />
        {pts.length > 1 && (
          <polyline points={pts.join(' ')} fill="none" stroke={COLORS.white} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#soft-glow)" />
        )}
        <text x="960" y="905" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          TAILS: -$1 · HEADS: +$20 · 13 LOSSES STILL WINS BIG
        </text>
      </svg>

      <RollingCounter label="NET PROFIT" prefix="$" value={equity} x={430} y={300} fontSize={92} labelSize={20} />
      <PillBadge text="WEIGHTED PAYOFFS" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
