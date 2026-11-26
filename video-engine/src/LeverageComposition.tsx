import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { BroadcastRippleScene } from './scenes/leverage/BroadcastRippleScene';
import { DominoChainScene } from './scenes/leverage/DominoChainScene';
import { EscapeVelocityScene } from './scenes/leverage/EscapeVelocityScene';
import { FourPillarsMatrixScene } from './scenes/leverage/FourPillarsMatrixScene';
import { FulcrumLeverScene } from './scenes/leverage/FulcrumLeverScene';
import { HorizonArchitectScene } from './scenes/leverage/HorizonArchitectScene';
import { HourglassDrainScene } from './scenes/leverage/HourglassDrainScene';
import { SleepClockFactoryScene } from './scenes/leverage/SleepClockFactoryScene';
import { SplitPathForkScene } from './scenes/leverage/SplitPathForkScene';
import { TreadmillClockScene } from './scenes/leverage/TreadmillClockScene';

export type LeverageSceneType =
  | 'treadmill-clock'
  | 'hourglass-drain'
  | 'split-path-fork'
  | 'fulcrum-lever'
  | 'four-pillars'
  | 'broadcast-ripple'
  | 'sleep-clock-factory'
  | 'domino-chain'
  | 'escape-velocity'
  | 'horizon-architect';

export interface LeverageStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: LeverageSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type LeverageCompositionProps = {
  storyboard: LeverageStoryboard;
};

export function getLeverageTotalFrames(storyboard: LeverageStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const LeverageSceneRenderer: React.FC<{
  type: LeverageSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'treadmill-clock':
      return <TreadmillClockScene durationInFrames={durationInFrames} />;
    case 'hourglass-drain':
      return <HourglassDrainScene durationInFrames={durationInFrames} />;
    case 'split-path-fork':
      return <SplitPathForkScene durationInFrames={durationInFrames} />;
    case 'fulcrum-lever':
      return <FulcrumLeverScene durationInFrames={durationInFrames} />;
    case 'four-pillars':
      return <FourPillarsMatrixScene durationInFrames={durationInFrames} />;
    case 'broadcast-ripple':
      return <BroadcastRippleScene durationInFrames={durationInFrames} />;
    case 'sleep-clock-factory':
      return <SleepClockFactoryScene durationInFrames={durationInFrames} />;
    case 'domino-chain':
      return <DominoChainScene durationInFrames={durationInFrames} />;
    case 'escape-velocity':
      return <EscapeVelocityScene durationInFrames={durationInFrames} />;
    case 'horizon-architect':
      return <HorizonArchitectScene durationInFrames={durationInFrames} />;
  }
};

export const LeverageComposition: React.FC<LeverageCompositionProps> = ({ storyboard }) => {
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
            <LeverageSceneRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
