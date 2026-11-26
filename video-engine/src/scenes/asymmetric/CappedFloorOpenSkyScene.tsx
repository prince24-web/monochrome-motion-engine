import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CappedFloorOpenSkyScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const riseT = clampedInterpolate(frame, [18, durationInFrames - 20], [0, 1], EASING.expoOut);
  const baseY = 740;
  const floorY = 825;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Solid Capped Floor ("-1X MAX LOSS") */}
        <line x1="260" y1={floorY} x2="1660" y2={floorY} stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />
        <text x="960" y={floorY + 48} textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          HARD FLOOR · MAX LOSS = -1X
        </text>

        {/* Zero Start Line */}
        <line x1="360" y1={baseY} x2="1560" y2={baseY} stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="10 10" />

        {/* Small Capped Downside Arrow */}
        <line x1="680" y1={baseY} x2="680" y2={floorY - 12} stroke={COLORS.midGrey} strokeWidth="6" strokeLinecap="round" />
        <text x="680" y={baseY - 22} textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700">
          -1X
        </text>

        {/* Massive Uncapped Upside Beam Shooting to the Top of the Frame */}
        <line
          x1="1240"
          y1={baseY}
          x2="1240"
          y2={baseY - riseT * 520}
          stroke={COLORS.white}
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#strong-glow)"
        />
        <polygon
          points={`1240,${baseY - riseT * 520 - 34} 1214,${baseY - riseT * 520 + 8} 1266,${baseY - riseT * 520 + 8}`}
          fill={COLORS.white}
          filter="url(#soft-glow)"
        />
        <text x="1340" y={baseY - riseT * 360} fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="42" fontWeight="900">
          +100X
        </text>
        <text x="1340" y={baseY - riseT * 360 + 36} fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
          UNCAPPED SKY
        </text>
      </svg>

      <PillBadge text="THE ASYMMETRIC BET" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
