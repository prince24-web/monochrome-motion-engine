import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { CloneConveyorScene } from './scenes/signal/CloneConveyorScene';
import { FacetedCrystalScene } from './scenes/signal/FacetedCrystalScene';
import { GreyCubeFloodScene } from './scenes/signal/GreyCubeFloodScene';
import { HumanSignatureScene } from './scenes/signal/HumanSignatureScene';
import { NoiseToSignalWaveScene } from './scenes/signal/NoiseToSignalWaveScene';
import { PrismFilterScene } from './scenes/signal/PrismFilterScene';
import { RareSignalFinaleScene } from './scenes/signal/RareSignalFinaleScene';
import { TasteTuningForkScene } from './scenes/signal/TasteTuningForkScene';

export type SignalSceneType =
  | 'clone-conveyor'
  | 'grey-cube-flood'
  | 'prism-filter'
  | 'taste-tuning-fork'
  | 'noise-to-signal-wave'
  | 'faceted-crystal'
  | 'human-signature'
  | 'rare-signal-finale';

export interface SignalStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: SignalSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type SignalCompositionProps = {
  storyboard: SignalStoryboard;
};

export function getSignalTotalFrames(storyboard: SignalStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const SignalRenderer: React.FC<{
  type: SignalSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'clone-conveyor':
      return <CloneConveyorScene durationInFrames={durationInFrames} />;
    case 'grey-cube-flood':
      return <GreyCubeFloodScene durationInFrames={durationInFrames} />;
    case 'prism-filter':
      return <PrismFilterScene durationInFrames={durationInFrames} />;
    case 'taste-tuning-fork':
      return <TasteTuningForkScene durationInFrames={durationInFrames} />;
    case 'noise-to-signal-wave':
      return <NoiseToSignalWaveScene durationInFrames={durationInFrames} />;
    case 'faceted-crystal':
      return <FacetedCrystalScene durationInFrames={durationInFrames} />;
    case 'human-signature':
      return <HumanSignatureScene durationInFrames={durationInFrames} />;
    case 'rare-signal-finale':
      return <RareSignalFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const SignalComposition: React.FC<SignalCompositionProps> = ({ storyboard }) => {
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
            <SignalRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
