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

export const SkewedBellCurveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const morphT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const baseY = 785;

  // Build normal bell curve vs. right-skewed fat-tail outlier curve
  const normalPts: string[] = [];
  const fatTailPts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const u = i / 100;
    const x = 220 + u * 1480;
    const bell = Math.exp(-Math.pow((u - 0.36) / 0.13, 2)) * 380;
    const tail =
      Math.exp(-Math.pow((u - 0.25) / 0.09, 2)) * 310 +
      Math.exp(-Math.pow((u - 0.78) / 0.16, 2)) * 185 * u;
    normalPts.push(`${x.toFixed(1)},${(baseY - bell).toFixed(1)}`);
    fatTailPts.push(`${x.toFixed(1)},${(baseY - (bell * (1 - morphT) + tail * morphT)).toFixed(1)}`);
  }

  // Camera: start on normal bell curve -> sweep right to emerging 100X outlier tail -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.38, x: -220, y: 20 },
    { t: 0.42, scale: 1.32, x: 140, y: 55 },
    { t: 0.72, scale: 1.44, x: 420, y: 85 },
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
          <line x1="200" y1={baseY} x2="1720" y2={baseY} stroke={COLORS.midGrey} strokeWidth="2.5" />
          <polyline
            points={normalPts.join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2.5"
            strokeDasharray="8 8"
          />
          <polyline
            points={fatTailPts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="4.5"
            filter="url(#soft-glow)"
          />

          <g opacity={morphT}>
            <circle
              cx="1420"
              cy={baseY - 140}
              r={105 + Math.sin(frame * 0.12) * 10}
              fill="url(#hero-aura)"
              opacity="0.72"
            />
            <text
              x="1420"
              y={baseY - 185}
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="24"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              OUTLIER TAIL (100X)
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="FAT-TAIL OUTCOMES" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="OUTLIERS DEFINE DECADES."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
