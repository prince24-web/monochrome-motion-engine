import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 91.77 + 33.11) * 43758.5453;
  return x - Math.floor(x);
}

export const ScatterToClusterScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const convergeT = clampedInterpolate(frame, [20, durationInFrames - 22], [0, 1], EASING.expoInOut);

  const dots = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const a = seeded(i + 1) * Math.PI * 2;
      const rWide = 45 + seeded(i + 100) * 195;
      const rTight = 6 + seeded(i + 200) * 42;
      return { a, rWide, rTight };
    });
  }, []);

  const leftCx = 510;
  const rightCx = 1410;
  const cy = 560;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Center Divider */}
        <line x1="960" y1="220" x2="960" y2="900" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: Shots 1-20 (Wide Noise) */}
        <g>
          <text x={leftCx} y="275" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
            SHOTS 1 – 20 · NOISE
          </text>
          <circle cx={leftCx} cy={cy} r="230" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="8 10" />
          <circle cx={leftCx} cy={cy} r="6" fill={COLORS.midGrey} />
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={leftCx + Math.cos(d.a) * d.rWide}
              cy={cy + Math.sin(d.a) * d.rWide}
              r="5.5"
              fill={COLORS.softWhite}
              opacity="0.45"
            />
          ))}
        </g>

        {/* Right: Shots 70-100 (Tightening Cluster) */}
        <g>
          <text x={rightCx} y="275" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            SHOTS 70 – 100 · CLUSTER
          </text>
          <circle cx={rightCx} cy={cy} r="230" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="8 10" />
          <circle cx={rightCx} cy={cy} r={220 - convergeT * 155} fill="none" stroke={COLORS.white} strokeWidth="3" filter="url(#soft-glow)" />
          <circle cx={rightCx} cy={cy} r="130" fill="url(#hero-aura)" opacity={0.25 + convergeT * 0.6} />

          {dots.map((d, i) => {
            const curR = d.rWide + (d.rTight - d.rWide) * convergeT;
            return (
              <circle
                key={i}
                cx={rightCx + Math.cos(d.a) * curR}
                cy={cy + Math.sin(d.a) * curR}
                r="6"
                fill={COLORS.white}
                opacity={0.55 + convergeT * 0.45}
              />
            );
          })}
        </g>
      </svg>

      <PillBadge text="DATA TIGHTENS YOUR AIM" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
