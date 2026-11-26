import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../components/PillBadge';
import { MajorityCrowdProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: MajorityCrowdProps;
  durationInFrames: number;
}

export const MajorityCrowdScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  // Coin scale-in on left
  const coinScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 170 },
  });

  // Left 51% highlight sweep
  const majorityReveal = clampedInterpolate(
    frame,
    [Math.round(fps * 0.55), Math.round(fps * 1.35)],
    [0, 1],
    EASING.expoOut
  );

  // "(X) NOT REQUIRED" reveal
  const xBeat = Math.round(fps * 1.65);
  const xScale =
    frame >= xBeat
      ? spring({
          frame: frame - xBeat,
          fps,
          config: { damping: 14, stiffness: 200 },
        })
      : 0;

  // 5 rows x 20 cols = 100 silhouettes
  const rows = 5;
  const cols = 20;
  const gridX = 470;
  const gridY = 405;
  const cellW = 63;
  const cellH = 68;
  const majorityCols = Math.round((config.majorityPercent / 100) * cols); // 10 cols (~51%)
  const bracketRightX = gridX + majorityCols * cellW - 8;
  const bracketMidX = (gridX + bracketRightX) / 2;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Left "$" Coin + GETTING RICH */}
        <g transform={`translate(260, 565) scale(${coinScale})`}>
          <circle cx="0" cy="0" r="88" fill="url(#hero-aura)" opacity="0.55" />
          <circle
            cx="0"
            cy="0"
            r="52"
            fill={COLORS.softWhite}
            filter="url(#soft-glow)"
          />
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fill={COLORS.bg}
            fontFamily={FONT_FAMILY}
            fontSize="54"
            fontWeight="900"
          >
            $
          </text>
          <text
            x="0"
            y="96"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            {config.leftLabel}
          </text>
        </g>

        {/* Top Majority Bracket */}
        <g opacity={majorityReveal}>
          <path
            d={`M ${gridX + 6} ${gridY - 22} L ${gridX + 6} ${gridY - 36} L ${bracketRightX} ${gridY - 36} L ${bracketRightX} ${gridY - 22}`}
            fill="none"
            stroke={COLORS.softWhite}
            strokeWidth="2.5"
          />
          <text
            x={bracketMidX}
            y={gridY - 52}
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            {config.majorityLabel}
          </text>
        </g>

        {/* Rejection (X) circle above bracket */}
        {xScale > 0.01 && (
          <g
            transform={`translate(${bracketMidX}, ${gridY - 122}) scale(${xScale})`}
            filter="url(#soft-glow)"
          >
            <circle cx="0" cy="0" r="34" fill="#0B0B0E" stroke={COLORS.white} strokeWidth="3.5" />
            <line x1="-13" y1="-13" x2="13" y2="13" stroke={COLORS.white} strokeWidth="3.8" strokeLinecap="round" />
            <line x1="13" y1="-13" x2="-13" y2="13" stroke={COLORS.white} strokeWidth="3.8" strokeLinecap="round" />
          </g>
        )}

        {/* 5x20 Horizontal Crowd Grid */}
        <g transform={`translate(${gridX}, ${gridY})`}>
          {Array.from({ length: rows * cols }, (_, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const cx = col * cellW + cellW / 2;
            const cy = row * cellH + cellH / 2;
            const inMajority = col < majorityCols;

            const isLit = inMajority && majorityReveal > col / majorityCols;
            const opacity = isLit ? 1 : 0.28;

            return (
              <g
                key={idx}
                transform={`translate(${cx}, ${cy})`}
                opacity={opacity}
                filter={isLit ? 'url(#soft-glow)' : undefined}
              >
                <circle cx="0" cy="-14" r="6.4" fill={COLORS.white} />
                <path
                  d="M -6.8 -5 Q 0 -7.5 6.8 -5 Q 9 -3.5 10 2 L 11.5 17 Q 12 20 9 20 L -9 20 Q -12 20 -11.5 17 L -10 2 Q -9 -3.5 -6.8 -5 Z"
                  fill={COLORS.white}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* "NOT REQUIRED" Pill Badge */}
      <PillBadge text={config.pillText} x={bracketMidX} y={195} enterFrame={xBeat + 6} />
    </div>
  );
};
