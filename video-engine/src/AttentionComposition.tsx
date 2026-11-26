import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { ContextSwitchMeterScene } from './scenes/attention/ContextSwitchMeterScene';
import { DeepOceanVaultScene } from './scenes/attention/DeepOceanVaultScene';
import { DivingBellScene } from './scenes/attention/DivingBellScene';
import { FragmentedGridScene } from './scenes/attention/FragmentedGridScene';
import { PingHarpoonScene } from './scenes/attention/PingHarpoonScene';
import { RecoveryClockScene } from './scenes/attention/RecoveryClockScene';
import { ShatteredLensScene } from './scenes/attention/ShatteredLensScene';
import { UnbrokenFocusFinaleScene } from './scenes/attention/UnbrokenFocusFinaleScene';

export type AttentionSceneType =
  | 'diving-bell'
  | 'ping-harpoon'
  | 'recovery-clock'
  | 'shattered-lens'
  | 'fragmented-grid'
  | 'context-switch-meter'
  | 'deep-ocean-vault'
  | 'unbroken-focus-finale';

export interface AttentionStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: AttentionSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type AttentionCompositionProps = {
  storyboard: AttentionStoryboard;
};

export function getAttentionTotalFrames(storyboard: AttentionStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const AttentionRenderer: React.FC<{
  type: AttentionSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'diving-bell':
      return <DivingBellScene durationInFrames={durationInFrames} />;
    case 'ping-harpoon':
      return <PingHarpoonScene durationInFrames={durationInFrames} />;
    case 'recovery-clock':
      return <RecoveryClockScene durationInFrames={durationInFrames} />;
    case 'shattered-lens':
      return <ShatteredLensScene durationInFrames={durationInFrames} />;
    case 'fragmented-grid':
      return <FragmentedGridScene durationInFrames={durationInFrames} />;
    case 'context-switch-meter':
      return <ContextSwitchMeterScene durationInFrames={durationInFrames} />;
    case 'deep-ocean-vault':
      return <DeepOceanVaultScene durationInFrames={durationInFrames} />;
    case 'unbroken-focus-finale':
      return <UnbrokenFocusFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const AttentionComposition: React.FC<AttentionCompositionProps> = ({ storyboard }) => {
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
            <AttentionRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
