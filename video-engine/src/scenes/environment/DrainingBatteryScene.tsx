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

export const DrainingBatteryScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const drainT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const pct = 100 - drainT * 96;
  const hour = Math.round(8 + drainT * 7); // 8 AM -> 3 PM
  const timeLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

  const bx = 560;
  const by = 415;
  const bw = 920;
  const bh = 250;

  // Camera: start tight on full battery right side -> track draining edge leftward -> pull back on depleted hero
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.42, x: 320, y: 15 },
    { t: 0.42, scale: 1.32, x: 20, y: 15 },
    { t: 0.72, scale: 1.38, x: -340, y: 40 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  const heroGlow = 0.85 - drainT * 0.48;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Volumetric spotlight dimming as willpower drains */}
          <SpotlightCone
            topX={325}
            topWidth={95}
            bottomX={325}
            bottomY={760}
            bottomWidth={290}
            opacity={0.35 + heroGlow * 0.55}
          />

          {/* Recurring Protagonist feeling willpower drain away */}
          <PawnCharacter
            x={325}
            y={715}
            scale={0.94}
            glowIntensity={heroGlow}
            showFloorHalo
            haloProgress={0.85}
          />

          {/* Battery Shell + Positive Terminal */}
          <rect
            x={bx}
            y={by}
            width={bw}
            height={bh}
            rx="26"
            fill="#0A0A0E"
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />
          <rect x={bx + bw} y={by + 78} width="32" height="94" rx="8" fill={COLORS.white} />

          {/* Draining Charge Fill */}
          <rect
            x={bx + 18}
            y={by + 18}
            width={Math.max(16, (bw - 36) * (pct / 100))}
            height={bh - 36}
            rx="14"
            fill="rgba(255,255,255,0.78)"
            filter="url(#soft-glow)"
          />

          <text
            x={bx + bw / 2}
            y="755"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="26"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            TIME OF DAY: {timeLabel}
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="DIES BY 3 PM" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="WILLPOWER BATTERY"
        value={pct}
        suffix="%"
        x={1820}
        y={158}
        fontSize={120}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="WILLPOWER ALWAYS DRAINS."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={58}
      />
    </div>
  );
};
