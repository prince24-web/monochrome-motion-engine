export interface OnePercentBuyerProps {
  counterLabel: string;
  counterStart: number;
  counterMid: number;
  counterEnd: number;
  counterPrefix?: string;
  pillText: string;
  highlightIndex?: number;
}

export interface ProgressRingGoalProps {
  pillText: string;
  counterLabel: string;
  percentStart: number;
  percentEnd: number;
  targetLabel: string;
}

export interface FailingGaugeProps {
  pillText: string;
  leftLabel: string;
  rightLabel: string;
  ignoredLabel: string;
  ignoredCount: number;
}

export interface MorphingShapeProps {
  versionStart: number;
  versionEnd: number;
  lovedStart: number;
  lovedEnd: number;
  pillText: string;
}

export interface MajorityCrowdProps {
  leftLabel: string;
  majorityLabel: string;
  majorityPercent: number;
  pillText: string;
}

export interface WireframeGlobeProps {
  topLabelA: string;
  countA: number;
  pillA: string;
  topLabelB: string;
  countB: number;
  pillB: string;
}

export interface NestedZoomGridProps {
  outerPill: string;
  outerCounterLabel: string;
  outerCounterValue: number;
  bottomCaption: string;
  innerPill: string;
}

export interface BuyerQueueProps {
  counterLabel: string;
  counterStart: number;
  counterEnd: number;
  pillText: string;
}

export interface TimelineScrubberProps {
  leftMetricLabel: string;
  leftMetricValue: string;
  rightMetricLabel: string;
  moneyStart: number;
  moneyEnd: number;
  pillText: string;
  startAge?: number;
  endAge?: number;
}

export interface WireframeCalculatorProps {
  screenHeader: string;
  line1: string;
  line2: string;
  resultLine: string;
  sideBoxTitle: string;
  sideBoxSubtitle: string;
  pillText: string;
}

export interface TribeScaleProps {
  introPill: string;
  groupPill: string;
  groupSizeLabel: string;
  rejectedEnd: number;
  everyonePill: string;
  scalePill: string;
  leftPanLabel: string;
  rightPanLabel: string;
  warningLabel: string;
}

export interface GrowthCurveProps {
  counterLabel: string;
  moneyStart: number;
  moneyEnd: number;
  headlineText: string;
  crowdPillText: string;
  axisLabel?: string;
}

export type SceneConfig =
  | {
      id: string;
      type: 'one-percent-buyer';
      durationSec: number;
      narration: string;
      props: OnePercentBuyerProps;
    }
  | {
      id: string;
      type: 'progress-ring-goal';
      durationSec: number;
      narration: string;
      props: ProgressRingGoalProps;
    }
  | {
      id: string;
      type: 'failing-gauge';
      durationSec: number;
      narration: string;
      props: FailingGaugeProps;
    }
  | {
      id: string;
      type: 'morphing-shape';
      durationSec: number;
      narration: string;
      props: MorphingShapeProps;
    }
  | {
      id: string;
      type: 'majority-crowd';
      durationSec: number;
      narration: string;
      props: MajorityCrowdProps;
    }
  | {
      id: string;
      type: 'wireframe-globe';
      durationSec: number;
      narration: string;
      props: WireframeGlobeProps;
    }
  | {
      id: string;
      type: 'nested-zoom-grid';
      durationSec: number;
      narration: string;
      props: NestedZoomGridProps;
    }
  | {
      id: string;
      type: 'buyer-queue';
      durationSec: number;
      narration: string;
      props: BuyerQueueProps;
    }
  | {
      id: string;
      type: 'timeline-scrubber';
      durationSec: number;
      narration: string;
      props: TimelineScrubberProps;
    }
  | {
      id: string;
      type: 'wireframe-calculator';
      durationSec: number;
      narration: string;
      props: WireframeCalculatorProps;
    }
  | {
      id: string;
      type: 'tribe-scale';
      durationSec: number;
      narration: string;
      props: TribeScaleProps;
    }
  | {
      id: string;
      type: 'growth-curve';
      durationSec: number;
      narration: string;
      props: GrowthCurveProps;
    };

export interface VideoStoryboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  audioFile?: string;
  scenes: SceneConfig[];
}
