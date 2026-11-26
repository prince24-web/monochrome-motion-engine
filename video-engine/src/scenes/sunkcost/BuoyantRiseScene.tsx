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

export const BuoyantRiseScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const riseT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const heroY = 760 - riseT * 305;
  const anchorY = 780 + riseT * 240;
  const momentumPct = Math.round(riseT * 100);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 0, y: 170 },
    { t: 0.4, scale: 1.34, x: 0, y: 15 },
    { t: 0.72, scale: 1.4, x: 0, y: -120 },
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
          {/* Expanding volumetric spotlight illuminating the buoyant rise */}
          <SpotlightCone
            topX={960}
            topWidth={145}
            bottomX={960}
            bottomY={920}
            bottomWidth={560}
            opacity={0.42 + riseT * 0.58}
          />

          {/* Sinking Dead Weight Anchor Fading Out Below */}
          <g transform={`translate(960, ${anchorY})`} opacity={Math.max(0, 0.7 - riseT * 0.7)}>
            <line x1="0" y1="-40" x2="0" y2="44" stroke={COLORS.midGrey} strokeWidth="5" />
            <path d="M -56 12 Q 0 68 56 12" fill="none" stroke={COLORS.midGrey} strokeWidth="5" />
          </g>

          {/* Protagonist Rising Effortlessly into Bright Aura */}
          <PawnCharacter
            x={960}
            y={heroY}
            scale={1.1}
            glowIntensity={0.65 + riseT * 0.35}
            armPose="celebrate"
            sunburstOpacity={riseT * 0.9}
          />

          <text
            x="960"
            y="865"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            DROP DEAD WEIGHT → RISE INSTANTLY
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="INSTANT BUOYANCY" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="MOMENTUM"
        value={momentumPct}
        showPlusSign
        suffix="%"
        x={1820}
        y={158}
        fontSize={116}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="RISE FREE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
