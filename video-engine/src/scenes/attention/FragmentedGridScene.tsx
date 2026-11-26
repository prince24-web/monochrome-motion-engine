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

export const FragmentedGridScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sliverSweep = clampedInterpolate(
    frame,
    [6, Math.round(durationInFrames * 0.45)],
    [0, 1],
    EASING.smoothInOut
  );
  const revealBottom = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.4), durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const barX = 240;
  const barW = 1440;
  const slivers = 32;

  // Camera: scan across fragmented slivers on top -> tilt down to expanding 90-min deep blocks -> full comparison pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -340, y: -125 },
    { t: 0.34, scale: 1.38, x: 320, y: -125 },
    { t: 0.68, scale: 1.32, x: 0, y: 155 },
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
          {/* Top Bar: 8 Hours Sliced into 32 Interrupted Slivers */}
          <text
            x={barX}
            y="340"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            8 SCATTERED HOURS (0 DEEP BLOCKS)
          </text>
          {Array.from({ length: slivers }, (_, i) => {
            const sw = barW / slivers - 6;
            const sx = barX + i * (barW / slivers);
            const lit = sliverSweep >= i / slivers;
            return (
              <rect
                key={i}
                x={sx}
                y="365"
                width={sw}
                height="110"
                rx="5"
                fill="#0C0C12"
                stroke={lit ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.12)'}
                strokeWidth="2"
              />
            );
          })}

          {/* Bottom Bar: 2 Unbroken Luminous 90-Minute Deep Blocks */}
          <g opacity={0.15 + revealBottom * 0.85}>
            <text
              x={barX}
              y="625"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              2 × 90-MIN UNBROKEN BLOCKS (3× OUTPUT)
            </text>
            {[0, 1].map((idx) => {
              const bx = barX + idx * 750;
              return (
                <g key={idx} filter="url(#soft-glow)">
                  <rect
                    x={bx}
                    y="650"
                    width={Math.max(24, 690 * revealBottom)}
                    height="130"
                    rx="16"
                    fill="rgba(255,255,255,0.18)"
                    stroke={COLORS.white}
                    strokeWidth="3.5"
                  />
                  <text
                    x={bx + 345}
                    y="726"
                    textAnchor="middle"
                    fill={COLORS.white}
                    fontFamily={FONT_FAMILY}
                    fontSize="28"
                    fontWeight="800"
                    letterSpacing="0.14em"
                    opacity={revealBottom}
                  >
                    DEEP BLOCK {idx + 1} · 90 MIN
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="UNBROKEN BLOCKS WIN" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="3× OUTPUT."
        subtext="TWO UNBROKEN BLOCKS BEAT EIGHT SCATTERED HOURS"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
