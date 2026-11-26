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

export const CalibrationDialScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Continuous smooth calibration sweep across the full scene
  const calT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const errorDeg = 42 * (1 - calT);
  const ring1Rot = errorDeg;
  const ring2Rot = -errorDeg * 1.4;
  const ring3Rot = errorDeg * 0.7;

  const cx = 960;
  const cy = 540;

  // Camera: close-up on top alignment notch -> zoom out to full concentric rings -> punch into locked core -> wide settle
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: -195 },
    { t: 0.35, scale: 1.18, x: 0, y: 0 },
    { t: 0.68, scale: 1.5, x: 0, y: 0 },
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
          {/* Fixed Reference Axis */}
          <line
            x1={cx}
            y1="220"
            x2={cx}
            y2="860"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="8 10"
          />
          <line
            x1="620"
            y1={cy}
            x2="1300"
            y2={cy}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="8 10"
          />

          {/* Concentric Vernier Calibration Rings locking into 0 deg alignment */}
          {[
            { r: 270, rot: ring1Rot, w: 3 },
            { r: 195, rot: ring2Rot, w: 2.5 },
            { r: 120, rot: ring3Rot, w: 3.5 },
          ].map((ring, i) => (
            <g key={i} transform={`translate(${cx}, ${cy}) rotate(${ring.rot})`}>
              <circle
                cx="0"
                cy="0"
                r={ring.r}
                fill="none"
                stroke={calT > 0.85 ? COLORS.white : 'rgba(255,255,255,0.6)'}
                strokeWidth={ring.w}
                strokeDasharray={i === 1 ? '18 14' : undefined}
                filter={calT > 0.85 ? 'url(#soft-glow)' : undefined}
              />
              {/* Top Alignment Notch */}
              <line
                x1="0"
                y1={-ring.r - 14}
                x2="0"
                y2={-ring.r + 18}
                stroke={COLORS.white}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Center Lock Core */}
          <circle cx={cx} cy={cy} r={14 + calT * 8} fill={COLORS.white} filter="url(#soft-glow)" />

          <text
            x={cx}
            y={875}
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            EVERY MISS CALIBRATES THE NEXT SHOT
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="CALIBRATION SIGNAL" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="AIM ERROR"
        value={errorDeg}
        suffix="°"
        x={1820}
        y={158}
        fontSize={120}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="MISSES ARE DATA."
        subtext="ERROR CONVERGES TO ZERO"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
