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

export const RoomArchitectureScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Clutter items fade out while clean central DESK lights up smoothly across entire scene!
  const cleanT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const clutter = [
    { label: 'TV', x: 560, y: 375 },
    { label: 'PHONE', x: 1360, y: 375 },
    { label: 'SNACKS', x: 560, y: 715 },
    { label: '20 TABS', x: 1360, y: 715 },
  ];

  // Camera: wide cluttered room -> push tightly into illuminated central DEEP WORK DESK -> pull back to clean blueprint
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.06, x: 0, y: 10 },
    { t: 0.38, scale: 1.32, x: 0, y: 10 },
    { t: 0.72, scale: 1.48, x: 0, y: 10 },
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
          {/* Top-Down Architectural Room Blueprint */}
          <rect
            x="400"
            y="240"
            width="1120"
            height="610"
            rx="18"
            fill="#09090D"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
          />

          {/* Clutter Nodes Fading Away */}
          {clutter.map((c) => (
            <g
              key={c.label}
              transform={`translate(${c.x}, ${c.y})`}
              opacity={Math.max(0.06, 0.85 - cleanT * 0.79)}
            >
              <rect
                x="-82"
                y="-32"
                width="164"
                height="64"
                rx="12"
                fill="#0D0D14"
                stroke={COLORS.midGrey}
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <text
                x="0"
                y="8"
                textAnchor="middle"
                fill={COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize="20"
                fontWeight="700"
                letterSpacing="0.14em"
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Clean Illuminated Central Desk */}
          <g transform="translate(960, 545)" filter="url(#soft-glow)">
            <circle
              cx="0"
              cy="0"
              r={190 + Math.sin(frame * 0.08) * 12}
              fill="url(#hero-aura)"
              opacity={0.3 + cleanT * 0.65}
            />
            <rect
              x="-180"
              y="-76"
              width="360"
              height="152"
              rx="16"
              fill="#0B0B10"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="28"
              fontWeight="900"
              letterSpacing="0.16em"
            >
              DEEP WORK DESK
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="REDESIGN THE ROOM" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="CLEAR THE NOISE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
