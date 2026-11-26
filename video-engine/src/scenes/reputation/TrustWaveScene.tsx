import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKeyframe, CameraRig } from '../../components/CameraRig';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { PunchlineCallout } from '../../components/PunchlineCallout';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const TrustWaveScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const cx = 960;
  const cy = 545;
  const waveT = clampedInterpolate(frame, [6, durationInFrames - 12], [0, 1], EASING.smoothInOut);
  const waveR = 40 + waveT * 620;

  const peers = [
    { x: 520, y: 405 },
    { x: 1400, y: 405 },
    { x: 460, y: 675 },
    { x: 1460, y: 675 },
    { x: 690, y: 325 },
    { x: 1230, y: 325 },
    { x: 710, y: 765 },
    { x: 1210, y: 765 },
  ];

  // Camera: start tight on protagonist emitting trust wave -> pull out as peers light up -> wide shot
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.48, x: 0, y: 20 },
    { t: 0.42, scale: 1.24, x: 0, y: 5 },
    { t: 0.78, scale: 1.0, x: 0, y: 0 },
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
          <SpotlightCone
            topX={cx}
            topWidth={120}
            bottomX={cx}
            bottomY={cy + 210}
            bottomWidth={420}
            opacity={0.78}
          />

          {[0, 140, 280].map((off, i) => {
            const r = Math.max(0, waveR - off);
            if (r <= 5) return null;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={COLORS.white}
                strokeWidth={i === 0 ? 3.5 : 2}
                opacity={Math.max(0, 1 - r / 680) * 0.75}
              />
            );
          })}

          {peers.map((p, i) => {
            const dist = Math.hypot(p.x - cx, p.y - cy);
            const lit = waveR >= dist;
            return (
              <g
                key={i}
                transform={`translate(${p.x}, ${p.y})`}
                opacity={lit ? 1 : 0.24}
                filter={lit ? 'url(#soft-glow)' : undefined}
              >
                <circle cx="0" cy="-22" r="13" fill={COLORS.white} />
                <path d="M -14 -4 Q 0 -9 14 -4 L 22 32 L -22 32 Z" fill={COLORS.softWhite} />
              </g>
            );
          })}

          <PawnCharacter
            x={cx}
            y={cy + 75}
            scale={0.96}
            glowIntensity={0.95}
            showFloorHalo
            haloProgress={0.8 + waveT * 0.2}
          />
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="FRICTION DISAPPEARS" x={cx} y={88} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ZERO FRICTION."
        subtext="HIGH TRUST ACCELERATES EVERYTHING"
        x={cx}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
