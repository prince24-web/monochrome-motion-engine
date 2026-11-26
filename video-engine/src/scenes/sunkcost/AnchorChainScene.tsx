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

export const AnchorChainScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const dragT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const heroY = 445 + dragT * 105;
  const anchorY = 720 + dragT * 90;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: -155 },
    { t: 0.36, scale: 1.32, x: 0, y: 20 },
    { t: 0.68, scale: 1.46, x: 0, y: 195 },
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
          {/* Volumetric spotlight dimming as protagonist is dragged down */}
          <SpotlightCone
            topX={960}
            topWidth={125}
            bottomX={960}
            bottomY={anchorY + 60}
            bottomWidth={420}
            opacity={0.78 - dragT * 0.32}
          />

          {/* Heavy Chain Links */}
          <line
            x1="960"
            y1={heroY}
            x2="960"
            y2={anchorY - 68}
            stroke={COLORS.white}
            strokeWidth="5"
            strokeDasharray="14 10"
          />

          {/* Wireframe Iron Anchor */}
          <g transform={`translate(960, ${anchorY})`} filter="url(#soft-glow)">
            <circle cx="0" cy="-64" r="14" fill="none" stroke={COLORS.white} strokeWidth="4" />
            <line x1="0" y1="-50" x2="0" y2="54" stroke={COLORS.white} strokeWidth="5" />
            <line x1="-42" y1="-26" x2="42" y2="-26" stroke={COLORS.white} strokeWidth="4.5" />
            <path
              d="M -68 18 Q 0 86 68 18"
              fill="none"
              stroke={COLORS.white}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          <PawnCharacter
            x={960}
            y={heroY}
            scale={0.96}
            glowIntensity={0.74 - dragT * 0.25}
          />

          <text
            x="960"
            y="870"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            PAST COMMITMENTS BECOME AN IRON ANCHOR
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DRAGGED BY YESTERDAY" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="DEAD WEIGHT."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
