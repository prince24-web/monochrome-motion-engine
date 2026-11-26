import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BaselineOscilloscopeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const leftX = 180;
  const rightX = 1740;
  const baseY = 540;
  const drawT = clampedInterpolate(frame, [8, durationInFrames - 22], [0, 1], EASING.smoothInOut);

  // Waveform: starts flat -> sharp artificial spike -> deep painful trough below baseline -> lower resting debt
  const evalWave = (u: number): number => {
    const spike = Math.exp(-Math.pow((u - 0.36) / 0.055, 2)) * -290;
    const crash = Math.exp(-Math.pow((u - 0.56) / 0.11, 2)) * 245;
    const debt = u > 0.56 ? (u - 0.56) * 260 : 0;
    const micro = Math.sin(u * 48 + frame * 0.08) * 5;
    return baseY + spike + crash + Math.min(135, debt) + micro;
  };

  const samples = 140;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * drawT;
    const x = leftX + u * (rightX - leftX);
    const y = evalWave(u);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const headX = leftX + drawT * (rightX - leftX);
  const headY = evalWave(drawT);
  const baselinePct = Math.round(((baseY - headY) / 290) * 100);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Horizontal Zero Baseline */}
        <line
          x1={leftX}
          y1={baseY}
          x2={rightX}
          y2={baseY}
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
        />
        <text
          x={leftX}
          y={baseY - 16}
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="19"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          0.0 BASELINE
        </text>

        {/* Below-zero Debt Zone Shading */}
        <rect
          x={leftX}
          y={baseY}
          width={rightX - leftX}
          height="280"
          fill="rgba(255,255,255,0.025)"
        />
        <text
          x={rightX}
          y={baseY + 255}
          textAnchor="end"
          fill={COLORS.dimGrey}
          fontFamily={FONT_FAMILY}
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.2em"
        >
          DOPAMINE DEBT ZONE
        </text>

        {/* Peak Spike Annotation */}
        {drawT > 0.36 && (
          <g>
            <line x1={leftX + 0.36 * (rightX - leftX)} y1={baseY - 290} x2={leftX + 0.36 * (rightX - leftX)} y2={baseY} stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="6 6" />
            <text
              x={leftX + 0.36 * (rightX - leftX)}
              y={baseY - 314}
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              ARTIFICIAL SPIKE
            </text>
          </g>
        )}

        {/* Live Glowing Oscilloscope Waveform */}
        {pts.length > 1 && (
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />
        )}

        {/* Glowing Trace Head */}
        <circle cx={headX} cy={headY} r="36" fill="url(#hero-aura)" opacity="0.9" />
        <circle cx={headX} cy={headY} r="8" fill={COLORS.white} filter="url(#soft-glow)" />
      </svg>

      <RollingCounter
        label="DOPAMINE LEVEL"
        value={baselinePct}
        suffix="%"
        x={1520}
        y={165}
        fontSize={82}
        labelSize={19}
      />

      <PillBadge text="DOPAMINE DEBT" x={960} y={145} enterFrame={Math.round(fps * 1.4)} />
    </div>
  );
};
