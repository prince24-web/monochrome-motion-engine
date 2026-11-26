import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const AutopilotRailScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const glideT = clampedInterpolate(frame, [8, durationInFrames - 16], [0, 1], EASING.smoothInOut);
  const capsuleX = 280 + glideT * 1340;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Parallel Magnetic Levitation Rails */}
        <line x1="160" y1="620" x2="1760" y2="620" stroke={COLORS.white} strokeWidth="4" filter="url(#soft-glow)" />
        <line x1="160" y1="646" x2="1760" y2="646" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeDasharray="14 14" strokeDashoffset={-frame * 10} />

        {/* Effortless Gliding Capsule */}
        <g transform={`translate(${capsuleX}, 562)`} filter="url(#soft-glow)">
          <circle cx="0" cy="0" r="120" fill="url(#hero-aura)" opacity="0.7" />
          <rect x="-110" y="-34" width="220" height="68" rx="34" fill="#0B0B10" stroke={COLORS.white} strokeWidth="4" />
          <text x="0" y="9" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="900" letterSpacing="0.16em">
            AUTOPILOT
          </text>
        </g>

        <text x="960" y="790" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="700" letterSpacing="0.18em">
          ZERO MENTAL FRICTION · ZERO WILLPOWER SPENT
        </text>
      </svg>

      <PillBadge text="RUNS ON AUTOPILOT" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
