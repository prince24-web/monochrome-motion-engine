import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const GravityRampScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Ramp tilts downward toward GOOD HABIT, letting the glowing sphere roll effortlessly!
  const tiltT = clampedInterpolate(frame, [10, Math.round(fps * 1.4)], [0, 1], EASING.expoInOut);
  const rollT = clampedInterpolate(frame, [Math.round(fps * 1.2), durationInFrames - 18], [0, 1], EASING.smoothInOut);

  const leftY = 660 - tiltT * 210;
  const rightY = 660 + tiltT * 180;
  const ballX = 360 + rollT * 1200;
  const ballY = leftY + (rightY - leftY) * rollT - 28;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Tilting Gravity Ramp */}
        <line x1="300" y1={leftY} x2="1620" y2={rightY} stroke={COLORS.white} strokeWidth="6" strokeLinecap="round" filter="url(#soft-glow)" />

        {/* Rolling Glowing Sphere */}
        <circle cx={ballX} cy={ballY} r="75" fill="url(#hero-aura)" opacity="0.7" />
        <circle cx={ballX} cy={ballY} r="26" fill={COLORS.white} filter="url(#soft-glow)" />

        <text x="1580" y={rightY + 56} textAnchor="end" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="800" letterSpacing="0.16em">
          GOOD HABITS (DOWNHILL)
        </text>
      </svg>

      <PillBadge text="TILT THE FLOOR" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
