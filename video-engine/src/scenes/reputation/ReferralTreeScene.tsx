import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ReferralTreeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Continuous sweep across scene so tree expands without static holds
  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const l1 = clampedInterpolate(sweepT, [0.0, 0.34], [0, 1], EASING.smoothOut);
  const l2 = clampedInterpolate(sweepT, [0.3, 0.7], [0, 1], EASING.smoothOut);
  const l3 = clampedInterpolate(sweepT, [0.65, 0.98], [0, 1], EASING.smoothOut);

  const reachVal = Math.round(Math.pow(10, sweepT * 3));

  const root = { x: 960, y: 270 };
  const tier1 = [
    { x: 520, y: 465 },
    { x: 960, y: 465 },
    { x: 1400, y: 465 },
  ];
  const tier2 = tier1.flatMap((p) => [
    { x: p.x - 135, y: 680, px: p.x, py: p.y },
    { x: p.x, y: 680, px: p.x, py: p.y },
    { x: p.x + 135, y: 680, px: p.x, py: p.y },
  ]);

  // Camera: start tight on root node -> pull out to tier 1 -> pan down to tier 2 -> full network reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.5, x: 0, y: -230 },
    { t: 0.34, scale: 1.32, x: 0, y: -70 },
    { t: 0.68, scale: 1.18, x: 0, y: 70 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
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
          {/* Root -> Tier 1 edges */}
          {tier1.map((n, i) => (
            <line
              key={`e1-${i}`}
              x1={root.x}
              y1={root.y}
              x2={root.x + (n.x - root.x) * l1}
              y2={root.y + (n.y - root.y) * l1}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.8"
              strokeDasharray="8 8"
              strokeDashoffset={-frame * 1.4}
            />
          ))}

          {/* Tier 1 -> Tier 2 edges */}
          {l2 > 0.01 &&
            tier2.map((n, i) => (
              <line
                key={`e2-${i}`}
                x1={n.px}
                y1={n.py}
                x2={n.px + (n.x - n.px) * l2}
                y2={n.py + (n.y - n.py) * l2}
                stroke="rgba(255,255,255,0.38)"
                strokeWidth="2"
              />
            ))}

          {/* Root Node */}
          <circle cx={root.x} cy={root.y} r="58" fill="url(#hero-aura)" opacity="0.7" />
          <circle cx={root.x} cy={root.y} r="28" fill={COLORS.white} filter="url(#soft-glow)" />

          {/* Tier 1 Nodes */}
          {tier1.map((n, i) => (
            <circle
              key={`t1-${i}`}
              cx={n.x}
              cy={n.y}
              r={20 * l1}
              fill={COLORS.white}
              opacity={l1}
              filter="url(#soft-glow)"
            />
          ))}

          {/* Tier 2 Nodes */}
          {tier2.map((n, i) => (
            <circle
              key={`t2-${i}`}
              cx={n.x}
              cy={n.y}
              r={14 * l2}
              fill={COLORS.softWhite}
              opacity={l2}
            />
          ))}

          {/* Tier 3 Multiplier Row */}
          {l3 > 0.01 && (
            <text
              x="960"
              y="815"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="34"
              fontWeight="900"
              letterSpacing="0.16em"
              opacity={l3}
              filter="url(#soft-glow)"
            >
              1 → 3 → 9 → 27 → THOUSANDS
            </text>
          )}
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE REFERRAL ENGINE" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="TRUST REACH"
        value={reachVal}
        suffix="+"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="FREE COMPOUNDING."
        subtext="WORD OF MOUTH SCALES INFINITELY"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
