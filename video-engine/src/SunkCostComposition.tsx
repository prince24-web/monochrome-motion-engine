import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { AnchorChainScene } from './scenes/sunkcost/AnchorChainScene';
import { BuoyantRiseScene } from './scenes/sunkcost/BuoyantRiseScene';
import { CleanSlateFinaleScene } from './scenes/sunkcost/CleanSlateFinaleScene';
import { CoinPourScene } from './scenes/sunkcost/CoinPourScene';
import { EgoMirrorScene } from './scenes/sunkcost/EgoMirrorScene';
import { SinkingShipScene } from './scenes/sunkcost/SinkingShipScene';
import { VectorShearsScene } from './scenes/sunkcost/VectorShearsScene';
import { ZeroBasedResetScene } from './scenes/sunkcost/ZeroBasedResetScene';

export type SunkCostSceneType =
  | 'sinking-ship'
  | 'coin-pour'
  | 'anchor-chain'
  | 'ego-mirror'
  | 'zero-based-reset'
  | 'vector-shears'
  | 'buoyant-rise'
  | 'clean-slate-finale';

export interface SunkCostStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: SunkCostSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type SunkCostCompositionProps = {
  storyboard: SunkCostStoryboard;
};

export function getSunkCostTotalFrames(storyboard: SunkCostStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const SunkCostRenderer: React.FC<{
  type: SunkCostSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'sinking-ship':
      return <SinkingShipScene durationInFrames={durationInFrames} />;
    case 'coin-pour':
      return <CoinPourScene durationInFrames={durationInFrames} />;
    case 'anchor-chain':
      return <AnchorChainScene durationInFrames={durationInFrames} />;
    case 'ego-mirror':
      return <EgoMirrorScene durationInFrames={durationInFrames} />;
    case 'zero-based-reset':
      return <ZeroBasedResetScene durationInFrames={durationInFrames} />;
    case 'vector-shears':
      return <VectorShearsScene durationInFrames={durationInFrames} />;
    case 'buoyant-rise':
      return <BuoyantRiseScene durationInFrames={durationInFrames} />;
    case 'clean-slate-finale':
      return <CleanSlateFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const SunkCostComposition: React.FC<SunkCostCompositionProps> = ({ storyboard }) => {
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
            <SunkCostRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
