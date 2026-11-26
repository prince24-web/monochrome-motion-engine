import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ScrollSlotMachineScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Rapid scrolling reels inside a minimalist wireframe smartphone
  const reelSpeed = 16;
  const phoneX = 480;
  const phoneY = 230;
  const phoneW = 310;
  const phoneH = 610;

  const stimuli = ['REEL', 'LIKE', 'PING', 'CLIP', 'NEWS', 'ALERT'];
  const drainT = clampedInterpolate(frame, [10, durationInFrames - 16], [0, 1], EASING.smoothInOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <defs>
          <clipPath id="phone-screen-clip">
            <rect x={phoneX + 18} y={phoneY + 46} width={phoneW - 36} height={phoneH - 92} rx="18" />
          </clipPath>
        </defs>

        {/* Wireframe Smartphone Slot Machine */}
        <g filter="url(#soft-glow)">
          <rect
            x={phoneX}
            y={phoneY}
            width={phoneW}
            height={phoneH}
            rx="42"
            fill="#0A0A0E"
            stroke={COLORS.white}
            strokeWidth="3.5"
          />
          <line
            x1={phoneX + phoneW / 2 - 42}
            y1={phoneY + 24}
            x2={phoneX + phoneW / 2 + 42}
            y2={phoneY + 24}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Infinite Spinning Feed Cards inside Phone */}
        <g clipPath="url(#phone-screen-clip)">
          {Array.from({ length: 8 }, (_, i) => {
            const cardH = 110;
            const totalH = 8 * cardH;
            const cy = phoneY + 46 + (((i * cardH - frame * reelSpeed) % totalH) + totalH) % totalH - cardH;
            const label = stimuli[i % stimuli.length];
            return (
              <g key={i} transform={`translate(${phoneX + 30}, ${cy})`}>
                <rect
                  x="0"
                  y="8"
                  width={phoneW - 60}
                  height={cardH - 16}
                  rx="14"
                  fill="rgba(255,255,255,0.08)"
                  stroke="rgba(255,255,255,0.52)"
                  strokeWidth="2"
                />
                <text
                  x={(phoneW - 60) / 2}
                  y={cardH / 2 + 7}
                  textAnchor="middle"
                  fill={COLORS.white}
                  fontFamily={FONT_FAMILY}
                  fontSize="24"
                  fontWeight="800"
                  letterSpacing="0.18em"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Rapid Pulse Stream from Phone -> Brain */}
        <line
          x1={phoneX + phoneW + 18}
          y1="535"
          x2="1150"
          y2="535"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="3"
          strokeDasharray="10 12"
          strokeDashoffset={-frame * 8}
        />
        {[0, 1, 2, 3, 4].map((p) => {
          const prog = ((frame * 0.045 + p * 0.2) % 1);
          const px = phoneX + phoneW + 24 + prog * (1140 - (phoneX + phoneW + 24));
          return (
            <circle
              key={p}
              cx={px}
              cy={535 + Math.sin(prog * Math.PI * 3) * 14}
              r="7"
              fill={COLORS.white}
              filter="url(#soft-glow)"
            />
          );
        })}

        {/* Right Side: Overstimulated Brain + Dropping Sensitivity Meter */}
        <g transform="translate(1335, 495)">
          <circle cx="0" cy="0" r={160 + Math.sin(frame * 0.35) * 16} fill="url(#hero-aura)" opacity="0.65" />
          <g filter="url(#soft-glow)">
            <path
              d="M -8 -90 C -58 -100 -100 -64 -94 -16 C -118 0 -114 50 -82 66 C -72 98 -24 100 -8 82 Z"
              fill="#0A0A0E"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <path
              d="M 8 -90 C 58 -100 100 -64 94 -16 C 118 0 114 50 82 66 C 72 98 24 100 8 82 Z"
              fill="#0A0A0E"
              stroke={COLORS.white}
              strokeWidth="4"
            />
          </g>

          {/* Sensitivity Bar dropping underneath */}
          <text
            x="0"
            y="165"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            REWARD SENSITIVITY
          </text>
          <rect x="-150" y="185" width="300" height="22" rx="11" fill={COLORS.darkGrey} />
          <rect
            x="-150"
            y="185"
            width={Math.max(24, 300 * (1 - drainT * 0.78))}
            height="22"
            rx="11"
            fill={COLORS.white}
            filter="url(#soft-glow)"
          />
        </g>
      </svg>

      <PillBadge text="POCKET SLOT MACHINE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
