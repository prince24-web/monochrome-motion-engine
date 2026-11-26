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

export const CloneConveyorScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const beltY = 690;
  const shift = (frame * 4.5) % 190;
  const clonesCount = Math.round(100 + sweepT * 9900);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 0, y: -140 },
    { t: 0.36, scale: 1.32, x: -320, y: 80 },
    { t: 0.68, scale: 1.38, x: 260, y: 65 },
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
          {/* Volumetric spotlight separating the lone human from the clone line */}
          <SpotlightCone
            topX={220}
            topWidth={95}
            bottomX={220}
            bottomY={885}
            bottomWidth={290}
            opacity={0.72}
          />

          {/* Conveyor Belt */}
          <line x1="120" y1={beltY} x2="1800" y2={beltY} stroke={COLORS.midGrey} strokeWidth="4" />
          <line
            x1="120"
            y1={beltY + 18}
            x2="1800"
            y2={beltY + 18}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="3"
            strokeDasharray="16 20"
            strokeDashoffset={-frame * 4.5}
          />

          {/* Overhead Stamping Press */}
          <rect
            x="860"
            y="215"
            width="200"
            height={120 + Math.abs(Math.sin(frame * 0.14)) * 95}
            rx="12"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          <text
            x="960"
            y="290"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            CLONE PRESS
          </text>

          {/* Endless Row of Identical Dim Grey Cubes */}
          {Array.from({ length: 11 }, (_, i) => {
            const cx = 80 + i * 190 + shift - 190;
            return (
              <g key={i} transform={`translate(${cx}, ${beltY - 108})`}>
                <rect
                  x="0"
                  y="0"
                  width="102"
                  height="102"
                  rx="10"
                  fill="#101016"
                  stroke="rgba(255,255,255,0.34)"
                  strokeWidth="2.5"
                />
                <text
                  x="51"
                  y="58"
                  textAnchor="middle"
                  fill={COLORS.dimGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize="18"
                  fontWeight="700"
                >
                  COPY
                </text>
              </g>
            );
          })}

          {/* Protagonist observing the automated sea of identical clones */}
          <PawnCharacter
            x={220}
            y={875}
            scale={0.86}
            glowIntensity={0.8}
            showFloorHalo
            haloProgress={0.85}
          />

          <text
            x="960"
            y="835"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            MILLIONS OF IDENTICAL GREY CLONES
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="AVERAGE IS AUTOMATED" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="CLONES MINTED"
        value={clonesCount}
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="AVERAGE IS FREE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
