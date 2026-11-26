import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TreadmillClockScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Speed ramps up over the scene
  const speed = clampedInterpolate(frame, [0, durationInFrames * 0.7], [1, 3.6], EASING.smoothInOut);
  const beltOffset = (frame * 5.5 * speed) % 44;

  // Giant analog clock behind treadmill
  const clockCx = 570;
  const clockCy = 420;
  const clockR = 178;
  const minuteAngle = frame * 7.5 * speed;
  const hourAngle = frame * 0.9 * speed;

  // Income bar rises and slams into 24 HR CEILING
  const hitFrame = Math.round(durationInFrames * 0.48);
  const barProgress = clampedInterpolate(frame, [16, hitFrame], [0.08, 1], EASING.expoOut);
  const impactFrame = Math.max(0, frame - hitFrame);
  const impactRing =
    frame >= hitFrame
      ? clampedInterpolate(impactFrame, [0, 28], [0, 1], EASING.expoOut)
      : 0;
  const bounceY =
    frame >= hitFrame
      ? Math.sin(impactFrame * 0.7) * Math.exp(-impactFrame * 0.14) * 14
      : 0;

  const barX = 1280;
  const barBaseY = 820;
  const ceilingY = 390;
  const maxBarH = barBaseY - ceilingY;
  const currentBarH = Math.max(20, maxBarH * barProgress - bounceY);

  // Sprint lean & bob for protagonist on treadmill
  const runBob = Math.abs(Math.sin(frame * 0.28 * Math.min(2.2, speed))) * 12;
  const runLean = 8 + speed * 3.5;

  const hoursVal = clampedInterpolate(frame, [0, hitFrame], [8, 24], EASING.smoothOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Background Wireframe Analog Clock */}
        <g opacity="0.52">
          <circle
            cx={clockCx}
            cy={clockCy}
            r={clockR}
            fill="#09090D"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
          />
          {Array.from({ length: 12 }, (_, i) => {
            const rad = (i * Math.PI) / 6;
            const x1 = clockCx + Math.cos(rad) * (clockR - 18);
            const y1 = clockCy + Math.sin(rad) * (clockR - 18);
            const x2 = clockCx + Math.cos(rad) * (clockR - 4);
            const y2 = clockCy + Math.sin(rad) * (clockR - 4);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={i % 3 === 0 ? 3.5 : 2}
              />
            );
          })}
          {/* Hour hand */}
          <line
            x1={clockCx}
            y1={clockCy}
            x2={clockCx}
            y2={clockCy - 92}
            stroke={COLORS.softWhite}
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} ${clockCx} ${clockCy})`}
          />
          {/* Minute hand */}
          <line
            x1={clockCx}
            y1={clockCy}
            x2={clockCx}
            y2={clockCy - 142}
            stroke={COLORS.white}
            strokeWidth="3.2"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} ${clockCx} ${clockCy})`}
          />
          <circle cx={clockCx} cy={clockCy} r="7" fill={COLORS.white} />
        </g>

        {/* Mechanical Conveyor Treadmill */}
        <g transform="translate(260, 790)">
          {/* Outer rounded belt loop */}
          <rect
            x="0"
            y="0"
            width="620"
            height="62"
            rx="31"
            fill="#0A0A0E"
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter="url(#soft-glow)"
          />
          {/* Animated moving tread ticks along top surface */}
          <line
            x1="34"
            y1="0"
            x2="586"
            y2="0"
            stroke={COLORS.white}
            strokeWidth="7"
            strokeDasharray="16 28"
            strokeDashoffset={beltOffset}
          />
          {/* Left & Right Rollers */}
          {[42, 310, 578].map((rx, idx) => (
            <g key={idx} transform={`translate(${rx}, 31) rotate(${-frame * 8 * speed})`}>
              <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            </g>
          ))}
        </g>

        {/* Sprinting Pawn Character on Treadmill */}
        <g transform={`translate(570, ${784 - runBob})`}>
          <circle cx="0" cy="-95" r="140" fill="url(#hero-aura)" opacity="0.55" />
          {/* Motion speed streaks behind runner */}
          {[-125, -85, -45].map((sy, i) => (
            <line
              key={i}
              x1={-90 - i * 18}
              y1={sy}
              x2={-160 - i * 24 - speed * 14}
              y2={sy}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <g transform={`skewX(${-runLean})`} filter="url(#soft-glow)">
            <circle cx="0" cy="-168" r="28" fill={COLORS.white} />
            <path
              d="M -25 -124 Q 0 -134 25 -124 Q 36 -118 40 -96 L 52 -12 Q 54 0 42 0 L -42 0 Q -54 0 -52 -12 L -40 -96 Q -36 -118 -25 -124 Z"
              fill={COLORS.softWhite}
            />
          </g>
        </g>

        {/* Right Side: Ceiling Bar Chart ("INCOME CAPPED BY 24 HRS") */}
        <g>
          {/* Hard horizontal glowing ceiling barrier */}
          <line
            x1="1120"
            y1={ceilingY}
            x2="1640"
            y2={ceilingY}
            stroke={COLORS.white}
            strokeWidth="4"
            strokeDasharray="14 10"
            filter="url(#soft-glow)"
          />
          <text
            x="1380"
            y={ceilingY - 22}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            24 HR HARD CEILING
          </text>

          {/* Shockwave ripple on ceiling impact */}
          {impactRing > 0.01 && impactRing < 0.98 && (
            <ellipse
              cx={barX + 100}
              cy={ceilingY}
              rx={40 + impactRing * 165}
              ry={10 + impactRing * 32}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="3"
              opacity={1 - impactRing}
            />
          )}

          {/* Base platform line */}
          <line x1="1160" y1={barBaseY} x2="1600" y2={barBaseY} stroke={COLORS.midGrey} strokeWidth="2.5" />

          {/* Rising Income Bar */}
          <rect
            x={barX}
            y={barBaseY - currentBarH}
            width="200"
            height={currentBarH}
            rx="10"
            fill="rgba(255,255,255,0.16)"
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter="url(#soft-glow)"
          />
          <text
            x={barX + 100}
            y={barBaseY + 42}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            HOURLY INCOME
          </text>
        </g>
      </svg>

      {/* Top Left Rolling Hours Counter */}
      <RollingCounter
        label="DAILY EFFORT"
        value={hoursVal}
        suffix=" HRS"
        x={570}
        y={142}
        fontSize={74}
        labelSize={20}
      />

      {/* Top Right Pill Badge */}
      <PillBadge
        text="CAPPED BY TIME"
        x={1380}
        y={156}
        enterFrame={hitFrame - 6}
      />
    </div>
  );
};
