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

export const DistributionBridgeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const bridgeT = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: -510, y: 15 },
    { t: 0.4, scale: 1.32, x: -60, y: 0 },
    { t: 0.72, scale: 1.42, x: 470, y: 15 },
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
          {/* Volumetric spotlight over creator's island */}
          <SpotlightCone
            topX={340}
            topWidth={120}
            bottomX={340}
            bottomY={860}
            bottomWidth={380}
            opacity={0.72}
          />
          <SpotlightCone
            topX={1580}
            topWidth={120}
            bottomX={1580}
            bottomY={860}
            bottomWidth={380}
            opacity={0.22 + bridgeT * 0.65}
          />

          {/* Protagonist standing on the Value Island reaching across */}
          <PawnCharacter
            x={340}
            y={860}
            scale={0.86}
            glowIntensity={0.75}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Left Island: VALUE CREATED */}
          <rect
            x="180"
            y="455"
            width="320"
            height="190"
            rx="22"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          <text
            x="340"
            y="540"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="24"
            fontWeight="800"
            letterSpacing="0.14em"
          >
            YOUR VALUE
          </text>
          <text
            x="340"
            y="580"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            SOLUTION
          </text>

          {/* Right Island: PEOPLE SEARCHING */}
          <rect
            x="1420"
            y="455"
            width="320"
            height="190"
            rx="22"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
            opacity={0.45 + bridgeT * 0.55}
          />
          <text
            x="1580"
            y="540"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="24"
            fontWeight="800"
            letterSpacing="0.14em"
          >
            THE MARKET
          </text>
          <text
            x="1580"
            y="580"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            PEOPLE IN NEED
          </text>

          {/* Glowing Distribution Bridge Connecting Both */}
          <line
            x1="500"
            y1="550"
            x2={500 + 920 * bridgeT}
            y2="550"
            stroke={COLORS.white}
            strokeWidth="6"
            filter="url(#soft-glow)"
          />
          {bridgeT > 0.35 &&
            [0, 1, 2, 3, 4].map((p) => {
              const seed = Math.abs(Math.sin(p * 17.31) * 43758.5453) % 1;
              const prog = (frame * 0.028 + seed) % 1;
              const px = 520 + prog * 880 * bridgeT;
              return (
                <circle
                  key={p}
                  cx={px}
                  cy={550}
                  r="7"
                  fill={COLORS.white}
                  filter="url(#soft-glow)"
                />
              );
            })}

          <text
            x="960"
            y="635"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.18em"
            opacity={bridgeT}
          >
            MARKETING = THE BRIDGE
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="BUILD THE BRIDGE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="BRIDGE THE GAP."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
