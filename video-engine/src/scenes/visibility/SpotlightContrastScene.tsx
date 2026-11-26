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

export const SpotlightContrastScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const contrastT = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -450, y: 10 },
    { t: 0.36, scale: 1.25, x: 0, y: 0 },
    { t: 0.68, scale: 1.44, x: 450, y: -15 },
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
          <line
            x1="960"
            y1="210"
            x2="960"
            y2="870"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          {/* Left: Hidden Masterpiece in Total Darkness */}
          <g transform="translate(480, 500)" opacity={0.34 - contrastT * 0.16}>
            <polygon
              points="0,-110 95,0 0,110 -95,0"
              fill="#0A0A0E"
              stroke={COLORS.midGrey}
              strokeWidth="3"
            />
            <text
              x="0"
              y="165"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="21"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              UNSEEN MASTERPIECE
            </text>
          </g>
          <PawnCharacter
            x={250}
            y={860}
            scale={0.82}
            opacity={0.36 - contrastT * 0.14}
            glowIntensity={0.08}
          />

          {/* Right: Visible Star Under Bright Spotlight */}
          <SpotlightCone
            topX={1440}
            topWidth={125}
            bottomX={1440}
            bottomY={875}
            bottomWidth={490}
            opacity={0.45 + contrastT * 0.55}
          />
          <g
            transform={`translate(1440, 500) scale(${0.92 + contrastT * 0.1})`}
            filter="url(#strong-glow)"
          >
            <circle
              cx="0"
              cy="0"
              r={145 + Math.sin(frame * 0.12) * 12}
              fill="url(#hero-aura)"
              opacity={0.45 + contrastT * 0.45}
            />
            <polygon
              points="0,-95 28,-28 98,-28 42,16 62,86 0,44 -62,86 -42,16 -98,-28 -28,-28"
              fill={COLORS.white}
            />
            <text
              x="0"
              y="165"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              IN THE SPOTLIGHT
            </text>
          </g>
          <PawnCharacter
            x={1670}
            y={860}
            scale={0.88}
            glowIntensity={0.45 + contrastT * 0.45}
            showFloorHalo
            haloProgress={0.5 + contrastT * 0.5}
            armPose="celebrate"
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="BUYERS PICK WHAT THEY SEE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="SEEN BEATS BEST."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
