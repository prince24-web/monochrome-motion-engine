import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const InvisibleShieldScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 12], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const cx = 960;
  const cy = 540;

  // Camera: inspect incoming arrows on shield edge -> push into protected hero -> wide hero reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: -240, y: 15 },
    { t: 0.42, scale: 1.32, x: -80, y: -15 },
    { t: 0.74, scale: 1.24, x: 40, y: 10 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Deterministic sine-hash arrow offsets so impacts feel organic, never mechanical modulo
  const arrows = [
    { dy: -128, speed: 0.028, phase: 0.13, dir: -1 },
    { dy: -38, speed: 0.034, phase: 0.47, dir: -0.6 },
    { dy: 48, speed: 0.031, phase: 0.79, dir: 0.7 },
    { dy: 132, speed: 0.026, phase: 0.29, dir: 1 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          <SpotlightCone
            topX={cx}
            topWidth={120}
            bottomX={cx}
            bottomY={cy + 250}
            bottomWidth={440}
            opacity={0.78}
          />

          {/* Outer Energy Field Pulse */}
          <polygon
            points={`${cx},${cy - 262} ${cx + 228},${cy - 131} ${cx + 228},${cy + 131} ${cx},${cy + 262} ${cx - 228},${cy + 131} ${cx - 228},${cy - 131}`}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="10 10"
            opacity={0.5 + 0.5 * Math.sin(frame * 0.08)}
          />

          {/* Glowing Hexagonal Reputation Shield */}
          <polygon
            points={`${cx},${cy - 235} ${cx + 205},${cy - 118} ${cx + 205},${cy + 118} ${cx},${cy + 235} ${cx - 205},${cy + 118} ${cx - 205},${cy - 118}`}
            fill="#09090D"
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />

          {/* Deflected Critic / Rumor Arrows bouncing off shield */}
          {arrows.map((a, i) => {
            const raw = frame * a.speed + a.phase + Math.sin(i * 7.3) * 0.15;
            const cycle = raw - Math.floor(raw);
            const ax = 330 + cycle * 405;
            const deflect = cycle > 0.72 ? (cycle - 0.72) * 320 : 0;
            const yPos = cy + a.dy + deflect * a.dir;
            return (
              <g key={i} opacity={Math.max(0, 1 - deflect / 115)}>
                <line
                  x1={ax - 62}
                  y1={yPos}
                  x2={ax}
                  y2={yPos}
                  stroke="rgba(255,255,255,0.62)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {cycle > 0.7 && cycle < 0.85 && (
                  <circle
                    cx={cx - 205}
                    cy={cy + a.dy}
                    r={(cycle - 0.7) * 160}
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth="2"
                    opacity={1 - (cycle - 0.7) / 0.15}
                  />
                )}
              </g>
            );
          })}

          <PawnCharacter
            x={cx}
            y={cy + 95}
            scale={1.04}
            glowIntensity={0.82 + sweepT * 0.15}
            showFloorHalo
            haloProgress={0.85 + sweepT * 0.15}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE INVISIBLE SHIELD" x={cx} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="HISTORY DEFENDS YOU."
        subtext="LOUDER THAN ANY EXCUSE"
        x={cx}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
