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

export const SurvivalBarrierScene: React.FC<Props> = ({ durationInFrames }) => {
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
  const ruinY = 735;
  const shieldGlow = 0.68 + 0.32 * Math.sin(frame * 0.09);

  // Camera: tight on protagonist & survival line -> tilt down to danger zone -> pull back to full stance
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: 0, y: 120 },
    { t: 0.4, scale: 1.32, x: 0, y: 195 },
    { t: 0.72, scale: 1.18, x: 0, y: 35 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Deterministic falling shockwaves deflected by the survival barrier
  const shocks = Array.from({ length: 8 }, (_, i) => {
    const seed = Math.sin(i * 19.7 + 1.3) * 0.5 + 0.5;
    const x = 280 + i * 195 + (seed - 0.5) * 60;
    const raw = frame * (0.016 + seed * 0.008) + seed;
    const prog = raw - Math.floor(raw);
    return { x, prog };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          <SpotlightCone
            topX={960}
            topWidth={130}
            bottomX={960}
            bottomY={ruinY + 15}
            bottomWidth={440}
            opacity={0.78}
          />

          {/* Downward volatility streaks stopped cold at the survival barrier */}
          {shocks.map((s, i) => {
            const yHead = 280 + s.prog * (ruinY - 280);
            return (
              <line
                key={i}
                x1={s.x}
                y1={Math.max(260, yHead - 45)}
                x2={s.x}
                y2={Math.min(ruinY - 6, yHead)}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={1 - s.prog * 0.5}
              />
            );
          })}

          {/* Solid Protected Survival Line */}
          <line
            x1="180"
            y1={ruinY}
            x2="1740"
            y2={ruinY}
            stroke={COLORS.white}
            strokeWidth="5"
            opacity={shieldGlow}
            filter="url(#soft-glow)"
          />

          {/* Danger Zone Below Ruin Line */}
          <rect x="180" y={ruinY + 4} width="1560" height="165" fill="rgba(255,255,255,0.032)" />
          <text
            x="960"
            y={ruinY + 86}
            textAnchor="middle"
            fill={COLORS.dimGrey}
            fontFamily={FONT_FAMILY}
            fontSize="28"
            fontWeight="800"
            letterSpacing="0.22em"
          >
            RUIN · GAME OVER ($0)
          </text>

          {/* Protagonist Standing Safely Above the Ruin Line */}
          <PawnCharacter
            x={960}
            y={ruinY - 8}
            scale={1.15}
            glowIntensity={0.85 + sweepT * 0.15}
            showFloorHalo
            haloProgress={0.85 + sweepT * 0.15}
          />

          <text
            x="960"
            y="325"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="30"
            fontWeight="800"
            letterSpacing="0.16em"
            opacity={0.75 + sweepT * 0.25}
          >
            STAY IN THE GAME = UNLIMITED SHOTS
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="NEVER RISK RUIN" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="SURVIVE TO COMPOUND."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
