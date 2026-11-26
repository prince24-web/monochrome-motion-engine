import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const VaultedDiamondScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Vault door slides shut over the blazing 10/10 diamond
  const shutT = clampedInterpolate(frame, [28, Math.round(fps * 2.2)], [0, 1], EASING.expoInOut);
  const cx = 960;
  const cy = 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Brilliant 10/10 Diamond */}
        <g transform={`translate(${cx}, ${cy})`} opacity={1 - shutT * 0.8} filter="url(#strong-glow)">
          <polygon points="0,-130 115,-25 0,130 -115,-25" fill="rgba(255,255,255,0.24)" stroke={COLORS.white} strokeWidth="4" />
          <line x1="-115" y1="-25" x2="115" y2="-25" stroke={COLORS.white} strokeWidth="2.5" />
          <polyline points="-55,-25 0,-130 55,-25 0,130 -55,-25" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
        </g>

        {/* Heavy Opaque Vault Box Closing Over Diamond */}
        <rect
          x={cx - 190}
          y={cy - 190}
          width={380}
          height={380 * shutT}
          rx="18"
          fill="#0B0B10"
          stroke={COLORS.midGrey}
          strokeWidth="4"
        />
        {shutT > 0.65 && (
          <g transform={`translate(${cx}, ${cy})`} opacity={(shutT - 0.65) / 0.35}>
            <circle cx="0" cy="0" r="46" fill="none" stroke={COLORS.midGrey} strokeWidth="4" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke={COLORS.midGrey} strokeWidth="4" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke={COLORS.midGrey} strokeWidth="4" />
          </g>
        )}

        <text x={cx} y="875" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          10/10 QUALITY · 0 DISTRIBUTION = $0
        </text>
      </svg>

      <PillBadge text="THE HIDDEN DIAMOND" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
