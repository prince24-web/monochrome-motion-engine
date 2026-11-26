import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { BrickTowerScene } from './scenes/reputation/BrickTowerScene';
import { CompoundingAuraScene } from './scenes/reputation/CompoundingAuraScene';
import { GlassBridgeScene } from './scenes/reputation/GlassBridgeScene';
import { InvisibleShieldScene } from './scenes/reputation/InvisibleShieldScene';
import { KeystonePullScene } from './scenes/reputation/KeystonePullScene';
import { PromiseLedgerScene } from './scenes/reputation/PromiseLedgerScene';
import { ReferralTreeScene } from './scenes/reputation/ReferralTreeScene';
import { TrustWaveScene } from './scenes/reputation/TrustWaveScene';

export type ReputationSceneType =
  | 'brick-tower'
  | 'keystone-pull'
  | 'trust-wave'
  | 'referral-tree'
  | 'glass-bridge'
  | 'promise-ledger'
  | 'invisible-shield'
  | 'compounding-aura';

export interface ReputationStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: ReputationSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type ReputationCompositionProps = {
  storyboard: ReputationStoryboard;
};

export function getReputationTotalFrames(storyboard: ReputationStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const ReputationRenderer: React.FC<{
  type: ReputationSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'brick-tower':
      return <BrickTowerScene durationInFrames={durationInFrames} />;
    case 'keystone-pull':
      return <KeystonePullScene durationInFrames={durationInFrames} />;
    case 'trust-wave':
      return <TrustWaveScene durationInFrames={durationInFrames} />;
    case 'referral-tree':
      return <ReferralTreeScene durationInFrames={durationInFrames} />;
    case 'glass-bridge':
      return <GlassBridgeScene durationInFrames={durationInFrames} />;
    case 'promise-ledger':
      return <PromiseLedgerScene durationInFrames={durationInFrames} />;
    case 'invisible-shield':
      return <InvisibleShieldScene durationInFrames={durationInFrames} />;
    case 'compounding-aura':
      return <CompoundingAuraScene durationInFrames={durationInFrames} />;
  }
};

export const ReputationComposition: React.FC<ReputationCompositionProps> = ({ storyboard }) => {
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
            <ReputationRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
