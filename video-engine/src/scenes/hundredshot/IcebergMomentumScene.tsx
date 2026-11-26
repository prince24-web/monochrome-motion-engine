import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const IcebergMomentumScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const revealDepth = clampedInterpolate(frame, [20, Math.round(fps * 2.2)], [0, 1], EASING.expoOut);
  const waterlineY = 435;
  const bob = Math.sin(frame * 0.05) * 6;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Subtle Water Surface Plane */}
        <line
          x1="140"
          y1={waterlineY}
          x2="1780"
          y2={waterlineY}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="3"
          strokeDasharray="14 12"
        />

        {/* Geometric Wireframe Iceberg */}
        <g transform={`translate(960, ${waterlineY + bob})`}>
          {/* Visible Tip Above Waterline ("1% VISIBLE WIN") */}
          <polygon
            points="0,-165 115,0 -115,0"
            fill="rgba(255,255,255,0.22)"
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />
          <line x1="0" y1="-165" x2="22" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

          {/* Colossal Submerged Foundation Below Waterline ("99 IMPERFECT REPS") */}
          <g opacity={revealDepth}>
            <polygon
              points="-115,0 115,0 285,175 165,455 -185,435 -295,165"
              fill="#09090E"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="3"
            />
            {/* Architectural facet lines */}
            <line x1="-115" y1="0" x2="-185" y2="435" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            <line x1="115" y1="0" x2="165" y2="455" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            <line x1="-295" y1="165" x2="285" y2="175" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            <line x1="22" y1="0" x2="-15" y2="445" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          </g>
        </g>

        {/* Side Annotations */}
        <text x="1360" y="345" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="23" fontWeight="800" letterSpacing="0.16em">
          WHAT THE WORLD SEES
        </text>
        <text x="1360" y="382" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.14em">
          SHOT #100 · &quot;OVERNIGHT SUCCESS&quot;
        </text>

        <g opacity={revealDepth}>
          <text x="1360" y="655" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="23" fontWeight="800" letterSpacing="0.16em">
            WHAT BUILT IT
          </text>
          <text x="1360" y="692" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.14em">
            99 UNSEEN IMPERFECT REPS
          </text>
        </g>
      </svg>

      <PillBadge text="THE HIDDEN 99 REPS" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
