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

export const DiscoveryFunnelScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const flowT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cx = 960;
  const buyersCount = Math.round(flowT * 840);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: 0, y: -165 },
    { t: 0.36, scale: 1.36, x: 0, y: 25 },
    { t: 0.68, scale: 1.46, x: 0, y: 205 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  const tier1Glow = clampedInterpolate(flowT, [0.0, 0.35], [0.45, 1], EASING.smoothOut);
  const tier2Glow = clampedInterpolate(flowT, [0.28, 0.65], [0.35, 1], EASING.smoothOut);
  const tier3Glow = clampedInterpolate(flowT, [0.55, 0.95], [0.3, 1], EASING.smoothOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* 3 Funnel Tiers lighting up sequentially */}
          <polygon
            points="500,265 1420,265 1260,455 660,455"
            fill={`rgba(255,255,255,${0.05 + tier1Glow * 0.06})`}
            stroke={COLORS.white}
            strokeWidth="3"
            opacity={tier1Glow}
          />
          <polygon
            points="660,475 1260,475 1120,655 800,655"
            fill={`rgba(255,255,255,${0.07 + tier2Glow * 0.08})`}
            stroke={COLORS.white}
            strokeWidth="3"
            opacity={tier2Glow}
          />
          <polygon
            points="800,675 1120,675 1035,835 885,835"
            fill={`rgba(255,255,255,${0.1 + tier3Glow * 0.14})`}
            stroke={COLORS.white}
            strokeWidth="3.5"
            opacity={tier3Glow}
            filter="url(#soft-glow)"
          />

          {/* Flowing Dots Through Funnel using deterministic sine-hash seeds */}
          {Array.from({ length: 20 }, (_, i) => {
            const hashPhase = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
            const hashSpeed = 0.014 + (Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1) * 0.01;
            const hashSpread = Math.sin(i * 45.164);
            const u = (frame * hashSpeed + hashPhase) % 1;
            const y = 240 + u * 610;
            const halfSpread = 360 * (1 - u * 0.84);
            const x = cx + hashSpread * halfSpread + Math.sin(u * 9 + i) * 14 * (1 - u);
            const r = 3.5 + (i % 3) * 0.9;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill={COLORS.white}
                opacity={0.45 + u * 0.5}
              />
            );
          })}

          <text
            x={cx}
            y="372"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="26"
            fontWeight="800"
            letterSpacing="0.18em"
            opacity={tier1Glow}
          >
            1. VISIBILITY
          </text>
          <text
            x={cx}
            y="576"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="26"
            fontWeight="800"
            letterSpacing="0.18em"
            opacity={tier2Glow}
          >
            2. TRUST
          </text>
          <text
            x={cx}
            y="766"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="26"
            fontWeight="900"
            letterSpacing="0.18em"
            opacity={tier3Glow}
          >
            3. BUYERS
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="VISIBILITY IS STEP ONE" x={cx} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="BUYERS"
        value={buyersCount}
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="ATTENTION FIRST."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
