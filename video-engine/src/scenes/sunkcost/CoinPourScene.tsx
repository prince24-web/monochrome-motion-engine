import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const CoinPourScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const spent = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [2000, 18500],
    EASING.smoothInOut
  );
  const cx = 960;

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: -145 },
    { t: 0.36, scale: 1.32, x: 0, y: 15 },
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
          {/* Falling Coins Going IN the Top (deterministic sine-hash seeds) */}
          {Array.from({ length: 7 }, (_, i) => {
            const phase = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
            const speed = 0.026 + (Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1) * 0.012;
            const spread = Math.sin(i * 45.164) * 52;
            const u = (frame * speed + phase) % 1;
            return (
              <circle
                key={`in-${i}`}
                cx={cx + spread}
                cy={205 + u * 235}
                r={11 + (i % 3) * 1.5}
                fill={COLORS.white}
                filter="url(#soft-glow)"
              />
            );
          })}

          {/* Leaking Wireframe Bucket with Broken Bottom */}
          <path
            d="M 780 430 L 820 695 L 1100 695 L 1140 430"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="4"
          />
          <line x1="870" y1="695" x2="1050" y2="695" stroke="#070709" strokeWidth="9" />

          {/* Coins Falling Straight Out the Bottom Hole (deterministic sine-hash seeds) */}
          {Array.from({ length: 7 }, (_, i) => {
            const phase = Math.abs(Math.sin((i + 11) * 19.19) * 43758.5453) % 1;
            const speed = 0.028 + (Math.abs(Math.sin((i + 5) * 63.71) * 43758.5453) % 1) * 0.014;
            const spread = Math.cos(i * 37.82) * 58;
            const u = (frame * speed + phase) % 1;
            return (
              <circle
                key={`out-${i}`}
                cx={cx + spread}
                cy={700 + u * 210}
                r={9 + (i % 3) * 1.2}
                fill={COLORS.midGrey}
                opacity={1 - u}
              />
            );
          })}

          <text
            x={cx}
            y="865"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            POURING GOOD TIME INTO A LEAKING BUCKET
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE LEAKING BUCKET" x={cx} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="ALREADY SUNK"
        prefix="$"
        value={spent}
        x={1820}
        y={158}
        fontSize={116}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="STOP POURING."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
