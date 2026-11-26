import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SignalAmplifierScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cy = 560;

  // Left: tiny quiet whisper sine wave; Right: huge amplified signal sine wave!
  const leftPts: string[] = [];
  const rightPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const lx = 180 + u * 620;
    const ly = cy + Math.sin(u * 20 - frame * 0.14) * 24;
    leftPts.push(`${lx.toFixed(1)},${ly.toFixed(1)}`);

    const rx = 1120 + u * 620;
    const ry = cy + Math.sin(u * 20 - frame * 0.14) * 165;
    rightPts.push(`${rx.toFixed(1)},${ry.toFixed(1)}`);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <polyline points={leftPts.join(' ')} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
        <polyline points={rightPts.join(' ')} fill="none" stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />

        {/* Central Distribution Amplifier Triangle */}
        <g transform={`translate(960, ${cy})`} filter="url(#soft-glow)">
          <polygon points="-130,-145 145,0 -130,145" fill="#0B0B10" stroke={COLORS.white} strokeWidth="4" />
          <text x="-28" y="8" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="900" letterSpacing="0.14em">
            100X
          </text>
        </g>

        <text x="480" y="790" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.16em">
          QUIET CRAFTSMANSHIP
        </text>
        <text x="1430" y="790" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.16em">
          AMPLIFIED SIGNAL
        </text>
      </svg>

      <PillBadge text="DISTRIBUTION AMPLIFIES" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
