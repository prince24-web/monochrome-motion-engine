import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ClarityHorizonScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Smooth calm elevated sine wave above zero baseline
  const pts: string[] = [];
  for (let i = 0; i <= 110; i++) {
    const x = 120 + (i / 110) * 1680;
    const y = 695 + Math.sin(i * 0.16 - frame * 0.065) * 22;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const h1 = clampedInterpolate(
    frame,
    [Math.round(fps * 0.35), Math.round(fps * 0.95)],
    [0, 1],
    EASING.expoOut
  );
  const h2 = clampedInterpolate(
    frame,
    [Math.round(fps * 1.15), Math.round(fps * 1.8)],
    [0, 1],
    EASING.expoOut
  );
  const sunburst = clampedInterpolate(
    frame,
    [Math.round(fps * 0.6), Math.round(fps * 2.0)],
    [0, 0.95],
    EASING.smoothOut
  );

  const pillars = [
    { label: 'FOCUS', x: 450 },
    { label: 'CREATE', x: 960 },
    { label: 'BUILD', x: 1470 },
  ];

  // Cinematic pull-back revealing the celebrating protagonist, calm wave, and ignited nodes
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.24, x: 0, y: 120 },
    { t: 0.65, scale: 1.02, x: 0, y: 10 },
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
            topX={960}
            topWidth={155}
            bottomX={960}
            bottomY={945}
            bottomWidth={580}
            opacity={0.92}
          />

          {/* Elevated Calm Sine Wave */}
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="4.2"
            opacity="0.75"
            filter="url(#soft-glow)"
          />

          {/* Ignited Magnetic Habit Nodes with Spring Pop */}
          {pillars.map((p, idx) => {
            const startF = 14 + idx * 14;
            const pop =
              frame >= startF
                ? spring({
                    frame: frame - startF,
                    fps,
                    config: { damping: 14, stiffness: 190 },
                  })
                : 0;
            return (
              <g
                key={p.label}
                transform={`translate(${p.x}, 545) scale(${0.65 + 0.35 * pop})`}
                opacity={pop}
                filter="url(#soft-glow)"
              >
                <rect
                  x="-98"
                  y="-34"
                  width="196"
                  height="68"
                  rx="34"
                  fill="#0B0B10"
                  stroke={COLORS.white}
                  strokeWidth="3.2"
                />
                <text
                  x="0"
                  y="9"
                  textAnchor="middle"
                  fill={COLORS.white}
                  fontFamily={FONT_FAMILY}
                  fontSize="23"
                  fontWeight="800"
                  letterSpacing="0.18em"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          <PawnCharacter
            x={960}
            y={915}
            scale={1.14}
            glowIntensity={0.98}
            showFloorHalo
            haloProgress={1}
            armPose="celebrate"
            sunburstOpacity={sunburst}
          />
        </svg>
      </CameraRig>

      {/* Finale Typography HUD */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 185,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 18}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        RESET YOUR BASELINE.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 280,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 20}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: '0.05em',
          color: COLORS.white,
          textShadow: '0 0 44px rgba(255,255,255,0.52)',
          whiteSpace: 'nowrap',
        }}
      >
        RECLAIM YOUR DRIVE.
      </div>
    </div>
  );
};
