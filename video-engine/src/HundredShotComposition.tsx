import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { AttemptSevenWallScene } from './scenes/hundredshot/AttemptSevenWallScene';
import { CalibrationDialScene } from './scenes/hundredshot/CalibrationDialScene';
import { IcebergMomentumScene } from './scenes/hundredshot/IcebergMomentumScene';
import { MasterySummitScene } from './scenes/hundredshot/MasterySummitScene';
import { PrecisionReticleScene } from './scenes/hundredshot/PrecisionReticleScene';
import { ScatterToClusterScene } from './scenes/hundredshot/ScatterToClusterScene';
import { TargetRangeScene } from './scenes/hundredshot/TargetRangeScene';
import { UndergroundRootsScene } from './scenes/hundredshot/UndergroundRootsScene';

export type HundredShotSceneType =
  | 'target-range'
  | 'attempt-seven-wall'
  | 'scatter-to-cluster'
  | 'underground-roots'
  | 'calibration-dial'
  | 'iceberg-momentum'
  | 'precision-reticle'
  | 'mastery-summit';

export interface HundredShotStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: HundredShotSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type HundredShotCompositionProps = {
  storyboard: HundredShotStoryboard;
};

export function getHundredShotTotalFrames(storyboard: HundredShotStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const HundredShotRenderer: React.FC<{
  type: HundredShotSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'target-range':
      return <TargetRangeScene durationInFrames={durationInFrames} />;
    case 'attempt-seven-wall':
      return <AttemptSevenWallScene durationInFrames={durationInFrames} />;
    case 'scatter-to-cluster':
      return <ScatterToClusterScene durationInFrames={durationInFrames} />;
    case 'underground-roots':
      return <UndergroundRootsScene durationInFrames={durationInFrames} />;
    case 'calibration-dial':
      return <CalibrationDialScene durationInFrames={durationInFrames} />;
    case 'iceberg-momentum':
      return <IcebergMomentumScene durationInFrames={durationInFrames} />;
    case 'precision-reticle':
      return <PrecisionReticleScene durationInFrames={durationInFrames} />;
    case 'mastery-summit':
      return <MasterySummitScene durationInFrames={durationInFrames} />;
  }
};

export const HundredShotComposition: React.FC<HundredShotCompositionProps> = ({ storyboard }) => {
  let cursor = 0;

  return (
    <Stage showGround={false}>
      {storyboard.audioFile && <Audio src={staticFile(storyboard.audioFile)} />}
      {storyboard.scenes.map((scene) => {
        const durationInFrames = Math.max(1, Math.round(scene.durationSec * storyboard.fps));
        const from = cursor;
        cursor += durationInFrames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <HundredShotRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
