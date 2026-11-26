import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const DeepOceanVaultScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Airplane mode toggle snaps ON at frame 30 -> protective shield seals out pings!
  const toggleOn = frame >= 30;
  const toggleSpring = toggleOn
    ? spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 190 } })
    : 0;

  const cx = 960;
  const cy = 620;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Top Airplane-Mode Toggle Switch */}
        <g transform="translate(960, 265)">
          <rect
            x="-76"
            y="-34"
            width="152"
            height="68"
            rx="34"
            fill={toggleOn ? 'rgba(255,255,255,0.22)' : '#0B0B10'}
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter={toggleOn ? 'url(#soft-glow)' : undefined}
          />
          <circle cx={-40 + toggleSpring * 80} cy="0" r="24" fill={COLORS.white} />
          <text x="0" y="64" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="800" letterSpacing="0.18em">
            AIRPLANE MODE: {toggleOn ? 'ON' : 'OFF'}
          </text>
        </g>

        {/* Protective Shield Dome */}
        <circle
          cx={cx}
          cy={cy}
          r="210"
          fill="#09090D"
          stroke={COLORS.white}
          strokeWidth={toggleOn ? 4 : 2}
          opacity={0.35 + toggleSpring * 0.65}
          filter={toggleOn ? 'url(#soft-glow)' : undefined}
        />

        {/* Bouncing External Notification Pings Deflected Off Shield */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2 + 0.35;
          const bounce = Math.abs(Math.sin(frame * 0.08 + i)) * 90;
          const dist = 245 + bounce;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          return (
            <g key={i} transform={`translate(${px}, ${py})`} opacity="0.45">
              <circle cx="0" cy="0" r="14" fill="#0A0A0E" stroke={COLORS.softWhite} strokeWidth="2" />
              <line x1="-5" y1="-5" x2="5" y2="5" stroke={COLORS.softWhite} strokeWidth="2" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke={COLORS.softWhite} strokeWidth="2" />
            </g>
          );
        })}

        <PawnCharacter x={cx} y={cy + 95} scale={1.02} glowIntensity={0.85} showFloorHalo haloProgress={1} />
      </svg>

      <PillBadge text="LOCK THE HATCH" x={cx} y={136} enterFrame={34} />
    </div>
  );
};
