import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const AsymmetricFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const arrowT = clampedInterpolate(frame, [8, Math.round(fps * 1.6)], [0, 1], EASING.expoOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.6), Math.round(fps * 1.3)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 2.2)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone topX={960} topWidth={150} bottomX={960} bottomY={920} bottomWidth={520} />

        {/* Solid Flat Floor */}
        <line x1="420" y1="880" x2="1500" y2="880" stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />

        {/* Rising Uncapped Arrow */}
        <line x1="960" y1="880" x2="960" y2={880 - arrowT * 340} stroke={COLORS.white} strokeWidth="7" filter="url(#strong-glow)" />
        <polygon
          points={`960,${880 - arrowT * 340 - 36} 930,${880 - arrowT * 340 + 10} 990,${880 - arrowT * 340 + 10}`}
          fill={COLORS.white}
          filter="url(#soft-glow)"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 235,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        CAP YOUR DOWNSIDE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 330,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 80,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        UNCAP YOUR UPSIDE.
      </div>
    </div>
  );
};
