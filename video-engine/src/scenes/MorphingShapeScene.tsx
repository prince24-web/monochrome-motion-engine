import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { MorphingShapeProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: MorphingShapeProps;
  durationInFrames: number;
}

function buildMorphPath(morphT: number, frame: number): string {
  // 10 vertices alternating outer tips and inner valleys of a 5-point star -> morphing to a smooth pentagon
  const points: Array<{ x: number; y: number }> = [];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const isOuter = i % 2 === 0;
    const baseAngle = (i * Math.PI * 2) / count - Math.PI / 2;
    const starR = isOuter ? 165 : 64;
    const pentagonR = isOuter ? 116 : 94;
    // Slight organic wobble during mid-morph
    const midWobble = Math.sin(morphT * Math.PI) * Math.sin(i * 1.9 + frame * 0.08) * 18;
    const r = starR + (pentagonR - starR) * morphT + midWobble;
    points.push({
      x: Math.cos(baseAngle) * r,
      y: Math.sin(baseAngle) * r,
    });
  }

  // Smooth closed quadratic spline through midpoints
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const firstMid = mid(points[count - 1], points[0]);
  let d = `M ${firstMid.x.toFixed(1)} ${firstMid.y.toFixed(1)}`;
  for (let i = 0; i < count; i++) {
    const curr = points[i];
    const next = points[(i + 1) % count];
    const m = mid(curr, next);
    d += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`;
  }
  return d + ' Z';
}

export const MorphingShapeScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  const morphT = clampedInterpolate(
    frame,
    [Math.round(fps * 0.25), durationInFrames - Math.round(fps * 0.6)],
    [0, 1],
    EASING.smoothInOut
  );

  const versionVal = interpolate(morphT, [0, 1], [config.versionStart, config.versionEnd]);
  const lovedVal = interpolate(morphT, [0, 1], [config.lovedStart, config.lovedEnd]);
  const lovedOpacity = clampedInterpolate(frame, [Math.round(fps * 0.6), Math.round(fps * 1.1)], [0, 1], EASING.smoothOut);

  const cx = 960;
  const cy = 500;
  const shapePath = buildMorphPath(morphT, frame);
  const rotation = Math.sin(morphT * Math.PI) * -28;
  const auraOpacity = 0.85 - morphT * 0.52;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Soft radial aura that dims as the product becomes generic */}
        <circle cx={cx} cy={cy} r={290} fill="url(#hero-aura)" opacity={auraOpacity} />

        {/* Ambient floating orbs during active tweaking */}
        {[0, 1, 2].map((i) => {
          const angle = frame * 0.04 + i * 2.1;
          const dist = 165 + Math.sin(frame * 0.07 + i) * 28;
          const ox = cx + Math.cos(angle) * dist;
          const oy = cy + Math.sin(angle) * dist;
          const oOpacity = Math.sin(morphT * Math.PI) * 0.55;
          return (
            <circle
              key={i}
              cx={ox}
              cy={oy}
              r={10 + i * 3}
              fill="rgba(255,255,255,0.45)"
              opacity={oOpacity}
              filter="url(#soft-glow)"
            />
          );
        })}

        {/* Morphing Star -> Generic Pentagon */}
        <g transform={`translate(${cx}, ${cy}) rotate(${rotation})`}>
          <path
            d={shapePath}
            fill={`rgba(255, 255, 255, ${(0.38 - morphT * 0.24).toFixed(2)})`}
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter={morphT < 0.7 ? 'url(#soft-glow)' : undefined}
          />
        </g>
      </svg>

      {/* Left: VERSION counter */}
      <RollingCounter
        label="VERSION"
        value={versionVal}
        x={470}
        y={390}
        fontSize={68}
        labelSize={20}
      />

      {/* Right: LOVED BY counter dropping as version rises */}
      <RollingCounter
        label="LOVED BY"
        value={lovedVal}
        x={1450}
        y={390}
        fontSize={68}
        labelSize={20}
        opacity={lovedOpacity}
      />

      {/* Bottom Pill: OFFENDS NOBODY */}
      <PillBadge
        text={config.pillText}
        x={cx}
        y={790}
        enterFrame={Math.max(20, durationInFrames - Math.round(fps * 1.15))}
      />
    </div>
  );
};
