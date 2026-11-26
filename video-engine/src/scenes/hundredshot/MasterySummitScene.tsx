import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const MasterySummitScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const climbT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const bars = 25; // Representing shots 1..100
  const startX = 240;
  const barW = 42;
  const gap = 16;
  const baseY = 920;

  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 1.2)], [0, 1], EASING.smoothOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.3), Math.round(fps * 2.1)], [0, 1], EASING.smoothOut);

  const lastBarX = startX + (bars - 1) * (barW + gap) + barW / 2;
  const lastBarTop = baseY - 460;

  // Camera: sweep along ascending pillars from Shot 1 -> punch up to celebrating protagonist at Shot #100 -> majestic pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: -520, y: 210 },
    { t: 0.38, scale: 1.32, x: 40, y: 90 },
    { t: 0.7, scale: 1.4, x: 540, y: -110 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
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
          <SpotlightCone
            topX={lastBarX}
            topWidth={110}
            bottomX={lastBarX}
            bottomY={lastBarTop + 40}
            bottomWidth={360}
            opacity={0.85}
          />

          {/* 25 Ascending Frequency Pillars Leading to Shot #100 */}
          {Array.from({ length: bars }, (_, i) => {
            const frac = i / (bars - 1);
            const lit = climbT >= frac * 0.92;
            const h = 36 + Math.pow(frac, 1.95) * 424;
            const x = startX + i * (barW + gap);
            return (
              <rect
                key={i}
                x={x}
                y={baseY - h}
                width={barW}
                height={h}
                rx="6"
                fill={lit ? `rgba(255,255,255,${(0.14 + frac * 0.45).toFixed(2)})` : '#0B0B10'}
                stroke={lit ? COLORS.white : COLORS.dimGrey}
                strokeWidth={i === bars - 1 ? 3.5 : 2}
                filter={i === bars - 1 && lit ? 'url(#soft-glow)' : undefined}
              />
            );
          })}

          {/* Celebrating Protagonist atop Pillar #100 */}
          <PawnCharacter
            x={lastBarX}
            y={lastBarTop}
            scale={0.92}
            glowIntensity={0.95}
            armPose="celebrate"
            showFloorHalo
            haloProgress={climbT}
            sunburstOpacity={climbT * 0.9}
          />
        </svg>
      </CameraRig>

      {/* Finale Headline Layer (outside CameraRig) */}
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 215,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        DON&apos;T JUDGE BEFORE
      </div>
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 305,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 40px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        SHOT #100.
      </div>
    </div>
  );
};
