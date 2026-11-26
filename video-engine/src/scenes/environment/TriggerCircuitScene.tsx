import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TriggerCircuitScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const flowT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const nodes = [
    { label: 'VISUAL CUE', x: 420, thresh: 0.05 },
    { label: 'AUTOMATIC ROUTINE', x: 960, thresh: 0.45 },
    { label: 'REWARD', x: 1500, thresh: 0.8 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Circuit Wire */}
        <line x1="420" y1="560" x2="1500" y2="560" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        <line x1="420" y1="560" x2={420 + flowT * 1080} y2="560" stroke={COLORS.white} strokeWidth="6" filter="url(#soft-glow)" />

        {nodes.map((n) => {
          const lit = flowT >= n.thresh;
          return (
            <g key={n.label} transform={`translate(${n.x}, 560)`}>
              <rect
                x="-150"
                y="-56"
                width="300"
                height="112"
                rx="18"
                fill={lit ? 'rgba(255,255,255,0.16)' : '#0B0B10'}
                stroke={lit ? COLORS.white : COLORS.dimGrey}
                strokeWidth={lit ? 4 : 2.5}
                filter={lit ? 'url(#soft-glow)' : undefined}
              />
              <text x="0" y="9" textAnchor="middle" fill={lit ? COLORS.white : COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.12em">
                {n.label}
              </text>
            </g>
          );
        })}

        <text x="960" y="765" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          CHANGE THE CUE → REWIRE THE ENTIRE CIRCUIT
        </text>
      </svg>

      <PillBadge text="THE VISUAL CIRCUIT" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
