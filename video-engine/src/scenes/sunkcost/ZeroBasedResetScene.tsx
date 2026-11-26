import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ZeroBasedResetScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const selectFrame = Math.round(durationInFrames * 0.45);
  const selectSpring =
    frame >= selectFrame
      ? spring({ frame: frame - selectFrame, fps, config: { damping: 14, stiffness: 180 } })
      : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Question Frame */}
        <rect x="340" y="295" width="1240" height="210" rx="22" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3.5" />
        <text x="960" y="388" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="36" fontWeight="800" letterSpacing="0.06em">
          IF YOU WEREN&apos;T ALREADY IN THIS,
        </text>
        <text x="960" y="446" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="36" fontWeight="800" letterSpacing="0.06em">
          WOULD YOU START IT TODAY?
        </text>

        {/* YES vs NO Answer Buttons */}
        <g transform="translate(720, 680)" opacity={1 - selectSpring * 0.65}>
          <rect x="-135" y="-52" width="270" height="104" rx="52" fill="#0A0A0E" stroke={COLORS.midGrey} strokeWidth="3" />
          <text x="0" y="13" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="800">
            YES
          </text>
        </g>

        <g transform={`translate(1200, 680) scale(${1 + selectSpring * 0.12})`} filter={selectSpring > 0.3 ? 'url(#soft-glow)' : undefined}>
          <rect x="-135" y="-52" width="270" height="104" rx="52" fill={selectSpring > 0.3 ? COLORS.white : '#0A0A0E'} stroke={COLORS.white} strokeWidth="4" />
          <text x="0" y="13" textAnchor="middle" fill={selectSpring > 0.3 ? COLORS.bg : COLORS.white} fontFamily={FONT_FAMILY} fontSize="36" fontWeight="900">
            NO
          </text>
        </g>
      </svg>

      <PillBadge text="THE ZERO-BASED TEST" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
