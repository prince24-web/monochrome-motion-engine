import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { AsymmetricFinaleScene } from './scenes/asymmetric/AsymmetricFinaleScene';
import { CappedFloorOpenSkyScene } from './scenes/asymmetric/CappedFloorOpenSkyScene';
import { ConvexCurveScene } from './scenes/asymmetric/ConvexCurveScene';
import { PortfolioDoorsScene } from './scenes/asymmetric/PortfolioDoorsScene';
import { RiskRewardMatrixScene } from './scenes/asymmetric/RiskRewardMatrixScene';
import { SkewedBellCurveScene } from './scenes/asymmetric/SkewedBellCurveScene';
import { SurvivalBarrierScene } from './scenes/asymmetric/SurvivalBarrierScene';
import { WeightedCoinSimScene } from './scenes/asymmetric/WeightedCoinSimScene';

export type AsymmetricSceneType =
  | 'capped-floor-open-sky'
  | 'weighted-coin-sim'
  | 'skewed-bell-curve'
  | 'survival-barrier'
  | 'portfolio-doors'
  | 'convex-curve'
  | 'risk-reward-matrix'
  | 'asymmetric-finale';

export interface AsymmetricStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: AsymmetricSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type AsymmetricCompositionProps = {
  storyboard: AsymmetricStoryboard;
};

export function getAsymmetricTotalFrames(storyboard: AsymmetricStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const AsymmetricRenderer: React.FC<{
  type: AsymmetricSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'capped-floor-open-sky':
      return <CappedFloorOpenSkyScene durationInFrames={durationInFrames} />;
    case 'weighted-coin-sim':
      return <WeightedCoinSimScene durationInFrames={durationInFrames} />;
    case 'skewed-bell-curve':
      return <SkewedBellCurveScene durationInFrames={durationInFrames} />;
    case 'survival-barrier':
      return <SurvivalBarrierScene durationInFrames={durationInFrames} />;
    case 'portfolio-doors':
      return <PortfolioDoorsScene durationInFrames={durationInFrames} />;
    case 'convex-curve':
      return <ConvexCurveScene durationInFrames={durationInFrames} />;
    case 'risk-reward-matrix':
      return <RiskRewardMatrixScene durationInFrames={durationInFrames} />;
    case 'asymmetric-finale':
      return <AsymmetricFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const AsymmetricComposition: React.FC<AsymmetricCompositionProps> = ({ storyboard }) => {
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
            <AsymmetricRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
