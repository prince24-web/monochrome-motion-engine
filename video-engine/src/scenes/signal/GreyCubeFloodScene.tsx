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

export const GreyCubeFloodScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const floodT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const priceVal = Math.max(0, Math.round(100 * (1 - floodT)));

  const cols = 12;
  const rows = 5;
  const total = cols * rows;
  const visible = Math.floor(floodT * total);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: -340, y: 185 },
    { t: 0.38, scale: 1.32, x: 180, y: 65 },
    { t: 0.7, scale: 1.24, x: 0, y: -55 },
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
          {Array.from({ length: visible }, (_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 300 + col * 112;
            const y = 760 - row * 102;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="92"
                height="86"
                rx="10"
                fill="#0E0E14"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2"
              />
            );
          })}

          <text
            x="960"
            y="885"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            INFINITE SUPPLY → PRICE COLLAPSES TO ZERO
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="INFINITE SUPPLY" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="VALUE OF AVERAGE"
        prefix="$"
        value={priceVal}
        x={1820}
        y={158}
        fontSize={120}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="VALUE COLLAPSES."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
