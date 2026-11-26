import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { ProductBox } from '../components/ProductBox';
import { RollingCounter } from '../components/RollingCounter';
import { SpotlightCone } from '../components/SpotlightCone';
import { BuyerQueueProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, LAYOUT, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: BuyerQueueProps;
  durationInFrames: number;
}

export const BuyerQueueScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  const buyersCount = clampedInterpolate(
    frame,
    [8, durationInFrames - 16],
    [config.counterStart, config.counterEnd],
    EASING.expoOut
  );

  const queueProgress = clampedInterpolate(
    frame,
    [6, durationInFrames - 20],
    [0, 1],
    EASING.smoothOut
  );

  const heroX = 335;
  const heroY = LAYOUT.groundY;
  const totalBuyers = 26;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone
          topX={heroX - 40}
          topWidth={110}
          bottomX={heroX}
          bottomY={heroY + 12}
          bottomWidth={410}
        />

        {/* Protagonist & Product Box */}
        <PawnCharacter
          x={heroX}
          y={heroY}
          scale={1.06}
          glowIntensity={0.85}
          showFloorHalo
          haloProgress={1}
          armPose={queueProgress > 0.45 ? 'celebrate' : 'none'}
        />
        <ProductBox x={heroX + 148} y={heroY} size={86} />

        {/* Expanding horizontal queue of buyers fading into the distance on the right */}
        {Array.from({ length: totalBuyers }, (_, i) => {
          const threshold = i / totalBuyers;
          if (queueProgress < threshold * 0.85) return null;

          const appearF = Math.max(0, frame - Math.round(6 + threshold * (durationInFrames - 36)));
          const pop = spring({
            frame: appearF,
            fps,
            config: { damping: 16, stiffness: 200 },
          });

          // Subtle perspective taper & spacing compression towards the far right
          const bx = 595 + i * 50 - i * i * 0.22;
          const bScale = (0.58 - i * 0.011) * pop;
          const distFade = Math.max(0.14, 1 - i / (totalBuyers + 2));

          return (
            <g
              key={i}
              transform={`translate(${bx}, ${heroY}) scale(${bScale})`}
              opacity={distFade * pop}
              filter={i < 6 ? 'url(#soft-glow)' : undefined}
            >
              <circle cx="0" cy="-168" r="30" fill={COLORS.white} />
              <path
                d="M -27 -122 Q 0 -132 27 -122 Q 38 -117 42 -96 L 56 -12 Q 58 0 46 0 L -46 0 Q -58 0 -56 -12 L -42 -96 Q -38 -117 -27 -122 Z"
                fill={COLORS.softWhite}
              />
            </g>
          );
        })}
      </svg>

      {/* Top-right BUYERS counter & pill */}
      <PillBadge text={config.pillText} x={1220} y={195} enterFrame={Math.round(fps * 0.5)} />
      <RollingCounter
        label={config.counterLabel}
        value={buyersCount}
        x={1220}
        y={312}
        fontSize={96}
        labelSize={21}
      />
    </div>
  );
};
