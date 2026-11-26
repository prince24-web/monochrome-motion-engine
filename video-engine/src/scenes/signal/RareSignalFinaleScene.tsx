import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const RareSignalFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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
        <SpotlightCone topX={960} topWidth={160} bottomX={960} bottomY={930} bottomWidth={640} />

        {/* Dark Sea of Grey Average Cubes Along Bottom */}
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={160 + i * 102}
            y={845}
            width="82"
            height="82"
            rx="10"
            fill="#0D0D13"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
          />
        ))}

        {/* Blazing Suspended 1% Crystal Above */}
        <g transform={`translate(960, ${635 + Math.sin(frame * 0.06) * 8})`} filter="url(#strong-glow)">
          <circle cx="0" cy="0" r="165" fill="url(#hero-aura)" opacity="0.9" />
          <polygon points="0,-95 75,0 0,95 -75,0" fill={COLORS.white} />
        </g>
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 220,
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
        AVERAGE IS FREE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 315,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 42px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        TASTE IS PRICELESS.
      </div>
    </div>
  );
};
