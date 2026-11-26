import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CoinPourScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const spent = clampedInterpolate(frame, [8, durationInFrames - 18], [2000, 18500], EASING.smoothInOut);
  const cx = 960;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Falling Coins Going IN the Top */}
        {[0, 1, 2, 3].map((i) => {
          const u = ((frame * 0.032 + i * 0.25) % 1);
          return <circle key={`in-${i}`} cx={cx + Math.sin(i * 3) * 28} cy={220 + u * 230} r="13" fill={COLORS.white} filter="url(#soft-glow)" />;
        })}

        {/* Leaking Wireframe Bucket with Broken Bottom */}
        <path d="M 780 440 L 820 710 L 1100 710 L 1140 440" fill="#0B0B10" stroke={COLORS.white} strokeWidth="4" />
        <line x1="870" y1="710" x2="1050" y2="710" stroke="#070709" strokeWidth="8" />

        {/* Coins Falling Straight Out the Bottom Hole */}
        {[0, 1, 2, 3].map((i) => {
          const u = ((frame * 0.032 + i * 0.25) % 1);
          return <circle key={`out-${i}`} cx={cx + Math.cos(i * 4) * 34} cy={715 + u * 240} r="11" fill={COLORS.midGrey} opacity={1 - u} />;
        })}

        <text x={cx} y="925" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          POURING GOOD TIME INTO A LEAKING BUCKET
        </text>
      </svg>

      <RollingCounter label="ALREADY SUNK" prefix="$" value={spent} x={410} y={560} fontSize={84} labelSize={19} />
      <PillBadge text="THE LEAKING BUCKET" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
