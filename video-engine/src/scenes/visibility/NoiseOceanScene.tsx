import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
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

  const signalRise = clampedInterpolate(frame, [20, Math.round(fps * 1.8)], [0, 1], EASING.expoOut);
  const baseY = 810;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* 48 Low Dim Noise Bars Representing the Crowded Feed */}
        {Array.from({ length: 48 }, (_, i) => {
          const x = 160 + i * 33;
          const isSignal = i === 24;
          const noiseH = 40 + Math.abs(Math.sin(i * 1.7 + frame * 0.08)) * 95;
          const h = isSignal ? noiseH + signalRise * 390 : noiseH;
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

        <text x="960" y="900" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          ATTENTION IS THE RAREST RESOURCE ON EARTH
        </text>
      </svg>

      <PillBadge text="RISING ABOVE NOISE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
