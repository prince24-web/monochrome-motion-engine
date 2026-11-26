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

export const BoredomChamberScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Calm progress: chaotic noise rings dissolve outward as 72 hours tick up continuously
  const calmT = clampedInterpolate(frame, [8, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const hoursVal = calmT * 72;

  const cx = 960;
  const cy = 585;
  const chamberR = 235;
  const circumference = 2 * Math.PI * chamberR;

  const noiseTags = [
    { label: 'FEEDS', angle: 0.35 },
    { label: 'ALERTS', angle: 1.55 },
    { label: 'SCROLLING', angle: 2.8 },
    { label: 'NOISE', angle: 4.05 },
    { label: 'CLIPS', angle: 5.25 },
  ];

  // Smooth meditative zoom-in into the spotlighted protagonist as static clears
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 0.96, x: 0, y: 15 },
    { t: 0.55, scale: 1.12, x: 0, y: 35 },
    { t: 1.0, scale: 1.24, x: 0, y: 45 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Brightening Overhead Spotlight Cone as Silence Deepens */}
          <SpotlightCone
            topX={cx}
            topWidth={120}
            bottomX={cx}
            bottomY={880}
            bottomWidth={440}
            opacity={0.32 + calmT * 0.65}
          />

          {/* Base Chamber Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={chamberR}
            fill="#09090D"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="3"
          />

          {/* Clean 72-Hour Progress Arc Sweeping Around the Chamber */}
          <circle
            cx={cx}
            cy={cy}
            r={chamberR}
            fill="none"
            stroke={COLORS.white}
            strokeWidth="4.5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - calmT)}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            filter="url(#soft-glow)"
          />

          {/* Outer Rotating Dashed Halo */}
          <circle
            cx={cx}
            cy={cy}
            r={290}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="10 12"
            transform={`rotate(${frame * 0.12} ${cx} ${cy})`}
          />

          {/* Orbiting Noise Tags drifting outward and dissolving into silence */}
          {noiseTags.map((tag, i) => {
            const orbitR = 320 + calmT * 390;
            const a = tag.angle + frame * 0.016 * (1 - calmT * 0.65);
            const nx = cx + Math.cos(a) * orbitR;
            const ny = cy + Math.sin(a) * orbitR * 0.56;
            const op = Math.max(0, 0.9 - calmT * 0.92);
            return (
              <g key={i} transform={`translate(${nx}, ${ny})`} opacity={op}>
                <rect
                  x="-78"
                  y="-22"
                  width="156"
                  height="44"
                  rx="22"
                  fill="#0B0B10"
                  stroke="rgba(255,255,255,0.52)"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  fill={COLORS.softWhite}
                  fontFamily={FONT_FAMILY}
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="0.16em"
                >
                  {tag.label}
                </text>
              </g>
            );
          })}

          {/* Calm Protagonist centered in stillness */}
          <PawnCharacter
            x={cx}
            y={cy + 95}
            scale={1.08}
            glowIntensity={0.45 + calmT * 0.52}
            showFloorHalo
            haloProgress={0.5 + calmT * 0.5}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DELIBERATE BOREDOM" x={960} y={110} enterFrame={Math.round(fps * 0.4)} />

      <RollingCounter
        label="DELIBERATE SILENCE"
        value={hoursVal}
        suffix=" HRS"
        x={1820}
        y={158}
        fontSize={116}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="LET THE STATIC FADE."
        x={960}
        y={948}
        enterFrame={Math.round(durationInFrames * 0.66)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
