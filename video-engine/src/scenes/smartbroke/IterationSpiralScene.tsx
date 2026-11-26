import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const IterationSpiralScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const drawT = clampedInterpolate(frame, [8, durationInFrames - 18], [0, 1], EASING.smoothInOut);

  // Expanding Archimedean vector spiral (3.2 revolutions)
  const samples = 180;
  const maxTheta = Math.PI * 2 * 3.2;
  const pts: string[] = [];
  let headX = cx;
  let headY = cy;

  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * drawT;
    const theta = u * maxTheta - Math.PI / 2;
    const r = 24 + u * 290;
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (i === samples) {
      headX = x;
      headY = y;
    }
  }

  const cycles = Math.max(1, Math.round(drawT * 10));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <circle cx={cx} cy={cy} r="280" fill="url(#hero-aura)" opacity="0.35" />

        {pts.length > 1 && (
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />
        )}

        <circle cx={headX} cy={headY} r="12" fill={COLORS.white} filter="url(#soft-glow)" />

        <text x={cx} y={935} textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          SHIP → LEARN → IMPROVE · CYCLE #{cycles}
        </text>
      </svg>

      <PillBadge text="10× FASTER ITERATION" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
