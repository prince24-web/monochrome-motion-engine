import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ConvexCurveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drawT = clampedInterpolate(frame, [10, durationInFrames - 20], [0, 1], EASING.smoothInOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="220" x2="960" y2="900" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: Fragile Concave Curve (Capped Gain, Catastrophic Drop) */}
        <g opacity="0.55">
          <text x="510" y="280" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
            CONCAVE · FRAGILE
          </text>
          <path
            d="M 220 790 Q 480 420 800 500"
            fill="none"
            stroke="rgba(255,255,255,0.52)"
            strokeWidth="4"
            strokeDasharray="760"
            strokeDashoffset={760 * (1 - drawT)}
          />
          <text x="510" y="865" textAnchor="middle" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
            SMALL UPSIDE · HUGE DOWNSIDE
          </text>
        </g>

        {/* Right: Antifragile Convex Curve (Tiny Downside, Explosive Upside) */}
        <g>
          <text x="1410" y="280" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            CONVEX · ANTIFRAGILE
          </text>
          <path
            d="M 1120 760 Q 1420 755 1700 320"
            fill="none"
            stroke={COLORS.white}
            strokeWidth="5"
            strokeDasharray="820"
            strokeDashoffset={820 * (1 - drawT)}
            filter="url(#soft-glow)"
          />
          <text x="1410" y="865" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="800" letterSpacing="0.16em">
            TINY DOWNSIDE · EXPLOSIVE UPSIDE
          </text>
        </g>
      </svg>

      <PillBadge text="CONVEXITY WINS" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
