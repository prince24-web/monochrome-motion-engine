import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FeedbackRadarScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 560;
  const sweepDeg = (frame * 3.4) % 360;
  const sweepRad = ((sweepDeg - 90) * Math.PI) / 180;

  const blips = [
    { x: cx + 120, y: cy - 90, label: 'PRICE FIT' },
    { x: cx - 155, y: cy - 60, label: 'DEMAND' },
    { x: cx + 175, y: cy + 110, label: 'HOOK' },
    { x: cx - 110, y: cy + 150, label: 'BUYER' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {[290, 215, 140, 65].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="2" />
        ))}
        <line x1={cx - 310} y1={cy} x2={cx + 310} y2={cy} stroke="rgba(255,255,255,0.16)" strokeWidth="1.6" />
        <line x1={cx} y1={cy - 310} x2={cx} y2={cy + 310} stroke="rgba(255,255,255,0.16)" strokeWidth="1.6" />

        {/* Rotating Radar Sweep Beam */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(sweepRad) * 290}
          y2={cy + Math.sin(sweepRad) * 290}
          stroke={COLORS.white}
          strokeWidth="4"
          filter="url(#soft-glow)"
        />

        {/* Market Feedback Blips */}
        {blips.map((b, i) => (
          <g key={i} transform={`translate(${b.x}, ${b.y})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="8" fill={COLORS.white} />
            <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
            <text x="26" y="6" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="17" fontWeight="700" letterSpacing="0.14em">
              {b.label}
            </text>
          </g>
        ))}

        <circle cx={cx} cy={cy} r="10" fill={COLORS.white} />
      </svg>

      <PillBadge text="REAL MARKET SIGNAL" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
