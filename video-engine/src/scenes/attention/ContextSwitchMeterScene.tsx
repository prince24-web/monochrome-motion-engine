import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ContextSwitchMeterScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Rapid alternating toggle between TASK A and TASK B every 22 frames
  const activeTask = Math.floor(frame / 22) % 2;
  const drainT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const bandwidth = 100 - drainT * 58;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Alternating Task Nodes */}
        {[
          { label: 'TASK A', x: 520, active: activeTask === 0 },
          { label: 'TASK B', x: 1400, active: activeTask === 1 },
        ].map((t) => (
          <g key={t.label} transform={`translate(${t.x}, 430)`} opacity={t.active ? 1 : 0.32}>
            <rect
              x="-145"
              y="-64"
              width="290"
              height="128"
              rx="20"
              fill="#0B0B10"
              stroke={t.active ? COLORS.white : COLORS.dimGrey}
              strokeWidth={t.active ? 4 : 2.5}
              filter={t.active ? 'url(#soft-glow)' : undefined}
            />
            <text x="0" y="12" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="800" letterSpacing="0.14em">
              {t.label}
            </text>
          </g>
        ))}

        {/* Sparking Switch Arc */}
        <line x1="680" y1="430" x2="1240" y2="430" stroke={COLORS.white} strokeWidth="3.5" strokeDasharray="12 12" strokeDashoffset={activeTask === 0 ? frame * 8 : -frame * 8} />

        {/* Draining Cognitive Bandwidth Bar */}
        <text x="960" y="695" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
          USABLE COGNITIVE BANDWIDTH
        </text>
        <rect x="460" y="725" width="1000" height="44" rx="22" fill={COLORS.darkGrey} />
        <rect
          x="460"
          y="725"
          width={1000 * (bandwidth / 100)}
          height="44"
          rx="22"
          fill={COLORS.white}
          filter="url(#soft-glow)"
        />
      </svg>

      <RollingCounter label="BANDWIDTH LEFT" value={bandwidth} suffix="%" x={960} y={860} fontSize={74} labelSize={18} />
      <PillBadge text="THE SWITCHING TAX" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
