import React from 'react';
import { useCurrentFrame } from 'remotion';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { WireframeGlobe } from '../components/WireframeGlobe';
import { WireframeGlobeProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: WireframeGlobeProps;
  durationInFrames: number;
}

export const WireframeGlobeScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();
  const midFrame = Math.round(durationInFrames * 0.5);

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const isPhaseB = frame >= midFrame;

  const countA = clampedInterpolate(frame, [4, midFrame - 20], [config.countA * 0.55, config.countA], EASING.expoOut);
  const countB = clampedInterpolate(
    frame,
    [midFrame + 4, durationInFrames - 22],
    [config.countB * 0.62, config.countB],
    EASING.expoOut
  );

  const networkProgress = clampedInterpolate(
    frame,
    [midFrame, midFrame + 42],
    [0, 1],
    EASING.smoothOut
  );

  const globeScale = clampedInterpolate(frame, [0, 26], [0.85, 1], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <g transform={`translate(960, 565) scale(${globeScale}) translate(-960, -565)`}>
          <WireframeGlobe
            cx={960}
            cy={565}
            radius={250}
            rotationDeg={frame * 0.42}
            nodeIntensity={isPhaseB ? 1.0 : 0.65}
            networkProgress={networkProgress}
          />
        </g>
      </svg>

      {/* Top rolling population counter */}
      <RollingCounter
        label={isPhaseB ? config.topLabelB : config.topLabelA}
        value={isPhaseB ? countB : countA}
        x={960}
        y={168}
        fontSize={96}
        labelSize={21}
      />

      {/* Bottom pill badges switching cleanly at midpoint */}
      <PillBadge
        text={config.pillA}
        x={960}
        y={892}
        enterFrame={10}
        exitFrame={midFrame - 4}
      />
      <PillBadge
        text={config.pillB}
        x={960}
        y={892}
        enterFrame={midFrame + 6}
      />
    </div>
  );
};
