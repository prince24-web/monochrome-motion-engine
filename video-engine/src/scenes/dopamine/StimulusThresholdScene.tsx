import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const StimulusThresholdScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Enjoyment threshold line rises from y=670 -> y=330, leaving real-life bars stranded below it
  const riseT = clampedInterpolate(frame, [14, durationInFrames - 24], [0, 1], EASING.expoInOut);
  const thresholdY = 670 - riseT * 340;
  const baseY = 850;

  const bars = [
    { label: 'READING', h: 240, x: 390 },
    { label: 'DEEP WORK', h: 280, x: 690 },
    { label: 'TRAINING', h: 315, x: 990 },
    { label: 'BUILDING', h: 350, x: 1290 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Base Axis */}
        <line x1="250" y1={baseY} x2="1670" y2={baseY} stroke={COLORS.midGrey} strokeWidth="2.5" />

        {/* Real-Life Activity Bars */}
        {bars.map((b) => {
          const topOfBar = baseY - b.h;
          const aboveThreshold = topOfBar <= thresholdY;
          return (
            <g key={b.label} opacity={aboveThreshold ? 0.95 : 0.28}>
              <rect
                x={b.x}
                y={topOfBar}
                width="175"
                height={b.h}
                rx="12"
                fill={aboveThreshold ? 'rgba(255,255,255,0.22)' : '#0B0B10'}
                stroke={aboveThreshold ? COLORS.white : COLORS.dimGrey}
                strokeWidth="3"
                filter={aboveThreshold ? 'url(#soft-glow)' : undefined}
              />
              <text
                x={b.x + 87.5}
                y={baseY + 42}
                textAnchor="middle"
                fill={aboveThreshold ? COLORS.white : COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize="20"
                fontWeight="700"
                letterSpacing="0.14em"
              >
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Rising Glowing Threshold Bar */}
        <g filter="url(#soft-glow)">
          <line
            x1="220"
            y1={thresholdY}
            x2="1700"
            y2={thresholdY}
            stroke={COLORS.white}
            strokeWidth="4.5"
          />
          <text
            x="1690"
            y={thresholdY - 18}
            textAnchor="end"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            STIMULATION THRESHOLD ▲
          </text>
        </g>
      </svg>

      <PillBadge text="NOTHING FEELS REWARDING" x={960} y={145} enterFrame={Math.round(fps * 1.3)} />
    </div>
  );
};
