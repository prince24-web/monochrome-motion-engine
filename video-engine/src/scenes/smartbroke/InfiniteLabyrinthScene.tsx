import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const InfiniteLabyrinthScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const t = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);

  // Left: trapped node looping endlessly inside a wireframe maze
  const mazeCx = 560;
  const mazeCy = 570;
  const loopAngle = frame * 0.09;
  const trappedX = mazeCx + Math.cos(loopAngle) * 95 + Math.sin(loopAngle * 2) * 35;
  const trappedY = mazeCy + Math.sin(loopAngle) * 95;

  // Right: simple node walking a straight glowing line directly to GOAL
  const straightX = 1140 + t * 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="220" x2="960" y2="910" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: Wireframe Concentric Labyrinth */}
        <g>
          <text x={mazeCx} y="275" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
            THE OVERTHINKER
          </text>
          {[220, 165, 110, 55].map((r, i) => (
            <circle
              key={r}
              cx={mazeCx}
              cy={mazeCy}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.36)"
              strokeWidth="3"
              strokeDasharray={`${140 + i * 25} ${38 + i * 10}`}
              transform={`rotate(${i * 75} ${mazeCx} ${mazeCy})`}
            />
          ))}
          <circle cx={trappedX} cy={trappedY} r="10" fill={COLORS.softWhite} filter="url(#soft-glow)" />
          <text x={mazeCx} y="855" textAnchor="middle" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
            TRAPPED IN COMPLEXITY
          </text>
        </g>

        {/* Right: Direct Straight Path to Execution */}
        <g>
          <text x="1420" y="275" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            THE EXECUTOR
          </text>
          <line x1="1140" y1={mazeCy} x2="1700" y2={mazeCy} stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeDasharray="10 10" />
          <line x1="1140" y1={mazeCy} x2={straightX} y2={mazeCy} stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />
          <circle cx={straightX} cy={mazeCy} r="13" fill={COLORS.white} filter="url(#soft-glow)" />
          <circle cx="1700" cy={mazeCy} r="24" fill="none" stroke={COLORS.white} strokeWidth="3" />
          <text x="1700" y={mazeCy + 64} textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="800" letterSpacing="0.16em">
            DONE
          </text>
        </g>
      </svg>

      <PillBadge text="THE INTELLIGENCE TRAP" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
