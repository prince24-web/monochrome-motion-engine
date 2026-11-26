import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const BrickTowerScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const rows = 9;
  const cols = 3;
  const totalBricks = rows * cols;
  const buildT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const stepF = Math.max(4, Math.floor((durationInFrames - 24) / totalBricks));
  const yearsVal = 1 + buildT * 9;

  const brickW = 112;
  const brickH = 44;
  const baseY = 850;
  const startX = 960 - (cols * brickW) / 2;

  // Camera: start close on base foundation & builder -> rise with tower -> pull back for full monument
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -120, y: 210 },
    { t: 0.36, scale: 1.32, x: 0, y: 65 },
    { t: 0.68, scale: 1.24, x: 25, y: -85 },
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
          {/* Volumetric spotlight over protagonist & tower */}
          <SpotlightCone
            topX={960}
            topWidth={160}
            bottomX={960}
            bottomY={baseY + 40}
            bottomWidth={540}
            opacity={0.72}
          />
          <SpotlightCone
            topX={540}
            topWidth={85}
            bottomX={540}
            bottomY={baseY + 35}
            bottomWidth={260}
            opacity={0.55}
          />

          <line
            x1="400"
            y1={baseY}
            x2="1520"
            y2={baseY}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="3"
          />

          {/* Recurring Protagonist building the monument */}
          <PawnCharacter
            x={540}
            y={baseY}
            scale={0.92}
            glowIntensity={0.78}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

          {Array.from({ length: totalBricks }, (_, idx) => {
            const dropF = 6 + idx * stepF;
            if (frame < dropF) return null;
            const pop = spring({
              frame: frame - dropF,
              fps,
              config: { damping: 16, stiffness: 200 },
            });
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const stagger = row % 2 === 0 ? 0 : 18;
            const bx = startX + col * brickW + stagger - 9;
            const targetY = baseY - (row + 1) * brickH;
            const y = targetY - (1 - pop) * 70;
            return (
              <rect
                key={idx}
                x={bx + 4}
                y={y + 4}
                width={brickW - 8}
                height={brickH - 8}
                rx="5"
                fill={row === rows - 1 ? 'rgba(255,255,255,0.22)' : '#0B0B10'}
                stroke={row >= rows - 2 ? COLORS.white : 'rgba(255,255,255,0.55)'}
                strokeWidth="2.5"
                opacity={pop}
                filter={row === rows - 1 ? 'url(#soft-glow)' : undefined}
              />
            );
          })}
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="BUILT LIKE AN ELEVATOR" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="YEARS BUILDING"
        value={yearsVal}
        prefix="YR "
        x={1820}
        y={158}
        fontSize={116}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="BRICK BY BRICK."
        subtext="ONE KEPT PROMISE AT A TIME"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
