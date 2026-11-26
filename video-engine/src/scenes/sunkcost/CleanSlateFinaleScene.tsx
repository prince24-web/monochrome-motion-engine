import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CleanSlateFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 1.2)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 2.2)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone topX={960} topWidth={160} bottomX={960} bottomY={920} bottomWidth={640} />
        <line x1="220" y1="680" x2="1700" y2="680" stroke={COLORS.white} strokeWidth="3.5" filter="url(#soft-glow)" />
        <circle cx="960" cy="680" r="145" fill="url(#hero-aura)" opacity="0.75" />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 325,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        HONOR YOUR FUTURE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 420,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 78,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        NOT YOUR SUNK COSTS.
      </div>
    </div>
  );
};
