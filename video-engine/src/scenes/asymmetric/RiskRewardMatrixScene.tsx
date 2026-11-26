import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const RiskRewardMatrixScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const reveal = clampedInterpolate(frame, [14, Math.round(fps * 1.4)], [0, 1], EASING.expoOut);

  const cx = 960;
  const cy = 570;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* 2x2 Coordinate Axes */}
        <line x1="420" y1={cy} x2="1500" y2={cy} stroke={COLORS.midGrey} strokeWidth="2.5" />
        <line x1={cx} y1="240" x2={cx} y2="900" stroke={COLORS.midGrey} strokeWidth="2.5" />

        {/* Highlighted Golden Quadrant (Top-Left: LOW RISK, HIGH UPSIDE) */}
        <rect
          x="440"
          y="255"
          width="500"
          height="295"
          rx="18"
          fill="rgba(255,255,255,0.12)"
          stroke={COLORS.white}
          strokeWidth="3.5"
          opacity={reveal}
          filter="url(#soft-glow)"
        />
        <g opacity={reveal}>
          <text x="690" y="335" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="900" letterSpacing="0.16em">
            GOLDEN QUADRANT
          </text>
          <text x="690" y="395" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700">
            WRITING · CODE · PRODUCTS
          </text>
          <text x="690" y="445" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700">
            COLD OUTREACH · MEDIA
          </text>
        </g>

        {/* Axis Labels */}
        <text x={cx} y="220" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="800" letterSpacing="0.18em">
          INFINITE UPSIDE ▲
        </text>
        <text x="420" y={cy + 36} fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
          ◀ LOW RISK
        </text>
        <text x="1500" y={cy + 36} textAnchor="end" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
          HIGH RISK ▶
        </text>
      </svg>

      <PillBadge text="THE GOLDEN QUADRANT" x={cx} y={128} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
