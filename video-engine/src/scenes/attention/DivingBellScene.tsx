import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DivingBellScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const descendT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const bellY = 270 + descendT * 510;
  const depthMeters = descendT * 1000;

  const bands = [
    { label: 'SURFACE · NOISE', y: 310 },
    { label: 'SHALLOW WORK', y: 495 },
    { label: 'FLOW ZONE', y: 675 },
    { label: 'DEEP WORK', y: 835 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Depth Bands */}
        {bands.map((b) => {
          const passed = bellY >= b.y - 25;
          return (
            <g key={b.label}>
              <line x1="220" y1={b.y} x2="1700" y2={b.y} stroke={passed ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)'} strokeWidth="2" strokeDasharray="10 12" />
              <text x="1690" y={b.y - 12} textAnchor="end" fill={passed ? COLORS.white : COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="18" fontWeight="700" letterSpacing="0.16em">
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Vertical Tether Cable */}
        <line x1="960" y1="180" x2="960" y2={bellY - 58} stroke="rgba(255,255,255,0.55)" strokeWidth="3" />

        {/* Wireframe Deep-Sea Diving Bell */}
        <g transform={`translate(960, ${bellY})`} filter="url(#soft-glow)">
          <circle cx="0" cy="0" r="115" fill="url(#hero-aura)" opacity={0.3 + descendT * 0.6} />
          <path d="M -52 44 L -52 -12 A 52 52 0 0 1 52 -12 L 52 44 Z" fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3.5" />
          <circle cx="0" cy="-4" r="20" fill="none" stroke={COLORS.white} strokeWidth="2.8" />
          <circle cx="0" cy="-4" r="7" fill={COLORS.white} />
        </g>
      </svg>

      <RollingCounter label="FOCUS DEPTH" value={depthMeters} suffix=" M" x={370} y={560} fontSize={82} labelSize={19} />
      <PillBadge text="DESCENDING INTO FLOW" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
