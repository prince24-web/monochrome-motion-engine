import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const LighthouseBeamScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  // Lighthouse beam sweeps smoothly across the ocean of buyers
  const sweepAngle = Math.sin(frame * 0.045) * 20 + (sweepT - 0.5) * 14;
  const towerX = 390;
  const lampY = 390;
  const reachedBuyers = Math.round(120 + sweepT * 9880);

  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: -460, y: -120 },
    { t: 0.35, scale: 1.24, x: -80, y: 40 },
    { t: 0.68, scale: 1.32, x: 260, y: 120 },
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
          {/* Volumetric spotlight behind lighthouse operator */}
          <SpotlightCone
            topX={200}
            topWidth={90}
            bottomX={200}
            bottomY={865}
            bottomWidth={280}
            opacity={0.62}
          />

          {/* Sweeping Volumetric Lighthouse Beam */}
          <g transform={`translate(${towerX}, ${lampY}) rotate(${sweepAngle})`}>
            <polygon points="0,0 1480,-230 1480,230" fill="url(#spotlight-grad)" opacity="0.95" />
          </g>

          {/* Minimalist Wireframe Lighthouse Tower */}
          <polygon
            points={`${towerX - 52},860 ${towerX - 28},420 ${towerX + 28},420 ${towerX + 52},860`}
            fill="#0A0A0E"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          <circle cx={towerX} cy={lampY} r={24 + Math.sin(frame * 0.18) * 3} fill={COLORS.white} filter="url(#strong-glow)" />

          {/* Protagonist standing beside the lighthouse */}
          <PawnCharacter
            x={200}
            y={860}
            scale={0.86}
            glowIntensity={0.78}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {/* Ocean Horizon + Illuminated Buyer Silhouettes */}
          <line
            x1="140"
            y1="860"
            x2="1780"
            y2="860"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="2.5"
            strokeDasharray="12 12"
          />
          {Array.from({ length: 14 }, (_, i) => {
            const bx = 660 + i * 78;
            const lit = Math.max(0.35, 1 - Math.abs(i / 13 - sweepT) * 1.4);
            return (
              <g key={i} transform={`translate(${bx}, 825)`} opacity={lit} filter="url(#soft-glow)">
                <circle cx="0" cy="-16" r="7" fill={COLORS.white} />
                <path d="M -8 -6 Q 0 -10 8 -6 L 12 24 L -12 24 Z" fill={COLORS.softWhite} />
              </g>
            );
          })}

          <text
            x="1160"
            y="895"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            7/10 PRODUCT · 10/10 VISIBILITY WINS
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE LIGHTHOUSE EFFECT" x={960} y={92} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="BUYERS REACHED"
        value={reachedBuyers}
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="BE SEEN FIRST."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
