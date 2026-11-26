import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PerfectionistLoopScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 540;
  const r = 240;

  // Orbiting dot accelerates faster and faster around the closed loop
  const angle = frame * 0.065;
  const orbX = cx + Math.cos(angle) * r;
  const orbY = cy + Math.sin(angle) * r;

  const nodes = [
    { label: 'RESEARCH', a: -Math.PI / 2 },
    { label: 'PLAN', a: 0 },
    { label: 'TWEAK', a: Math.PI / 2 },
    { label: 'DOUBT', a: Math.PI },
  ];

  // Camera: inspect top RESEARCH station -> glide across PLAN/TWEAK -> punch into 0% OUTPUT core -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: -185 },
    { t: 0.34, scale: 1.34, x: 185, y: 35 },
    { t: 0.68, scale: 1.5, x: 0, y: 0 },
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
          {/* Closed Loop Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="3.5"
            strokeDasharray="12 10"
          />

          {/* 4 Loop Station Nodes */}
          {nodes.map((n) => {
            const nx = cx + Math.cos(n.a) * r;
            const ny = cy + Math.sin(n.a) * r;
            return (
              <g key={n.label} transform={`translate(${nx}, ${ny})`}>
                <rect
                  x="-86"
                  y="-26"
                  width="172"
                  height="52"
                  rx="26"
                  fill="#0B0B10"
                  stroke={COLORS.white}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fill={COLORS.white}
                  fontFamily={FONT_FAMILY}
                  fontSize="20"
                  fontWeight="800"
                  letterSpacing="0.14em"
                >
                  {n.label}
                </text>
              </g>
            );
          })}

          {/* Center "0% SHIPPED" Lock */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            OUTPUT
          </text>
          <text
            x={cx}
            y={cy + 46}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="64"
            fontWeight="900"
          >
            0%
          </text>

          {/* Orbiting Bright Node */}
          <circle cx={orbX} cy={orbY} r="32" fill="url(#hero-aura)" opacity="0.9" />
          <circle cx={orbX} cy={orbY} r="10" fill={COLORS.white} filter="url(#soft-glow)" />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE PERFECTIONIST LOOP" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ZERO OUTPUT."
        subtext="ENDLESS POLISH IS STILL ZERO"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
