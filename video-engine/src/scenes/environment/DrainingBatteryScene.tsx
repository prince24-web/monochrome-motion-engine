import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DrainingBatteryScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drainT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const pct = 100 - drainT * 96;
  const hour = Math.round(8 + drainT * 7); // 8 AM -> 3 PM
  const timeLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

  const bx = 480;
  const by = 430;
  const bw = 920;
  const bh = 250;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Battery Shell + Positive Terminal */}
        <rect x={bx} y={by} width={bw} height={bh} rx="26" fill="#0A0A0E" stroke={COLORS.white} strokeWidth="4" filter="url(#soft-glow)" />
        <rect x={bx + bw} y={by + 78} width="32" height="94" rx="8" fill={COLORS.white} />

        {/* Draining Charge Fill */}
        <rect
          x={bx + 18}
          y={by + 18}
          width={Math.max(16, (bw - 36) * (pct / 100))}
          height={bh - 36}
          rx="14"
          fill="rgba(255,255,255,0.78)"
          filter="url(#soft-glow)"
        />

        <text x="960" y="775" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="28" fontWeight="800" letterSpacing="0.18em">
          TIME OF DAY: {timeLabel}
        </text>
      </svg>

      <RollingCounter label="WILLPOWER BATTERY" value={pct} suffix="%" x={960} y={310} fontSize={88} labelSize={20} />
      <PillBadge text="DIES BY 3 PM" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
