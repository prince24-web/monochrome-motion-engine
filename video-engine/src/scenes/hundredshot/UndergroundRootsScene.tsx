import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const UndergroundRootsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const surfaceY = 420;
  const cx = 960;

  // Phase 1 (0..70%): Roots expand deeply underground; Phase 2 (70%..100%): Glowing sprout shoots upward above surface!
  const rootT = clampedInterpolate(frame, [8, Math.round(durationInFrames * 0.72)], [0, 1], EASING.smoothInOut);
  const sproutT = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.68), durationInFrames - 16],
    [0, 1],
    EASING.expoOut
  );

  // Recursive-style clean branching root segments
  const rootBranches = [
    { d: `M ${cx} ${surfaceY} L ${cx} ${surfaceY + 420}`, len: 420, delay: 0 },
    { d: `M ${cx} ${surfaceY + 80} Q ${cx - 120} ${surfaceY + 140} ${cx - 260} ${surfaceY + 260}`, len: 340, delay: 0.1 },
    { d: `M ${cx} ${surfaceY + 80} Q ${cx + 120} ${surfaceY + 140} ${cx + 260} ${surfaceY + 260}`, len: 340, delay: 0.12 },
    { d: `M ${cx} ${surfaceY + 180} Q ${cx - 180} ${surfaceY + 250} ${cx - 410} ${surfaceY + 380}`, len: 480, delay: 0.25 },
    { d: `M ${cx} ${surfaceY + 180} Q ${cx + 180} ${surfaceY + 250} ${cx + 410} ${surfaceY + 380}`, len: 480, delay: 0.28 },
    { d: `M ${cx - 160} ${surfaceY + 190} Q ${cx - 240} ${surfaceY + 310} ${cx - 280} ${surfaceY + 450}`, len: 320, delay: 0.42 },
    { d: `M ${cx + 160} ${surfaceY + 190} Q ${cx + 240} ${surfaceY + 310} ${cx + 280} ${surfaceY + 450}`, len: 320, delay: 0.45 },
    { d: `M ${cx} ${surfaceY + 290} Q ${cx - 90} ${surfaceY + 380} ${cx - 140} ${surfaceY + 480}`, len: 260, delay: 0.55 },
    { d: `M ${cx} ${surfaceY + 290} Q ${cx + 90} ${surfaceY + 380} ${cx + 140} ${surfaceY + 480}`, len: 260, delay: 0.58 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Ground Surface Horizon */}
        <line x1="120" y1={surfaceY} x2="1800" y2={surfaceY} stroke={COLORS.white} strokeWidth="3" strokeDasharray="12 12" />
        <text x="1760" y={surfaceY - 16} textAnchor="end" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.18em">
          VISIBLE SURFACE
        </text>
        <text x="1760" y={surfaceY + 38} textAnchor="end" fill={COLORS.dimGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.18em">
          90% INVISIBLE ROOTS
        </text>

        {/* Growing Underground Root Network */}
        {rootBranches.map((b, i) => {
          const prog = clampedInterpolate(rootT, [b.delay, Math.min(1, b.delay + 0.45)], [0, 1], EASING.smoothOut);
          return (
            <path
              key={i}
              d={b.d}
              fill="none"
              stroke="rgba(255,255,255,0.68)"
              strokeWidth={i === 0 ? 4.5 : 2.8}
              strokeDasharray={b.len}
              strokeDashoffset={b.len * (1 - prog)}
              strokeLinecap="round"
            />
          );
        })}

        {/* Breakthrough Luminous Sprout Shooting Above Surface */}
        {sproutT > 0.01 && (
          <g filter="url(#soft-glow)">
            <circle cx={cx} cy={surfaceY - sproutT * 195} r="130" fill="url(#hero-aura)" opacity={sproutT * 0.85} />
            <line
              x1={cx}
              y1={surfaceY}
              x2={cx}
              y2={surfaceY - sproutT * 215}
              stroke={COLORS.white}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {sproutT > 0.45 && (
              <>
                <path
                  d={`M ${cx} ${surfaceY - sproutT * 165} Q ${cx - 58} ${surfaceY - sproutT * 225} ${cx - 95} ${surfaceY - sproutT * 195} Q ${cx - 48} ${surfaceY - sproutT * 145} ${cx} ${surfaceY - sproutT * 165} Z`}
                  fill={COLORS.white}
                />
                <path
                  d={`M ${cx} ${surfaceY - sproutT * 165} Q ${cx + 58} ${surfaceY - sproutT * 225} ${cx + 95} ${surfaceY - sproutT * 195} Q ${cx + 48} ${surfaceY - sproutT * 145} ${cx} ${surfaceY - sproutT * 165} Z`}
                  fill={COLORS.white}
                />
              </>
            )}
          </g>
        )}
      </svg>

      <PillBadge text="INVISIBLE PROGRESS" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
