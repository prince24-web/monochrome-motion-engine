import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

function buildGearPath(teeth: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  const total = teeth * 4;
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2;
    const phase = i % 4;
    const r = phase === 1 || phase === 2 ? outerR : innerR;
    pts.push(`${(Math.cos(angle) * r).toFixed(1)},${(Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
}

export const SleepClockFactoryScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Orbital moon arc across top sky
  const nightT = clampedInterpolate(frame, [0, durationInFrames], [0, 1], EASING.smoothInOut);
  const arcAngle = Math.PI + nightT * Math.PI; // Left to right across upper arc
  const moonX = 960 + Math.cos(arcAngle) * 520;
  const moonY = 395 + Math.sin(arcAngle) * 205;

  // Overnight revenue climbs continuously while gears spin
  const overnightRev = clampedInterpolate(frame, [8, durationInFrames - 12], [0, 4820], EASING.smoothInOut);

  // 3 mathematically meshed gear paths (12 teeth, 8 teeth, 10 teeth)
  const gear1Path = buildGearPath(12, 108, 86);
  const gear2Path = buildGearPath(8, 76, 58);
  const gear3Path = buildGearPath(10, 92, 72);

  const g1Rot = frame * 1.1;
  const g2Rot = -frame * (1.1 * (12 / 8)) + 22;
  const g3Rot = frame * (1.1 * (12 / 10)) + 10;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Top Dashed Orbital Night Sky Arc */}
        <path
          d="M 440 395 A 520 205 0 0 1 1480 395"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2.5"
          strokeDasharray="8 12"
        />

        {/* Glowing Crescent Moon gliding along the night arc */}
        <g transform={`translate(${moonX}, ${moonY})`} filter="url(#soft-glow)">
          <circle cx="0" cy="0" r="64" fill="url(#hero-aura)" opacity="0.65" />
          <path
            d="M 10 -26 A 26 26 0 1 0 10 26 A 20 20 0 1 1 10 -26 Z"
            fill={COLORS.white}
          />
        </g>

        {/* Center divider */}
        <line
          x1="960"
          y1="380"
          x2="960"
          y2="920"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          strokeDasharray="8 10"
        />

        {/* LEFT SIDE: SLEEPING PROTAGONIST ("0 HRS ACTIVE") */}
        <g transform="translate(500, 765)">
          {/* Soft dark pillow / resting platform */}
          <line x1="-180" y1="22" x2="180" y2="22" stroke="rgba(255,255,255,0.38)" strokeWidth="3" />
          {/* Horizontal resting pawn silhouette */}
          <g opacity="0.72">
            <circle cx="-105" cy="-16" r="24" fill={COLORS.softWhite} />
            <rect x="-70" y="-36" width="165" height="44" rx="22" fill={COLORS.softWhite} />
          </g>
          {/* Floating Zzz breathing animation */}
          {[0, 1, 2].map((i) => {
            const zPhase = ((frame * 0.018 + i * 0.33) % 1);
            const zx = -78 + zPhase * 55;
            const zy = -64 - zPhase * 95;
            const zOp = Math.sin(zPhase * Math.PI) * 0.85;
            return (
              <text
                key={i}
                x={zx}
                y={zy}
                fill={COLORS.white}
                fontFamily={FONT_FAMILY}
                fontSize={22 + i * 7}
                fontWeight="800"
                opacity={zOp}
              >
                Z
              </text>
            );
          })}
          <text
            x="0"
            y="74"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            YOU: ASLEEP
          </text>
        </g>

        {/* RIGHT SIDE: INTERLOCKING AUTOMATED GEARS ("SYSTEM: 24/7") */}
        <g transform="translate(1410, 680)">
          <circle cx="0" cy="-20" r="230" fill="url(#hero-aura)" opacity="0.42" />

          {/* Gear 1 (Large left-center) */}
          <g transform={`translate(-92, 12) rotate(${g1Rot})`} filter="url(#soft-glow)">
            <path d={gear1Path} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3" />
            <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" />
          </g>

          {/* Gear 2 (Small upper-right meshed) */}
          <g transform={`translate(56, -78) rotate(${g2Rot})`} filter="url(#soft-glow)">
            <path d={gear2Path} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" />
          </g>

          {/* Gear 3 (Medium lower-right meshed) */}
          <g transform={`translate(95, 76) rotate(${g3Rot})`} filter="url(#soft-glow)">
            <path d={gear3Path} fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3" />
            <circle cx="0" cy="0" r="26" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" />
          </g>

          <text
            x="0"
            y="220"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            YOUR SYSTEM: RUNNING 24/7
          </text>
        </g>
      </svg>

      {/* Overnight revenue counter */}
      <RollingCounter
        label="OVERNIGHT REVENUE"
        prefix="$"
        value={overnightRev}
        x={1410}
        y={425}
        fontSize={74}
        labelSize={19}
      />

      <PillBadge text="DECOUPLED FROM TIME" x={960} y={136} enterFrame={Math.round(fps * 0.6)} />
    </div>
  );
};
