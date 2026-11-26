import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FacetedCrystalScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Rotating 3D wireframe octahedron crystal
  const cx = 960;
  const cy = 560;
  const rot = frame * 0.025;
  const r = 195;

  const verts3D = [
    [0, -1.25, 0], // Top
    [0, 1.25, 0], // Bottom
    [1, 0, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, 0, -1],
  ];

  const projected = verts3D.map(([x, y, z]) => {
    const rx = x * Math.cos(rot) - z * Math.sin(rot);
    const rz = x * Math.sin(rot) + z * Math.cos(rot);
    const py = y * Math.cos(0.32) - rz * Math.sin(0.32);
    return { x: cx + rx * r, y: cy + py * r };
  });

  const edges = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 3], [3, 4], [4, 5], [5, 2],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <circle cx={cx} cy={cy} r="280" fill="url(#hero-aura)" opacity="0.65" />
        <g filter="url(#soft-glow)">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={projected[a].x}
              y1={projected[a].y}
              x2={projected[b].x}
              y2={projected[b].y}
              stroke={COLORS.white}
              strokeWidth="3.5"
            />
          ))}
          {projected.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="7" fill={COLORS.white} />
          ))}
        </g>

        <text x={cx} y="910" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          AN ORIGINAL POINT OF VIEW IS A RARE DIAMOND
        </text>
      </svg>

      <PillBadge text="UNIQUE PERSPECTIVE" x={cx} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
