import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const VectorShearsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cutFrame = Math.round(durationInFrames * 0.44);
  const cutT = clampedInterpolate(frame, [cutFrame, cutFrame + 20], [0, 1], EASING.expoOut);
  const sparkT = frame >= cutFrame ? clampedInterpolate(frame - cutFrame, [0, 24], [0, 1], EASING.expoOut) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Upper & Lower Rope Halves Snapping Apart on Cut */}
        <line x1="960" y1="220" x2="960" y2={540 - cutT * 110} stroke={COLORS.white} strokeWidth="6" strokeDasharray="14 10" filter="url(#soft-glow)" />
        <line x1="960" y1={540 + cutT * 180} x2="960" y2={880 + cutT * 140} stroke={COLORS.midGrey} strokeWidth="6" strokeDasharray="14 10" opacity={1 - cutT * 0.6} />

        {/* Horizontal Razor Cut Flash */}
        {sparkT > 0.01 && sparkT < 0.98 && (
          <g filter="url(#strong-glow)">
            <line x1={960 - sparkT * 360} y1="540" x2={960 + sparkT * 360} y2="540" stroke={COLORS.white} strokeWidth="5" opacity={1 - sparkT} />
            <circle cx="960" cy="540" r={18 + sparkT * 95} fill="none" stroke={COLORS.white} strokeWidth="3" opacity={1 - sparkT} />
          </g>
        )}

        <text x="960" y="925" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          STRATEGIC QUITTING IS PRECISION
        </text>
      </svg>

      <PillBadge text="CUT THE ROPE" x={960} y={136} enterFrame={cutFrame - 6} />
    </div>
  );
};
