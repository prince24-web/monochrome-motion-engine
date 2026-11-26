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

export const DefaultPathSwitchScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Railway switch flips UP toward GOOD DEFAULT, sending the glowing orb smoothly along the upper track!
  const t = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const orbX = 240 + t * 1400;
  const orbY = orbX < 860 ? 585 : 585 - ((orbX - 860) / 780) * 195;

  // Camera: start on incoming orb -> zoom to switch pivot & protagonist -> track upward to NEW DEFAULT -> wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.4, x: -420, y: 45 },
    { t: 0.38, scale: 1.44, x: -60, y: 55 },
    { t: 0.72, scale: 1.32, x: 420, y: -95 },
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
          <SpotlightCone
            topX={860}
            topWidth={110}
            bottomX={860}
            bottomY={835}
            bottomWidth={340}
            opacity={0.72}
          />

          {/* Incoming Main Track */}
          <line
            x1="200"
            y1="585"
            x2="860"
            y2="585"
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />

          {/* Lower Unused Distraction Branch */}
          <line
            x1="860"
            y1="585"
            x2="1680"
            y2="780"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="3.5"
            strokeDasharray="10 10"
          />
          <text
            x="1670"
            y="825"
            textAnchor="end"
            fill={COLORS.dimGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            OLD DEFAULT (DISTRACTION)
          </text>

          {/* Upper Lit Default Track */}
          <line
            x1="860"
            y1="585"
            x2="1680"
            y2="390"
            stroke={COLORS.white}
            strokeWidth="5"
            filter="url(#soft-glow)"
          />
          <text
            x="1670"
            y="350"
            textAnchor="end"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            NEW DEFAULT (DEEP WORK)
          </text>

          {/* Switch Pivot */}
          <circle cx="860" cy="585" r="14" fill={COLORS.white} filter="url(#soft-glow)" />

          {/* Protagonist standing at the switch pivot directing the track */}
          <PawnCharacter
            x={860}
            y={815}
            scale={0.88}
            glowIntensity={0.85}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Moving Orb */}
          <circle cx={orbX} cy={orbY} r="68" fill="url(#hero-aura)" opacity="0.8" />
          <circle cx={orbX} cy={orbY} r="18" fill={COLORS.white} filter="url(#soft-glow)" />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="SWITCH THE DEFAULT TRACK" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="MAKE GOOD THE DEFAULT."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
