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

export const ConvexCurveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drawT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);

  // Camera: inspect fragile concave curve on left -> pan to explosive convex curve on right -> wide compare
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.4, x: -380, y: 20 },
    { t: 0.36, scale: 1.32, x: -180, y: 10 },
    { t: 0.68, scale: 1.38, x: 380, y: -25 },
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
            x1="960"
            y1="210"
            x2="960"
            y2="870"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          {/* Left: Fragile Concave Curve (Capped Gain, Catastrophic Drop) */}
          <g opacity="0.55">
            <text
              x="510"
              y="265"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              CONCAVE · FRAGILE
            </text>
            <path
              d="M 220 770 Q 480 400 800 480"
              fill="none"
              stroke="rgba(255,255,255,0.52)"
              strokeWidth="4"
              strokeDasharray="760"
              strokeDashoffset={760 * (1 - drawT)}
            />
            <text
              x="510"
              y="840"
              textAnchor="middle"
              fill={COLORS.dimGrey}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              SMALL UPSIDE · HUGE DOWNSIDE
            </text>
          </g>

          {/* Right: Antifragile Convex Curve (Tiny Downside, Explosive Upside) */}
          <g>
            <text
              x="1410"
              y="265"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              CONVEX · ANTIFRAGILE
            </text>
            <path
              d="M 1120 740 Q 1420 735 1700 300"
              fill="none"
              stroke={COLORS.white}
              strokeWidth="5"
              strokeDasharray="820"
              strokeDashoffset={820 * (1 - drawT)}
              filter="url(#soft-glow)"
            />
            <text
              x="1410"
              y="840"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              TINY DOWNSIDE · EXPLOSIVE UPSIDE
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="CONVEXITY WINS" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="BUILD CONVEXITY."
        subtext="GAIN MORE FROM CHAOS THAN YOU LOSE"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
