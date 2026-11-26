import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const LighthouseBeamScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Lighthouse beam sweeps smoothly from -22 deg to +22 deg across the ocean of buyers
  const sweepAngle = Math.sin(frame * 0.045) * 24;
  const towerX = 390;
  const lampY = 390;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Sweeping Volumetric Lighthouse Beam */}
        <g transform={`translate(${towerX}, ${lampY}) rotate(${sweepAngle})`}>
          <polygon points="0,0 1420,-220 1420,220" fill="url(#spotlight-grad)" opacity="0.95" />
        </g>

        {/* Minimalist Wireframe Lighthouse Tower */}
        <polygon points={`${towerX - 52},860 ${towerX - 28},420 ${towerX + 28},420 ${towerX + 52},860`} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3.5" />
        <circle cx={towerX} cy={lampY} r="24" fill={COLORS.white} filter="url(#strong-glow)" />

        {/* Ocean Horizon + Illuminated Buyer Dots */}
        <line x1="160" y1="860" x2="1780" y2="860" stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" strokeDasharray="12 12" />
        {Array.from({ length: 14 }, (_, i) => {
          const bx = 660 + i * 78;
          return (
            <g key={i} transform={`translate(${bx}, 825)`} filter="url(#soft-glow)">
              <circle cx="0" cy="-16" r="7" fill={COLORS.white} />
              <path d="M -8 -6 Q 0 -10 8 -6 L 12 24 L -12 24 Z" fill={COLORS.softWhite} />
            </g>
          );
        })}

        <text x="1160" y="925" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          7/10 PRODUCT · 10/10 VISIBILITY WINS
        </text>
      </svg>

      <PillBadge text="THE LIGHTHOUSE EFFECT" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
