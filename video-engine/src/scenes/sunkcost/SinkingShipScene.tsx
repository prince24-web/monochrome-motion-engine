import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SinkingShipScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sinkT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const waterY = 660;
  const shipY = 590 + sinkT * 140;
  const shipTilt = -4 - sinkT * 18;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Wireframe Sinking Ship Hull */}
        <g transform={`translate(960, ${shipY}) rotate(${shipTilt})`} filter="url(#soft-glow)">
          <polygon points="-240,-20 240,-20 175,90 -175,90" fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3.5" />
          <line x1="0" y1="-20" x2="0" y2="-210" stroke={COLORS.white} strokeWidth="3.5" />
          <polygon points="0,-200 135,-85 0,-55" fill="rgba(255,255,255,0.12)" stroke={COLORS.white} strokeWidth="2.5" />
        </g>

        {/* Waterline Masking Lower Hull */}
        <rect x="0" y={waterY} width={VIDEO_CONFIG.width} height="420" fill="#07070A" opacity="0.86" />
        <line x1="140" y1={waterY} x2="1780" y2={waterY} stroke={COLORS.white} strokeWidth="3" strokeDasharray="14 12" />

        <text x="960" y="835" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          PAST EFFORT IS ALREADY GONE
        </text>
      </svg>

      <PillBadge text="THE SUNK COST TRAP" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
