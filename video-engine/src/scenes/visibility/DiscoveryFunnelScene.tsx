import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DiscoveryFunnelScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* 3 Funnel Tiers */}
        <polygon points="500,290 1420,290 1260,480 660,480" fill="rgba(255,255,255,0.08)" stroke={COLORS.white} strokeWidth="3" />
        <polygon points="660,500 1260,500 1120,680 800,680" fill="rgba(255,255,255,0.12)" stroke={COLORS.white} strokeWidth="3" />
        <polygon points="800,700 1120,700 1035,860 885,860" fill="rgba(255,255,255,0.2)" stroke={COLORS.white} strokeWidth="3.5" filter="url(#soft-glow)" />

        {/* Flowing Dots Through Funnel */}
        {Array.from({ length: 16 }, (_, i) => {
          const u = ((frame * 0.018 + i / 16) % 1);
          const y = 260 + u * 610;
          const halfSpread = 360 * (1 - u * 0.85);
          const x = cx + Math.sin(i * 3.7) * halfSpread;
          return <circle key={i} cx={x} cy={y} r="4.5" fill={COLORS.white} opacity="0.8" />;
        })}

        <text x={cx} y="395" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="26" fontWeight="800" letterSpacing="0.18em">
          1. VISIBILITY
        </text>
        <text x={cx} y="600" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="26" fontWeight="800" letterSpacing="0.18em">
          2. TRUST
        </text>
        <text x={cx} y="790" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="26" fontWeight="900" letterSpacing="0.18em">
          3. BUYERS
        </text>
      </svg>

      <PillBadge text="VISIBILITY IS STEP ONE" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
