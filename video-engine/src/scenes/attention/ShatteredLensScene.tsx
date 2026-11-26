import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ShatteredLensScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // First half: pure focused beam into blazing point; Second half: lens cracks and scatters into 11 weak rays
  const crackFrame = Math.round(durationInFrames * 0.48);
  const scatterT = clampedInterpolate(frame, [crackFrame, crackFrame + 28], [0, 1], EASING.expoOut);

  const lensX = 860;
  const cy = 540;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Incoming Parallel Light Beams on Left */}
        {[-120, -60, 0, 60, 120].map((dy, i) => (
          <line key={i} x1="160" y1={cy + dy} x2={lensX - 24} y2={cy + dy} stroke="rgba(255,255,255,0.62)" strokeWidth="3" />
        ))}

        {/* Convex Optical Lens */}
        <path
          d={`M ${lensX} ${cy - 185} Q ${lensX + 58} ${cy} ${lensX} ${cy + 185} Q ${lensX - 58} ${cy} ${lensX} ${cy - 185} Z`}
          fill="#0B0B12"
          stroke={COLORS.white}
          strokeWidth="3.5"
          filter="url(#soft-glow)"
        />

        {/* Crack Line across Lens when shattered */}
        {scatterT > 0.05 && (
          <polyline
            points={`${lensX - 18},${cy - 90} ${lensX + 12},${cy - 20} ${lensX - 14},${cy + 35} ${lensX + 16},${cy + 105}`}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="3"
            opacity={scatterT}
          />
        )}

        {/* Focused Converging Beams -> Scattered Weak Rays */}
        {[-120, -60, 0, 60, 120].map((dy, i) => {
          const targetX = 1480;
          const focusedY = cy;
          const scatteredY = cy + dy * 2.8;
          const curY = focusedY + (scatteredY - focusedY) * scatterT;
          return (
            <line
              key={i}
              x1={lensX + 24}
              y1={cy + dy * 0.75}
              x2={targetX}
              y2={curY}
              stroke={COLORS.white}
              strokeWidth={3.5 - scatterT * 1.8}
              opacity={0.92 - scatterT * 0.62}
              filter={scatterT < 0.4 ? 'url(#soft-glow)' : undefined}
            />
          );
        })}

        {/* Blazing Focal Star (fades when lens shatters) */}
        <g opacity={1 - scatterT * 0.92} filter="url(#strong-glow)">
          <circle cx="1480" cy={cy} r="95" fill="url(#hero-aura)" />
          <circle cx="1480" cy={cy} r="18" fill={COLORS.white} />
        </g>

        <text x="960" y="905" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          {scatterT > 0.5 ? 'SCATTERED ENERGY BURNS NOTHING' : 'UNDIVIDED FOCUS BURNS THROUGH ANYTHING'}
        </text>
      </svg>

      <PillBadge text="FOCUSED BEAM" x={960} y={136} enterFrame={Math.round(fps * 0.5)} exitFrame={crackFrame - 4} />
      <PillBadge text="SHATTERED ATTENTION" x={960} y={136} enterFrame={crackFrame + 6} />
    </div>
  );
};
