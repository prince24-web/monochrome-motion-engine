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

export const ScrollSlotMachineScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Rapid scrolling reels inside a towering minimalist wireframe smartphone
  const reelSpeed = 19;
  const phoneX = 485;
  const phoneY = 195;
  const phoneW = 325;
  const phoneH = 655;

  const stimuli = ['REEL', 'LIKE', 'PING', 'CLIP', 'NEWS', 'ALERT'];
  const drainT = clampedInterpolate(frame, [8, durationInFrames - 14], [0, 1], EASING.smoothInOut);
  const sensitivityPct = Math.round(100 - drainT * 78);

  // Camera: start tight on small protagonist beneath giant glowing phone -> pan right to pulsing brain -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.38, x: -340, y: 65 },
    { t: 0.34, scale: 1.28, x: -245, y: -35 },
    { t: 0.66, scale: 1.36, x: 355, y: 15 },
    { t: 0.88, scale: 1.0, x: 0, y: 0 },
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
          <defs>
            <clipPath id="phone-screen-clip">
              <rect
                x={phoneX + 18}
                y={phoneY + 46}
                width={phoneW - 36}
                height={phoneH - 92}
                rx="18"
              />
            </clipPath>
          </defs>

          {/* Angled Volumetric Glow Cone from Giant Phone Screen onto Protagonist */}
          <SpotlightCone
            topX={phoneX + 55}
            topWidth={165}
            bottomX={275}
            bottomY={935}
            bottomWidth={340}
            opacity={0.78}
          />

          {/* Small Protagonist Dwarfed by the Giant Glowing Smartphone */}
          <PawnCharacter
            x={275}
            y={915}
            scale={0.78}
            glowIntensity={0.62}
            showFloorHalo
            haloProgress={0.85}
            armPose="reachRight"
          />

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
              strokeWidth="4"
            />
            <line
              x1={phoneX + phoneW / 2 - 44}
              y1={phoneY + 24}
              x2={phoneX + phoneW / 2 + 44}
              y2={phoneY + 24}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Infinite Spinning Feed Cards inside Phone */}
          <g clipPath="url(#phone-screen-clip)">
            {Array.from({ length: 8 }, (_, i) => {
              const cardH = 114;
              const totalH = 8 * cardH;
              const cy =
                phoneY + 46 + (((i * cardH - frame * reelSpeed) % totalH) + totalH) % totalH - cardH;
              const label = stimuli[i % stimuli.length];
              return (
                <g key={i} transform={`translate(${phoneX + 30}, ${cy})`}>
                  <rect
                    x="0"
                    y="8"
                    width={phoneW - 60}
                    height={cardH - 16}
                    rx="14"
                    fill="rgba(255,255,255,0.09)"
                    stroke="rgba(255,255,255,0.56)"
                    strokeWidth="2.2"
                  />
                  <text
                    x={(phoneW - 60) / 2}
                    y={cardH / 2 + 8}
                    textAnchor="middle"
                    fill={COLORS.white}
                    fontFamily={FONT_FAMILY}
                    fontSize="25"
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
            y1="525"
            x2="1205"
            y2="525"
            stroke="rgba(255,255,255,0.48)"
            strokeWidth="3.5"
            strokeDasharray="10 12"
            strokeDashoffset={-frame * 10}
          />
          {[0, 1, 2, 3, 4, 5, 6].map((p) => {
            const prog = (frame * 0.052 + p / 7) % 1;
            const px = phoneX + phoneW + 24 + prog * (1195 - (phoneX + phoneW + 24));
            return (
              <circle
                key={p}
                cx={px}
                cy={525 + Math.sin(prog * Math.PI * 3.5) * 16}
                r="7.5"
                fill={COLORS.white}
                filter="url(#soft-glow)"
              />
            );
          })}

          {/* Right Side: Overstimulated Brain + Dropping Sensitivity Meter */}
          <g transform="translate(1390, 495)">
            <circle
              cx="0"
              cy="0"
              r={168 + Math.sin(frame * 0.42) * 20}
              fill="url(#hero-aura)"
              opacity="0.72"
            />
            <g filter="url(#soft-glow)">
              <path
                d="M -8 -94 C -60 -104 -104 -66 -98 -16 C -122 0 -118 52 -84 68 C -74 102 -24 104 -8 85 Z"
                fill="#0A0A0E"
                stroke={COLORS.white}
                strokeWidth="4.2"
              />
              <path
                d="M 8 -94 C 60 -104 104 -66 98 -16 C 122 0 118 52 84 68 C 74 102 24 104 8 85 Z"
                fill="#0A0A0E"
                stroke={COLORS.white}
                strokeWidth="4.2"
              />
            </g>

            {/* Sensitivity Bar dropping underneath */}
            <text
              x="0"
              y="172"
              textAnchor="middle"
              fill={COLORS.softWhite}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="800"
              letterSpacing="0.18em"
            >
              REWARD SENSITIVITY
            </text>
            <rect x="-165" y="194" width="330" height="24" rx="12" fill={COLORS.darkGrey} />
            <rect
              x="-165"
              y="194"
              width={Math.max(26, 330 * (1 - drainT * 0.78))}
              height="24"
              rx="12"
              fill={COLORS.white}
              filter="url(#soft-glow)"
            />
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="POCKET SLOT MACHINE" x={960} y={66} enterFrame={Math.round(fps * 0.4)} />

      <RollingCounter
        label="SENSITIVITY"
        value={sensitivityPct}
        suffix="%"
        x={1820}
        y={155}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="NOVELTY OVERLOAD."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
