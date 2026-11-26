import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { AutopilotRailScene } from './scenes/environment/AutopilotRailScene';
import { DefaultPathSwitchScene } from './scenes/environment/DefaultPathSwitchScene';
import { DrainingBatteryScene } from './scenes/environment/DrainingBatteryScene';
import { EffortlessFlowFinaleScene } from './scenes/environment/EffortlessFlowFinaleScene';
import { FrictionWallScene } from './scenes/environment/FrictionWallScene';
import { GravityRampScene } from './scenes/environment/GravityRampScene';
import { RoomArchitectureScene } from './scenes/environment/RoomArchitectureScene';
import { TriggerCircuitScene } from './scenes/environment/TriggerCircuitScene';

export type EnvironmentSceneType =
  | 'draining-battery'
  | 'friction-wall'
  | 'gravity-ramp'
  | 'trigger-circuit'
  | 'default-path-switch'
  | 'room-architecture'
  | 'autopilot-rail'
  | 'effortless-flow-finale';

export interface EnvironmentStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: EnvironmentSceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type EnvironmentCompositionProps = {
  storyboard: EnvironmentStoryboard;
};

export function getEnvironmentTotalFrames(storyboard: EnvironmentStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const EnvironmentRenderer: React.FC<{
  type: EnvironmentSceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'draining-battery':
      return <DrainingBatteryScene durationInFrames={durationInFrames} />;
    case 'friction-wall':
      return <FrictionWallScene durationInFrames={durationInFrames} />;
    case 'gravity-ramp':
      return <GravityRampScene durationInFrames={durationInFrames} />;
    case 'trigger-circuit':
      return <TriggerCircuitScene durationInFrames={durationInFrames} />;
    case 'default-path-switch':
      return <DefaultPathSwitchScene durationInFrames={durationInFrames} />;
    case 'room-architecture':
      return <RoomArchitectureScene durationInFrames={durationInFrames} />;
    case 'autopilot-rail':
      return <AutopilotRailScene durationInFrames={durationInFrames} />;
    case 'effortless-flow-finale':
      return <EffortlessFlowFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const EnvironmentComposition: React.FC<EnvironmentCompositionProps> = ({ storyboard }) => {
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
            <EnvironmentRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
