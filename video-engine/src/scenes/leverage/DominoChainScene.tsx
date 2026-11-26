import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DominoChainScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const groundY = 860;

  // 8 escalating domino slabs from tiny (56px) to skyscraper monolith (540px)
  const dominoes = [
    { x: 355, w: 16, h: 56 },
    { x: 420, w: 20, h: 82 },
    { x: 505, w: 25, h: 118 },
    { x: 615, w: 32, h: 168 },
    { x: 755, w: 40, h: 232 },
    { x: 930, w: 50, h: 315 },
    { x: 1150, w: 62, h: 415 },
    { x: 1425, w: 78, h: 530 },
  ];

  const cascadeStart = 20;
  const stepFrames = Math.max(12, Math.floor((durationInFrames - 60) / dominoes.length));

  // Subtle camera zoom-out as dominoes scale up
  const camScale = clampedInterpolate(frame, [0, durationInFrames - 20], [1.05, 0.96], EASING.smoothInOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <g transform={`translate(960, 540) scale(${camScale}) translate(-960, -540)`}>
          {/* Ground plane */}
          <line
            x1="120"
            y1={groundY}
            x2="1800"
            y2={groundY}
            stroke="rgba(255,255,255,0.36)"
            strokeWidth="2.5"
            strokeDasharray="12 14"
          />

          {/* Tiny Pawn gently nudging domino #1 */}
          <PawnCharacter
            x={255}
            y={groundY}
            scale={0.78}
            glowIntensity={0.7}
            armPose="reachRight"
          />

          {/* Escalating Dominoes with sequential fall rotation around bottom-right corner */}
          {dominoes.map((d, idx) => {
            const triggerFrame = cascadeStart + idx * stepFrames;
            const fallen = frame >= triggerFrame;
            const fallSpring = fallen
              ? spring({
                  frame: frame - triggerFrame,
                  fps,
                  config: { damping: 14, stiffness: 120, mass: 1.0 + idx * 0.14 },
                })
              : 0;

            // Earlier dominoes lean ~64 deg into the next; the final monolith tilts dramatically ~52 deg
            const maxAngle = idx === dominoes.length - 1 ? 52 : 64;
            const rotDeg = fallSpring * maxAngle;

            // Impact ripple at base when domino gets struck
            const impactT = fallen
              ? clampedInterpolate(frame - triggerFrame, [0, 22], [0, 1], EASING.expoOut)
              : 0;

            return (
              <g key={idx}>
                {impactT > 0.01 && impactT < 0.98 && (
                  <ellipse
                    cx={d.x + d.w / 2}
                    cy={groundY}
                    rx={20 + impactT * (40 + idx * 18)}
                    ry={6 + impactT * (10 + idx * 4)}
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth="2.2"
                    opacity={(1 - impactT) * 0.75}
                  />
                )}

                <g transform={`translate(${d.x + d.w}, ${groundY}) rotate(${rotDeg})`}>
                  <rect
                    x={-d.w}
                    y={-d.h}
                    width={d.w}
                    height={d.h}
                    rx={Math.max(4, d.w * 0.14)}
                    fill={fallen ? 'rgba(255,255,255,0.16)' : '#0B0B10'}
                    stroke={fallen ? COLORS.white : 'rgba(255,255,255,0.55)'}
                    strokeWidth={idx >= 5 ? 3.5 : 2.5}
                    filter={fallen && idx >= 4 ? 'url(#soft-glow)' : undefined}
                  />
                  {/* Classic minimalist domino center divider */}
                  <line
                    x1={-d.w + 4}
                    y1={-d.h / 2}
                    x2={-4}
                    y2={-d.h / 2}
                    stroke="rgba(255,255,255,0.32)"
                    strokeWidth="2"
                  />
                </g>
              </g>
            );
          })}

          {/* Scale Callouts */}
          <text
            x="360"
            y={groundY + 52}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            1× ACTION
          </text>
          <text
            x="1465"
            y={groundY + 52}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            128× IMPACT
          </text>
        </g>
      </svg>

      <PillBadge text="EXPONENTIAL CASCADE" x={960} y={142} enterFrame={Math.round(fps * 0.8)} />
    </div>
  );
};
