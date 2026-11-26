import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Stage } from './components/Stage';
import { BuyerQueueScene } from './scenes/BuyerQueueScene';
import { FailingGaugeScene } from './scenes/FailingGaugeScene';
import { GrowthCurveScene } from './scenes/GrowthCurveScene';
import { MajorityCrowdScene } from './scenes/MajorityCrowdScene';
import { MorphingShapeScene } from './scenes/MorphingShapeScene';
import { NestedZoomGridScene } from './scenes/NestedZoomGridScene';
import { OnePercentBuyerScene } from './scenes/OnePercentBuyerScene';
import { ProgressRingGoalScene } from './scenes/ProgressRingGoalScene';
import { TimelineScrubberScene } from './scenes/TimelineScrubberScene';
import { TribeScaleScene } from './scenes/TribeScaleScene';
import { WireframeCalculatorScene } from './scenes/WireframeCalculatorScene';
import { WireframeGlobeScene } from './scenes/WireframeGlobeScene';
import { SceneConfig, VideoStoryboard } from './schema/storyboard';

export type VideoCompositionProps = {
  storyboard: VideoStoryboard;
};

const GROUND_SCENES = new Set<SceneConfig['type']>([
  'one-percent-buyer',
  'progress-ring-goal',
  'failing-gauge',
  'buyer-queue',
]);

export function getTotalFrames(storyboard: VideoStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, scene) => sum + Math.max(1, Math.round(scene.durationSec * storyboard.fps)),
    0
  );
}

const SceneRenderer: React.FC<{ scene: SceneConfig; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  switch (scene.type) {
    case 'one-percent-buyer':
      return <OnePercentBuyerScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'progress-ring-goal':
      return <ProgressRingGoalScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'failing-gauge':
      return <FailingGaugeScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'morphing-shape':
      return <MorphingShapeScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'majority-crowd':
      return <MajorityCrowdScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'wireframe-globe':
      return <WireframeGlobeScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'nested-zoom-grid':
      return <NestedZoomGridScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'buyer-queue':
      return <BuyerQueueScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'timeline-scrubber':
      return <TimelineScrubberScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'wireframe-calculator':
      return <WireframeCalculatorScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'tribe-scale':
      return <TribeScaleScene config={scene.props} durationInFrames={durationInFrames} />;
    case 'growth-curve':
      return <GrowthCurveScene config={scene.props} durationInFrames={durationInFrames} />;
  }
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({ storyboard }) => {
  const frame = useCurrentFrame();

  // Compute scene start/end frame spans once
  let cursor = 0;
  const spans = storyboard.scenes.map((scene) => {
    const durationInFrames = Math.max(1, Math.round(scene.durationSec * storyboard.fps));
    const from = cursor;
    cursor += durationInFrames;
    return { scene, from, durationInFrames };
  });

  const activeSpan = spans.find(
    (s) => frame >= s.from && frame < s.from + s.durationInFrames
  );
  const showGround = activeSpan ? GROUND_SCENES.has(activeSpan.scene.type) : true;

  return (
    <Stage showGround={showGround}>
      {storyboard.audioFile && <Audio src={staticFile(storyboard.audioFile)} />}
      {spans.map(({ scene, from, durationInFrames }) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
          <SceneRenderer scene={scene} durationInFrames={durationInFrames} />
        </Sequence>
      ))}
    </Stage>
  );
};
