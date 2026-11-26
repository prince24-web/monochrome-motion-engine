import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PortfolioDoorsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const doors = [
    { label: 'BET 1', result: '-$1', win: false },
    { label: 'BET 2', result: '-$1', win: false },
    { label: 'BET 3', result: '-$1', win: false },
    { label: 'BET 4', result: '+$100', win: true },
    { label: 'BET 5', result: '-$1', win: false },
  ];

  const doorW = 240;
  const doorH = 420;
  const gap = 58;
  const startX = (VIDEO_CONFIG.width - (5 * doorW + 4 * gap)) / 2;
  const stepF = Math.max(16, Math.floor((durationInFrames - 70) / 5));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {doors.map((d, i) => {
          const openF = 16 + i * stepF;
          const opened = frame >= openF;
          const openT = opened ? clampedInterpolate(frame - openF, [0, 22], [0, 1], EASING.expoOut) : 0;
          const x = startX + i * (doorW + gap);
          const y = 340;
          return (
            <g key={d.label} transform={`translate(${x}, ${y})`}>
              {d.win && opened && (
                <circle cx={doorW / 2} cy={doorH / 2} r="240" fill="url(#hero-aura)" opacity={openT * 0.95} />
              )}
              <rect
                x="0"
                y="0"
                width={doorW}
                height={doorH}
                rx="14"
                fill={d.win && opened ? COLORS.white : '#0A0A0E'}
                stroke={d.win && opened ? COLORS.white : 'rgba(255,255,255,0.45)'}
                strokeWidth={d.win && opened ? 4 : 2.5}
                filter={d.win && opened ? 'url(#strong-glow)' : undefined}
              />
              <text
                x={doorW / 2}
                y={doorH / 2 + 12}
                textAnchor="middle"
                fill={d.win && opened ? COLORS.bg : COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize={d.win && opened ? '46' : '30'}
                fontWeight="900"
                opacity={openT}
              >
                {d.result}
              </text>
              <text
                x={doorW / 2}
                y={doorH + 46}
                textAnchor="middle"
                fill={d.win && opened ? COLORS.white : COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize="20"
                fontWeight="700"
                letterSpacing="0.16em"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      <PillBadge text="ONE DOOR PAYS FOR ALL" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
