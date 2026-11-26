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

export const NoiseToSignalWaveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Morphs continuously from chaotic jagged static -> razor-clean pure sine wave
  const cleanT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cy = 540;
  const clarityPct = Math.round(cleanT * 100);

  const pts: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const u = i / 140;
    const x = 180 + u * 1560;
    const noise =
      Math.sin(i * 2.7 + frame * 0.35) * 95 +
      Math.cos(i * 6.3 - frame * 0.25) * 65 +
      Math.sin(i * 11.1) * 45;
    const pure = Math.sin(u * Math.PI * 4 - frame * 0.08) * 145;
    const y = cy + noise * (1 - cleanT) + pure * cleanT;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -380, y: 0 },
    { t: 0.38, scale: 1.34, x: 0, y: -25 },
    { t: 0.7, scale: 1.4, x: 340, y: 15 },
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
          <line
            x1="180"
            y1={cy}
            x2="1740"
            y2={cy}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={COLORS.white}
            strokeWidth={3 + cleanT * 2.5}
            filter="url(#soft-glow)"
          />
          <text
            x="960"
            y="845"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            {cleanT > 0.5
              ? 'CLEAR STANDARDS CREATE PURE SIGNAL'
              : '10,000 SYNTHETIC VARIATIONS OF STATIC'}
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="SIGNAL OVER NOISE" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="SIGNAL CLARITY"
        value={clarityPct}
        suffix="%"
        x={1820}
        y={158}
        fontSize={116}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="PURE SIGNAL."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
