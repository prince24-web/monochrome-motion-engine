import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { BaselineOscilloscopeScene } from './scenes/dopamine/BaselineOscilloscopeScene';
import { BoredomChamberScene } from './scenes/dopamine/BoredomChamberScene';
import { ClarityHorizonScene } from './scenes/dopamine/ClarityHorizonScene';
import { FuelBankruptcyScene } from './scenes/dopamine/FuelBankruptcyScene';
import { ReceptorLockScene } from './scenes/dopamine/ReceptorLockScene';
import { ScrollSlotMachineScene } from './scenes/dopamine/ScrollSlotMachineScene';
import { StimulusThresholdScene } from './scenes/dopamine/StimulusThresholdScene';
import { ThermostatResetScene } from './scenes/dopamine/ThermostatResetScene';

export type DopamineSceneType =
  | 'baseline-oscilloscope'
  | 'scroll-slot-machine'
  | 'receptor-lock'
  | 'fuel-bankruptcy'
  | 'stimulus-threshold'
  | 'boredom-chamber'
  | 'thermostat-reset'
  | 'clarity-horizon';

export interface DopamineStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: DopamineSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type DopamineCompositionProps = {
  storyboard: DopamineStoryboard;
};

export function getDopamineTotalFrames(storyboard: DopamineStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const DopamineSceneRenderer: React.FC<{
  type: DopamineSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'baseline-oscilloscope':
      return <BaselineOscilloscopeScene durationInFrames={durationInFrames} />;
    case 'scroll-slot-machine':
      return <ScrollSlotMachineScene durationInFrames={durationInFrames} />;
    case 'receptor-lock':
      return <ReceptorLockScene durationInFrames={durationInFrames} />;
    case 'fuel-bankruptcy':
      return <FuelBankruptcyScene durationInFrames={durationInFrames} />;
    case 'stimulus-threshold':
      return <StimulusThresholdScene durationInFrames={durationInFrames} />;
    case 'boredom-chamber':
      return <BoredomChamberScene durationInFrames={durationInFrames} />;
    case 'thermostat-reset':
      return <ThermostatResetScene durationInFrames={durationInFrames} />;
    case 'clarity-horizon':
      return <ClarityHorizonScene durationInFrames={durationInFrames} />;
  }
};

export const DopamineComposition: React.FC<DopamineCompositionProps> = ({ storyboard }) => {
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
            <DopamineSceneRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
