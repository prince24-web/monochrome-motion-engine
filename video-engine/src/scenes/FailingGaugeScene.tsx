import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { SemiGauge } from '../components/SemiGauge';
import { FailingGaugeProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { LAYOUT, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: FailingGaugeProps;
  durationInFrames: number;
}

export const FailingGaugeScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const gaugeCx = 940;
  const gaugeCy = 665;

  // 3 falling (X) rejection icons drop in staggered, then line up horizontally
  const dropStart = Math.round(fps * 0.6);
  const badgeRowY = gaugeCy + 82;
  const badgeSpacing = 76;

  const fallingBadges = Array.from({ length: config.ignoredCount }, (_, i) => {
    const startF = dropStart + i * 16;
    if (frame < startF) {
      return { x: gaugeCx, y: 120, opacity: 0, scale: 0.8 };
    }
    const dropProgress = spring({
      frame: frame - startF,
      fps,
      config: { damping: 14, stiffness: 150, mass: 0.9 },
    });

    const targetX = gaugeCx + (i - (config.ignoredCount - 1) / 2) * badgeSpacing;
    const startX = gaugeCx + (i - 1) * 140;
    const startY = 140 + i * 40;

    return {
      x: startX + (targetX - startX) * dropProgress,
      y: startY + (badgeRowY - startY) * dropProgress,
      opacity: Math.min(1, dropProgress * 2.2),
      scale: 0.75 + 0.25 * dropProgress,
    };
  });

  // "3 IGNORED" text fades in once badges settle
  const ignoredTextOpacity = clampedInterpolate(
    frame,
    [dropStart + 42, dropStart + 62],
    [0, 1],
    EASING.smoothOut
  );

  // Needle starts optimistic (+56 deg on WORKING side), then drops sharply to FAILING (-76 deg)
  const swingStart = Math.round(fps * 1.85);
  const swingProgress = spring({
    frame: Math.max(0, frame - swingStart),
    fps,
    config: { damping: 13, stiffness: 90, mass: 1.1 },
  });
  const idleWobble = Math.sin(frame * 0.1) * 1.4;
  const needleAngle = 56 - swingProgress * 132 + idleWobble;

  // Protagonist shrinks/dims slightly on lower-right as needle hits FAILING
  const heroScale = clampedInterpolate(
    frame,
    [swingStart, swingStart + 60],
    [1.0, 0.82],
    EASING.smoothInOut
  );
  const heroGlow = clampedInterpolate(
    frame,
    [swingStart, swingStart + 60],
    [0.45, 0.18],
    EASING.smoothOut
  );

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SemiGauge
          cx={gaugeCx}
          cy={gaugeCy}
          radius={275}
          needleAngle={needleAngle}
          leftLabel={config.leftLabel}
          rightLabel={config.rightLabel}
          fallingBadges={fallingBadges}
          ignoredCountText={config.ignoredLabel}
          ignoredCountOpacity={ignoredTextOpacity}
        />

        {/* Protagonist standing on lower-right watching the gauge drop */}
        <PawnCharacter
          x={1435}
          y={LAYOUT.groundY}
          scale={heroScale}
          glowIntensity={heroGlow}
          bob={false}
        />
      </svg>

      {/* "PROOF IT'S FAILING" Pill Badge */}
      <PillBadge
        text={config.pillText}
        x={gaugeCx}
        y={260}
        enterFrame={swingStart + 10}
      />
    </div>
  );
};
