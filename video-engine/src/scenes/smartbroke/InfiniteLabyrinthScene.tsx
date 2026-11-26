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

export const InfiniteLabyrinthScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const t = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);

  // Left: trapped node looping endlessly inside a wireframe maze
  const mazeCx = 560;
  const mazeCy = 550;
  const loopAngle = frame * 0.09;
  const trappedX = mazeCx + Math.cos(loopAngle) * 95 + Math.sin(loopAngle * 2) * 35;
  const trappedY = mazeCy + Math.sin(loopAngle) * 95;

  // Right: executor walking a straight glowing line directly to DONE
  const straightX = 1140 + t * 560;

  // Camera: start on trapped overthinker maze -> pan right to track executor marching straight to DONE -> wide contrast reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -400, y: 10 },
    { t: 0.34, scale: 1.36, x: -340, y: 10 },
    { t: 0.68, scale: 1.38, x: 460, y: 10 },
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
          {/* Volumetric spotlight tracking the executor on the right */}
          <SpotlightCone
            topX={straightX}
            topWidth={95}
            bottomX={straightX}
            bottomY={mazeCy + 45}
            bottomWidth={280}
            opacity={0.75}
          />

          <line
            x1="960"
            y1="210"
            x2="960"
            y2="870"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          {/* Left: Wireframe Concentric Labyrinth */}
          <g>
            <text
              x={mazeCx}
              y="265"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              THE OVERTHINKER
            </text>
            {[220, 165, 110, 55].map((r, i) => (
              <circle
                key={r}
                cx={mazeCx}
                cy={mazeCy}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.36)"
                strokeWidth="3"
                strokeDasharray={`${140 + i * 25} ${38 + i * 10}`}
                transform={`rotate(${i * 75} ${mazeCx} ${mazeCy})`}
              />
            ))}
            <circle cx={trappedX} cy={trappedY} r="10" fill={COLORS.softWhite} filter="url(#soft-glow)" />
            <text
              x={mazeCx}
              y="835"
              textAnchor="middle"
              fill={COLORS.dimGrey}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              TRAPPED IN COMPLEXITY
            </text>
          </g>

          {/* Right: Direct Straight Path to Execution */}
          <g>
            <text
              x="1420"
              y="265"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="22"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              THE EXECUTOR
            </text>
            <line
              x1="1140"
              y1={mazeCy}
              x2="1700"
              y2={mazeCy}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="3"
              strokeDasharray="10 10"
            />
            <line
              x1="1140"
              y1={mazeCy}
              x2={straightX}
              y2={mazeCy}
              stroke={COLORS.white}
              strokeWidth="5"
              filter="url(#soft-glow)"
            />
            <circle cx={straightX} cy={mazeCy} r="13" fill={COLORS.white} filter="url(#soft-glow)" />
            <circle cx="1700" cy={mazeCy} r="24" fill="none" stroke={COLORS.white} strokeWidth="3" />
            <text
              x="1700"
              y={mazeCy + 64}
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="800"
              letterSpacing="0.16em"
            >
              DONE
            </text>

            {/* Protagonist walking directly toward DONE */}
            <PawnCharacter
              x={straightX}
              y={mazeCy - 18}
              scale={0.72}
              glowIntensity={0.82}
              armPose={t > 0.85 ? 'celebrate' : 'reachRight'}
            />
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE INTELLIGENCE TRAP" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="SIMPLE MOVES FAST."
        subtext="COMPLEXITY IS A HIDING PLACE"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
