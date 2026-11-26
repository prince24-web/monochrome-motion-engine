import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FuelBankruptcyScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Reserve plunges from +80% -> -60% (into DEBT)
  const drainT = clampedInterpolate(frame, [10, durationInFrames - 22], [0, 1], EASING.smoothInOut);
  const reserveVal = 80 - drainT * 140;

  const tankX = 470;
  const tankW = 240;
  const zeroY = 580;
  const topY = 260;
  const botY = 860;

  const posFillH = reserveVal > 0 ? (reserveVal / 100) * (zeroY - topY) : 0;
  const negFillH = reserveVal < 0 ? (Math.abs(reserveVal) / 100) * (botY - zeroY) : 0;

  const tasks = ['DEEP WORK', 'READING', 'BUILDING', 'EXERCISE'];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Upper Tank (+0% to +100%) */}
        <rect
          x={tankX}
          y={topY}
          width={tankW}
          height={zeroY - topY}
          rx="16"
          fill="#0A0A0E"
          stroke={COLORS.white}
          strokeWidth="3.5"
        />
        {posFillH > 2 && (
          <rect
            x={tankX + 12}
            y={zeroY - posFillH}
            width={tankW - 24}
            height={posFillH}
            rx="8"
            fill="rgba(255,255,255,0.65)"
            filter="url(#soft-glow)"
          />
        )}

        {/* Zero Divider Line */}
        <line
          x1={tankX - 42}
          y1={zeroY}
          x2={tankX + tankW + 42}
          y2={zeroY}
          stroke={COLORS.white}
          strokeWidth="3"
          strokeDasharray="8 8"
        />
        <text
          x={tankX - 58}
          y={zeroY + 7}
          textAnchor="end"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
        >
          0%
        </text>

        {/* Lower Dashed Debt Tank (0% to -100%) */}
        <rect
          x={tankX}
          y={zeroY}
          width={tankW}
          height={botY - zeroY}
          rx="16"
          fill="#08080C"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
        />
        {negFillH > 2 && (
          <rect
            x={tankX + 12}
            y={zeroY + 4}
            width={tankW - 24}
            height={negFillH}
            rx="8"
            fill="rgba(255,255,255,0.16)"
            stroke={COLORS.white}
            strokeWidth="2"
          />
        )}
        <text
          x={tankX + tankW / 2}
          y={botY + 42}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          MOTIVATION RESERVE
        </text>

        {/* Right Side: Unlit Everyday Tasks Starved of Energy */}
        <g transform="translate(1040, 395)">
          <text
            x="0"
            y="-32"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            REAL-LIFE HABITS (STARVED)
          </text>
          {tasks.map((task, idx) => {
            const ty = idx * 105;
            const dimOp = 0.55 - drainT * 0.35;
            return (
              <g key={task} transform={`translate(0, ${ty})`} opacity={dimOp}>
                <rect
                  x="0"
                  y="0"
                  width="520"
                  height="74"
                  rx="14"
                  fill="#0A0A0E"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                />
                <circle cx="40" cy="37" r="10" fill="none" stroke={COLORS.midGrey} strokeWidth="2.5" />
                <text
                  x="74"
                  y="45"
                  fill={COLORS.softWhite}
                  fontFamily={FONT_FAMILY}
                  fontSize="24"
                  fontWeight="700"
                  letterSpacing="0.12em"
                >
                  {task}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <RollingCounter
        label="STARTING BALANCE"
        value={reserveVal}
        suffix="%"
        x={1300}
        y={220}
        fontSize={88}
        labelSize={20}
      />

      <PillBadge text="STARTING IN DEBT" x={590} y={145} enterFrame={Math.round(fps * 1.1)} />
    </div>
  );
};
