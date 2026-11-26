import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FrictionWallScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const t = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);

  // Camera: inspect bad habit blocked by friction walls on left -> pan to zero-friction glide on right -> wide compare
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.4, x: -380, y: 25 },
    { t: 0.36, scale: 1.32, x: -240, y: 25 },
    { t: 0.68, scale: 1.38, x: 380, y: 25 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Subtle bounce back after hitting first friction wall so left side stays alive
  const badBallX = t < 0.55 ? 250 + (t / 0.55) * 155 : 405 - Math.sin(((t - 0.55) / 0.45) * Math.PI) * 26;

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
            y2="860"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          {/* Left: BAD HABIT blocked by 3 Tall Friction Walls */}
          <g>
            <text
              x="510"
              y="268"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              BAD HABIT · HIGH FRICTION
            </text>
            <line
              x1="200"
              y1="720"
              x2="820"
              y2="720"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="3"
            />
            {[430, 540, 650].map((wx, i) => (
              <rect
                key={i}
                x={wx}
                y={400}
                width="26"
                height="320"
                rx="5"
                fill="#101016"
                stroke={COLORS.white}
                strokeWidth="3"
              />
            ))}
            <circle cx={badBallX} cy={695} r="18" fill={COLORS.softWhite} />
            <text
              x="510"
              y="790"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="700"
              letterSpacing="0.14em"
            >
              PHONE IN ANOTHER ROOM
            </text>
          </g>

          {/* Right: GOOD HABIT glides through 0 Friction */}
          <g>
            <text
              x="1410"
              y="268"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              GOOD HABIT · ZERO FRICTION
            </text>
            <line
              x1="1100"
              y1="720"
              x2="1720"
              y2="720"
              stroke={COLORS.white}
              strokeWidth="4"
              filter="url(#soft-glow)"
            />
            <circle cx={1140 + t * 540} cy={695} r="58" fill="url(#hero-aura)" opacity="0.7" />
            <circle
              cx={1140 + t * 540}
              cy={695}
              r="20"
              fill={COLORS.white}
              filter="url(#soft-glow)"
            />
            <text
              x="1410"
              y="790"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="800"
              letterSpacing="0.14em"
            >
              BOOK ALREADY OPEN ON DESK
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DESIGN FRICTION" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ENGINEER YOUR FRICTION."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
