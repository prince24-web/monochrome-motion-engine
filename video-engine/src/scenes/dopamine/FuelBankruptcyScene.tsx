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

export const FuelBankruptcyScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Reserve plunges continuously from +80% -> -60% (into DEBT)
  const drainT = clampedInterpolate(frame, [8, durationInFrames - 14], [0, 1], EASING.smoothInOut);
  const reserveVal = 80 - drainT * 140;

  const tankX = 490;
  const tankW = 240;
  const zeroY = 565;
  const topY = 250;
  const botY = 855;

  const posFillH = reserveVal > 0 ? (reserveVal / 100) * (zeroY - topY) : 0;
  const negFillH = reserveVal < 0 ? (Math.abs(reserveVal) / 100) * (botY - zeroY) : 0;

  const tasks = ['DEEP WORK', 'READING', 'BUILDING', 'EXERCISE'];

  // Camera: establish -> push in 1.32x on tank crossing 0% into DEBT ZONE -> pan right to dimming habits -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.06, x: -120, y: 0 },
    { t: 0.44, scale: 1.32, x: -240, y: 115 },
    { t: 0.74, scale: 1.14, x: 185, y: 15 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  // Pulse hero counter right as balance crosses 0%
  const zeroCrossFrame = Math.round(durationInFrames * 0.52);
  const zeroPulse =
    frame >= zeroCrossFrame
      ? 1 +
        0.13 *
          Math.exp(-(frame - zeroCrossFrame) * 0.09) *
          Math.sin((frame - zeroCrossFrame) * 0.38)
      : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Fading Spotlight Cone over Protagonist as Reserve Drains */}
          <SpotlightCone
            topX={245}
            topWidth={100}
            bottomX={245}
            bottomY={925}
            bottomWidth={310}
            opacity={0.85 - drainT * 0.58}
          />

          {/* Protagonist Dimming & Slightly Shrinking Beside the Draining Tank */}
          <PawnCharacter
            x={245}
            y={895}
            scale={0.96 - drainT * 0.1}
            opacity={0.95 - drainT * 0.25}
            glowIntensity={0.78 - drainT * 0.56}
            showFloorHalo
            haloProgress={1 - drainT * 0.55}
          />

          {/* Upper Tank (+0% to +100%) */}
          <rect
            x={tankX}
            y={topY}
            width={tankW}
            height={zeroY - topY}
            rx="16"
            fill="#0A0A0E"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          {posFillH > 2 && (
            <rect
              x={tankX + 12}
              y={zeroY - posFillH}
              width={tankW - 24}
              height={posFillH}
              rx="8"
              fill="rgba(255,255,255,0.7)"
              filter="url(#soft-glow)"
            />
          )}

          {/* Zero Divider Line */}
          <line
            x1={tankX - 44}
            y1={zeroY}
            x2={tankX + tankW + 44}
            y2={zeroY}
            stroke={COLORS.white}
            strokeWidth="3.5"
            strokeDasharray="8 8"
          />
          <text
            x={tankX - 58}
            y={zeroY + 7}
            textAnchor="end"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="800"
          >
            0%
          </text>

          {/* Lower Dashed Debt Tank (0% to -100%) */}
          <rect
            x={tankX}
            y={zeroY}
            width={tankW}
            height={botY - zeroY}
            rx="16"
            fill="#08080C"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="2.5"
            strokeDasharray="10 10"
          />
          {negFillH > 2 && (
            <rect
              x={tankX + 12}
              y={zeroY + 4}
              width={tankW - 24}
              height={negFillH}
              rx="8"
              fill="rgba(255,255,255,0.18)"
              stroke={COLORS.white}
              strokeWidth="2.2"
            />
          )}
          <text
            x={tankX + tankW / 2}
            y={botY + 42}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            MOTIVATION RESERVE
          </text>

          {/* Right Side: Everyday Tasks Starving & Locking Out One by One */}
          <g transform="translate(1030, 380)">
            <text
              x="0"
              y="-32"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              REAL-LIFE HABITS (STARVED)
            </text>
            {tasks.map((task, idx) => {
              const ty = idx * 105;
              const starvesAt = 0.25 + idx * 0.16;
              const isStarved = drainT > starvesAt;
              const dimOp = isStarved ? 0.28 : 0.85;
              return (
                <g key={task} transform={`translate(0, ${ty})`} opacity={dimOp}>
                  <rect
                    x="0"
                    y="0"
                    width="540"
                    height="74"
                    rx="14"
                    fill="#0A0A0E"
                    stroke={isStarved ? COLORS.dimGrey : COLORS.white}
                    strokeWidth="2.2"
                  />
                  <circle
                    cx="40"
                    cy="37"
                    r="11"
                    fill={isStarved ? 'none' : COLORS.white}
                    stroke={isStarved ? COLORS.midGrey : COLORS.white}
                    strokeWidth="2.5"
                  />
                  {isStarved && (
                    <g stroke={COLORS.midGrey} strokeWidth="2.5" strokeLinecap="round">
                      <line x1="35" y1="32" x2="45" y2="42" />
                      <line x1="45" y1="32" x2="35" y2="42" />
                    </g>
                  )}
                  <text
                    x="74"
                    y="45"
                    fill={isStarved ? COLORS.midGrey : COLORS.white}
                    fontFamily={FONT_FAMILY}
                    fontSize="24"
                    fontWeight="700"
                    letterSpacing="0.12em"
                  >
                    {task}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="STARTING IN DEBT" x={960} y={112} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="STARTING BALANCE"
        value={reserveVal}
        showPlusSign
        suffix="%"
        x={1820}
        y={162}
        fontSize={124}
        labelSize={20}
        align="right"
        scalePulse={zeroPulse}
      />

      <PunchlineCallout
        text="STARTING AT -60%."
        x={960}
        y={952}
        enterFrame={Math.round(durationInFrames * 0.68)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
