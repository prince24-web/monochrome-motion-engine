import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const AnchorChainScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const dragT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const heroY = 470 + dragT * 110;
  const anchorY = 760 + dragT * 95;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Heavy Chain Links */}
        <line x1="960" y1={heroY} x2="960" y2={anchorY - 68} stroke={COLORS.white} strokeWidth="5" strokeDasharray="14 10" />

        {/* Wireframe Iron Anchor */}
        <g transform={`translate(960, ${anchorY})`} filter="url(#soft-glow)">
          <circle cx="0" cy="-64" r="14" fill="none" stroke={COLORS.white} strokeWidth="4" />
          <line x1="0" y1="-50" x2="0" y2="54" stroke={COLORS.white} strokeWidth="5" />
          <line x1="-42" y1="-26" x2="42" y2="-26" stroke={COLORS.white} strokeWidth="4.5" />
          <path d="M -68 18 Q 0 86 68 18" fill="none" stroke={COLORS.white} strokeWidth="5" strokeLinecap="round" />
        </g>

        <PawnCharacter x={960} y={heroY} scale={0.96} glowIntensity={0.6} />

        <text x="960" y="950" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="21" fontWeight="700" letterSpacing="0.18em">
          PAST COMMITMENTS BECOME AN IRON ANCHOR
        </text>
      </svg>

      <PillBadge text="DRAGGED BY YESTERDAY" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
