import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ReceptorLockScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // 8 receptor sockets along a curved neural membrane; 6 of 8 shutter closed sequentially
  const receptorCount = 8;
  const membraneY = 635;
  const startX = 285;
  const spacing = 192;

  const shutOrder = [0, 7, 2, 5, 1, 6]; // 6 receptors shut down, leaving only 2 dim ones open
  const stepF = Math.max(18, Math.floor((durationInFrames - 70) / shutOrder.length));

  const activeCount = receptorCount - shutOrder.filter((_, idx) => frame >= 30 + idx * stepF).length;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Horizontal Neural Membrane Double Line */}
        <line x1="150" y1={membraneY} x2="1770" y2={membraneY} stroke="rgba(255,255,255,0.42)" strokeWidth="3.5" />
        <line x1="150" y1={membraneY + 18} x2="1770" y2={membraneY + 18} stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        {/* Flooding signal particles raining down from above */}
        {Array.from({ length: 24 }, (_, i) => {
          const rx = 220 + ((i * 67) % 1480);
          const fall = ((frame * 5.5 + i * 37) % 360);
          const py = 240 + fall;
          return (
            <circle
              key={i}
              cx={rx}
              cy={py}
              r="4.2"
              fill={COLORS.white}
              opacity={0.22 + (1 - fall / 360) * 0.55}
            />
          );
        })}

        {/* 8 Receptor Sockets */}
        {Array.from({ length: receptorCount }, (_, idx) => {
          const cx = startX + idx * spacing;
          const shutIdx = shutOrder.indexOf(idx);
          const shutFrame = shutIdx >= 0 ? 30 + shutIdx * stepF : 99999;
          const isShut = frame >= shutFrame;
          const shutSpring = isShut
            ? spring({
                frame: frame - shutFrame,
                fps,
                config: { damping: 14, stiffness: 190 },
              })
            : 0;

          return (
            <g key={idx} transform={`translate(${cx}, ${membraneY})`}>
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
                <circle cx="0" cy="-12" r="14" fill={COLORS.white} filter="url(#soft-glow)" />
              )}

              {/* Crisp Shutter Shield slamming down when receptor shuts down */}
              {shutSpring > 0.01 && (
                <g transform={`translate(0, ${-56 + shutSpring * 14})`} opacity={shutSpring}>
                  <rect
                    x="-46"
                    y="-12"
                    width="92"
                    height="22"
                    rx="6"
                    fill="#18181F"
                    stroke={COLORS.softWhite}
                    strokeWidth="2.5"
                  />
                  <line x1="-18" y1="-1" x2="18" y2="-1" stroke={COLORS.midGrey} strokeWidth="3" />
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom Status Caption */}
        <text
          x="960"
          y="785"
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="26"
          fontWeight="800"
          letterSpacing="0.18em"
        >
          ACTIVE RECEPTORS: {activeCount} / {receptorCount}
        </text>
      </svg>

      <PillBadge text="RECEPTORS SHUT DOWN" x={960} y={146} enterFrame={Math.round(fps * 1.1)} />
    </div>
  );
};
