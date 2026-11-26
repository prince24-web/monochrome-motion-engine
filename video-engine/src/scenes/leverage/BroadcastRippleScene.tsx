import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 78.233 + 19.19) * 43758.5453;
  return x - Math.floor(x);
}

export const BroadcastRippleScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const cy = 540;

  // 76 distributed receiver nodes across the 16:9 canvas
  const nodes = useMemo(() => {
    return Array.from({ length: 76 }, (_, i) => {
      const angle = seeded(i + 1) * Math.PI * 2;
      const dist = 155 + seeded(i + 101) * 740;
      const nx = cx + Math.cos(angle) * dist * 1.18;
      const ny = cy + Math.sin(angle) * dist * 0.62;
      return {
        x: Math.max(90, Math.min(1830, nx)),
        y: Math.max(210, Math.min(930, ny)),
        dist: Math.hypot(nx - cx, ny - cy),
      };
    });
  }, []);

  // Leading sonar wavefront expands from 0 -> 1050px
  const waveLead = clampedInterpolate(frame, [16, durationInFrames - 24], [0, 1080], EASING.smoothOut);
  const reachCount = clampedInterpolate(frame, [16, durationInFrames - 24], [1, 1000000], EASING.expoInOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Expanding concentric sonar ripple rings */}
        {[0, 1, 2, 3].map((ringIdx) => {
          const r = Math.max(0, waveLead - ringIdx * 210);
          if (r <= 4 || r > 1060) return null;
          const alpha = Math.max(0, 1 - r / 1060) * 0.65;
          return (
            <circle
              key={ringIdx}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={ringIdx === 0 ? 3.2 : 1.8}
              opacity={alpha}
            />
          );
        })}

        {/* Distributed receiver nodes that ignite as the wave passes them */}
        {nodes.map((n, i) => {
          const isLit = waveLead >= n.dist;
          const flash = isLit ? Math.max(0, 1 - (waveLead - n.dist) / 140) : 0;
          return (
            <g key={i}>
              {/* Faint radial link back to center when lit */}
              {isLit && i % 4 === 0 && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={n.x}
                  y2={n.y}
                  stroke="rgba(255,255,255,0.09)"
                  strokeWidth="1.2"
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={isLit ? 5.5 + flash * 5 : 3.2}
                fill={isLit ? COLORS.white : COLORS.dimGrey}
                opacity={isLit ? 0.92 : 0.35}
              />
            </g>
          );
        })}

        {/* Central Emitter Core ("BUILD ONCE") */}
        <circle cx={cx} cy={cy} r="145" fill="url(#hero-aura)" opacity="0.85" />
        <rect
          x={cx - 46}
          y={cy - 46}
          width="92"
          height="92"
          rx="14"
          fill="#0B0B10"
          stroke={COLORS.white}
          strokeWidth="4"
          filter="url(#soft-glow)"
        />
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          fill={COLORS.white}
          fontFamily={FONT_FAMILY}
          fontSize="28"
          fontWeight="900"
        >
          1×
        </text>

        {/* Bottom Marginal Cost Callout */}
        <text
          x={cx}
          y={965}
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="24"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          MARGINAL COST PER EXTRA USER: $0.00
        </text>
      </svg>

      <RollingCounter
        label="PEOPLE REACHED"
        value={reachCount}
        x={cx}
        y={148}
        fontSize={86}
        labelSize={20}
      />

      <PillBadge text="BUILD ONCE, SELL TWICE" x={cx} y={248} enterFrame={Math.round(fps * 0.9)} />
    </div>
  );
};
