import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const NoiseOceanScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const signalRise = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );
  const baseY = 810;
  const signalX = 160 + 24 * 33 + 11;
  const signalRatio = Math.round(1 + signalRise * 98);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.32, x: -240, y: 140 },
    { t: 0.36, scale: 1.44, x: 0, y: 60 },
    { t: 0.68, scale: 1.36, x: 0, y: -115 },
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
          {/* Volumetric spotlight locking onto the rising signal */}
          <SpotlightCone
            topX={signalX}
            topWidth={95}
            bottomX={signalX}
            bottomY={baseY}
            bottomWidth={340}
            opacity={0.25 + signalRise * 0.72}
          />

          {/* 48 Low Dim Noise Bars Representing the Crowded Feed */}
          {Array.from({ length: 48 }, (_, i) => {
            const x = 160 + i * 33;
            const isSignal = i === 24;
            const noiseH = 42 + Math.abs(Math.sin(i * 1.7 + frame * 0.08)) * 92;
            const h = isSignal ? noiseH + signalRise * 420 : noiseH;
            return (
              <rect
                key={i}
                x={x}
                y={baseY - h}
                width={isSignal ? 22 : 16}
                height={h}
                rx="4"
                fill={isSignal ? COLORS.white : 'rgba(255,255,255,0.18)'}
                filter={isSignal ? 'url(#strong-glow)' : undefined}
              />
            );
          })}

          <text
            x="960"
            y="865"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            ATTENTION IS THE RAREST RESOURCE ON EARTH
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="RISING ABOVE NOISE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="SIGNAL SHARE"
        value={signalRatio}
        suffix="%"
        x={1820}
        y={158}
        fontSize={116}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="BREAK THE NOISE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
