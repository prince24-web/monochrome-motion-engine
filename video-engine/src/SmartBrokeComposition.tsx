import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { ActionWinsFinaleScene } from './scenes/smartbroke/ActionWinsFinaleScene';
import { BlueprintTowerScene } from './scenes/smartbroke/BlueprintTowerScene';
import { FeedbackRadarScene } from './scenes/smartbroke/FeedbackRadarScene';
import { InfiniteLabyrinthScene } from './scenes/smartbroke/InfiniteLabyrinthScene';
import { IterationSpiralScene } from './scenes/smartbroke/IterationSpiralScene';
import { ParalysisCageScene } from './scenes/smartbroke/ParalysisCageScene';
import { PerfectionistLoopScene } from './scenes/smartbroke/PerfectionistLoopScene';
import { VersionZeroShipScene } from './scenes/smartbroke/VersionZeroShipScene';

export type SmartBrokeSceneType =
  | 'infinite-labyrinth'
  | 'blueprint-tower'
  | 'perfectionist-loop'
  | 'version-zero-ship'
  | 'feedback-radar'
  | 'paralysis-cage'
  | 'iteration-spiral'
  | 'action-wins-finale';

export interface SmartBrokeStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: SmartBrokeSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type SmartBrokeCompositionProps = {
  storyboard: SmartBrokeStoryboard;
};

export function getSmartBrokeTotalFrames(storyboard: SmartBrokeStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const SmartBrokeRenderer: React.FC<{
  type: SmartBrokeSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'infinite-labyrinth':
      return <InfiniteLabyrinthScene durationInFrames={durationInFrames} />;
    case 'blueprint-tower':
      return <BlueprintTowerScene durationInFrames={durationInFrames} />;
    case 'perfectionist-loop':
      return <PerfectionistLoopScene durationInFrames={durationInFrames} />;
    case 'version-zero-ship':
      return <VersionZeroShipScene durationInFrames={durationInFrames} />;
    case 'feedback-radar':
      return <FeedbackRadarScene durationInFrames={durationInFrames} />;
    case 'paralysis-cage':
      return <ParalysisCageScene durationInFrames={durationInFrames} />;
    case 'iteration-spiral':
      return <IterationSpiralScene durationInFrames={durationInFrames} />;
    case 'action-wins-finale':
      return <ActionWinsFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const SmartBrokeComposition: React.FC<SmartBrokeCompositionProps> = ({ storyboard }) => {
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
            <SmartBrokeRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
