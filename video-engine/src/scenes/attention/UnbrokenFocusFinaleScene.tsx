import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const UnbrokenFocusFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const beamT = clampedInterpolate(frame, [6, Math.round(fps * 1.5)], [0, 1], EASING.expoOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.6), Math.round(fps * 1.3)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 2.2)], [0, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Single Razor-Sharp Unbroken Horizontal Focus Beam */}
        <line
          x1="0"
          y1="620"
          x2={VIDEO_CONFIG.width * beamT}
          y2="620"
          stroke={COLORS.white}
          strokeWidth="6"
          filter="url(#strong-glow)"
        />
        <circle cx={960} cy={620} r="185" fill="url(#hero-aura)" opacity={beamT * 0.9} />
        <circle cx={960} cy={620} r="18" fill={COLORS.white} filter="url(#strong-glow)" opacity={beamT} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 325,
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
        PROTECT YOUR DEPTH.
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
        UNBROKEN FOCUS WINS.
      </div>
    </div>
  );
};
