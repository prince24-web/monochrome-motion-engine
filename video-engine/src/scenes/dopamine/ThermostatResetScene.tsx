import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ThermostatResetScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Paced cleanly across 90% of the scene so there is zero dead idle hold at the end
  const resetEndFrame = Math.round(durationInFrames * 0.9);
  const resetT = clampedInterpolate(frame, [8, resetEndFrame], [0, 1], EASING.smoothInOut);
  const dialAngle = 125 - resetT * 240;

  const cx = 960;
  const cy = 505;
  const r = 212;

  // Camera: start close 1.35x on the rotary dial sweeping -> pull back to 1.0x as 6 receptors ignite underneath
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.36, x: 0, y: -35 },
    { t: 0.45, scale: 1.24, x: 0, y: -10 },
    { t: 0.76, scale: 1.0, x: 0, y: 0 },
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
          {/* Overhead Volumetric Spotlight Growing as Sensitivity Returns */}
          <SpotlightCone
            topX={cx}
            topWidth={130}
            bottomX={cx}
            bottomY={895}
            bottomWidth={640}
            opacity={0.25 + resetT * 0.58}
          />

          {/* Soft aura behind thermostat */}
          <circle cx={cx} cy={cy} r="295" fill="url(#hero-aura)" opacity={0.28 + resetT * 0.6} />

          {/* Outer Tick Ring */}
          {Array.from({ length: 24 }, (_, i) => {
            const deg = -135 + (i / 23) * 270;
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * (r + 18);
            const y1 = cy + Math.sin(rad) * (r + 18);
            const x2 = cx + Math.cos(rad) * (r + (i % 4 === 0 ? 42 : 28));
            const y2 = cy + Math.sin(rad) * (r + (i % 4 === 0 ? 42 : 28));
            const tickActive = deg >= dialAngle - 5;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tickActive ? COLORS.white : COLORS.dimGrey}
                strokeWidth={i % 4 === 0 ? 3.8 : 2.2}
              />
            );
          })}

          {/* Rotating Thermostat Dial */}
          <g transform={`translate(${cx}, ${cy}) rotate(${dialAngle})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r={r} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="4.2" />
            <line
              x1="0"
              y1={-r + 22}
              x2="0"
              y2={-r + 78}
              stroke={COLORS.white}
              strokeWidth="7.5"
              strokeLinecap="round"
            />
          </g>

          {/* Center Status Label inside Dial */}
          <text
            x={cx}
            y={cy - 22}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.2em"
          >
            SENSITIVITY
          </text>
          <text
            x={cx}
            y={cy + 48}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="74"
            fontWeight="900"
          >
            {Math.round(20 + resetT * 80)}%
          </text>

          {/* Left & Right Dial Labels */}
          <text
            x={cx - 315}
            y={cy + 140}
            textAnchor="end"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            HIGH SENSITIVITY
          </text>
          <text
            x={cx + 315}
            y={cy + 140}
            textAnchor="start"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            OVERSTIMULATED
          </text>

          {/* Row of 6 Reopening Receptors at Bottom with Radial Glow Bursts */}
          {Array.from({ length: 6 }, (_, i) => {
            const rx = 560 + i * 160;
            const unlockFrame = Math.round(8 + ((i + 0.5) / 6) * (resetEndFrame - 8));
            const isOpen = frame >= unlockFrame;
            const pop = isOpen
              ? spring({
                  frame: frame - unlockFrame,
                  fps,
                  config: { damping: 12, stiffness: 200 },
                })
              : 0;
            const burst = isOpen
              ? clampedInterpolate(frame - unlockFrame, [0, 22], [0, 1], EASING.expoOut)
              : 0;

            return (
              <g key={i} transform={`translate(${rx}, 835)`}>
                {/* Radial ignition burst */}
                {isOpen && burst < 0.99 && (
                  <circle
                    cx="0"
                    cy="0"
                    r={24 + burst * 48}
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth={3 * (1 - burst)}
                    opacity={0.8 * (1 - burst)}
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r={24 * (isOpen ? 0.85 + 0.25 * pop : 1)}
                  fill={isOpen ? 'rgba(255,255,255,0.28)' : '#0B0B10'}
                  stroke={isOpen ? COLORS.white : COLORS.dimGrey}
                  strokeWidth="3.2"
                  filter={isOpen ? 'url(#soft-glow)' : undefined}
                />
                {isOpen && <circle cx="0" cy="0" r={10 * pop} fill={COLORS.white} />}
              </g>
            );
          })}
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THERMOSTAT RESET" x={cx} y={110} enterFrame={Math.round(fps * 0.4)} />

      <PunchlineCallout
        text="SENSITIVITY RESTORED."
        x={960}
        y={962}
        enterFrame={Math.round(durationInFrames * 0.68)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
