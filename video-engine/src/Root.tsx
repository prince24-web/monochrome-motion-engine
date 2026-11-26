import React from 'react';
import { Composition } from 'remotion';
import {
  AttentionComposition,
  AttentionStoryboard,
  getAttentionTotalFrames,
} from './AttentionComposition';
import attentionTaxRaw from './data/attention-tax.json';
import compoundingRepRaw from './data/compounding-reputation.json';
import consistencyRaw from './data/consistency-beats-talent.json';
import dopamineDebtRaw from './data/dopamine-debt.json';
import fullOnePercentRaw from './data/full-one-percent.json';
import hundredShotRaw from './data/hundred-shot-rule.json';
import leverageTrapRaw from './data/leverage-trap.json';
import openingDemoRaw from './data/opening-demo.json';
import smartBrokeRaw from './data/smart-people-broke.json';
import {
  DopamineComposition,
  DopamineStoryboard,
  getDopamineTotalFrames,
} from './DopamineComposition';
import {
  getHundredShotTotalFrames,
  HundredShotComposition,
  HundredShotStoryboard,
} from './HundredShotComposition';
import {
  getSmartBrokeTotalFrames,
  SmartBrokeComposition,
  SmartBrokeStoryboard,
} from './SmartBrokeComposition';
import {
  getLeverageTotalFrames,
  LeverageComposition,
  LeverageStoryboard,
} from './LeverageComposition';
import {
  getReputationTotalFrames,
  ReputationComposition,
  ReputationStoryboard,
} from './ReputationComposition';
import { VideoStoryboard } from './schema/storyboard';
import { getTotalFrames, VideoComposition } from './VideoComposition';

const openingDemo = openingDemoRaw as VideoStoryboard;
const fullOnePercent = fullOnePercentRaw as VideoStoryboard;
const consistencyBeatsTalent = consistencyRaw as VideoStoryboard;
const leverageTrap = leverageTrapRaw as LeverageStoryboard;
const dopamineDebt = dopamineDebtRaw as DopamineStoryboard;
const hundredShotRule = hundredShotRaw as HundredShotStoryboard;
const smartPeopleBroke = smartBrokeRaw as SmartBrokeStoryboard;
const attentionTax = attentionTaxRaw as AttentionStoryboard;
const compoundingReputation = compoundingRepRaw as ReputationStoryboard;

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
      <Composition
        id="LeverageTrap"
        component={LeverageComposition}
        durationInFrames={getLeverageTotalFrames(leverageTrap)}
        fps={leverageTrap.fps}
        width={leverageTrap.width}
        height={leverageTrap.height}
        defaultProps={{
          storyboard: leverageTrap,
        }}
      />
      <Composition
        id="DopamineDebt"
        component={DopamineComposition}
        durationInFrames={getDopamineTotalFrames(dopamineDebt)}
        fps={dopamineDebt.fps}
        width={dopamineDebt.width}
        height={dopamineDebt.height}
        defaultProps={{
          storyboard: dopamineDebt,
        }}
      />
      <Composition
        id="HundredShotRule"
        component={HundredShotComposition}
        durationInFrames={getHundredShotTotalFrames(hundredShotRule)}
        fps={hundredShotRule.fps}
        width={hundredShotRule.width}
        height={hundredShotRule.height}
        defaultProps={{
          storyboard: hundredShotRule,
        }}
      />
      <Composition
        id="SmartPeopleBroke"
        component={SmartBrokeComposition}
        durationInFrames={getSmartBrokeTotalFrames(smartPeopleBroke)}
        fps={smartPeopleBroke.fps}
        width={smartPeopleBroke.width}
        height={smartPeopleBroke.height}
        defaultProps={{
          storyboard: smartPeopleBroke,
        }}
      />
      <Composition
        id="AttentionTax"
        component={AttentionComposition}
        durationInFrames={getAttentionTotalFrames(attentionTax)}
        fps={attentionTax.fps}
        width={attentionTax.width}
        height={attentionTax.height}
        defaultProps={{
          storyboard: attentionTax,
        }}
      />
      <Composition
        id="CompoundingReputation"
        component={ReputationComposition}
        durationInFrames={getReputationTotalFrames(compoundingReputation)}
        fps={compoundingReputation.fps}
        width={compoundingReputation.width}
        height={compoundingReputation.height}
        defaultProps={{
          storyboard: compoundingReputation,
        }}
      />
    </>
  );
};
