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

export const HumanSignatureScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drawT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const sigPath =
    'M 340 605 C 440 405 520 695 640 515 C 740 365 820 675 950 495 C 1060 345 1160 645 1280 525 C 1380 435 1460 605 1580 545';
  const totalLen = 1950;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: -460, y: 15 },
    { t: 0.38, scale: 1.38, x: -40, y: -15 },
    { t: 0.72, scale: 1.42, x: 420, y: 5 },
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
          {/* Volumetric spotlight over the author signing their work */}
          <SpotlightCone
            topX={220}
            topWidth={95}
            bottomX={220}
            bottomY={860}
            bottomWidth={290}
            opacity={0.72}
          />

          {/* Protagonist authoring the signature */}
          <PawnCharacter
            x={220}
            y={855}
            scale={0.84}
            glowIntensity={0.78}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Signature Baseline */}
          <line
            x1="310"
            y1="665"
            x2="1640"
            y2="665"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.5"
            strokeDasharray="10 10"
          />

          {/* Live Calligraphic Human Signature Stroke */}
          <path
            d={sigPath}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={totalLen}
            strokeDashoffset={totalLen * (1 - drawT)}
            filter="url(#soft-glow)"
          />

          <text
            x="960"
            y="780"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="23"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            LIVED EXPERIENCE CANNOT BE PROMPTED
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE HUMAN SIGNATURE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="UNPROMPTABLE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
