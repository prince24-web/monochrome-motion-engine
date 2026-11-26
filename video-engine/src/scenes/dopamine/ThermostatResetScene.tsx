import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ThermostatResetScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Rotary thermostat dial rotates smoothly from +125 deg (OVERSTIMULATED) -> -115 deg (SENSITIVE)
  const resetT = clampedInterpolate(frame, [14, durationInFrames - 22], [0, 1], EASING.expoInOut);
  const dialAngle = 125 - resetT * 240;

  const cx = 960;
  const cy = 530;
  const r = 215;

  // 6 receptors below unlocking one by one as dial resets
  const unlockedCount = Math.round(resetT * 6);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Soft aura behind thermostat */}
        <circle cx={cx} cy={cy} r="280" fill="url(#hero-aura)" opacity={0.25 + resetT * 0.55} />

        {/* Outer Tick Ring */}
        {Array.from({ length: 24 }, (_, i) => {
          const deg = -135 + (i / 23) * 270;
          const rad = ((deg - 90) * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (r + 18);
          const y1 = cy + Math.sin(rad) * (r + 18);
          const x2 = cx + Math.cos(rad) * (r + (i % 4 === 0 ? 40 : 28));
          const y2 = cy + Math.sin(rad) * (r + (i % 4 === 0 ? 40 : 28));
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 4 === 0 ? COLORS.white : COLORS.midGrey}
              strokeWidth={i % 4 === 0 ? 3.5 : 2}
            />
          );
        })}

        {/* Rotating Thermostat Dial */}
        <g transform={`translate(${cx}, ${cy}) rotate(${dialAngle})`} filter="url(#soft-glow)">
          <circle cx="0" cy="0" r={r} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="4" />
          <line x1="0" y1={-r + 22} x2="0" y2={-r + 74} stroke={COLORS.white} strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Center Status Label inside Dial */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          SENSITIVITY
        </text>
        <text
          x={cx}
          y={cy + 44}
          textAnchor="middle"
          fill={COLORS.white}
          fontFamily={FONT_FAMILY}
          fontSize="58"
          fontWeight="900"
        >
          {Math.round(20 + resetT * 80)}%
        </text>

        {/* Left & Right Dial Labels */}
        <text x={cx - 320} y={cy + 145} textAnchor="end" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="800" letterSpacing="0.16em">
          HIGH SENSITIVITY
        </text>
        <text x={cx + 320} y={cy + 145} textAnchor="start" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.16em">
          OVERSTIMULATED
        </text>

        {/* Row of 6 Reopening Receptors at Bottom */}
        {Array.from({ length: 6 }, (_, i) => {
          const rx = 560 + i * 160;
          const isOpen = i < unlockedCount;
          return (
            <g key={i} transform={`translate(${rx}, 885)`}>
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={isOpen ? 'rgba(255,255,255,0.22)' : '#0B0B10'}
                stroke={isOpen ? COLORS.white : COLORS.dimGrey}
                strokeWidth="3"
                filter={isOpen ? 'url(#soft-glow)' : undefined}
              />
              {isOpen && <circle cx="0" cy="0" r="9" fill={COLORS.white} />}
            </g>
          );
        })}
      </svg>

      <PillBadge text="THERMOSTAT RESET" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
