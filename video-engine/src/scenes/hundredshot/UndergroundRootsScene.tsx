import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
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

export const UndergroundRootsScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const surfaceY = 440;
  const cx = 960;

  // Continuous progression: roots expand deeply underground, then luminous sprout breaks through
  const rootT = clampedInterpolate(frame, [6, Math.round(durationInFrames * 0.78)], [0, 1], EASING.smoothInOut);
  const sproutT = clampedInterpolate(
    frame,
    [Math.round(durationInFrames * 0.62), durationInFrames - 12],
    [0, 1],
    EASING.smoothInOut
  );

  // Recursive-style clean branching root segments
  const rootBranches = [
    { d: `M ${cx} ${surfaceY} L ${cx} ${surfaceY + 420}`, len: 420, delay: 0 },
    { d: `M ${cx} ${surfaceY + 80} Q ${cx - 120} ${surfaceY + 140} ${cx - 260} ${surfaceY + 260}`, len: 340, delay: 0.1 },
    { d: `M ${cx} ${surfaceY + 80} Q ${cx + 120} ${surfaceY + 140} ${cx + 260} ${surfaceY + 260}`, len: 340, delay: 0.12 },
    { d: `M ${cx} ${surfaceY + 180} Q ${cx - 180} ${surfaceY + 250} ${cx - 410} ${surfaceY + 380}`, len: 480, delay: 0.25 },
    { d: `M ${cx} ${surfaceY + 180} Q ${cx + 180} ${surfaceY + 250} ${cx + 410} ${surfaceY + 380}`, len: 480, delay: 0.28 },
    { d: `M ${cx - 160} ${surfaceY + 190} Q ${cx - 240} ${surfaceY + 310} ${cx - 280} ${surfaceY + 450}`, len: 320, delay: 0.42 },
    { d: `M ${cx + 160} ${surfaceY + 190} Q ${cx + 240} ${surfaceY + 310} ${cx + 280} ${surfaceY + 450}`, len: 320, delay: 0.45 },
    { d: `M ${cx} ${surfaceY + 290} Q ${cx - 90} ${surfaceY + 380} ${cx - 140} ${surfaceY + 480}`, len: 260, delay: 0.55 },
    { d: `M ${cx} ${surfaceY + 290} Q ${cx + 90} ${surfaceY + 380} ${cx + 140} ${surfaceY + 480}`, len: 260, delay: 0.58 },
  ];

  // Camera: dive deep underground following roots -> rise up as sprout breaks surface -> pull back to reveal whole system
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: 0, y: 95 },
    { t: 0.36, scale: 1.32, x: 0, y: 210 },
    { t: 0.72, scale: 1.38, x: -70, y: -155 },
    { t: 0.92, scale: 1.0, x: 0, y: 0 },
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
          {/* Spotlight over protagonist and emerging sprout */}
          <SpotlightCone
            topX={760}
            topWidth={95}
            bottomX={760}
            bottomY={surfaceY + 20}
            bottomWidth={310}
            opacity={0.5 + sproutT * 0.35}
          />

          {/* Ground Surface Horizon */}
          <line
            x1="120"
            y1={surfaceY}
            x2="1800"
            y2={surfaceY}
            stroke={COLORS.white}
            strokeWidth="3"
            strokeDasharray="12 12"
          />
          <text
            x="1760"
            y={surfaceY - 16}
            textAnchor="end"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            VISIBLE SURFACE
          </text>
          <text
            x="1760"
            y={surfaceY + 38}
            textAnchor="end"
            fill={COLORS.dimGrey}
            fontFamily={FONT_FAMILY}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            90% INVISIBLE ROOTS
          </text>

          {/* Growing Underground Root Network */}
          {rootBranches.map((b, i) => {
            const prog = clampedInterpolate(
              rootT,
              [b.delay, Math.min(1, b.delay + 0.45)],
              [0, 1],
              EASING.smoothOut
            );
            return (
              <path
                key={i}
                d={b.d}
                fill="none"
                stroke="rgba(255,255,255,0.68)"
                strokeWidth={i === 0 ? 4.5 : 2.8}
                strokeDasharray={b.len}
                strokeDashoffset={b.len * (1 - prog)}
                strokeLinecap="round"
              />
            );
          })}

          {/* Protagonist standing on the surface tending the breakthrough */}
          <PawnCharacter
            x={760}
            y={surfaceY}
            scale={0.78}
            glowIntensity={0.6 + sproutT * 0.3}
            armPose={sproutT > 0.5 ? 'reachRight' : 'none'}
          />

          {/* Breakthrough Luminous Sprout Shooting Above Surface */}
          {sproutT > 0.01 && (
            <g filter="url(#soft-glow)">
              <circle
                cx={cx}
                cy={surfaceY - sproutT * 195}
                r="130"
                fill="url(#hero-aura)"
                opacity={sproutT * 0.85}
              />
              <line
                x1={cx}
                y1={surfaceY}
                x2={cx}
                y2={surfaceY - sproutT * 215}
                stroke={COLORS.white}
                strokeWidth="6"
                strokeLinecap="round"
              />
              {sproutT > 0.45 && (
                <>
                  <path
                    d={`M ${cx} ${surfaceY - sproutT * 165} Q ${cx - 58} ${surfaceY - sproutT * 225} ${cx - 95} ${surfaceY - sproutT * 195} Q ${cx - 48} ${surfaceY - sproutT * 145} ${cx} ${surfaceY - sproutT * 165} Z`}
                    fill={COLORS.white}
                  />
                  <path
                    d={`M ${cx} ${surfaceY - sproutT * 165} Q ${cx + 58} ${surfaceY - sproutT * 225} ${cx + 95} ${surfaceY - sproutT * 195} Q ${cx + 48} ${surfaceY - sproutT * 145} ${cx} ${surfaceY - sproutT * 165} Z`}
                    fill={COLORS.white}
                  />
                </>
              )}
            </g>
          )}
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="INVISIBLE PROGRESS" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <PunchlineCallout
        text="ROOTS BEFORE FRUIT."
        subtext="GROWTH HAPPENS UNDERGROUND FIRST"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
