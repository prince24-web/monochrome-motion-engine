import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CrowdGrid, MoneyArc } from '../components/CrowdGrid';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { ProductBox } from '../components/ProductBox';
import { RollingCounter } from '../components/RollingCounter';
import { SpotlightCone } from '../components/SpotlightCone';
import { OnePercentBuyerProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { LAYOUT, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: OnePercentBuyerProps;
  durationInFrames: number;
}

export const OnePercentBuyerScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beatDimStart = Math.round(fps * 0.45);
  const beatDimEnd = Math.round(fps * 1.15);
  const beatPill = Math.round(fps * 0.85);
  const beatMoneyStart = Math.round(fps * 1.55);
  const beatMoneyEnd = Math.max(beatMoneyStart + 30, durationInFrames - Math.round(fps * 0.25));

  const sceneOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );

  const dimOthers = clampedInterpolate(frame, [beatDimStart, beatDimEnd], [0, 1], EASING.expoOut);
  const highlightBoost = clampedInterpolate(
    frame,
    [beatDimStart + 8, beatDimEnd + 10],
    [0, 1],
    EASING.expoOut
  );
  const heartOpacity = clampedInterpolate(
    frame,
    [beatMoneyStart - 10, beatMoneyStart + 12],
    [0, 1],
    EASING.smoothOut
  );

  const moneyProgress = clampedInterpolate(
    frame,
    [beatMoneyStart, beatMoneyEnd],
    [0, 1],
    EASING.smoothInOut
  );
  const moneyArcOpacity = clampedInterpolate(
    frame,
    [beatMoneyStart, beatMoneyStart + 16],
    [0, 1],
    EASING.smoothOut
  );
  const heroHalo = clampedInterpolate(
    frame,
    [beatMoneyStart + 6, beatMoneyStart + 36],
    [0, 1],
    EASING.expoOut
  );
  const heroSunburst = clampedInterpolate(
    frame,
    [beatMoneyStart + 18, beatMoneyStart + 52],
    [0, 1],
    EASING.smoothOut
  );

  const moneyValue = interpolate(
    frame,
    [0, beatMoneyStart, durationInFrames - 10],
    [config.counterStart, config.counterMid, config.counterEnd],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASING.smoothInOut,
    }
  );

  const gridX = 955;
  const gridY = 235;
  const cellW = 64;
  const cellH = 62;
  const highlightIdx = config.highlightIndex ?? 46;
  const hiCol = highlightIdx % 10;
  const hiRow = Math.floor(highlightIdx / 10);
  const hiWorldX = gridX + hiCol * cellW + cellW / 2;
  const hiWorldY = gridY + hiRow * cellH + cellH / 2;

  const heroX = 355;
  const heroY = LAYOUT.groundY;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone
          topX={heroX - 95}
          topWidth={110}
          bottomX={heroX}
          bottomY={heroY + 12}
          bottomWidth={440}
          opacity={0.95}
        />

        <SpotlightCone
          topX={hiWorldX}
          topWidth={85}
          bottomX={hiWorldX}
          bottomY={hiWorldY + 110}
          bottomWidth={280}
          opacity={dimOthers * 0.92}
        />

        <CrowdGrid
          x={gridX}
          y={gridY}
          rows={10}
          cols={10}
          cellWidth={cellW}
          cellHeight={cellH}
          highlightIndex={highlightIdx}
          dimOthersProgress={dimOthers}
          highlightBoost={highlightBoost}
          showHeart
          heartOpacity={heartOpacity}
        />

        <MoneyArc
          fromX={hiWorldX - 24}
          fromY={hiWorldY - 6}
          toX={heroX + 120}
          toY={heroY - 125}
          controlX={890}
          controlY={370}
          progress={moneyProgress}
          opacity={moneyArcOpacity}
          billCount={7}
        />

        <PawnCharacter
          x={heroX}
          y={heroY}
          scale={1.08}
          glowIntensity={0.45 + heroHalo * 0.55}
          showFloorHalo
          haloProgress={heroHalo}
          armPose={moneyProgress > 0.15 ? 'reachRight' : 'none'}
          sunburstOpacity={heroSunburst}
        />
        <ProductBox x={heroX + 148} y={heroY} size={90} />
      </svg>

      <RollingCounter
        label={config.counterLabel}
        prefix={config.counterPrefix ?? '$'}
        value={moneyValue}
        x={685}
        y={132}
        fontSize={114}
        labelSize={22}
      />

      <PillBadge text={config.pillText} x={hiWorldX} y={162} enterFrame={beatPill} />
    </div>
  );
};
