import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PromiseLedgerScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const repT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const promises = [
    'SHOWED UP ON TIME',
    'DELIVERED AS PROMISED',
    'OWNED MISTAKE FAST',
    'NO SHORTCUTS TAKEN',
    'PROTECTED THE CLIENT',
  ];

  // Camera: start close on top ledger rows -> glide down checklist -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.4, x: -110, y: -125 },
    { t: 0.42, scale: 1.32, x: -80, y: 35 },
    { t: 0.72, scale: 1.24, x: -40, y: 140 },
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
          {/* Minimalist Ledger Frame */}
          <rect
            x="440"
            y="245"
            width="820"
            height="585"
            rx="22"
            fill="#0A0A0E"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
          />

          {promises.map((p, idx) => {
            const threshold = idx / promises.length;
            const lit = repT >= threshold;
            const ry = 315 + idx * 102;
            return (
              <g key={p} transform={`translate(500, ${ry})`} opacity={lit ? 1 : 0.22}>
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill={lit ? COLORS.white : 'none'}
                  stroke={COLORS.white}
                  strokeWidth="2.5"
                  filter={lit ? 'url(#soft-glow)' : undefined}
                />
                {lit && (
                  <polyline
                    points="-8,1 -2,7 9,-6"
                    fill="none"
                    stroke={COLORS.bg}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}
                <text
                  x="44"
                  y="8"
                  fill={COLORS.white}
                  fontFamily={FONT_FAMILY}
                  fontSize="24"
                  fontWeight="700"
                  letterSpacing="0.12em"
                >
                  {p}
                </text>
              </g>
            );
          })}
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE CHARACTER LEDGER" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="KEPT PROMISES"
        value={Math.max(1, repT * 500)}
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="PROOF OVER PROMISES."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={60}
      />
    </div>
  );
};
