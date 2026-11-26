import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const StimulusThresholdScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 12], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Smooth continuous climb across the entire scene (fixes multi-second static freeze)
  const riseT = clampedInterpolate(frame, [8, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const thresholdY = 710 - riseT * 410; // climbs from y=710 -> y=300
  const baseY = 855;
  const thresholdPct = Math.round(20 + riseT * 80);

  const bars = [
    { label: 'READING', h: 215, x: 370 },
    { label: 'DEEP WORK', h: 265, x: 675 },
    { label: 'TRAINING', h: 315, x: 980 },
    { label: 'BUILDING', h: 365, x: 1285 },
  ];

  // Camera tracks upward with the rising threshold line, then pulls back wide
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.28, x: -40, y: 125 },
    { t: 0.52, scale: 1.22, x: 35, y: -35 },
    { t: 0.84, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Base Axis */}
          <line x1="230" y1={baseY} x2="1690" y2={baseY} stroke={COLORS.midGrey} strokeWidth="2.5" />

          {/* Real-Life Activity Bars that dim + stamp an (X) lock when threshold passes above */}
          {bars.map((b) => {
            const topOfBar = baseY - b.h;
            const aboveThreshold = topOfBar <= thresholdY;
            // Approximate normalized crossing t for spring lock pop
            const crossT = (710 - topOfBar) / 410;
            const crossFrame = Math.round(8 + crossT * (durationInFrames - 20));
            const lockSpring = !aboveThreshold
              ? spring({
                  frame: Math.max(0, frame - crossFrame),
                  fps,
                  config: { damping: 13, stiffness: 210 },
                })
              : 0;

            return (
              <g key={b.label}>
                <g opacity={aboveThreshold ? 0.96 : 0.28}>
                  <rect
                    x={b.x}
                    y={topOfBar}
                    width="180"
                    height={b.h}
                    rx="12"
                    fill={aboveThreshold ? 'rgba(255,255,255,0.24)' : '#0B0B10'}
                    stroke={aboveThreshold ? COLORS.white : COLORS.dimGrey}
                    strokeWidth="3.2"
                    filter={aboveThreshold ? 'url(#soft-glow)' : undefined}
                  />
                  <text
                    x={b.x + 90}
                    y={baseY + 42}
                    textAnchor="middle"
                    fill={aboveThreshold ? COLORS.white : COLORS.midGrey}
                    fontFamily={FONT_FAMILY}
                    fontSize="20"
                    fontWeight="800"
                    letterSpacing="0.14em"
                  >
                    {b.label}
                  </text>
                </g>

                {/* Crisp (X) Lock Badge pops in when threshold leaves bar stranded below */}
                {lockSpring > 0.01 && (
                  <g
                    transform={`translate(${b.x + 90}, ${topOfBar + 42}) scale(${0.5 + 0.5 * lockSpring})`}
                    opacity={lockSpring * 0.85}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill="#0D0D12"
                      stroke={COLORS.softWhite}
                      strokeWidth="2.5"
                    />
                    <line
                      x1="-8"
                      y1="-8"
                      x2="8"
                      y2="8"
                      stroke={COLORS.white}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="8"
                      y1="-8"
                      x2="-8"
                      y2="8"
                      stroke={COLORS.white}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Rising Glowing Threshold Bar */}
          <g filter="url(#soft-glow)">
            <line
              x1="200"
              y1={thresholdY}
              x2="1720"
              y2={thresholdY}
              stroke={COLORS.white}
              strokeWidth="4.8"
            />
            <text
              x="1710"
              y={thresholdY - 18}
              textAnchor="end"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="21"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              STIMULATION THRESHOLD ▲
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="NOTHING FEELS REWARDING" x={960} y={112} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="THRESHOLD"
        value={thresholdPct}
        suffix="%"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="NOTHING REGISTERS."
        x={960}
        y={952}
        enterFrame={Math.round(durationInFrames * 0.66)}
        exitFrame={durationInFrames - 8}
        fontSize={64}
      />
    </div>
  );
};
