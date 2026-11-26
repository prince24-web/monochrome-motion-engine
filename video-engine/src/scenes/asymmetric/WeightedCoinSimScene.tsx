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

export const WeightedCoinSimScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // 16 flips: mostly -1 losses, with 3 huge +20 wins!
  const flips = [-1, -1, -1, -1, 20, -1, -1, -1, -1, -1, 20, -1, -1, -1, 20, -1];
  const progress = clampedInterpolate(
    frame,
    [6, durationInFrames - 12],
    [0, flips.length],
    EASING.smoothInOut
  );
  const count = Math.floor(progress);
  const frac = progress - count;

  const leftX = 360;
  const rightX = 1720;
  const zeroY = 770;

  let equity = 0;
  const pts: string[] = [`${leftX},${zeroY}`];
  let headX = leftX;
  let headY = zeroY;

  for (let i = 0; i < count; i++) {
    equity += flips[i];
    headX = leftX + ((i + 1) / flips.length) * (rightX - leftX);
    headY = zeroY - equity * 9.5;
    pts.push(`${headX.toFixed(1)},${headY.toFixed(1)}`);
  }

  // Smooth fractional segment so line never stutters between steps
  if (count < flips.length && frac > 0.001) {
    const nextEq = equity + flips[count] * frac;
    headX = leftX + ((count + frac) / flips.length) * (rightX - leftX);
    headY = zeroY - nextEq * 9.5;
    pts.push(`${headX.toFixed(1)},${headY.toFixed(1)}`);
  }

  // Camera: start on protagonist & early -1 losses -> follow +20 jumps upward -> wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -420, y: 175 },
    { t: 0.36, scale: 1.32, x: -90, y: 80 },
    { t: 0.68, scale: 1.28, x: 310, y: -95 },
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
          <SpotlightCone
            topX={235}
            topWidth={95}
            bottomX={235}
            bottomY={860}
            bottomWidth={290}
            opacity={0.68}
          />

          <line
            x1={leftX}
            y1={zeroY}
            x2={rightX}
            y2={zeroY}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="2.5"
            strokeDasharray="10 10"
          />

          {pts.length > 1 && (
            <polyline
              points={pts.join(' ')}
              fill="none"
              stroke={COLORS.white}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#soft-glow)"
            />
          )}

          {/* Glowing trace head */}
          <circle cx={headX} cy={headY} r="38" fill="url(#hero-aura)" opacity="0.9" />
          <circle cx={headX} cy={headY} r="8.5" fill={COLORS.white} filter="url(#soft-glow)" />

          <text
            x={leftX + 10}
            y={zeroY + 42}
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            TAILS: -$1 · HEADS: +$20
          </text>

          {/* Recurring Protagonist watching the weighted payoff climb */}
          <PawnCharacter
            x={235}
            y={825}
            scale={0.9}
            glowIntensity={0.82}
            showFloorHalo
            haloProgress={0.85}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="WEIGHTED PAYOFFS" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="NET PROFIT"
        prefix="$"
        showPlusSign
        value={equity}
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="PAYOFF BEATS WIN RATE."
        subtext="13 LOSSES STILL WINS BIG"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
