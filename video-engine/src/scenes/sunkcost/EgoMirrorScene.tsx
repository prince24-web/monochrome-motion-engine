import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const EgoMirrorScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const flipT = clampedInterpolate(frame, [Math.round(durationInFrames * 0.45), Math.round(durationInFrames * 0.72)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="240" x2="960" y2="880" stroke={COLORS.white} strokeWidth="3" strokeDasharray="10 10" />

        {/* Left: EGO FRAME ("QUITTING = FAILURE") */}
        <g transform="translate(510, 550)" opacity={1 - flipT * 0.65}>
          <rect x="-240" y="-135" width="480" height="270" rx="22" fill="#0A0A0E" stroke={COLORS.midGrey} strokeWidth="3" />
          <text x="0" y="-22" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
            EGO SAYS
          </text>
          <text x="0" y="34" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="800">
            QUITTING = DEFEAT
          </text>
        </g>

        {/* Right: CLARITY FRAME ("QUITTING = PRECISION") */}
        <g transform="translate(1410, 550)" opacity={0.25 + flipT * 0.75} filter={flipT > 0.5 ? 'url(#soft-glow)' : undefined}>
          <rect x="-240" y="-135" width="480" height="270" rx="22" fill="rgba(255,255,255,0.12)" stroke={COLORS.white} strokeWidth="4" />
          <text x="0" y="-22" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
            REALITY SAYS
          </text>
          <text x="0" y="34" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="900">
            QUITTING = CLARITY
          </text>
        </g>
      </svg>

      <PillBadge text="EGO HATES LOOKING WRONG" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
