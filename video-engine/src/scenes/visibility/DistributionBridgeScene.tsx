import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DistributionBridgeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const bridgeT = clampedInterpolate(frame, [12, Math.round(fps * 1.5)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Left Island: VALUE CREATED */}
        <rect x="180" y="470" width="320" height="190" rx="22" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3.5" />
        <text x="340" y="555" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="800" letterSpacing="0.14em">
          YOUR VALUE
        </text>
        <text x="340" y="595" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="18" fontWeight="700" letterSpacing="0.14em">
          SOLUTION
        </text>

        {/* Right Island: PEOPLE SEARCHING */}
        <rect x="1420" y="470" width="320" height="190" rx="22" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3.5" />
        <text x="1580" y="555" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="800" letterSpacing="0.14em">
          THE MARKET
        </text>
        <text x="1580" y="595" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="18" fontWeight="700" letterSpacing="0.14em">
          PEOPLE IN NEED
        </text>

        {/* Glowing Distribution Bridge Connecting Both */}
        <line x1="500" y1="565" x2={500 + 920 * bridgeT} y2="565" stroke={COLORS.white} strokeWidth="6" filter="url(#soft-glow)" />
        {bridgeT > 0.7 &&
          [0, 1, 2, 3, 4].map((p) => {
            const prog = ((frame * 0.03 + p * 0.2) % 1);
            return <circle key={p} cx={520 + prog * 880} cy="565" r="7" fill={COLORS.white} filter="url(#soft-glow)" />;
          })}

        <text x="960" y="645" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em" opacity={bridgeT}>
          MARKETING = THE BRIDGE
        </text>
      </svg>

      <PillBadge text="BUILD THE BRIDGE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
