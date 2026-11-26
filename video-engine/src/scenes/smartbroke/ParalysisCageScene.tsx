import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ParalysisCageScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Cage bars slide apart midway, revealing it was never locked!
  const openT = clampedInterpolate(frame, [Math.round(durationInFrames * 0.48), durationInFrames - 24], [0, 1], EASING.expoInOut);

  const cx = 960;
  const barOffsets = [-210, -140, -70, 70, 140, 210];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Protagonist inside the cage */}
        <PawnCharacter
          x={cx}
          y={820}
          scale={1.12}
          glowIntensity={0.45 + openT * 0.55}
          showFloorHalo
          haloProgress={0.4 + openT * 0.6}
          armPose={openT > 0.65 ? 'celebrate' : 'none'}
        />

        {/* Sliding Cage Bars */}
        {barOffsets.map((off, i) => {
          const dir = off < 0 ? -1 : 1;
          const bx = cx + off + dir * openT * 360;
          return (
            <line
              key={i}
              x1={bx}
              y1="270"
              x2={bx}
              y2="840"
              stroke={COLORS.white}
              strokeWidth="4.5"
              opacity={1 - openT * 0.65}
              filter="url(#soft-glow)"
            />
          );
        })}

        <text
          x={cx}
          y="915"
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="22"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          {openT > 0.5 ? 'THE CAGE WAS NEVER LOCKED' : 'WHAT IF · TOO SOON · NOT READY'}
        </text>
      </svg>

      <PillBadge text="ANALYSIS PARALYSIS" x={cx} y={136} enterFrame={Math.round(fps * 0.5)} exitFrame={Math.round(durationInFrames * 0.45)} />
      <PillBadge text="UNLOCKED FROM WITHIN" x={cx} y={136} enterFrame={Math.round(durationInFrames * 0.52)} />
    </div>
  );
};
