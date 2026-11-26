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

export const CappedFloorOpenSkyScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const riseT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const baseY = 720;
  const floorY = 810;
  const upsideVal = 1 + riseT * 99;

  // Camera: start on hard floor & capped -1X -> pan right & tilt up with +100X beam -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -250, y: 185 },
    { t: 0.38, scale: 1.32, x: 180, y: 60 },
    { t: 0.7, scale: 1.28, x: 240, y: -150 },
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
          {/* Volumetric spotlight over protagonist & upside beam */}
          <SpotlightCone
            topX={370}
            topWidth={95}
            bottomX={370}
            bottomY={floorY + 30}
            bottomWidth={280}
            opacity={0.62}
          />
          <SpotlightCone
            topX={1240}
            topWidth={130}
            bottomX={1240}
            bottomY={floorY + 30}
            bottomWidth={380}
            opacity={0.45 + riseT * 0.45}
          />

          {/* Solid Capped Floor ("-1X MAX LOSS") */}
          <line
            x1="220"
            y1={floorY}
            x2="1700"
            y2={floorY}
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />
          <text
            x="960"
            y={floorY + 46}
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            HARD FLOOR · MAX LOSS = -1X
          </text>

          {/* Zero Start Line */}
          <line
            x1="320"
            y1={baseY}
            x2="1600"
            y2={baseY}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />

          {/* Protagonist safely standing on the hard floor */}
          <PawnCharacter
            x={370}
            y={floorY}
            scale={0.92}
            glowIntensity={0.82}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Small Capped Downside Arrow */}
          <line
            x1="690"
            y1={baseY}
            x2="690"
            y2={floorY - 12}
            stroke={COLORS.midGrey}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text
            x="690"
            y={baseY - 22}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="24"
            fontWeight="700"
          >
            -1X
          </text>

          {/* Massive Uncapped Upside Beam Shooting to the Top of the Frame */}
          <line
            x1="1240"
            y1={baseY}
            x2="1240"
            y2={baseY - riseT * 500}
            stroke={COLORS.white}
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#strong-glow)"
          />
          <polygon
            points={`1240,${baseY - riseT * 500 - 34} 1214,${baseY - riseT * 500 + 8} 1266,${baseY - riseT * 500 + 8}`}
            fill={COLORS.white}
            filter="url(#soft-glow)"
          />
          <text
            x="1335"
            y={baseY - riseT * 340}
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="44"
            fontWeight="900"
          >
            +100X
          </text>
          <text
            x="1335"
            y={baseY - riseT * 340 + 36}
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            UNCAPPED SKY
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE ASYMMETRIC BET" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="UPSIDE MULTIPLIER"
        value={upsideVal}
        prefix="+"
        suffix="X"
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="CAPPED FLOOR. OPEN SKY."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
