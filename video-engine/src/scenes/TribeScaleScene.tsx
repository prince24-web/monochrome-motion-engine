import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../components/PawnCharacter';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { SpotlightCone } from '../components/SpotlightCone';
import { WireframeGlobe } from '../components/WireframeGlobe';
import { TribeScaleProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: TribeScaleProps;
  durationInFrames: number;
}

export const TribeScaleScene: React.FC<Props> = ({ config, durationInFrames }) => {
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

  const scaleStart = Math.round(durationInFrames * 0.52);

  // Beat A: Brain + Perspective Crowd Ring (0 -> scaleStart)
  const beatAOpacity = clampedInterpolate(frame, [scaleStart - 16, scaleStart], [1, 0], EASING.smoothOut);
  const rejectPhaseStart = Math.round(scaleStart * 0.42);
  const rejectedCount = clampedInterpolate(
    frame,
    [rejectPhaseStart, scaleStart - 16],
    [2, config.rejectedEnd],
    EASING.smoothInOut
  );
  const isRejectPhase = frame >= rejectPhaseStart;

  // Beat B: Balance Scale (scaleStart -> end)
  const beatBOpacity = clampedInterpolate(frame, [scaleStart - 4, scaleStart + 16], [0, 1], EASING.smoothOut);
  const scaleFrame = Math.max(0, frame - scaleStart);
  const tipSpring = spring({
    frame: Math.max(0, scaleFrame - 18),
    fps,
    config: { damping: 12, stiffness: 65, mass: 1.3 },
  });
  // Beam tilts down on left (-11 deg) when 5 NO's weigh it down
  const beamAngleDeg = 4 - tipSpring * 15;
  const beamAngleRad = (beamAngleDeg * Math.PI) / 180;

  const pivotX = 960;
  const pivotY = 475;
  const halfBeam = 370;
  const leftPanX = pivotX - Math.cos(beamAngleRad) * halfBeam;
  const leftPanY = pivotY - Math.sin(beamAngleRad) * halfBeam;
  const rightPanX = pivotX + Math.cos(beamAngleRad) * halfBeam;
  const rightPanY = pivotY + Math.sin(beamAngleRad) * halfBeam;

  const warnOpacity = clampedInterpolate(
    scaleFrame,
    [Math.round(fps * 1.4), Math.round(fps * 1.85)],
    [0, 1],
    EASING.smoothOut
  );

  // Perspective ellipse ring of 22 silhouettes around protagonist
  const ringCx = 1140;
  const ringCy = 700;
  const ringRx = 270;
  const ringRy = 68;
  const ringCount = 22;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      {/* BEAT A: BRAIN + SMALL GROUP PERSPECTIVE RING */}
      {beatAOpacity > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, opacity: beatAOpacity }}>
          <svg
            width={VIDEO_CONFIG.width}
            height={VIDEO_CONFIG.height}
            viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
          >
            {/* Spotlight on center protagonist in ring */}
            <SpotlightCone
              topX={ringCx}
              topWidth={95}
              bottomX={ringCx}
              bottomY={ringCy + 110}
              bottomWidth={310}
              opacity={0.85}
            />

            {/* Minimalist Line-Art Brain on the left */}
            <g transform="translate(505, 435)" filter="url(#soft-glow)">
              <circle cx="0" cy="0" r="140" fill="url(#hero-aura)" opacity="0.35" />
              {/* Left hemisphere */}
              <path
                d="M -6 -68 C -44 -76 -76 -48 -72 -12 C -90 0 -86 38 -62 50 C -54 74 -18 76 -6 62 Z"
                fill="#0A0A0E"
                stroke={COLORS.white}
                strokeWidth="3.5"
              />
              {/* Right hemisphere */}
              <path
                d="M 6 -68 C 44 -76 76 -48 72 -12 C 90 0 86 38 62 50 C 54 74 18 76 6 62 Z"
                fill="#0A0A0E"
                stroke={COLORS.white}
                strokeWidth="3.5"
              />
              {/* Inner brain folds */}
              <path
                d="M -42 -28 C -26 -24 -24 -4 -40 4 M -44 26 C -26 24 -20 42 -32 48"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 42 -28 C 26 -24 24 -4 40 4 M 44 26 C 26 24 20 42 32 48"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>

            {/* Dashed leader line from Brain to Crowd Ring */}
            <line
              x1="590"
              y1="468"
              x2={ringCx - ringRx - 14}
              y2={ringCy - 18}
              stroke="rgba(255,255,255,0.52)"
              strokeWidth="2.5"
              strokeDasharray="9 9"
            />

            {/* Back half of perspective crowd ring */}
            {Array.from({ length: ringCount }, (_, i) => {
              const angle = (i / ringCount) * Math.PI * 2;
              if (Math.sin(angle) >= 0) return null; // Back half only
              const px = ringCx + Math.cos(angle) * ringRx;
              const py = ringCy + Math.sin(angle) * ringRy;
              const depthScale = 0.34 + (Math.sin(angle) + 1) * 0.1;
              const rejectRatio = isRejectPhase ? rejectedCount / config.rejectedEnd : 0;
              const dimmed = isRejectPhase && i / ringCount < rejectRatio;
              return (
                <g
                  key={`back-${i}`}
                  transform={`translate(${px}, ${py}) scale(${depthScale})`}
                  opacity={dimmed ? 0.18 : 0.72}
                >
                  <circle cx="0" cy="-168" r="30" fill={COLORS.white} />
                  <path
                    d="M -27 -122 Q 0 -132 27 -122 Q 38 -117 42 -96 L 56 -12 Q 58 0 46 0 L -46 0 Q -58 0 -56 -12 L -42 -96 Q -38 -117 -27 -122 Z"
                    fill={COLORS.softWhite}
                  />
                </g>
              );
            })}

            {/* Glowing Protagonist in the center of the ring */}
            <PawnCharacter
              x={ringCx}
              y={ringCy + 42}
              scale={0.96}
              glowIntensity={0.92}
              showFloorHalo
              haloProgress={1}
            />

            {/* Front half of perspective crowd ring */}
            {Array.from({ length: ringCount }, (_, i) => {
              const angle = (i / ringCount) * Math.PI * 2;
              if (Math.sin(angle) < 0) return null; // Front half only
              const px = ringCx + Math.cos(angle) * ringRx;
              const py = ringCy + Math.sin(angle) * ringRy;
              const depthScale = 0.38 + Math.sin(angle) * 0.12;
              const rejectRatio = isRejectPhase ? rejectedCount / config.rejectedEnd : 0;
              const dimmed = isRejectPhase && i / ringCount < rejectRatio;
              return (
                <g
                  key={`front-${i}`}
                  transform={`translate(${px}, ${py}) scale(${depthScale})`}
                  opacity={dimmed ? 0.2 : 0.88}
                >
                  <circle cx="0" cy="-168" r="30" fill={COLORS.white} />
                  <path
                    d="M -27 -122 Q 0 -132 27 -122 Q 38 -117 42 -96 L 56 -12 Q 58 0 46 0 L -46 0 Q -58 0 -56 -12 L -42 -96 Q -38 -117 -27 -122 Z"
                    fill={COLORS.softWhite}
                  />
                </g>
              );
            })}
          </svg>

          {/* Beat A Counters & Pills */}
          <PillBadge text={config.groupPill} x={960} y={146} enterFrame={6} exitFrame={rejectPhaseStart - 4} />
          <PillBadge text={config.everyonePill} x={ringCx} y={248} enterFrame={rejectPhaseStart + 16} />

          {!isRejectPhase ? (
            <div
              style={{
                position: 'absolute',
                left: ringCx,
                top: 382,
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                fontFamily: FONT_FAMILY,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.18em', color: COLORS.midGrey }}>
                GROUP
              </div>
              <div style={{ fontSize: 72, fontWeight: 800, color: COLORS.white }}>
                {config.groupSizeLabel}
              </div>
            </div>
          ) : (
            <RollingCounter
              label="REJECTED BY"
              value={rejectedCount}
              x={ringCx}
              y={382}
              fontSize={76}
              labelSize={20}
            />
          )}
        </div>
      )}

      {/* BEAT B: BALANCE SCALE (5 NO'S vs EVERYONE ELSE) */}
      {beatBOpacity > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, opacity: beatBOpacity }}>
          <svg
            width={VIDEO_CONFIG.width}
            height={VIDEO_CONFIG.height}
            viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
          >
            {/* Central Scale Pillar & Base */}
            <line x1={pivotX} y1={pivotY} x2={pivotX} y2="875" stroke={COLORS.midGrey} strokeWidth="3.5" />
            <line x1={pivotX - 135} y1="875" x2={pivotX + 135} y2="875" stroke={COLORS.midGrey} strokeWidth="3.5" />

            {/* Tilting Balance Beam */}
            <line
              x1={leftPanX}
              y1={leftPanY}
              x2={rightPanX}
              y2={rightPanY}
              stroke={COLORS.white}
              strokeWidth="4"
              filter="url(#soft-glow)"
            />
            <circle cx={pivotX} cy={pivotY} r="10" fill={COLORS.white} filter="url(#soft-glow)" />

            {/* Left Pan Suspension & Bowl */}
            <g transform={`translate(${leftPanX}, ${leftPanY})`}>
              <line x1="0" y1="0" x2="-125" y2="210" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
              <line x1="0" y1="0" x2="125" y2="210" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
              <path
                d="M -135 210 Q 0 264 135 210"
                fill="none"
                stroke={COLORS.white}
                strokeWidth="3.5"
                filter="url(#soft-glow)"
              />

              {/* 5 (X) rejection tokens sitting in the left pan */}
              {[
                { x: -64, y: 196 },
                { x: -16, y: 204 },
                { x: 34, y: 200 },
                { x: 76, y: 190 },
                { x: 6, y: 162 },
              ].map((tok, idx) => {
                const dropF = Math.max(0, scaleFrame - 4 - idx * 5);
                const dropP = spring({
                  frame: dropF,
                  fps,
                  config: { damping: 14, stiffness: 160 },
                });
                const ty = tok.y - (1 - dropP) * 160;
                return (
                  <g
                    key={idx}
                    transform={`translate(${tok.x}, ${ty})`}
                    opacity={Math.min(1, dropP * 2)}
                    filter="url(#soft-glow)"
                  >
                    <circle cx="0" cy="0" r="22" fill="#0A0A0E" stroke={COLORS.white} strokeWidth="2.8" />
                    <line x1="-8" y1="-8" x2="8" y2="8" stroke={COLORS.white} strokeWidth="2.8" />
                    <line x1="8" y1="-8" x2="-8" y2="8" stroke={COLORS.white} strokeWidth="2.8" />
                  </g>
                );
              })}

              {/* Left Pan Label */}
              <text
                x="0"
                y="296"
                textAnchor="middle"
                fill={COLORS.softWhite}
                fontFamily={FONT_FAMILY}
                fontSize="21"
                fontWeight="700"
                letterSpacing="0.18em"
              >
                {config.leftPanLabel}
              </text>

              {/* ! DANGEROUS warning triangle above left pan */}
              {warnOpacity > 0.01 && (
                <g transform="translate(0, -145)" opacity={warnOpacity} filter="url(#soft-glow)">
                  <polygon
                    points="0,-58 54,36 -54,36"
                    fill="#0A0A0E"
                    stroke={COLORS.white}
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <line x1="0" y1="-22" x2="0" y2="6" stroke={COLORS.white} strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="0" cy="20" r="3.5" fill={COLORS.white} />
                  <text
                    x="0"
                    y="72"
                    textAnchor="middle"
                    fill={COLORS.softWhite}
                    fontFamily={FONT_FAMILY}
                    fontSize="19"
                    fontWeight="700"
                    letterSpacing="0.18em"
                  >
                    {config.warningLabel}
                  </text>
                </g>
              )}
            </g>

            {/* Right Pan Suspension, Bowl & Wireframe Globe */}
            <g transform={`translate(${rightPanX}, ${rightPanY})`}>
              <line x1="0" y1="0" x2="-125" y2="210" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
              <line x1="0" y1="0" x2="125" y2="210" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
              <path
                d="M -135 210 Q 0 264 135 210"
                fill="none"
                stroke={COLORS.white}
                strokeWidth="3.5"
              />
              <WireframeGlobe
                cx={0}
                cy={142}
                radius={78}
                rotationDeg={frame * 0.55}
                nodeIntensity={0.45}
                strokeWidth={1.8}
              />
              <text
                x="0"
                y="296"
                textAnchor="middle"
                fill={COLORS.softWhite}
                fontFamily={FONT_FAMILY}
                fontSize="21"
                fontWeight="700"
                letterSpacing="0.18em"
              >
                {config.rightPanLabel}
              </text>
            </g>
          </svg>

          {/* Scale Top Pill: A HANDFUL OF NO'S */}
          <PillBadge text={config.scalePill} x={960} y={196} enterFrame={scaleStart + 8} />
        </div>
      )}
    </div>
  );
};
