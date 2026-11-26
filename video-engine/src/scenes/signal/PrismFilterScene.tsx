import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PrismFilterScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const passT = clampedInterpolate(frame, [16, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const filterX = 920;
  const cy = 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Incoming Stream of Grey Noise Cubes on Left */}
        {[-120, -60, 0, 60, 120].map((dy, i) => {
          const prog = ((frame * 0.024 + i * 0.19) % 1);
          const x = 180 + prog * (filterX - 240);
          return <rect key={i} x={x} y={cy + dy - 16} width="32" height="32" rx="5" fill="#121218" stroke="rgba(255,255,255,0.34)" strokeWidth="2" />;
        })}

        {/* Vertical Magnetic Filter Gate */}
        <line x1={filterX} y1="260" x2={filterX} y2="860" stroke={COLORS.white} strokeWidth="5" strokeDasharray="16 10" filter="url(#soft-glow)" />

        {/* Single Isolated Blazing 1% Crystal Emerging on Right */}
        <g transform={`translate(${filterX + 120 + passT * 420}, ${cy})`} filter="url(#strong-glow)">
          <circle cx="0" cy="0" r="125" fill="url(#hero-aura)" opacity="0.85" />
          <polygon points="0,-64 52,0 0,64 -52,0" fill={COLORS.white} />
        </g>

        <text x="520" y="885" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.16em">
          99% REJECTED NOISE
        </text>
        <text x="1360" y="885" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          1% RARE SIGNAL
        </text>
      </svg>

      <PillBadge text="THE SIGNAL FILTER" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
