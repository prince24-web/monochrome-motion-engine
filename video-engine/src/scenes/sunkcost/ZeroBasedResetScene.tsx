import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ZeroBasedResetScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const selectFrame = Math.round(durationInFrames * 0.45);
  const selectSpring =
    frame >= selectFrame
      ? spring({ frame: frame - selectFrame, fps, config: { damping: 14, stiffness: 180 } })
      : 0;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.38, x: 0, y: -135 },
    { t: 0.36, scale: 1.32, x: -180, y: 110 },
    { t: 0.68, scale: 1.46, x: 220, y: 135 },
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
          {/* Question Frame */}
          <rect
            x="340"
            y="280"
            width="1240"
            height="210"
            rx="22"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
            opacity={0.75 + sweepT * 0.25}
          />
          <text
            x="960"
            y="372"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="36"
            fontWeight="800"
            letterSpacing="0.06em"
          >
            IF YOU WEREN&apos;T ALREADY IN THIS,
          </text>
          <text
            x="960"
            y="430"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="36"
            fontWeight="800"
            letterSpacing="0.06em"
          >
            WOULD YOU START IT TODAY?
          </text>

          {/* YES vs NO Answer Buttons */}
          <g transform="translate(720, 665)" opacity={1 - selectSpring * 0.68}>
            <rect
              x="-135"
              y="-52"
              width="270"
              height="104"
              rx="52"
              fill="#0A0A0E"
              stroke={COLORS.midGrey}
              strokeWidth="3"
            />
            <text
              x="0"
              y="13"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="34"
              fontWeight="800"
            >
              YES
            </text>
          </g>

          <g
            transform={`translate(1200, 665) scale(${1 + selectSpring * 0.14})`}
            filter={selectSpring > 0.3 ? 'url(#soft-glow)' : undefined}
          >
            <circle
              cx="0"
              cy="0"
              r={130 * selectSpring}
              fill="url(#hero-aura)"
              opacity={0.65 * selectSpring}
            />
            <rect
              x="-135"
              y="-52"
              width="270"
              height="104"
              rx="52"
              fill={selectSpring > 0.3 ? COLORS.white : '#0A0A0E'}
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text
              x="0"
              y="13"
              textAnchor="middle"
              fill={selectSpring > 0.3 ? COLORS.bg : COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="36"
              fontWeight="900"
            >
              NO
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE ZERO-BASED TEST" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="START FROM ZERO."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
