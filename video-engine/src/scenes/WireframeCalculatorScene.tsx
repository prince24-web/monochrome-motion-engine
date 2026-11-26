import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../components/PillBadge';
import { WireframeCalculatorProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: WireframeCalculatorProps;
  durationInFrames: number;
}

export const WireframeCalculatorScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  const line1Opacity = clampedInterpolate(frame, [10, 24], [0, 1], EASING.smoothOut);
  const line2Opacity = clampedInterpolate(frame, [Math.round(fps * 0.8), Math.round(fps * 1.05)], [0, 1], EASING.smoothOut);
  const resultOpacity = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 1.8)], [0, 1], EASING.smoothOut);

  const strikeProgress = clampedInterpolate(
    frame,
    [Math.round(fps * 2.2), Math.round(fps * 2.65)],
    [0, 1],
    EASING.expoOut
  );

  // Calculator geometry
  const calcX = 525;
  const calcY = 235;
  const calcW = 460;
  const calcH = 650;

  // Side box ("99% SAY NO")
  const boxX = 1235;
  const boxY = 440;
  const boxW = 340;
  const boxH = 112;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Wireframe Calculator Shell */}
        <rect
          x={calcX}
          y={calcY}
          width={calcW}
          height={calcH}
          rx="26"
          fill="#09090D"
          stroke={COLORS.white}
          strokeWidth="3.5"
          filter="url(#soft-glow)"
        />

        {/* Screen Header ("MARKET") */}
        <text
          x={calcX + 34}
          y={calcY + 46}
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          {config.screenHeader}
        </text>

        {/* Display Screen Box */}
        <rect
          x={calcX + 32}
          y={calcY + 62}
          width={calcW - 64}
          height={162}
          rx="14"
          fill="#0D0D12"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
        />

        {/* Calculation Lines */}
        <text
          x={calcX + calcW - 54}
          y={calcY + 114}
          textAnchor="end"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="31"
          fontWeight="700"
          opacity={line1Opacity}
        >
          {config.line1}
        </text>
        <text
          x={calcX + calcW - 54}
          y={calcY + 154}
          textAnchor="end"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="28"
          fontWeight="600"
          opacity={line2Opacity}
        >
          {config.line2}
        </text>
        <text
          x={calcX + calcW - 54}
          y={calcY + 206}
          textAnchor="end"
          fill={COLORS.white}
          fontFamily={FONT_FAMILY}
          fontSize="38"
          fontWeight="800"
          opacity={resultOpacity}
          filter={resultOpacity > 0.5 ? 'url(#soft-glow)' : undefined}
        >
          {config.resultLine}
        </text>

        {/* 4x4 Calculator Key Grid */}
        {Array.from({ length: 16 }, (_, idx) => {
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          const kw = 84;
          const kh = 76;
          const gapX = 20;
          const gapY = 18;
          const kx = calcX + 32 + col * (kw + gapX);
          const ky = calcY + 258 + row * (kh + gapY);
          const isEquals = idx === 15;
          const isActive = isEquals && resultOpacity > 0.2;

          return (
            <rect
              key={idx}
              x={kx}
              y={ky}
              width={kw}
              height={kh}
              rx="12"
              fill={isActive ? 'rgba(255,255,255,0.22)' : '#0B0B0F'}
              stroke={isActive ? COLORS.white : 'rgba(255,255,255,0.45)'}
              strokeWidth={isActive ? '3' : '2.2'}
            />
          );
        })}

        {/* Right Side Box: "99% SAY NO" + Strikethrough */}
        <g opacity={1 - strikeProgress * 0.42}>
          <rect
            x={boxX}
            y={boxY}
            width={boxW}
            height={boxH}
            rx="16"
            fill="#0A0A0E"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2.8"
          />
          <text
            x={boxX + boxW / 2}
            y={boxY + 67}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="34"
            fontWeight="800"
            letterSpacing="0.06em"
          >
            {config.sideBoxTitle}
          </text>
          <text
            x={boxX + boxW / 2}
            y={boxY + boxH + 42}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            {config.sideBoxSubtitle}
          </text>
        </g>

        {/* Bold glowing strikethrough line */}
        {strikeProgress > 0.01 && (
          <line
            x1={boxX - 24}
            y1={boxY + boxH / 2}
            x2={boxX - 24 + (boxW + 48) * strikeProgress}
            y2={boxY + boxH / 2}
            stroke={COLORS.white}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />
        )}
      </svg>

      {/* Top Pill: MATHEMATICALLY IRRELEVANT */}
      <PillBadge
        text={config.pillText}
        x={calcX + calcW / 2}
        y={156}
        enterFrame={Math.round(fps * 1.65)}
      />
    </div>
  );
};
