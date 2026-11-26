import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BaselineOscilloscopeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const leftX = 350;
  const rightX = 1750;
  const baseY = 530;
  // Continuous draw across almost the entire scene so zero frames ever sit static
  const drawT = clampedInterpolate(frame, [6, durationInFrames - 14], [0, 1], EASING.smoothInOut);

  // Waveform: flat baseline -> sharp artificial spike -> painful crash below zero -> bankrupt resting debt
  const evalWave = (u: number): number => {
    const spike = Math.exp(-Math.pow((u - 0.34) / 0.055, 2)) * -275;
    const crash = Math.exp(-Math.pow((u - 0.56) / 0.11, 2)) * 245;
    const debt = u > 0.56 ? (u - 0.56) * 265 : 0;
    const micro = Math.sin(u * 52 + frame * 0.1) * 5;
    return baseY + spike + crash + Math.min(140, debt) + micro;
  };

  const samples = 160;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * drawT;
    const x = leftX + u * (rightX - leftX);
    const y = evalWave(u);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const headX = leftX + drawT * (rightX - leftX);
  const headY = evalWave(drawT);
  const baselinePct = Math.round(((baseY - headY) / 275) * 100);

  // Dynamic camera choreography: zoom on baseline -> track spike -> dive into debt trough -> wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: -340, y: 15 },
    { t: 0.34, scale: 1.36, x: -60, y: -145 },
    { t: 0.62, scale: 1.44, x: 185, y: 135 },
    { t: 0.86, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Pulse hero counter when plunging below 0%
  const crashBeatFrame = Math.round(durationInFrames * 0.54);
  const troughPulse =
    frame >= crashBeatFrame
      ? 1 +
        0.12 *
          Math.exp(-(frame - crashBeatFrame) * 0.08) *
          Math.sin((frame - crashBeatFrame) * 0.35)
      : 1;

  const spikePop =
    drawT > 0.34
      ? spring({
          frame: Math.max(0, frame - Math.round(durationInFrames * 0.34)),
          fps,
          config: { damping: 14, stiffness: 200 },
        })
      : 0;

  const crashPop =
    drawT > 0.56
      ? spring({
          frame: Math.max(0, frame - Math.round(durationInFrames * 0.56)),
          fps,
          config: { damping: 14, stiffness: 200 },
        })
      : 0;

  const avatarDim = clampedInterpolate(drawT, [0.5, 0.8], [0.82, 0.35], EASING.smoothOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Volumetric spotlight over recurring protagonist */}
          <SpotlightCone
            topX={225}
            topWidth={95}
            bottomX={225}
            bottomY={930}
            bottomWidth={310}
            opacity={0.45 + avatarDim * 0.5}
          />

          {/* Subtle Oscilloscope Vertical Reference Ticks */}
          {[0.2, 0.4, 0.6, 0.8].map((frac) => {
            const gx = leftX + frac * (rightX - leftX);
            return (
              <line
                key={frac}
                x1={gx}
                y1={230}
                x2={gx}
                y2={820}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />
            );
          })}

          {/* Horizontal Zero Baseline */}
          <line
            x1={leftX}
            y1={baseY}
            x2={rightX}
            y2={baseY}
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="2.5"
            strokeDasharray="10 10"
          />
          <text
            x={leftX + 6}
            y={baseY - 16}
            fill={COLORS.softWhite}
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
            height="285"
            fill="rgba(255,255,255,0.032)"
          />
          <text
            x={rightX - 10}
            y={baseY + 258}
            textAnchor="end"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="800"
            letterSpacing="0.2em"
          >
            DOPAMINE DEBT ZONE
          </text>

          {/* Peak Spike Annotation */}
          {spikePop > 0.01 && (
            <g opacity={spikePop}>
              <line
                x1={leftX + 0.34 * (rightX - leftX)}
                y1={baseY - 275}
                x2={leftX + 0.34 * (rightX - leftX)}
                y2={baseY}
                stroke="rgba(255,255,255,0.34)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <circle
                cx={leftX + 0.34 * (rightX - leftX)}
                cy={baseY - 275}
                r={12 * spikePop}
                fill="none"
                stroke={COLORS.white}
                strokeWidth="2.5"
              />
              <text
                x={leftX + 0.34 * (rightX - leftX)}
                y={baseY - 302}
                textAnchor="middle"
                fill={COLORS.white}
                fontFamily={FONT_FAMILY}
                fontSize="21"
                fontWeight="800"
                letterSpacing="0.16em"
              >
                ARTIFICIAL SPIKE
              </text>
            </g>
          )}

          {/* Crash Trough Annotation */}
          {crashPop > 0.01 && (
            <g opacity={crashPop}>
              <line
                x1={leftX + 0.56 * (rightX - leftX)}
                y1={baseY}
                x2={leftX + 0.56 * (rightX - leftX)}
                y2={baseY + 245}
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <text
                x={leftX + 0.56 * (rightX - leftX)}
                y={baseY + 275}
                textAnchor="middle"
                fill={COLORS.white}
                fontFamily={FONT_FAMILY}
                fontSize="20"
                fontWeight="800"
                letterSpacing="0.16em"
              >
                EQUAL &amp; OPPOSITE CRASH
              </text>
            </g>
          )}

          {/* Live Glowing Oscilloscope Waveform */}
          {pts.length > 1 && (
            <polyline
              points={pts.join(' ')}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#soft-glow)"
            />
          )}

          {/* Glowing Trace Head */}
          <circle cx={headX} cy={headY} r="42" fill="url(#hero-aura)" opacity="0.95" />
          <circle cx={headX} cy={headY} r="9" fill={COLORS.white} filter="url(#soft-glow)" />

          {/* Recurring Protagonist Watching the Baseline Crash */}
          <PawnCharacter
            x={225}
            y={900}
            scale={0.94}
            glowIntensity={avatarDim}
            showFloorHalo
            haloProgress={0.85}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer (stays crisp and unclipped during camera zooms) */}
      <RollingCounter
        label="DOPAMINE LEVEL"
        value={baselinePct}
        showPlusSign
        suffix="%"
        x={1820}
        y={155}
        fontSize={118}
        labelSize={20}
        align="right"
        scalePulse={troughPulse}
      />

      <PillBadge text="DOPAMINE DEBT" x={960} y={112} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="BANKRUPT BASELINE."
        subtext="EVERY SPIKE FORCES A CRASH"
        x={960}
        y={940}
        enterFrame={Math.round(durationInFrames * 0.6)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
