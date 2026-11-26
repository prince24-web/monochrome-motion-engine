import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const KeystonePullScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Keystone slides out at ~26% -> entire tower tilts & fractures continuously across remaining scene
  const pullFrame = Math.round(durationInFrames * 0.26);
  const pullT = clampedInterpolate(frame, [pullFrame, durationInFrames - 14], [0, 1], EASING.smoothInOut);
  const collapseSpring =
    frame >= pullFrame + 14
      ? spring({
          frame: frame - (pullFrame + 14),
          fps,
          config: { damping: 11, stiffness: 75, mass: 1.2 },
        })
      : 0;
  const driftAfter = clampedInterpolate(
    frame,
    [pullFrame + 18, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const baseY = 835;
  const cx = 960;

  // Camera: tight on the base keystone -> follow shortcut pull left -> pull back as tower collapses
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: 235 },
    { t: 0.34, scale: 1.42, x: -165, y: 215 },
    { t: 0.64, scale: 1.22, x: 95, y: 20 },
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
          {/* Volumetric spotlight over tower & protagonist */}
          <SpotlightCone
            topX={cx}
            topWidth={140}
            bottomX={cx}
            bottomY={baseY + 40}
            bottomWidth={480}
            opacity={0.68}
          />
          <SpotlightCone
            topX={1470}
            topWidth={85}
            bottomX={1470}
            bottomY={baseY + 35}
            bottomWidth={250}
            opacity={0.5}
          />

          <line
            x1="380"
            y1={baseY}
            x2="1600"
            y2={baseY}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="3"
          />

          {/* Protagonist watching the collapse */}
          <PawnCharacter
            x={1470}
            y={baseY}
            scale={0.9}
            glowIntensity={0.8 - driftAfter * 0.35}
            showFloorHalo
            haloProgress={0.85}
          />

          {/* Upper Tower Tilting & Splitting Apart */}
          <g
            transform={`translate(${cx + 120}, ${baseY - 52}) rotate(${collapseSpring * 24 + driftAfter * 7}) translate(${-(cx + 120)}, ${-(baseY - 52)})`}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((row) => (
              <rect
                key={row}
                x={cx - 140 + (row % 2 === 0 ? (collapseSpring + driftAfter * 0.35) * 24 : -(collapseSpring + driftAfter * 0.35) * 18)}
                y={baseY - (row + 1) * 52 + (collapseSpring + driftAfter * 0.3) * row * 4.5}
                width="280"
                height="44"
                rx="6"
                fill="#0B0B10"
                stroke="rgba(255,255,255,0.58)"
                strokeWidth="2.5"
                opacity={Math.max(0.35, 1 - collapseSpring * 0.35)}
              />
            ))}
          </g>

          {/* Bottom Pulled Keystone ("1 SHORTCUT") */}
          <g
            transform={`translate(${cx - 140 - Math.min(1, pullT * 1.65) * 290}, ${baseY - 50})`}
            filter="url(#soft-glow)"
          >
            <rect x="0" y="0" width="280" height="46" rx="6" fill={COLORS.white} />
            <text
              x="140"
              y="30"
              textAnchor="middle"
              fill={COLORS.bg}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="900"
              letterSpacing="0.14em"
            >
              1 SHORTCUT
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DROPS LIKE A CLIFF" x={cx} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="SECONDS TO COLLAPSE."
        subtext="YEARS TO BUILD · ONE SHORTCUT TO LOSE"
        x={cx}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
