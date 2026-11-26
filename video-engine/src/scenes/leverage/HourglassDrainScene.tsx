import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const HourglassDrainScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Drain progress 0 -> 1
  const drainT = clampedInterpolate(frame, [10, durationInFrames - 20], [0, 1], EASING.smoothInOut);

  const cx = 960;
  const topY = 235;
  const neckY = 535;
  const botY = 835;
  const halfW = 195;

  // Upper sand level drops from 100% -> 10%
  const topSandH = (1 - drainT * 0.88) * 235;
  // Bottom sand only retains ~32% because 68% leaks out sideways!
  const botSandH = drainT * 115;

  const leakOpacity = clampedInterpolate(frame, [Math.round(fps * 1.1), Math.round(fps * 1.8)], [0, 1], EASING.expoOut);

  const leaks = [
    { label: 'TAXES', xDir: 1, yOff: 590, dx: 340, dy: -20 },
    { label: 'COMMUTE', xDir: -1, yOff: 640, dx: -340, dy: 10 },
    { label: 'BURNOUT', xDir: 1, yOff: 710, dx: 330, dy: 45 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <defs>
          <clipPath id="hg-top-clip">
            <path d={`M ${cx - halfW + 12} ${topY + 14} L ${cx + halfW - 12} ${topY + 14} Q ${cx + halfW - 18} ${neckY - 80} ${cx + 10} ${neckY} L ${cx - 10} ${neckY} Q ${cx - halfW + 18} ${neckY - 80} ${cx - halfW + 12} ${topY + 14} Z`} />
          </clipPath>
          <clipPath id="hg-bot-clip">
            <path d={`M ${cx - 10} ${neckY} L ${cx + 10} ${neckY} Q ${cx + halfW - 18} ${neckY + 80} ${cx + halfW - 12} ${botY - 14} L ${cx - halfW + 12} ${botY - 14} Q ${cx - halfW + 18} ${neckY + 80} ${cx - 10} ${neckY} Z`} />
          </clipPath>
        </defs>

        {/* Soft ambient aura behind hourglass */}
        <circle cx={cx} cy={neckY} r="310" fill="url(#hero-aura)" opacity="0.4" />

        {/* Upper sand fill ("YOUR TIME") */}
        <rect
          x={cx - halfW}
          y={neckY - topSandH}
          width={halfW * 2}
          height={topSandH}
          fill="rgba(255,255,255,0.34)"
          clipPath="url(#hg-top-clip)"
        />

        {/* Lower retained sand fill ("PAYCHECK") */}
        <rect
          x={cx - halfW}
          y={botY - 14 - botSandH}
          width={halfW * 2}
          height={botSandH}
          fill="rgba(255,255,255,0.52)"
          clipPath="url(#hg-bot-clip)"
        />

        {/* Continuous falling sand stream through neck */}
        <line
          x1={cx}
          y1={neckY - 4}
          x2={cx}
          y2={botY - 14 - botSandH}
          stroke={COLORS.white}
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeDashoffset={-frame * 5}
          filter="url(#soft-glow)"
        />

        {/* Falling sparkling sand particles */}
        {Array.from({ length: 14 }, (_, i) => {
          const t = ((frame * 0.025 + i / 14) % 1);
          const py = neckY + t * (botY - 24 - neckY);
          const px = cx + Math.sin(i * 4.1 + frame * 0.1) * (4 + t * 18);
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r="2.8"
              fill={COLORS.white}
              opacity={1 - t * 0.4}
            />
          );
        })}

        {/* Wireframe Hourglass Shell */}
        <g filter="url(#soft-glow)">
          {/* Top & Bottom Plates */}
          <line x1={cx - halfW - 22} y1={topY} x2={cx + halfW + 22} y2={topY} stroke={COLORS.white} strokeWidth="5" strokeLinecap="round" />
          <line x1={cx - halfW - 22} y1={botY} x2={cx + halfW + 22} y2={botY} stroke={COLORS.white} strokeWidth="5" strokeLinecap="round" />

          {/* Left & Right Glass Contours */}
          <path
            d={`M ${cx - halfW} ${topY} Q ${cx - halfW} ${neckY - 70} ${cx - 12} ${neckY} Q ${cx - halfW} ${neckY + 70} ${cx - halfW} ${botY}`}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          <path
            d={`M ${cx + halfW} ${topY} Q ${cx + halfW} ${neckY - 70} ${cx + 12} ${neckY} Q ${cx + halfW} ${neckY + 70} ${cx + halfW} ${botY}`}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
        </g>

        {/* Top & Bottom Micro-Labels */}
        <text
          x={cx}
          y={topY - 28}
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          YOUR LIFETIME
        </text>
        <text
          x={cx}
          y={botY + 46}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          WHAT YOU KEEP
        </text>

        {/* Siphoned Leak Streams (TAXES, COMMUTE, BURNOUT) */}
        {leakOpacity > 0.01 &&
          leaks.map((lk, idx) => {
            const startX = cx + lk.xDir * 95;
            const endX = startX + lk.dx;
            const endY = lk.yOff + lk.dy;
            const ctrlX = startX + lk.dx * 0.5;
            const ctrlY = lk.yOff - 28;
            return (
              <g key={idx} opacity={leakOpacity}>
                <path
                  d={`M ${startX} ${lk.yOff} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2.5"
                  strokeDasharray="7 9"
                  strokeDashoffset={-frame * 2.5}
                />
                <circle cx={endX} cy={endY} r="6" fill={COLORS.white} filter="url(#soft-glow)" />
                <text
                  x={endX + lk.xDir * 20}
                  y={endY + 7}
                  textAnchor={lk.xDir > 0 ? 'start' : 'end'}
                  fill={COLORS.softWhite}
                  fontFamily={FONT_FAMILY}
                  fontSize="21"
                  fontWeight="700"
                  letterSpacing="0.16em"
                >
                  {lk.label}
                </text>
              </g>
            );
          })}
      </svg>

      <PillBadge text="LINEAR INCOME" x={cx} y={118} enterFrame={Math.round(fps * 1.4)} />
    </div>
  );
};
