import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TrustWaveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 570;
  const waveR = clampedInterpolate(frame, [10, durationInFrames - 20], [40, 620], EASING.smoothOut);

  const peers = [
    { x: 520, y: 420 },
    { x: 1400, y: 420 },
    { x: 460, y: 690 },
    { x: 1460, y: 690 },
    { x: 690, y: 340 },
    { x: 1230, y: 340 },
    { x: 710, y: 790 },
    { x: 1210, y: 790 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {[0, 140, 280].map((off, i) => {
          const r = Math.max(0, waveR - off);
          if (r <= 5) return null;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={i === 0 ? 3.5 : 2}
              opacity={Math.max(0, 1 - r / 680) * 0.7}
            />
          );
        })}

        {peers.map((p, i) => {
          const dist = Math.hypot(p.x - cx, p.y - cy);
          const lit = waveR >= dist;
          return (
            <g key={i} transform={`translate(${p.x}, ${p.y})`} opacity={lit ? 1 : 0.25} filter={lit ? 'url(#soft-glow)' : undefined}>
              <circle cx="0" cy="-22" r="13" fill={COLORS.white} />
              <path d="M -14 -4 Q 0 -9 14 -4 L 22 32 L -22 32 Z" fill={COLORS.softWhite} />
            </g>
          );
        })}

        <PawnCharacter x={cx} y={cy + 75} scale={0.96} glowIntensity={0.95} showFloorHalo haloProgress={1} />

        <text x={cx} y="935" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          HIGH TRUST = ZERO FRICTION
        </text>
      </svg>

      <PillBadge text="FRICTION DISAPPEARS" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
