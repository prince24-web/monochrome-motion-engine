import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const HumanSignatureScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drawT = clampedInterpolate(frame, [10, durationInFrames - 22], [0, 1], EASING.smoothInOut);
  const sigPath =
    'M 340 620 C 440 420 520 710 640 530 C 740 380 820 690 950 510 C 1060 360 1160 660 1280 540 C 1380 450 1460 620 1580 560';
  const totalLen = 1950;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Signature Baseline */}
        <line x1="280" y1="680" x2="1640" y2="680" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeDasharray="10 10" />

        {/* Live Calligraphic Human Signature Stroke */}
        <path
          d={sigPath}
          fill="none"
          stroke={COLORS.white}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeDasharray={totalLen}
          strokeDashoffset={totalLen * (1 - drawT)}
          filter="url(#soft-glow)"
        />

        <text x="960" y="790" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="800" letterSpacing="0.18em">
          LIVED EXPERIENCE CANNOT BE PROMPTED
        </text>
      </svg>

      <PillBadge text="THE HUMAN SIGNATURE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
