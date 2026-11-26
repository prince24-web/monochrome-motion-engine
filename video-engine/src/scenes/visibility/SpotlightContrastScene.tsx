import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SpotlightContrastScene: React.FC<Props> = ({ durationInFrames }) => {
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

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="220" x2="960" y2="900" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: Hidden Masterpiece in Total Darkness */}
        <g transform="translate(480, 560)" opacity="0.22">
          <polygon points="0,-110 95,0 0,110 -95,0" fill="#0A0A0E" stroke={COLORS.midGrey} strokeWidth="3" />
          <text x="0" y="175" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="21" fontWeight="700" letterSpacing="0.16em">
            UNSEEN MASTERPIECE
          </text>
        </g>

        {/* Right: Visible Star Under Bright Spotlight */}
        <SpotlightCone topX={1440} topWidth={120} bottomX={1440} bottomY={860} bottomWidth={440} />
        <g transform="translate(1440, 560)" filter="url(#strong-glow)">
          <circle cx="0" cy="0" r="145" fill="url(#hero-aura)" opacity="0.8" />
          <polygon points="0,-95 28,-28 98,-28 42,16 62,86 0,44 -62,86 -42,16 -98,-28 -28,-28" fill={COLORS.white} />
          <text x="0" y="175" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.16em">
            IN THE SPOTLIGHT
          </text>
        </g>
      </svg>

      <PillBadge text="BUYERS PICK WHAT THEY SEE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
