import React from 'react';
import { Composition } from 'remotion';
import consistencyRaw from './data/consistency-beats-talent.json';
import fullOnePercentRaw from './data/full-one-percent.json';
import openingDemoRaw from './data/opening-demo.json';
import { VideoStoryboard } from './schema/storyboard';
import { getTotalFrames, VideoComposition } from './VideoComposition';

const openingDemo = openingDemoRaw as VideoStoryboard;
const fullOnePercent = fullOnePercentRaw as VideoStoryboard;
const consistencyBeatsTalent = consistencyRaw as VideoStoryboard;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OpeningDemo"
        component={VideoComposition}
        durationInFrames={getTotalFrames(openingDemo)}
        fps={openingDemo.fps}
        width={openingDemo.width}
        height={openingDemo.height}
        defaultProps={{
          storyboard: openingDemo,
        }}
      />
      <Composition
        id="FullOnePercent"
        component={VideoComposition}
        durationInFrames={getTotalFrames(fullOnePercent)}
        fps={fullOnePercent.fps}
        width={fullOnePercent.width}
        height={fullOnePercent.height}
        defaultProps={{
          storyboard: fullOnePercent,
        }}
      />
      <Composition
        id="ConsistencyBeatsTalent"
        component={VideoComposition}
        durationInFrames={getTotalFrames(consistencyBeatsTalent)}
        fps={consistencyBeatsTalent.fps}
        width={consistencyBeatsTalent.width}
        height={consistencyBeatsTalent.height}
        defaultProps={{
          storyboard: consistencyBeatsTalent,
        }}
      />
    </>
  );
};
