import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PingHarpoonScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Ping hits at 35% of scene -> violently yanks diving bell from y=790 straight back up to y=290!
  const pingFrame = Math.round(durationInFrames * 0.32);
  const yankSpring =
    frame >= pingFrame
      ? spring({
          frame: frame - pingFrame,
          fps,
          config: { damping: 13, stiffness: 120, mass: 0.9 },
        })
      : 0;

  const bellY = 790 - yankSpring * 490;
  const pingWave = frame >= pingFrame ? clampedInterpolate(frame - pingFrame, [0, 32], [0, 1], EASING.expoOut) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Surface & Deep lines */}
        <line x1="220" y1="290" x2="1700" y2="290" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeDasharray="10 10" />
        <line x1="220" y1="810" x2="1700" y2="810" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="10 10" />

        {/* Notification Bell Icon at Surface */}
        <g transform="translate(960, 210)" filter="url(#soft-glow)">
          {pingWave > 0.01 && pingWave < 0.98 && (
            <circle cx="0" cy="0" r={36 + pingWave * 160} fill="none" stroke={COLORS.white} strokeWidth="3" opacity={1 - pingWave} />
          )}
          <rect x="-76" y="-26" width="152" height="52" rx="26" fill={frame >= pingFrame ? COLORS.white : '#0B0B10'} stroke={COLORS.white} strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" fill={frame >= pingFrame ? COLORS.bg : COLORS.white} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="900" letterSpacing="0.14em">
            1 PING
          </text>
        </g>

        {/* Winch Cable Yanking Bell Up */}
        <line x1="960" y1="238" x2="960" y2={bellY - 56} stroke={COLORS.white} strokeWidth="4" filter="url(#soft-glow)" />

        {/* Diving Bell */}
        <g transform={`translate(960, ${bellY})`} filter="url(#soft-glow)">
          <path d="M -52 44 L -52 -12 A 52 52 0 0 1 52 -12 L 52 44 Z" fill="#0A0A0E" stroke={COLORS.white} strokeWidth="3.5" />
          <circle cx="0" cy="-4" r="18" fill="none" stroke={COLORS.white} strokeWidth="2.8" />
        </g>

        <text x="960" y="920" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="700" letterSpacing="0.18em">
          5-SECOND CHECK → BACK TO ZERO DEPTH
        </text>
      </svg>

      <PillBadge text="INSTANT RESET" x={960} y={118} enterFrame={pingFrame + 4} />
    </div>
  );
};
