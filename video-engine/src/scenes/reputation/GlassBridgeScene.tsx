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

export const GlassBridgeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const walkT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const bridgeY = 665;
  const heroX = 330 + walkT * 1240;

  // Camera: track protagonist stepping onto bridge -> glide across suspension span -> pull back on arrival
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -460, y: 95 },
    { t: 0.42, scale: 1.32, x: -40, y: 45 },
    { t: 0.72, scale: 1.38, x: 420, y: 80 },
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
          {/* Tracking Volumetric Spotlight following protagonist across bridge */}
          <SpotlightCone
            topX={heroX}
            topWidth={110}
            bottomX={heroX}
            bottomY={bridgeY + 40}
            bottomWidth={320}
            opacity={0.78}
          />

          {/* Left & Right Cliffs */}
          <path
            d="M 100 940 L 100 665 L 380 665 L 380 940 Z"
            fill="#0B0B10"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
          />
          <path
            d="M 1540 940 L 1540 665 L 1820 665 L 1820 940 Z"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />

          {/* Suspension Bridge Deck & Cables */}
          <line
            x1="380"
            y1={bridgeY}
            x2={380 + 1160 * Math.min(1, walkT * 1.25)}
            y2={bridgeY}
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />
          <path
            d="M 380 485 Q 960 655 1540 485"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.5"
          />
          <line x1="380" y1="485" x2="380" y2={bridgeY} stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
          <line x1="1540" y1="485" x2="1540" y2={bridgeY} stroke="rgba(255,255,255,0.5)" strokeWidth="3" />

          {/* Vertical Suspender Cables */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((u) => {
            const sx = 380 + u * 1160;
            const sy = 485 + 4 * u * (1 - u) * 170;
            return (
              <line
                key={u}
                x1={sx}
                y1={sy}
                x2={sx}
                y2={bridgeY}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.8"
                opacity={walkT * 1.25 >= u ? 1 : 0.15}
              />
            );
          })}

          <PawnCharacter
            x={heroX}
            y={bridgeY}
            scale={0.88}
            glowIntensity={0.88}
            showFloorHalo
            haloProgress={0.7}
          />

          <text
            x="240"
            y="745"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            UNKNOWN
          </text>
          <text
            x="1680"
            y="745"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            OPPORTUNITY
          </text>
          <text
            x="960"
            y="755"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            BRIDGE OF KEPT PROMISES
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="OPPORTUNITY FLOWS TO TRUST" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="TRUST BUILDS BRIDGES."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
