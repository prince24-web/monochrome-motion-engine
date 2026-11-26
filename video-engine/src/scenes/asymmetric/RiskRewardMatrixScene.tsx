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

export const RiskRewardMatrixScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const reveal = clampedInterpolate(sweepT, [0, 0.35], [0, 1], EASING.smoothOut);

  const cx = 960;
  const cy = 555;

  // Camera: wide matrix intro -> punch tightly into Golden Quadrant (top-left) -> pull back to full axes
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.08, x: 0, y: 15 },
    { t: 0.38, scale: 1.44, x: -245, y: -145 },
    { t: 0.72, scale: 1.38, x: -210, y: -120 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Deterministic glowing opportunity nodes inside Golden Quadrant
  const nodes = [
    { x: 525, y: 310, phase: 0.2 },
    { x: 645, y: 285, phase: 1.4 },
    { x: 820, y: 315, phase: 2.7 },
    { x: 540, y: 470, phase: 3.9 },
    { x: 845, y: 465, phase: 5.1 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* 2x2 Coordinate Axes */}
          <line x1="420" y1={cy} x2="1500" y2={cy} stroke={COLORS.midGrey} strokeWidth="2.5" />
          <line x1={cx} y1="225" x2={cx} y2="880" stroke={COLORS.midGrey} strokeWidth="2.5" />

          {/* Highlighted Golden Quadrant (Top-Left: LOW RISK, HIGH UPSIDE) */}
          <rect
            x="440"
            y="240"
            width="500"
            height="295"
            rx="18"
            fill={`rgba(255,255,255,${(0.08 + 0.07 * sweepT).toFixed(3)})`}
            stroke={COLORS.white}
            strokeWidth="3.5"
            opacity={reveal}
            filter="url(#soft-glow)"
          />

          {nodes.map((n, i) => {
            const pulse = 0.55 + 0.45 * Math.sin(frame * 0.08 + n.phase);
            return (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={5 + pulse * 3}
                fill={COLORS.white}
                opacity={reveal * pulse * 0.7}
                filter="url(#soft-glow)"
              />
            );
          })}

          <g opacity={reveal}>
            <text
              x="690"
              y="320"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="24"
              fontWeight="900"
              letterSpacing="0.16em"
            >
              GOLDEN QUADRANT
            </text>
            <text
              x="690"
              y="380"
              textAnchor="middle"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="700"
            >
              WRITING · CODE · PRODUCTS
            </text>
            <text
              x="690"
              y="430"
              textAnchor="middle"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="700"
            >
              COLD OUTREACH · MEDIA
            </text>
          </g>

          {/* Axis Labels */}
          <text
            x={cx}
            y="205"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            INFINITE UPSIDE ▲
          </text>
          <text
            x="420"
            y={cy + 36}
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            ◀ LOW RISK
          </text>
          <text
            x="1500"
            y={cy + 36}
            textAnchor="end"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            HIGH RISK ▶
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE GOLDEN QUADRANT" x={cx} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="LOW RISK. INFINITE UPSIDE."
        x={cx}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={56}
      />
    </div>
  );
};
