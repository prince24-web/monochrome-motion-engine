import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FulcrumLeverScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Fulcrum slides right from x=960 -> x=1220 to maximize mechanical advantage
  const slideT = clampedInterpolate(frame, [10, Math.round(fps * 1.4)], [0, 1], EASING.expoInOut);
  const fulcrumX = 960 + slideT * 265;
  const fulcrumTopY = 740;
  const groundY = 855;

  // Beam pivots down on the left, lifting the massive 100X monolith skyward on the right
  const liftStart = Math.round(fps * 1.35);
  const liftSpring =
    frame >= liftStart
      ? spring({
          frame: frame - liftStart,
          fps,
          config: { damping: 12, stiffness: 65, mass: 1.2 },
        })
      : 0;

  const beamAngleDeg = 10 - liftSpring * 24; // +10 deg (right heavy) -> -14 deg (left pushes down, right rises!)
  const rad = (beamAngleDeg * Math.PI) / 180;

  const leftArmLen = fulcrumX - 370;
  const rightArmLen = 1520 - fulcrumX;

  const leftEndX = fulcrumX - Math.cos(rad) * leftArmLen;
  const leftEndY = fulcrumTopY - Math.sin(rad) * leftArmLen;
  const rightEndX = fulcrumX + Math.cos(rad) * rightArmLen;
  const rightEndY = fulcrumTopY + Math.sin(rad) * rightArmLen;

  const ratioVal = clampedInterpolate(frame, [10, liftStart + 25], [1, 100], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Ground baseline */}
        <line
          x1="140"
          y1={groundY}
          x2="1780"
          y2={groundY}
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="2.5"
          strokeDasharray="12 14"
        />

        {/* Sliding Triangular Fulcrum */}
        <g transform={`translate(${fulcrumX}, ${groundY})`} filter="url(#soft-glow)">
          <polygon
            points={`0,${fulcrumTopY - groundY} -56,0 56,0`}
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="0" cy={fulcrumTopY - groundY} r="9" fill={COLORS.white} />
        </g>

        {/* Lever Beam */}
        <line
          x1={leftEndX}
          y1={leftEndY}
          x2={rightEndX}
          y2={rightEndY}
          stroke={COLORS.white}
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#soft-glow)"
        />

        {/* Tiny Pawn pressing down on the long left arm ("1X EFFORT") */}
        <PawnCharacter
          x={leftEndX + 22}
          y={leftEndY - 4}
          scale={0.72}
          glowIntensity={0.65}
          bob={false}
        />
        <text
          x={leftEndX + 22}
          y={leftEndY + 54}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.16em"
        >
          1X EFFORT
        </text>

        {/* Massive Glowing Monolith Cube ("100X OUTPUT") lifted on right arm */}
        <g
          transform={`translate(${rightEndX - 30}, ${rightEndY - 8})`}
          filter="url(#soft-glow)"
        >
          {/* Radial burst behind cube as it lifts */}
          <circle cx="0" cy="-125" r="210" fill="url(#hero-aura)" opacity={0.25 + liftSpring * 0.65} />
          <rect
            x="-125"
            y="-250"
            width="250"
            height="250"
            rx="16"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="4.5"
          />
          {/* Inner architectural grid lines on monolith */}
          <line x1="-125" y1="-166" x2="125" y2="-166" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <line x1="-125" y1="-84" x2="125" y2="-84" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <text
            x="0"
            y="-128"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="54"
            fontWeight="900"
          >
            100X
          </text>
          <text
            x="0"
            y="-92"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            OUTPUT
          </text>
        </g>
      </svg>

      {/* Top Left Leverage Multiplier Counter */}
      <RollingCounter
        label="LEVERAGE RATIO"
        value={ratioVal}
        suffix="X"
        x={480}
        y={215}
        fontSize={96}
        labelSize={20}
      />

      <PillBadge text="MECHANICAL ADVANTAGE" x={960} y={136} enterFrame={liftStart + 4} />
    </div>
  );
};
