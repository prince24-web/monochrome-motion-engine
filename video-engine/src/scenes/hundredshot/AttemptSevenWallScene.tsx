import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const AttemptSevenWallScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const trackY = 740;
  const leftX = 180;
  const rightX = 1740;
  const wallX = 520; // Attempt #7 early along the 1..100 journey

  const walkT = clampedInterpolate(frame, [10, Math.round(durationInFrames * 0.52)], [0, 1], EASING.expoOut);
  const heroX = leftX + 40 + walkT * (wallX - leftX - 115);

  const wallHeight = clampedInterpolate(frame, [16, Math.round(fps * 1.4)], [0, 440], EASING.expoOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Horizontal 1..100 Track */}
        <line x1={leftX} y1={trackY} x2={rightX} y2={trackY} stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeDasharray="10 12" />

        {/* Milestone Markers */}
        {[
          { label: 'SHOT 1', x: leftX + 20 },
          { label: 'SHOT 7', x: wallX },
          { label: 'SHOT 50', x: 1120 },
          { label: 'SHOT 100', x: rightX - 40 },
        ].map((m) => (
          <g key={m.label}>
            <line x1={m.x} y1={trackY - 12} x2={m.x} y2={trackY + 12} stroke={COLORS.softWhite} strokeWidth="2.5" />
            <text
              x={m.x}
              y={trackY + 48}
              textAnchor="middle"
              fill={m.label === 'SHOT 7' ? COLORS.white : COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              {m.label}
            </text>
          </g>
        ))}

        {/* Massive Vertical Glowing QUIT WALL at Shot #7 */}
        <g filter="url(#soft-glow)">
          <rect
            x={wallX - 16}
            y={trackY - wallHeight}
            width="32"
            height={wallHeight}
            rx="6"
            fill="#101016"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
        </g>
        <text
          x={wallX}
          y={trackY - wallHeight - 24}
          textAnchor="middle"
          fill={COLORS.white}
          fontFamily={FONT_FAMILY}
          fontSize="22"
          fontWeight="800"
          letterSpacing="0.18em"
        >
          92% QUIT HERE
        </text>

        {/* Unexplored Glowing Horizon Beyond the Wall */}
        <rect
          x={wallX + 40}
          y={360}
          width={rightX - wallX - 60}
          height={340}
          rx="18"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeDasharray="10 12"
        />
        <text
          x={(wallX + 40 + rightX) / 2}
          y={535}
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="30"
          fontWeight="800"
          letterSpacing="0.18em"
        >
          SHOTS 8 – 100 (NEVER SEEN)
        </text>

        {/* Protagonist stopped in front of Shot 7 wall */}
        <PawnCharacter x={heroX} y={trackY} scale={0.95} glowIntensity={0.55} />
      </svg>

      <PillBadge text="THE ATTEMPT #7 WALL" x={960} y={136} enterFrame={Math.round(fps * 0.8)} />
    </div>
  );
};
