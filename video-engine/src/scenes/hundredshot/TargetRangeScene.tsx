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
  const x = Math.sin(seed * 45.123 + 12.989) * 43758.5453;
  return x - Math.floor(x);
}

export const TargetRangeScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const cy = 565;

  // 25 early shots scattering wide around the target
  const shots = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const angle = seeded(i + 1) * Math.PI * 2;
      const dist = 165 + seeded(i + 51) * 230;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist * 0.85,
      };
    });
  }, []);

  const shotProgress = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 25], EASING.smoothOut);
  const visibleShots = Math.floor(shotProgress);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Concentric Archery Target Rings */}
        {[280, 210, 140, 70].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={i === 3 ? COLORS.white : 'rgba(255,255,255,0.28)'}
            strokeWidth={i === 3 ? 3.5 : 2}
            filter={i === 3 ? 'url(#soft-glow)' : undefined}
          />
        ))}
        <circle cx={cx} cy={cy} r="12" fill={COLORS.white} filter="url(#soft-glow)" />

        {/* Crosshairs */}
        <line x1={cx - 330} y1={cy} x2={cx + 330} y2={cy} stroke="rgba(255,255,255,0.16)" strokeWidth="1.8" strokeDasharray="8 10" />
        <line x1={cx} y1={cy - 310} x2={cx} y2={cy + 310} stroke="rgba(255,255,255,0.16)" strokeWidth="1.8" strokeDasharray="8 10" />

        {/* Early Scattered Misses */}
        {shots.slice(0, visibleShots).map((s, idx) => (
          <g key={idx} transform={`translate(${s.x}, ${s.y})`} opacity={idx === visibleShots - 1 ? 1 : 0.55}>
            <line x1="-9" y1="-9" x2="9" y2="9" stroke={COLORS.white} strokeWidth="2.8" />
            <line x1="9" y1="-9" x2="-9" y2="9" stroke={COLORS.white} strokeWidth="2.8" />
          </g>
        ))}

        <text
          x={cx}
          y={940}
          textAnchor="middle"
          fill={COLORS.midGrey}
          fontFamily={FONT_FAMILY}
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.18em"
        >
          EARLY ATTEMPTS ALWAYS SCATTER WIDE
        </text>
      </svg>

      <RollingCounter label="ATTEMPT" value={Math.max(1, visibleShots)} prefix="#" x={350} y={240} fontSize={88} labelSize={20} />
      <PillBadge text="THE FIRST 5 SHOTS" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
