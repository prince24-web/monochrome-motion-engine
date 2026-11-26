import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const RoomArchitectureScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Clutter items fade out while clean central DESK lights up!
  const cleanT = clampedInterpolate(frame, [16, durationInFrames - 22], [0, 1], EASING.expoInOut);
  const clutter = [
    { label: 'TV', x: 560, y: 390 },
    { label: 'PHONE', x: 1360, y: 390 },
    { label: 'SNACKS', x: 560, y: 740 },
    { label: '20 TABS', x: 1360, y: 740 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Top-Down Architectural Room Blueprint */}
        <rect x="400" y="255" width="1120" height="620" rx="18" fill="#09090D" stroke="rgba(255,255,255,0.45)" strokeWidth="3.5" />

        {/* Clutter Nodes Fading Away */}
        {clutter.map((c) => (
          <g key={c.label} transform={`translate(${c.x}, ${c.y})`} opacity={Math.max(0.08, 0.85 - cleanT * 0.78)}>
            <rect x="-82" y="-32" width="164" height="64" rx="12" fill="#0D0D14" stroke={COLORS.midGrey} strokeWidth="2" strokeDasharray="6 6" />
            <text x="0" y="8" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.14em">
              {c.label}
            </text>
          </g>
        ))}

        {/* Clean Illuminated Central Desk */}
        <g transform="translate(960, 565)" filter="url(#soft-glow)">
          <circle cx="0" cy="0" r="190" fill="url(#hero-aura)" opacity={0.3 + cleanT * 0.65} />
          <rect x="-180" y="-76" width="360" height="152" rx="16" fill="#0B0B10" stroke={COLORS.white} strokeWidth="4" />
          <text x="0" y="10" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="28" fontWeight="900" letterSpacing="0.16em">
            DEEP WORK DESK
          </text>
        </g>
      </svg>

      <PillBadge text="REDESIGN THE ROOM" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
