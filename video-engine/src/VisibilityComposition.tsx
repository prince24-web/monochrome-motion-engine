import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Stage } from './components/Stage';
import { DiscoveryFunnelScene } from './scenes/visibility/DiscoveryFunnelScene';
import { DistributionBridgeScene } from './scenes/visibility/DistributionBridgeScene';
import { LighthouseBeamScene } from './scenes/visibility/LighthouseBeamScene';
import { NoiseOceanScene } from './scenes/visibility/NoiseOceanScene';
import { SeenWinsFinaleScene } from './scenes/visibility/SeenWinsFinaleScene';
import { SignalAmplifierScene } from './scenes/visibility/SignalAmplifierScene';
import { SpotlightContrastScene } from './scenes/visibility/SpotlightContrastScene';
import { VaultedDiamondScene } from './scenes/visibility/VaultedDiamondScene';

export type VisibilitySceneType =
  | 'vaulted-diamond'
  | 'lighthouse-beam'
  | 'noise-ocean'
  | 'signal-amplifier'
  | 'discovery-funnel'
  | 'spotlight-contrast'
  | 'distribution-bridge'
  | 'seen-wins-finale';

export interface VisibilityStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: Array<{
    id: string;
    type: VisibilitySceneType;
    durationSec: number;
    narration: string;
  }>;
}

export type VisibilityCompositionProps = {
  storyboard: VisibilityStoryboard;
};

export function getVisibilityTotalFrames(storyboard: VisibilityStoryboard): number {
  return storyboard.scenes.reduce(
    (sum, s) => sum + Math.max(1, Math.round(s.durationSec * storyboard.fps)),
    0
  );
}

const VisibilityRenderer: React.FC<{
  type: VisibilitySceneType;
  durationInFrames: number;
}> = ({ type, durationInFrames }) => {
  switch (type) {
    case 'vaulted-diamond':
      return <VaultedDiamondScene durationInFrames={durationInFrames} />;
    case 'lighthouse-beam':
      return <LighthouseBeamScene durationInFrames={durationInFrames} />;
    case 'noise-ocean':
      return <NoiseOceanScene durationInFrames={durationInFrames} />;
    case 'signal-amplifier':
      return <SignalAmplifierScene durationInFrames={durationInFrames} />;
    case 'discovery-funnel':
      return <DiscoveryFunnelScene durationInFrames={durationInFrames} />;
    case 'spotlight-contrast':
      return <SpotlightContrastScene durationInFrames={durationInFrames} />;
    case 'distribution-bridge':
      return <DistributionBridgeScene durationInFrames={durationInFrames} />;
    case 'seen-wins-finale':
      return <SeenWinsFinaleScene durationInFrames={durationInFrames} />;
  }
};

export const VisibilityComposition: React.FC<VisibilityCompositionProps> = ({ storyboard }) => {
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
            <VisibilityRenderer type={scene.type} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </Stage>
  );
};
