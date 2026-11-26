import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CalibrationDialScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Error angle clicks down from 42 deg -> 0 deg in crisp stepped calibration rings
  const calT = clampedInterpolate(frame, [12, durationInFrames - 24], [0, 1], EASING.expoOut);
  const errorDeg = 42 * (1 - calT);
  const ring1Rot = errorDeg;
  const ring2Rot = -errorDeg * 1.4;
  const ring3Rot = errorDeg * 0.7;

  const cx = 960;
  const cy = 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Fixed Reference Axis */}
        <line x1={cx} y1="240" x2={cx} y2="880" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="8 10" />
        <line x1="620" y1={cy} x2="1300" y2={cy} stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="8 10" />

        {/* Concentric Vernier Calibration Rings locking into 0 deg alignment */}
        {[
          { r: 270, rot: ring1Rot, w: 3 },
          { r: 195, rot: ring2Rot, w: 2.5 },
          { r: 120, rot: ring3Rot, w: 3.5 },
        ].map((ring, i) => (
          <g key={i} transform={`translate(${cx}, ${cy}) rotate(${ring.rot})`}>
            <circle
              cx="0"
              cy="0"
              r={ring.r}
              fill="none"
              stroke={calT > 0.92 ? COLORS.white : 'rgba(255,255,255,0.6)'}
              strokeWidth={ring.w}
              strokeDasharray={i === 1 ? '18 14' : undefined}
              filter={calT > 0.92 ? 'url(#soft-glow)' : undefined}
            />
            {/* Top Alignment Notch */}
            <line x1="0" y1={-ring.r - 14} x2="0" y2={-ring.r + 18} stroke={COLORS.white} strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}

        {/* Center Lock Core */}
        <circle cx={cx} cy={cy} r={14 + calT * 6} fill={COLORS.white} filter="url(#soft-glow)" />

        <text x={cx} y={920} textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          EVERY MISS CALIBRATES THE NEXT SHOT
        </text>
      </svg>

      <RollingCounter label="AIM ERROR" value={errorDeg} suffix="°" x={360} y={560} fontSize={84} labelSize={19} />
      <PillBadge text="CALIBRATION SIGNAL" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
