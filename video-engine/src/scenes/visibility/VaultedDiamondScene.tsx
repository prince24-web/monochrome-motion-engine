import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
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

export const VaultedDiamondScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Continuous sweep: vault door slides shut across the scene without stalling
  const shutT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cx = 960;
  const cy = 530;
  const reachPct = Math.round((1 - shutT) * 100);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: -15 },
    { t: 0.36, scale: 1.26, x: -160, y: 20 },
    { t: 0.68, scale: 1.38, x: 0, y: 5 },
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
          {/* Dimming volumetric spotlight over protagonist & vault */}
          <SpotlightCone
            topX={320}
            topWidth={100}
            bottomX={320}
            bottomY={890}
            bottomWidth={320}
            opacity={0.78 - shutT * 0.45}
          />
          <SpotlightCone
            topX={cx}
            topWidth={140}
            bottomX={cx}
            bottomY={820}
            bottomWidth={440}
            opacity={0.75 * (1 - shutT * 0.85)}
          />

          {/* Protagonist watching their masterpiece get sealed away */}
          <PawnCharacter
            x={320}
            y={875}
            scale={0.92}
            glowIntensity={0.72 - shutT * 0.42}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Brilliant 10/10 Diamond */}
          <g transform={`translate(${cx}, ${cy})`} opacity={1 - shutT * 0.85} filter="url(#strong-glow)">
            <circle cx="0" cy="0" r={170 + Math.sin(frame * 0.14) * 14} fill="url(#hero-aura)" opacity="0.7" />
            <polygon
              points="0,-130 115,-25 0,130 -115,-25"
              fill="rgba(255,255,255,0.24)"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <line x1="-115" y1="-25" x2="115" y2="-25" stroke={COLORS.white} strokeWidth="2.5" />
            <polyline
              points="-55,-25 0,-130 55,-25 0,130 -55,-25"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2"
            />
          </g>

          {/* Heavy Opaque Vault Box Closing Over Diamond */}
          <rect
            x={cx - 190}
            y={cy - 190}
            width={380}
            height={380 * shutT}
            rx="18"
            fill="#0B0B10"
            stroke={COLORS.midGrey}
            strokeWidth="4"
          />
          {shutT > 0.55 && (
            <g
              transform={`translate(${cx}, ${cy}) rotate(${(shutT - 0.55) * 180})`}
              opacity={Math.min(1, (shutT - 0.55) / 0.35)}
            >
              <circle cx="0" cy="0" r="48" fill="none" stroke={COLORS.midGrey} strokeWidth="4" />
              <line x1="-32" y1="0" x2="32" y2="0" stroke={COLORS.midGrey} strokeWidth="4" />
              <line x1="0" y1="-32" x2="0" y2="32" stroke={COLORS.midGrey} strokeWidth="4" />
            </g>
          )}

          <text
            x={cx}
            y="825"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            10/10 QUALITY · 0 DISTRIBUTION = $0
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE HIDDEN DIAMOND" x={cx} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="VISIBILITY"
        value={reachPct}
        suffix="%"
        x={1820}
        y={158}
        fontSize={116}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="INVISIBLE VALUE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
