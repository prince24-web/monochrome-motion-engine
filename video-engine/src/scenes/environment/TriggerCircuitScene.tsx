import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TriggerCircuitScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const flowT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const nodes = [
    { label: 'VISUAL CUE', x: 420, thresh: 0.05 },
    { label: 'AUTOMATIC ROUTINE', x: 960, thresh: 0.45 },
    { label: 'REWARD', x: 1500, thresh: 0.8 },
  ];

  // Camera: start tight on VISUAL CUE -> glide across AUTOMATIC ROUTINE -> land on REWARD -> wide pull-back
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.46, x: -490, y: 10 },
    { t: 0.42, scale: 1.38, x: 0, y: 10 },
    { t: 0.72, scale: 1.42, x: 480, y: 10 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
    { t: 1.0, scale: 1.0, x: 0, y: 0 },
  ];

  const pulseX = 420 + flowT * 1080;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <CameraRig durationInFrames={durationInFrames} keyframes={cameraKeyframes}>
        <svg
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
        >
          {/* Circuit Wire */}
          <line x1="420" y1="545" x2="1500" y2="545" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
          <line
            x1="420"
            y1="545"
            x2={pulseX}
            y2="545"
            stroke={COLORS.white}
            strokeWidth="6"
            filter="url(#soft-glow)"
          />

          {/* Travelling Signal Head */}
          <circle cx={pulseX} cy="545" r="42" fill="url(#hero-aura)" opacity="0.85" />
          <circle cx={pulseX} cy="545" r="9" fill={COLORS.white} filter="url(#soft-glow)" />

          {nodes.map((n) => {
            const lit = flowT >= n.thresh;
            return (
              <g key={n.label} transform={`translate(${n.x}, 545)`}>
                <rect
                  x="-150"
                  y="-56"
                  width="300"
                  height="112"
                  rx="18"
                  fill={lit ? 'rgba(255,255,255,0.16)' : '#0B0B10'}
                  stroke={lit ? COLORS.white : COLORS.dimGrey}
                  strokeWidth={lit ? 4 : 2.5}
                  filter={lit ? 'url(#soft-glow)' : undefined}
                />
                <text
                  x="0"
                  y="9"
                  textAnchor="middle"
                  fill={lit ? COLORS.white : COLORS.midGrey}
                  fontFamily={FONT_FAMILY}
                  fontSize="22"
                  fontWeight="800"
                  letterSpacing="0.12em"
                >
                  {n.label}
                </text>
              </g>
            );
          })}

          <text
            x="960"
            y="740"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            CHANGE THE CUE → REWIRE THE ENTIRE CIRCUIT
          </text>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="THE VISUAL CIRCUIT" x={960} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="REWIRE THE CUE."
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
