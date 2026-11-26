import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const EgoMirrorScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const flipT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -430, y: 0 },
    { t: 0.38, scale: 1.24, x: 0, y: 0 },
    { t: 0.7, scale: 1.44, x: 430, y: 0 },
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
          {/* Volumetric spotlight shifting onto the Clarity Frame */}
          <SpotlightCone
            topX={1410}
            topWidth={140}
            bottomX={1410}
            bottomY={840}
            bottomWidth={540}
            opacity={0.2 + flipT * 0.75}
          />

          <line
            x1="960"
            y1="220"
            x2="960"
            y2="850"
            stroke={COLORS.white}
            strokeWidth="3"
            strokeDasharray="10 10"
          />

          {/* Left: EGO FRAME ("QUITTING = DEFEAT") */}
          <g transform="translate(510, 535)" opacity={1 - flipT * 0.65}>
            <rect
              x="-240"
              y="-135"
              width="480"
              height="270"
              rx="22"
              fill="#0A0A0E"
              stroke={COLORS.midGrey}
              strokeWidth="3"
            />
            <text
              x="0"
              y="-22"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              EGO SAYS
            </text>
            <text
              x="0"
              y="34"
              textAnchor="middle"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="34"
              fontWeight="800"
            >
              QUITTING = DEFEAT
            </text>
          </g>

          {/* Right: CLARITY FRAME ("QUITTING = CLARITY") */}
          <g
            transform={`translate(1410, 535) scale(${0.94 + flipT * 0.08})`}
            opacity={0.28 + flipT * 0.72}
            filter={flipT > 0.4 ? 'url(#soft-glow)' : undefined}
          >
            <rect
              x="-240"
              y="-135"
              width="480"
              height="270"
              rx="22"
              fill="rgba(255,255,255,0.12)"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text
              x="0"
              y="-22"
              textAnchor="middle"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              REALITY SAYS
            </text>
            <text
              x="0"
              y="34"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="34"
              fontWeight="900"
            >
              QUITTING = CLARITY
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="EGO HATES LOOKING WRONG" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="CHOOSE CLARITY."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
