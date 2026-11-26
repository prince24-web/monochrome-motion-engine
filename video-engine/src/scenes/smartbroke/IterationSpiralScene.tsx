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

export const IterationSpiralScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 540;
  const drawT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);

  // Expanding Archimedean vector spiral (3.2 revolutions)
  const samples = 180;
  const maxTheta = Math.PI * 2 * 3.2;
  const pts: string[] = [];
  let headX = cx;
  let headY = cy;

  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * drawT;
    const theta = u * maxTheta - Math.PI / 2;
    const r = 24 + u * 290;
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (i === samples) {
      headX = x;
      headY = y;
    }
  }

  const cycles = Math.max(1, Math.round(drawT * 10));

  // Camera: tight on spiral origin -> gradually pull back as each iteration expands outward -> full 10x spiral reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.54, x: 0, y: 0 },
    { t: 0.35, scale: 1.36, x: 40, y: -35 },
    { t: 0.68, scale: 1.18, x: -30, y: 25 },
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
          <circle cx={cx} cy={cy} r="280" fill="url(#hero-aura)" opacity="0.35" />

          {pts.length > 1 && (
            <polyline
              points={pts.join(' ')}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#soft-glow)"
            />
          )}

          <circle cx={headX} cy={headY} r="12" fill={COLORS.white} filter="url(#soft-glow)" />

          <text
            x={cx}
            y={875}
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            SHIP → LEARN → IMPROVE · CYCLE #{cycles}
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="10× FASTER ITERATION" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="ITERATION"
        prefix="#"
        value={cycles}
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="SPEED COMPOUNDS."
        subtext="TEN LOOPS BEAT ONE MASTERPLAN"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
