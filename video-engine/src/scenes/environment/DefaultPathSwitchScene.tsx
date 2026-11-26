import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DefaultPathSwitchScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Railway switch flips UP toward GOOD DEFAULT, sending the glowing orb smoothly along the upper track!
  const t = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const orbX = 240 + t * 1400;
  const orbY = orbX < 860 ? 600 : 600 - ((orbX - 860) / 780) * 195;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Incoming Main Track */}
        <line x1="200" y1="600" x2="860" y2="600" stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />

        {/* Lower Unused Distraction Branch */}
        <line x1="860" y1="600" x2="1680" y2="795" stroke="rgba(255,255,255,0.22)" strokeWidth="3.5" strokeDasharray="10 10" />
        <text x="1670" y="845" textAnchor="end" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.16em">
          OLD DEFAULT (DISTRACTION)
        </text>

        {/* Upper Lit Default Track */}
        <line x1="860" y1="600" x2="1680" y2="405" stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />
        <text x="1670" y="365" textAnchor="end" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.16em">
          NEW DEFAULT (DEEP WORK)
        </text>

        {/* Switch Pivot */}
        <circle cx="860" cy="600" r="14" fill={COLORS.white} filter="url(#soft-glow)" />

        {/* Moving Orb */}
        <circle cx={orbX} cy={orbY} r="68" fill="url(#hero-aura)" opacity="0.8" />
        <circle cx={orbX} cy={orbY} r="18" fill={COLORS.white} filter="url(#soft-glow)" />
      </svg>

      <PillBadge text="SWITCH THE DEFAULT TRACK" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
