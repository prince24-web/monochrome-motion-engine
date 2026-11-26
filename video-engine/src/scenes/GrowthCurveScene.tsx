import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CrowdGrid } from '../components/CrowdGrid';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { GrowthCurveProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: GrowthCurveProps;
  durationInFrames: number;
}

export const GrowthCurveScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Curve progress 0..1
  const curveT = clampedInterpolate(
    frame,
    [8, durationInFrames - Math.round(fps * 0.9)],
    [0, 1],
    EASING.smoothInOut
  );

  // Exponential growth curve from (260, 860) -> (1290, 325)
  const x0 = 260;
  const y0 = 860;
  const x1 = 1290;
  const y1 = 325;

  const evalCurve = (t: number) => {
    const x = x0 + (x1 - x0) * t;
    // Exponential rise: y stays low then shoots steeply up
    const expY = Math.pow(t, 2.75);
    const y = y0 - (y0 - y1) * expY;
    return { x, y };
  };

  // Build polyline path up to curveT
  const samples = 60;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * curveT;
    const p = evalCurve(t);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }

  const tip = evalCurve(curveT);

  // Money counter accelerates exponentially with the curve
  const moneyVal =
    config.moneyStart + (config.moneyEnd - config.moneyStart) * Math.pow(curveT, 2.35);

  // Mini 10x10 crowd grid in top-right corner
  const miniGridX = 1430;
  const miniGridY = 235;
  const miniCellW = 30;
  const miniCellH = 30;
  const hiIdx = 45;
  const hiX = miniGridX + (hiIdx % 10) * miniCellW + miniCellW / 2;
  const hiY = miniGridY + Math.floor(hiIdx / 10) * miniCellH + miniCellH / 2;

  const tetherOpacity = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.42), Math.round(durationInFrames * 0.56)],
    [0, 1],
    EASING.smoothOut
  );
  const headlineOpacity = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.68), Math.round(durationInFrames * 0.82)],
    [0, 1],
    EASING.expoOut
  );
  const celebrate = curveT > 0.62;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* L-shaped Chart Axes */}
        <line x1={x0} y1="240" x2={x0} y2={y0} stroke={COLORS.midGrey} strokeWidth="2.5" />
        <line x1={x0} y1={y0} x2="1490" y2={y0} stroke={COLORS.midGrey} strokeWidth="2.5" />
        <text
          x="1415"
          y={y0 + 44}
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          {config.axisLabel ?? 'TIME'}
        </text>

        {/* Mini 10x10 Crowd Grid in top-right ("THE 1% WHO DO") */}
        <g transform={`translate(${miniGridX}, ${miniGridY}) scale(0.48)`}>
          <CrowdGrid
            x={0}
            y={0}
            rows={10}
            cols={10}
            cellWidth={62}
            cellHeight={62}
            highlightIndex={hiIdx}
            dimOthersProgress={tetherOpacity}
            highlightBoost={tetherOpacity}
          />
        </g>

        {/* Dashed tether beam connecting THE 1% to rising protagonist */}
        {tetherOpacity > 0.01 && (
          <line
            x1={tip.x + 28}
            y1={tip.y - 68}
            x2={hiX}
            y2={hiY}
            stroke="rgba(255,255,255,0.68)"
            strokeWidth="2.5"
            strokeDasharray="8 9"
            opacity={tetherOpacity}
            filter="url(#soft-glow)"
          />
        )}

        {/* Exponential Growth Curve */}
        {pts.length > 1 && (
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />
        )}

        {/* Protagonist riding the leading tip of the curve */}
        <PawnCharacter
          x={tip.x}
          y={tip.y}
          scale={0.78}
          glowIntensity={0.75 + curveT * 0.25}
          armPose={celebrate ? 'celebrate' : 'none'}
          bob={false}
        />
      </svg>

      {/* Top Center Finale Headline ("1% IS ENOUGH.") */}
      <div
        style={{
          position: 'absolute',
          left: 830,
          top: 158,
          transform: `translate(-50%, -50%) translateY(${(1 - headlineOpacity) * 16}px)`,
          opacity: headlineOpacity,
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 36px rgba(255, 255, 255, 0.42)',
          whiteSpace: 'nowrap',
        }}
      >
        {config.headlineText}
      </div>

      {/* YOUR MONEY counter on left */}
      <RollingCounter
        label={config.counterLabel}
        prefix="$"
        value={moneyVal}
        x={605}
        y={340}
        fontSize={86}
        labelSize={20}
      />

      {/* Top-right Pill: THE 1% WHO DO */}
      <PillBadge
        text={config.crowdPillText}
        x={1575}
        y={180}
        enterFrame={Math.round(durationInFrames * 0.36)}
        scale={0.9}
      />
    </div>
  );
};
