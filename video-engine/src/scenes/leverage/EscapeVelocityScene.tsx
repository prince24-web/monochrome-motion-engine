import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const EscapeVelocityScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Left: linear crawling "HOURS" slope
  const t = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const linearX = 240 + t * 540;
  const linearY = 860 - t * 135;

  // Right: vertical rocket vector punching through 3 altitude thresholds (SKILL -> SYSTEM -> SCALE)
  const rocketX = 1350;
  const rocketY = 880 - Math.pow(t, 1.55) * 625;

  const layers = [
    { label: 'LAYER 1 · SKILL', y: 720 },
    { label: 'LAYER 2 · SYSTEM', y: 540 },
    { label: 'LAYER 3 · SCALE', y: 360 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Center vertical divider */}
        <line
          x1="960"
          y1="210"
          x2="960"
          y2="930"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          strokeDasharray="8 12"
        />

        {/* LEFT PANEL: LINEAR SLOPE ("HARD WORK") */}
        <g>
          <text
            x="510"
            y="265"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            LINEAR SLOPE
          </text>
          <line x1="220" y1="860" x2="820" y2="860" stroke={COLORS.dimGrey} strokeWidth="2.5" />
          <line
            x1="240"
            y1="860"
            x2={linearX}
            y2={linearY}
            stroke="rgba(255,255,255,0.52)"
            strokeWidth="4"
            strokeDasharray="10 8"
          />
          <circle cx={linearX} cy={linearY} r="9" fill={COLORS.softWhite} />
          <text
            x="510"
            y="915"
            textAnchor="middle"
            fill={COLORS.dimGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            HOURS WORKED
          </text>
        </g>

        {/* RIGHT PANEL: ESCAPE VELOCITY ("LEVERAGE") */}
        <g>
          <text
            x={rocketX}
            y="210"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            LEVERAGE TRAJECTORY
          </text>

          {/* 3 Horizontal Atmospheric Threshold Layers */}
          {layers.map((layer, idx) => {
            const breached = rocketY <= layer.y;
            const flash = breached ? Math.max(0, 1 - (layer.y - rocketY) / 140) : 0;
            return (
              <g key={idx}>
                <line
                  x1="1060"
                  y1={layer.y}
                  x2="1740"
                  y2={layer.y}
                  stroke={breached ? COLORS.white : 'rgba(255,255,255,0.28)'}
                  strokeWidth={breached ? 3 + flash * 3 : 2}
                  strokeDasharray={breached ? undefined : '10 10'}
                  opacity={breached ? 0.55 + flash * 0.45 : 0.6}
                  filter={flash > 0.2 ? 'url(#soft-glow)' : undefined}
                />
                <text
                  x="1740"
                  y={layer.y - 12}
                  textAnchor="end"
                  fill={breached ? COLORS.white : COLORS.midGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="0.16em"
                >
                  {layer.label}
                </text>
                {/* Breakthrough shockwave ring */}
                {flash > 0.05 && (
                  <ellipse
                    cx={rocketX}
                    cy={layer.y}
                    rx={25 + (1 - flash) * 140}
                    ry={8 + (1 - flash) * 28}
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth="2.5"
                    opacity={flash}
                  />
                )}
              </g>
            );
          })}

          {/* Luminous Vertical Contrail behind Rocket Chevron */}
          <line
            x1={rocketX}
            y1="890"
            x2={rocketX}
            y2={rocketY + 26}
            stroke={COLORS.white}
            strokeWidth="5"
            opacity="0.72"
            filter="url(#soft-glow)"
          />

          {/* Glowing Vector Rocket Chevron */}
          <g transform={`translate(${rocketX}, ${rocketY})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="88" fill="url(#hero-aura)" opacity="0.85" />
            <polygon
              points="0,-38 28,22 0,8 -28,22"
              fill={COLORS.white}
            />
          </g>
        </g>
      </svg>

      <PillBadge text="ESCAPE VELOCITY" x={960} y={136} enterFrame={Math.round(fps * 1.1)} />
    </div>
  );
};
