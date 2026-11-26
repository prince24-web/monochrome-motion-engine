import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const RecoveryClockScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const minutesVal = sweepT * 23;
  const cx = 960;
  const cy = 565;
  const r = 225;
  const circ = 2 * Math.PI * r;
  const arcFraction = (23 / 60) * sweepT;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <circle cx={cx} cy={cy} r={r} fill="#0A0A0E" stroke="rgba(255,255,255,0.22)" strokeWidth="20" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={COLORS.white}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - arcFraction)}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#soft-glow)"
        />
        <text x={cx} y={915} textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          5 SEC DISTRACTION = 23 MIN RECOVERY TAX
        </text>
      </svg>

      <RollingCounter label="RECOVERY TIME" value={minutesVal} suffix=" MIN" x={cx} y={cy} fontSize={84} labelSize={19} />
      <PillBadge text="THE 23-MINUTE TAX" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
