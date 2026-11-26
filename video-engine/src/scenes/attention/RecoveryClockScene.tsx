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

export const RecoveryClockScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const minutesVal = sweepT * 23;
  const cx = 960;
  const cy = 540;
  const r = 225;
  const circ = 2 * Math.PI * r;
  const arcFraction = (23 / 60) * sweepT;

  // Camera: close-up on top of clock arc -> follow sweeping white arc clockwise -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 40, y: -185 },
    { t: 0.36, scale: 1.38, x: 180, y: -40 },
    { t: 0.7, scale: 1.34, x: 120, y: 120 },
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
          <circle cx={cx} cy={cy} r={r} fill="#0A0A0E" stroke="rgba(255,255,255,0.22)" strokeWidth="20" />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - arcFraction)}
            transform={`rotate(-90 ${cx} ${cy})`}
            filter="url(#soft-glow)"
          />
          <text
            x={cx}
            y={cy - 18}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            RECOVERY TAX
          </text>
          <text
            x={cx}
            y={cy + 46}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="68"
            fontWeight="900"
          >
            {Math.round(minutesVal)} MIN
          </text>
          <text
            x={cx}
            y={865}
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            5 SEC DISTRACTION = 23 MIN RECOVERY TAX
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE 23-MINUTE TAX" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="RECOVERY TIME"
        value={minutesVal}
        suffix=" MIN"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="23 MINUTES LOST."
        subtext="FOR EVERY FIVE-SECOND GLANCE"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
