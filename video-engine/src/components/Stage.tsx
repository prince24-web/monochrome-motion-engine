import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS, FONT_FAMILY, LAYOUT, VIDEO_CONFIG } from '../theme/tokens';
import { GlowDefs } from './GlowDefs';

interface StageProps {
  children: React.ReactNode;
  showGround?: boolean;
  groundOpacity?: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const Stage: React.FC<StageProps> = ({
  children,
  showGround = true,
  groundOpacity = 1,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => ({
      x: seededRandom(i + 1) * VIDEO_CONFIG.width,
      y: seededRandom(i + 101) * VIDEO_CONFIG.height,
      r: 0.9 + seededRandom(i + 201) * 1.6,
      speedX: (seededRandom(i + 301) - 0.5) * 0.18,
      speedY: -0.06 - seededRandom(i + 401) * 0.16,
      baseOpacity: 0.08 + seededRandom(i + 501) * 0.22,
      phase: seededRandom(i + 601) * Math.PI * 2,
    }));
  }, []);

  const gridDriftX = (frame * 0.08) % 54;
  const gridDriftY = (frame * 0.04) % 54;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(ellipse 72% 68% at 50% 48%, ${COLORS.bgCenter} 0%, ${COLORS.bg} 74%, #020203 100%)`,
        fontFamily: FONT_FAMILY,
        color: COLORS.white,
        overflow: 'hidden',
      }}
    >
      {/* Background Dot-Matrix Grid + Ambient Particles + Dashed Ground */}
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <GlowDefs />
        <defs>
          <pattern
            id="dot-matrix"
            x={gridDriftX}
            y={gridDriftY}
            width="54"
            height="54"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.25" fill={COLORS.dotGrid} />
          </pattern>
        </defs>

        <rect width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} fill="url(#dot-matrix)" />

        {/* Subtle drifting dust motes */}
        {particles.map((p, idx) => {
          const px = (p.x + frame * p.speedX + VIDEO_CONFIG.width) % VIDEO_CONFIG.width;
          const py = (p.y + frame * p.speedY + VIDEO_CONFIG.height) % VIDEO_CONFIG.height;
          const twinkle = 0.65 + 0.35 * Math.sin(frame * 0.04 + p.phase);
          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r={p.r}
              fill="#FFFFFF"
              opacity={p.baseOpacity * twinkle}
            />
          );
        })}

        {/* Signature dashed horizontal ground line */}
        {showGround && (
          <line
            x1="0"
            y1={LAYOUT.groundY}
            x2={VIDEO_CONFIG.width}
            y2={LAYOUT.groundY}
            stroke={COLORS.dashedGround}
            strokeWidth="2.5"
            strokeDasharray="12 14"
            opacity={groundOpacity}
          />
        )}
      </svg>

      {/* Main Scene Layer */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Subtle cinema edge vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 84% 82% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.68) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
