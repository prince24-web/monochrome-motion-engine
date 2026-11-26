import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { ProductBox } from '../components/ProductBox';
import { ProgressRing } from '../components/ProgressRing';
import { RollingCounter } from '../components/RollingCounter';
import { ProgressRingGoalProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { LAYOUT, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: ProgressRingGoalProps;
  durationInFrames: number;
}

export const ProgressRingGoalScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const ringScale = clampedInterpolate(frame, [0, 26], [0.88, 1], EASING.expoOut);

  // Smooth percentage sweep from 2% -> 20%
  const percent = clampedInterpolate(
    frame,
    [10, durationInFrames - 22],
    [config.percentStart, config.percentEnd],
    EASING.smoothInOut
  );

  // Outer dashed TARGET: 100 % ring fades in midway
  const outerTargetOpacity = clampedInterpolate(
    frame,
    [Math.round(fps * 1.1), Math.round(fps * 1.65)],
    [0, 1],
    EASING.expoOut
  );

  // Protagonist glides slightly toward center holding up the product box
  const heroX = clampedInterpolate(frame, [0, 45], [640, 725], EASING.expoOut);
  const heroY = LAYOUT.groundY;

  const ringCx = 960;
  const ringCy = 445;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Center Progress Ring + Outer Target Ring */}
        <g transform={`translate(${ringCx}, ${ringCy}) scale(${ringScale}) translate(${-ringCx}, ${-ringCy})`}>
          <ProgressRing
            cx={ringCx}
            cy={ringCy}
            radius={178}
            strokeWidth={22}
            percent={percent}
            showOuterTarget
            outerTargetOpacity={outerTargetOpacity}
            targetLabel={config.targetLabel}
          />
        </g>

        {/* Protagonist holding the Product Box */}
        <PawnCharacter
          x={heroX}
          y={heroY}
          scale={0.95}
          glowIntensity={0.4}
          armPose="reachRight"
        />
        <ProductBox x={heroX + 126} y={heroY - 46} size={76} />
      </svg>

      {/* "NEEDS EVERYONE" Pill Badge */}
      <PillBadge
        text={config.pillText}
        x={ringCx}
        y={175}
        enterFrame={Math.round(fps * 0.45)}
      />

      {/* Centered "LIKED BY 20%" Counter inside the ring */}
      <RollingCounter
        label={config.counterLabel}
        value={percent}
        suffix=" %"
        x={ringCx}
        y={ringCy + 4}
        fontSize={72}
        labelSize={19}
      />
    </div>
  );
};
