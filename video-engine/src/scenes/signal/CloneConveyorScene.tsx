import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CloneConveyorScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const beltY = 690;
  const shift = (frame * 4.5) % 190;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Conveyor Belt */}
        <line x1="120" y1={beltY} x2="1800" y2={beltY} stroke={COLORS.midGrey} strokeWidth="4" />
        <line x1="120" y1={beltY + 18} x2="1800" y2={beltY + 18} stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeDasharray="16 20" strokeDashoffset={-frame * 4.5} />

        {/* Overhead Stamping Press */}
        <rect x="860" y="220" width="200" height={120 + Math.abs(Math.sin(frame * 0.14)) * 95} rx="12" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3.5" />
        <text x="960" y="295" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="800" letterSpacing="0.16em">
          CLONE PRESS
        </text>

        {/* Endless Row of Identical Dim Grey Cubes */}
        {Array.from({ length: 11 }, (_, i) => {
          const cx = 80 + i * 190 + shift - 190;
          return (
            <g key={i} transform={`translate(${cx}, ${beltY - 108})`}>
              <rect x="0" y="0" width="102" height="102" rx="10" fill="#101016" stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" />
              <text x="51" y="58" textAnchor="middle" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="18" fontWeight="700">
                COPY
              </text>
            </g>
          );
        })}

        <text x="960" y="835" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          MILLIONS OF IDENTICAL GREY CLONES
        </text>
      </svg>

      <PillBadge text="AVERAGE IS AUTOMATED" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
