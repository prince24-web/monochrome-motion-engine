import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { TimelineScrubberProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: TimelineScrubberProps;
  durationInFrames: number;
}

export const TimelineScrubberScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  const axisLeft = 185;
  const axisRight = 1520;
  const axisY = 720;
  const axisLen = axisRight - axisLeft;

  const scrubT = clampedInterpolate(
    frame,
    [10, durationInFrames - 28],
    [0, 1],
    EASING.smoothInOut
  );
  const playheadX = axisLeft + scrubT * axisLen;

  const moneyVal = clampedInterpolate(
    frame,
    [10, durationInFrames - 24],
    [config.moneyStart, config.moneyEnd],
    EASING.smoothInOut
  );

  const startAge = config.startAge ?? 20;
  const endAge = config.endAge ?? 80;
  const ticks = 7; // 20, 30, 40, 50, 60, 70, 80

  // 6 glowing checkmarks distributed evenly along the timeline
  const checkPositions = [0.14, 0.3, 0.46, 0.62, 0.78, 0.93];
  // 2 rows of dim "x" rejection marks
  const xCols = 28;

  const heroEnterFrame = Math.round(durationInFrames * 0.78);
  const heroPop =
    frame >= heroEnterFrame
      ? spring({
          frame: frame - heroEnterFrame,
          fps,
          config: { damping: 16, stiffness: 170 },
        })
      : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Base horizontal timeline axis */}
        <line
          x1={axisLeft}
          y1={axisY}
          x2={axisRight}
          y2={axisY}
          stroke={COLORS.dimGrey}
          strokeWidth="3"
        />
        {/* Active lit timeline segment */}
        <line
          x1={axisLeft}
          y1={axisY}
          x2={playheadX}
          y2={axisY}
          stroke={COLORS.white}
          strokeWidth="3.5"
          filter="url(#soft-glow)"
        />

        {/* Age tick marks & labels */}
        {Array.from({ length: ticks }, (_, i) => {
          const frac = i / (ticks - 1);
          const tx = axisLeft + frac * axisLen;
          const age = Math.round(startAge + frac * (endAge - startAge));
          const lit = scrubT >= frac - 0.01;
          return (
            <g key={i}>
              <line
                x1={tx}
                y1={axisY - 12}
                x2={tx}
                y2={axisY + 12}
                stroke={lit ? COLORS.white : COLORS.dimGrey}
                strokeWidth="2.5"
              />
              <text
                x={tx}
                y={axisY + 46}
                textAnchor="middle"
                fill={lit ? COLORS.softWhite : COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize="20"
                fontWeight="700"
                letterSpacing="0.12em"
              >
                {i === 0 ? `AGE ${age}` : `${age}`}
              </text>
            </g>
          );
        })}

        {/* Dense dim X marks above timeline as playhead passes */}
        {Array.from({ length: xCols * 2 }, (_, idx) => {
          const col = idx % xCols;
          const row = Math.floor(idx / xCols);
          const frac = (col + 0.5) / xCols;
          if (scrubT < frac) return null;
          const mx = axisLeft + frac * axisLen;
          const my = axisY - 46 - row * 36;
          return (
            <g key={idx} transform={`translate(${mx}, ${my})`} opacity={0.28}>
              <line x1="-7" y1="-7" x2="7" y2="7" stroke={COLORS.white} strokeWidth="2.2" />
              <line x1="7" y1="-7" x2="-7" y2="7" stroke={COLORS.white} strokeWidth="2.2" />
            </g>
          );
        })}

        {/* Occasional glowing checkmark circles (the 1% wins) */}
        {checkPositions.map((frac, i) => {
          if (scrubT < frac) return null;
          const cx = axisLeft + frac * axisLen;
          const cy = axisY - 142;
          return (
            <g key={i} transform={`translate(${cx}, ${cy})`} filter="url(#soft-glow)">
              <circle cx="0" cy="0" r="22" fill={COLORS.white} />
              <polyline
                points="-8,1 -2,7 9,-6"
                fill="none"
                stroke={COLORS.bg}
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Glowing playhead orb */}
        <circle cx={playheadX} cy={axisY} r="42" fill="url(#hero-aura)" opacity="0.9" />
        <circle cx={playheadX} cy={axisY} r="10" fill={COLORS.white} filter="url(#strong-glow)" />

        {/* Protagonist standing at age 80 on the right */}
        {heroPop > 0.01 && (
          <PawnCharacter
            x={1635}
            y={930}
            scale={0.96 * heroPop}
            opacity={heroPop}
            glowIntensity={0.75}
            showFloorHalo
            haloProgress={heroPop}
          />
        )}
      </svg>

      {/* Top-left: IGNORED BY 99 / 100 */}
      <div
        style={{
          position: 'absolute',
          left: 470,
          top: 325,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: FONT_FAMILY,
        }}
      >
        <div
          style={{
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: COLORS.midGrey,
            marginBottom: 8,
          }}
        >
          {config.leftMetricLabel}
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            color: COLORS.white,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 0 24px rgba(255,255,255,0.22)',
          }}
        >
          {config.leftMetricValue}
        </div>
      </div>

      {/* Top-right: HIS MONEY rolling counter */}
      <RollingCounter
        label={config.rightMetricLabel}
        prefix="$"
        value={moneyVal}
        x={1415}
        y={325}
        fontSize={78}
        labelSize={21}
      />

      {/* Top center pill: YOUR ENTIRE LIFE */}
      <PillBadge
        text={config.pillText}
        x={960}
        y={156}
        enterFrame={Math.round(durationInFrames * 0.56)}
      />
    </div>
  );
};
