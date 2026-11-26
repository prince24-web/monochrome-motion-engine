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

export const SignalAmplifierScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const ampT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cy = 540;
  const ampMultiplier = Math.round(1 + ampT * 99);
  const rightAmp = 32 + ampT * 145;

  // Left: tiny quiet whisper sine wave; Right: huge amplified signal sine wave
  const leftPts: string[] = [];
  const rightPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const lx = 180 + u * 620;
    const ly = cy + Math.sin(u * 20 - frame * 0.14) * 24;
    leftPts.push(`${lx.toFixed(1)},${ly.toFixed(1)}`);

    const rx = 1120 + u * 620;
    const ry = cy + Math.sin(u * 20 - frame * 0.14) * rightAmp;
    rightPts.push(`${rx.toFixed(1)},${ry.toFixed(1)}`);
  }

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -420, y: 0 },
    { t: 0.36, scale: 1.48, x: 0, y: 0 },
    { t: 0.68, scale: 1.38, x: 400, y: 0 },
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
          <polyline
            points={leftPts.join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
          />
          <polyline
            points={rightPts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />

          {/* Central Distribution Amplifier Triangle */}
          <g transform={`translate(960, ${cy})`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r={150 + ampT * 45} fill="url(#hero-aura)" opacity={0.35 + ampT * 0.4} />
            <polygon
              points="-130,-145 145,0 -130,145"
              fill="#0B0B10"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text
              x="-28"
              y="8"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="24"
              fontWeight="900"
              letterSpacing="0.14em"
            >
              {ampMultiplier}X
            </text>
          </g>

          <text
            x="480"
            y="780"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            QUIET CRAFTSMANSHIP
          </text>
          <text
            x="1430"
            y="780"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            AMPLIFIED SIGNAL
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DISTRIBUTION AMPLIFIES" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="REACH MULTIPLIER"
        value={ampMultiplier}
        suffix="X"
        x={1820}
        y={158}
        fontSize={118}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="AMPLIFY YOUR WORK."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
