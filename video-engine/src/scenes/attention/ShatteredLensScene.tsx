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

export const ShatteredLensScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // First half: pure focused beam into blazing point; Second half: lens cracks and scatters into weak rays
  const crackFrame = Math.round(durationInFrames * 0.46);
  const scatterT = clampedInterpolate(
    frame,
    [crackFrame, durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  const lensX = 880;
  const cy = 540;

  // Camera: inspect blazing focal star on right -> whip left to cracking optical lens -> pull back to reveal scattered rays & protagonist
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 420, y: 0 },
    { t: 0.36, scale: 1.38, x: 140, y: 0 },
    { t: 0.64, scale: 1.44, x: -90, y: 0 },
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
          {/* Volumetric spotlight over protagonist witnessing focus shatter */}
          <SpotlightCone
            topX={235}
            topWidth={95}
            bottomX={235}
            bottomY={880}
            bottomWidth={290}
            opacity={0.72 - scatterT * 0.25}
          />

          {/* Incoming Parallel Light Beams on Left */}
          {[-120, -60, 0, 60, 120].map((dy, i) => (
            <line
              key={i}
              x1="310"
              y1={cy + dy}
              x2={lensX - 24}
              y2={cy + dy}
              stroke="rgba(255,255,255,0.62)"
              strokeWidth="3"
            />
          ))}

          {/* Convex Optical Lens */}
          <path
            d={`M ${lensX} ${cy - 185} Q ${lensX + 58} ${cy} ${lensX} ${cy + 185} Q ${lensX - 58} ${cy} ${lensX} ${cy - 185} Z`}
            fill="#0B0B12"
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter="url(#soft-glow)"
          />

          {/* Crack Line across Lens when shattered */}
          {scatterT > 0.03 && (
            <polyline
              points={`${lensX - 18},${cy - 90} ${lensX + 12},${cy - 20} ${lensX - 14},${cy + 35} ${lensX + 16},${cy + 105}`}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="3"
              opacity={Math.min(1, scatterT * 2)}
            />
          )}

          {/* Focused Converging Beams -> Scattered Weak Rays */}
          {[-120, -60, 0, 60, 120].map((dy, i) => {
            const targetX = 1520;
            const focusedY = cy;
            const scatteredY = cy + dy * 2.8;
            const curY = focusedY + (scatteredY - focusedY) * scatterT;
            return (
              <line
                key={i}
                x1={lensX + 24}
                y1={cy + dy * 0.75}
                x2={targetX}
                y2={curY}
                stroke={COLORS.white}
                strokeWidth={3.5 - scatterT * 1.8}
                opacity={0.92 - scatterT * 0.62}
                filter={scatterT < 0.4 ? 'url(#soft-glow)' : undefined}
              />
            );
          })}

          {/* Blazing Focal Star (fades when lens shatters) */}
          <g opacity={1 - scatterT * 0.92} filter="url(#strong-glow)">
            <circle cx="1520" cy={cy} r="95" fill="url(#hero-aura)" />
            <circle cx="1520" cy={cy} r="18" fill={COLORS.white} />
          </g>

          {/* Protagonist standing at the source of the beam */}
          <PawnCharacter
            x={235}
            y={860}
            scale={0.92}
            glowIntensity={0.78 - scatterT * 0.3}
            showFloorHalo
            haloProgress={0.85}
          />

          <text
            x="960"
            y="870"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            {scatterT > 0.5
              ? 'SCATTERED ENERGY BURNS NOTHING'
              : 'UNDIVIDED FOCUS BURNS THROUGH ANYTHING'}
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge
        text="FOCUSED BEAM"
        x={960}
        y={96}
        enterFrame={Math.round(fps * 0.4)}
        exitFrame={crackFrame - 4}
      />
      <PillBadge text="SHATTERED ATTENTION" x={960} y={96} enterFrame={crackFrame + 6} />

      <PunchlineCallout
        text="FRACTURED LIGHT."
        subtext="SCATTERED ENERGY BURNS NOTHING"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
