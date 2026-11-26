import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

// Deterministic organic particle seeds (avoids rigid diagonal stripes)
const RAIN_PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const hash1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  const hash2 = Math.sin(i * 93.9898 + 19.133) * 24634.6345;
  const hash3 = Math.sin(i * 45.164 + 61.711) * 19283.4211;
  const frac1 = hash1 - Math.floor(hash1);
  const frac2 = hash2 - Math.floor(hash2);
  const frac3 = hash3 - Math.floor(hash3);
  return {
    baseX: 190 + frac1 * 1540,
    phase: frac2 * 420,
    speed: 3.4 + frac3 * 4.8,
    radius: 2.4 + frac2 * 3.1,
    swayAmp: 6 + frac1 * 12,
    swayFreq: 0.03 + frac3 * 0.04,
  };
});

export const ReceptorLockScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // 8 receptor sockets along a horizontal neural membrane; 6 of 8 slam shut sequentially
  const receptorCount = 8;
  const membraneY = 625;
  const startX = 285;
  const spacing = 192;

  // Shut left-most first so macro close-up camera catches the first 2 slamming shut up close
  const shutOrder = [0, 1, 3, 5, 6, 7];
  const firstShutFrame = 24;
  const stepF = Math.max(16, Math.floor((durationInFrames - 72) / shutOrder.length));

  const activeCount =
    receptorCount - shutOrder.filter((_, idx) => frame >= firstShutFrame + idx * stepF).length;

  // Camera: start macro 1.65x on receptors 0 & 1 slamming shut -> glide across membrane -> pull back 1.0x
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.65, x: -490, y: 75 },
    { t: 0.36, scale: 1.46, x: -60, y: 55 },
    { t: 0.72, scale: 1.0, x: 0, y: 0 },
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
          {/* Horizontal Neural Membrane Double Line */}
          <line
            x1="140"
            y1={membraneY}
            x2="1780"
            y2={membraneY}
            stroke="rgba(255,255,255,0.46)"
            strokeWidth="3.5"
          />
          <line
            x1="140"
            y1={membraneY + 18}
            x2="1780"
            y2={membraneY + 18}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />

          {/* Organic multi-speed neural stimulus rain */}
          {RAIN_PARTICLES.map((p, i) => {
            const fallSpan = 390;
            const fall = (frame * p.speed + p.phase) % fallSpan;
            const py = 205 + fall;
            const px = p.baseX + Math.sin(frame * p.swayFreq + i) * p.swayAmp;
            const fade = Math.sin((fall / fallSpan) * Math.PI);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={p.radius}
                fill={COLORS.white}
                opacity={0.18 + fade * 0.68}
              />
            );
          })}

          {/* 8 Receptor Sockets */}
          {Array.from({ length: receptorCount }, (_, idx) => {
            const cx = startX + idx * spacing;
            const shutIdx = shutOrder.indexOf(idx);
            const shutFrame = shutIdx >= 0 ? firstShutFrame + shutIdx * stepF : 99999;
            const isShut = frame >= shutFrame;
            const shutSpring = isShut
              ? spring({
                  frame: frame - shutFrame,
                  fps,
                  config: { damping: 12, stiffness: 220 },
                })
              : 0;
            const shockProgress = isShut
              ? clampedInterpolate(frame - shutFrame, [0, 20], [0, 1], EASING.expoOut)
              : 0;

            return (
              <g key={idx} transform={`translate(${cx}, ${membraneY})`}>
                {/* Impact shockwave ring when shutter slams */}
                {isShut && shockProgress < 0.99 && (
                  <circle
                    cx="0"
                    cy="-34"
                    r={24 + shockProgress * 58}
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth={3 * (1 - shockProgress)}
                    opacity={0.75 * (1 - shockProgress)}
                  />
                )}

                {/* Glowing open socket cup */}
                <path
                  d="M -38 -44 L -38 0 A 38 38 0 0 0 38 0 L 38 -44"
                  fill="#0B0B10"
                  stroke={isShut ? COLORS.dimGrey : COLORS.white}
                  strokeWidth="3.5"
                  filter={!isShut ? 'url(#soft-glow)' : undefined}
                />

                {/* Glowing core when open */}
                {!isShut && (
                  <circle
                    cx="0"
                    cy="-12"
                    r={14 + Math.sin(frame * 0.14 + idx) * 2}
                    fill={COLORS.white}
                    filter="url(#soft-glow)"
                  />
                )}

                {/* Crisp Shutter Shield slamming down when receptor shuts down */}
                {shutSpring > 0.01 && (
                  <g transform={`translate(0, ${-60 + shutSpring * 18})`} opacity={shutSpring}>
                    <rect
                      x="-46"
                      y="-12"
                      width="92"
                      height="24"
                      rx="6"
                      fill="#18181F"
                      stroke={COLORS.softWhite}
                      strokeWidth="2.6"
                    />
                    <line x1="-18" y1="0" x2="18" y2="0" stroke={COLORS.midGrey} strokeWidth="3.2" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Subtle Membrane Label */}
          <text
            x="960"
            y="745"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="21"
            fontWeight="700"
            letterSpacing="0.22em"
          >
            DOPAMINE RECEPTOR MEMBRANE
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="RECEPTORS SHUT DOWN" x={960} y={114} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="ACTIVE RECEPTORS"
        value={activeCount}
        suffix=" / 8"
        x={1820}
        y={158}
        fontSize={114}
        labelSize={19}
        align="right"
      />

      <PunchlineCallout
        text="6 OF 8 SHUT DOWN."
        subtext="BRAIN SELF-DEFENSE MODE"
        x={960}
        y={935}
        enterFrame={Math.round(durationInFrames * 0.68)}
        exitFrame={durationInFrames - 8}
        fontSize={64}
      />
    </div>
  );
};
