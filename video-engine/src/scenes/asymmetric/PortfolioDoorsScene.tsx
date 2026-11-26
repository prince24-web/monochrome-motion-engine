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

export const PortfolioDoorsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const doors = [
    { label: 'BET 1', result: '-$1', val: -1, win: false },
    { label: 'BET 2', result: '-$1', val: -1, win: false },
    { label: 'BET 3', result: '-$1', val: -1, win: false },
    { label: 'BET 4', result: '+$100', val: 100, win: true },
    { label: 'BET 5', result: '-$1', val: -1, win: false },
  ];

  const doorW = 235;
  const doorH = 390;
  const gap = 56;
  const startX = (VIDEO_CONFIG.width - (5 * doorW + 4 * gap)) / 2;
  const doorY = 305;
  const sweepT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const stepF = Math.max(12, Math.floor((durationInFrames - 36) / 5));

  // Calculate cumulative net payoff as doors open
  let netVal = 0;
  doors.forEach((d, i) => {
    const openF = 8 + i * stepF;
    if (frame >= openF) {
      const openT = clampedInterpolate(frame - openF, [0, 18], [0, 1], EASING.smoothOut);
      netVal += d.val * openT;
    }
  });

  // Protagonist glides along the row of doors
  const heroX = startX + doorW / 2 + sweepT * (4 * (doorW + gap));

  // Camera: track left bets -> punch into BET 4 (+$100) jackpot -> wide reveal of all 5 doors
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: -460, y: 10 },
    { t: 0.36, scale: 1.32, x: -120, y: 5 },
    { t: 0.68, scale: 1.46, x: 290, y: -10 },
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
          {/* Tracking Volumetric Spotlight over protagonist */}
          <SpotlightCone
            topX={heroX}
            topWidth={110}
            bottomX={heroX}
            bottomY={895}
            bottomWidth={340}
            opacity={0.72}
          />

          {doors.map((d, i) => {
            const openF = 8 + i * stepF;
            const opened = frame >= openF;
            const openT = opened
              ? clampedInterpolate(frame - openF, [0, 22], [0, 1], EASING.smoothOut)
              : 0;
            const x = startX + i * (doorW + gap);
            return (
              <g key={d.label} transform={`translate(${x}, ${doorY})`}>
                {d.win && opened && (
                  <circle
                    cx={doorW / 2}
                    cy={doorH / 2}
                    r="240"
                    fill="url(#hero-aura)"
                    opacity={openT * 0.95}
                  />
                )}
                <rect
                  x="0"
                  y="0"
                  width={doorW}
                  height={doorH}
                  rx="14"
                  fill={d.win && opened ? COLORS.white : '#0A0A0E'}
                  stroke={d.win && opened ? COLORS.white : 'rgba(255,255,255,0.45)'}
                  strokeWidth={d.win && opened ? 4 : 2.5}
                  filter={d.win && opened ? 'url(#strong-glow)' : undefined}
                />
                <text
                  x={doorW / 2}
                  y={doorH / 2 + 12}
                  textAnchor="middle"
                  fill={d.win && opened ? COLORS.bg : COLORS.midGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize={d.win && opened ? '46' : '30'}
                  fontWeight="900"
                  opacity={openT}
                >
                  {d.result}
                </text>
                <text
                  x={doorW / 2}
                  y={doorH + 42}
                  textAnchor="middle"
                  fill={d.win && opened ? COLORS.white : COLORS.midGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize="20"
                  fontWeight="700"
                  letterSpacing="0.16em"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Recurring Protagonist testing each door */}
          <PawnCharacter
            x={heroX}
            y={875}
            scale={0.78}
            glowIntensity={0.82}
            showFloorHalo
            haloProgress={0.78}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="ONE DOOR PAYS FOR ALL" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="NET PORTFOLIO"
        value={netVal}
        prefix="$"
        showPlusSign
        x={1820}
        y={158}
        fontSize={114}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="ONE WIN PAYS ALL."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
