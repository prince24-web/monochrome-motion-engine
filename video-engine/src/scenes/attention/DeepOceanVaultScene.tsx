import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
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
  const cy = 610;

  // Camera: tight on top Airplane Mode switch snapping ON -> pan down to sealed dome & protagonist -> wide shield reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.5, x: 0, y: -250 },
    { t: 0.35, scale: 1.38, x: 0, y: 60 },
    { t: 0.7, scale: 1.24, x: 0, y: 55 },
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
          {/* Volumetric spotlight sealing over protagonist inside the vault */}
          <SpotlightCone
            topX={cx}
            topWidth={120}
            bottomX={cx}
            bottomY={cy + 145}
            bottomWidth={420}
            opacity={0.35 + toggleSpring * 0.55}
          />

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
            <text
              x="0"
              y="64"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="19"
              fontWeight="800"
              letterSpacing="0.18em"
            >
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

          <PawnCharacter
            x={cx}
            y={cy + 95}
            scale={1.02}
            glowIntensity={0.6 + toggleSpring * 0.35}
            showFloorHalo
            haloProgress={0.6 + toggleSpring * 0.4}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="LOCK THE HATCH" x={960} y={96} enterFrame={34} />

      <PunchlineCallout
        text="SEAL THE VAULT."
        subtext="DEFLECT EVERY EXTERNAL PING"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
