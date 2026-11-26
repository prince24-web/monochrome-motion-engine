import React, { useMemo } from 'react';
import { COLORS } from '../theme/tokens';

interface WireframeGlobeProps {
  cx: number;
  cy: number;
  radius: number;
  rotationDeg: number;
  nodeIntensity?: number; // 0..1 brightness & count of surface nodes
  networkProgress?: number; // 0..1 constellation lines connecting online nodes
  opacity?: number;
  strokeWidth?: number;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 91.3458 + 47.123) * 43758.5453;
  return x - Math.floor(x);
}

export const WireframeGlobe: React.FC<WireframeGlobeProps> = ({
  cx,
  cy,
  radius,
  rotationDeg,
  nodeIntensity = 0.6,
  networkProgress = 0,
  opacity = 1,
  strokeWidth = 2.2,
}) => {
  const rotRad = (rotationDeg * Math.PI) / 180;
  const tiltRad = 0.24; // Subtle 3D tilt

  // Deterministic points distributed on unit sphere
  const sphereNodes = useMemo(() => {
    return Array.from({ length: 34 }, (_, i) => {
      const lat = (seeded(i + 10) - 0.5) * Math.PI * 0.84;
      const lon = seeded(i + 110) * Math.PI * 2;
      return { lat, lon, r: 2.2 + seeded(i + 210) * 2.2 };
    });
  }, []);

  // Project 3D spherical point to 2D
  const project = (lat: number, lon: number) => {
    const x0 = Math.cos(lat) * Math.sin(lon + rotRad);
    const y0 = Math.sin(lat);
    const z0 = Math.cos(lat) * Math.cos(lon + rotRad);

    // Apply X-axis tilt
    const y1 = y0 * Math.cos(tiltRad) - z0 * Math.sin(tiltRad);
    const z1 = y0 * Math.sin(tiltRad) + z0 * Math.cos(tiltRad);

    return {
      x: cx + x0 * radius,
      y: cy - y1 * radius,
      z: z1,
    };
  };

  // Latitude rings
  const latitudes = [-50, -22, 0, 22, 50];
  // Longitude meridians (12 full half-meridians covering 0..360 deg)
  const longitudes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const projectedNodes = sphereNodes.map((n) => ({
    ...project(n.lat, n.lon),
    r: n.r,
  }));

  const frontNodes = projectedNodes.filter((n) => n.z > -0.1);

  return (
    <g opacity={opacity}>
      {/* Subtle radial glow behind globe */}
      <circle cx={cx} cy={cy} r={radius * 1.28} fill="url(#hero-aura)" opacity={0.35} />

      {/* Outer crisp sphere silhouette */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#07070A"
        stroke={COLORS.white}
        strokeWidth={strokeWidth * 1.15}
        filter="url(#soft-glow)"
      />

      {/* Latitude curves */}
      {latitudes.map((latDeg) => {
        const lat = (latDeg * Math.PI) / 180;
        const pts: string[] = [];
        for (let step = 0; step <= 48; step++) {
          const lon = (step / 48) * Math.PI * 2;
          const p = project(lat, lon);
          if (p.z >= -0.05) {
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          } else if (pts.length > 0) {
            pts.push('BREAK');
          }
        }
        const segments = pts
          .join(' ')
          .split('BREAK')
          .map((s) => s.trim())
          .filter((s) => s.includes(' '));

        return segments.map((seg, si) => (
          <polyline
            key={`lat-${latDeg}-${si}`}
            points={seg}
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth={strokeWidth * 0.78}
          />
        ));
      })}

      {/* Longitude meridians */}
      {longitudes.map((lonDeg) => {
        const lon = (lonDeg * Math.PI) / 180;
        const pts: string[] = [];
        for (let step = 0; step <= 40; step++) {
          const lat = -Math.PI / 2 + (step / 40) * Math.PI;
          const p = project(lat, lon);
          if (p.z >= -0.05) {
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          } else if (pts.length > 0) {
            pts.push('BREAK');
          }
        }
        const segments = pts
          .join(' ')
          .split('BREAK')
          .map((s) => s.trim())
          .filter((s) => s.includes(' '));

        return segments.map((seg, si) => (
          <polyline
            key={`lon-${lonDeg}-${si}`}
            points={seg}
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth={strokeWidth * 0.78}
          />
        ));
      })}

      {/* Animated network constellation edges between nearby front nodes */}
      {networkProgress > 0.02 &&
        frontNodes.map((a, i) =>
          frontNodes.slice(i + 1).map((b, j) => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist > radius * 0.56) return null;
            const alpha = (1 - dist / (radius * 0.56)) * 0.65 * networkProgress;
            return (
              <line
                key={`edge-${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={COLORS.white}
                strokeWidth="1.4"
                opacity={alpha}
              />
            );
          })
        )}

      {/* Glowing surface nodes */}
      {nodeIntensity > 0.01 &&
        frontNodes.map((n, i) => (
          <circle
            key={`node-${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r * (0.7 + 0.4 * nodeIntensity)}
            fill={COLORS.white}
            opacity={Math.min(1, (0.35 + n.z * 0.65) * nodeIntensity)}
          />
        ))}
    </g>
  );
};
