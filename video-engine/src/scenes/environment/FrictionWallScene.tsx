import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FrictionWallScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const t = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="220" x2="960" y2="900" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: BAD HABIT blocked by 3 Tall Friction Walls */}
        <g>
          <text x="510" y="280" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
            BAD HABIT · HIGH FRICTION
          </text>
          <line x1="200" y1="740" x2="820" y2="740" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
          {[430, 540, 650].map((wx, i) => (
            <rect key={i} x={wx} y={420} width="26" height="320" rx="5" fill="#101016" stroke={COLORS.white} strokeWidth="3" />
          ))}
          <circle cx={260 + Math.min(140, t * 240)} cy={715} r="18" fill={COLORS.softWhite} />
          <text x="510" y="810" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.14em">
            PHONE IN ANOTHER ROOM
          </text>
        </g>

        {/* Right: GOOD HABIT glides through 0 Friction */}
        <g>
          <text x="1410" y="280" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            GOOD HABIT · ZERO FRICTION
          </text>
          <line x1="1100" y1="740" x2="1720" y2="740" stroke={COLORS.white} strokeWidth="4" filter="url(#soft-glow)" />
          <circle cx={1140 + t * 540} cy={715} r="20" fill={COLORS.white} filter="url(#soft-glow)" />
          <text x="1410" y="810" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="800" letterSpacing="0.14em">
            BOOK ALREADY OPEN ON DESK
          </text>
        </g>
      </svg>

      <PillBadge text="DESIGN FRICTION" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
