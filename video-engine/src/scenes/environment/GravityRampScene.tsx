import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
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

export const GravityRampScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Continuous sweep across the whole scene: ramp tilts smoothly while glowing sphere rolls downhill
  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const tiltT = clampedInterpolate(sweepT, [0, 0.42], [0, 1], EASING.smoothInOut);
  const rollT = clampedInterpolate(sweepT, [0.22, 1.0], [0, 1], EASING.smoothInOut);

  const leftY = 630 - tiltT * 210;
  const rightY = 630 + tiltT * 175;
  const ballX = 340 + rollT * 1160;
  const ballY = leftY + (rightY - leftY) * rollT - 28;

  // Camera: start on left side as ramp lifts -> track rolling sphere downhill -> land on hero & wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: -420, y: 20 },
    { t: 0.36, scale: 1.34, x: -120, y: -25 },
    { t: 0.72, scale: 1.36, x: 410, y: 145 },
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
          {/* Volumetric spotlight over destination protagonist */}
          <SpotlightCone
            topX={1650}
            topWidth={100}
            bottomX={1650}
            bottomY={860}
            bottomWidth={310}
            opacity={0.72}
          />

          {/* Tilting Gravity Ramp */}
          <line
            x1="280"
            y1={leftY}
            x2="1540"
            y2={rightY}
            stroke={COLORS.white}
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />

          {/* Rolling Glowing Sphere */}
          <circle cx={ballX} cy={ballY} r="75" fill="url(#hero-aura)" opacity="0.72" />
          <circle cx={ballX} cy={ballY} r="26" fill={COLORS.white} filter="url(#soft-glow)" />

          {/* Protagonist waiting effortlessly at the bottom of the downhill slope */}
          <PawnCharacter
            x={1650}
            y={825}
            scale={0.88}
            glowIntensity={0.85}
            showFloorHalo
            haloProgress={0.85}
          />

          <text
            x="1510"
            y={rightY + 56}
            textAnchor="end"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            GOOD HABITS (DOWNHILL)
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="TILT THE FLOOR" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="LET GRAVITY WORK."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
