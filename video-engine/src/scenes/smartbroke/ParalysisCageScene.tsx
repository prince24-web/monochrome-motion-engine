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

export const ParalysisCageScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Continuous progression: tension holds early, then cage bars glide smoothly apart revealing it was never locked
  const openT = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.36), durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const cx = 960;
  const barOffsets = [-210, -140, -70, 70, 140, 210];

  // Camera: claustrophobic close-up behind bars -> slow push on protagonist -> liberating wide pull-back as bars open
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: 120 },
    { t: 0.36, scale: 1.54, x: 0, y: 95 },
    { t: 0.72, scale: 1.18, x: 0, y: 35 },
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
          {/* Volumetric spotlight brightening as the mental cage dissolves */}
          <SpotlightCone
            topX={cx}
            topWidth={110}
            bottomX={cx}
            bottomY={845}
            bottomWidth={340 + openT * 140}
            opacity={0.4 + openT * 0.52}
          />

          {/* Protagonist inside the cage */}
          <PawnCharacter
            x={cx}
            y={820}
            scale={1.12}
            glowIntensity={0.45 + openT * 0.55}
            showFloorHalo
            haloProgress={0.4 + openT * 0.6}
            armPose={openT > 0.65 ? 'celebrate' : 'none'}
            sunburstOpacity={openT * 0.65}
          />

          {/* Sliding Cage Bars */}
          {barOffsets.map((off, i) => {
            const dir = off < 0 ? -1 : 1;
            const bx = cx + off + dir * openT * 360;
            return (
              <line
                key={i}
                x1={bx}
                y1="260"
                x2={bx}
                y2="835"
                stroke={COLORS.white}
                strokeWidth="4.5"
                opacity={1 - openT * 0.65}
                filter="url(#soft-glow)"
              />
            );
          })}

          <text
            x={cx}
            y="880"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            {openT > 0.5 ? 'THE CAGE WAS NEVER LOCKED' : 'WHAT IF · TOO SOON · NOT READY'}
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge
        text="ANALYSIS PARALYSIS"
        x={960}
        y={96}
        enterFrame={Math.round(fps * 0.4)}
        exitFrame={Math.round(durationInFrames * 0.44)}
      />
      <PillBadge
        text="UNLOCKED FROM WITHIN"
        x={960}
        y={96}
        enterFrame={Math.round(durationInFrames * 0.48)}
      />

      <PunchlineCallout
        text="NEVER LOCKED."
        subtext="FEAR WAS THE ONLY BAR"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
