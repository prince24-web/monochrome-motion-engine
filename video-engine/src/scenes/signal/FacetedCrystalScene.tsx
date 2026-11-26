import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
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

  const bloomT = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  // Rotating 3D wireframe octahedron crystal
  const cx = 960;
  const cy = 530;
  const rot = frame * 0.028 + bloomT * 0.6;
  const r = 190;

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
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 2],
  ];

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.52, x: 0, y: -20 },
    { t: 0.36, scale: 1.32, x: -240, y: 55 },
    { t: 0.68, scale: 1.38, x: 160, y: -35 },
    { t: 0.9, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Volumetric spotlight beaming onto the faceted crystal */}
          <SpotlightCone
            topX={cx}
            topWidth={145}
            bottomX={cx}
            bottomY={860}
            bottomWidth={520}
            opacity={0.48 + bloomT * 0.45}
          />

          {/* Protagonist standing in awe of the unique perspective crystal */}
          <PawnCharacter
            x={320}
            y={870}
            scale={0.88}
            glowIntensity={0.62 + bloomT * 0.28}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          <circle
            cx={cx}
            cy={cy}
            r={260 + bloomT * 45}
            fill="url(#hero-aura)"
            opacity={0.55 + bloomT * 0.3}
          />
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

          <text
            x={cx}
            y="855"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            AN ORIGINAL POINT OF VIEW IS A RARE DIAMOND
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="UNIQUE PERSPECTIVE" x={cx} y={92} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="IRREPLACEABLE POV."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
