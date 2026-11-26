import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
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

export const BlueprintTowerScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const sheets = 10;
  const stepF = Math.max(10, Math.floor((durationInFrames - 30) / sheets));
  const visibleSheets = Math.min(sheets, Math.floor(frame / stepF) + 1);

  // Camera: track blueprints piling upward -> pan right to frozen $0 revenue box -> wide reveal
  const cameraKeyframes: CameraKeyframe[] = [
    { t: 0.0, scale: 1.44, x: -320, y: 185 },
    { t: 0.42, scale: 1.32, x: -320, y: -60 },
    { t: 0.72, scale: 1.34, x: 310, y: 10 },
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
          {/* Volumetric spotlight over protagonist dwarfed by plans */}
          <SpotlightCone
            topX={270}
            topWidth={95}
            bottomX={270}
            bottomY={880}
            bottomWidth={290}
            opacity={0.72}
          />

          {/* Isometric Stack of Blueprint Plans Piling Up on the Left */}
          {Array.from({ length: visibleSheets }, (_, i) => {
            const dropF = Math.max(0, frame - i * stepF);
            const pop = spring({ frame: dropF, fps, config: { damping: 14, stiffness: 180 } });
            const baseY = 820 - i * 44;
            const y = baseY - (1 - pop) * 90;
            const cx = 660;
            return (
              <g key={i} transform={`translate(${cx}, ${y})`} opacity={0.35 + (i / sheets) * 0.65}>
                <polygon
                  points="0,-54 220,0 0,54 -220,0"
                  fill="#0C0C12"
                  stroke={i === visibleSheets - 1 ? COLORS.white : 'rgba(255,255,255,0.48)'}
                  strokeWidth={i === visibleSheets - 1 ? 3 : 2}
                  filter={i === visibleSheets - 1 ? 'url(#soft-glow)' : undefined}
                />
                {i === visibleSheets - 1 && (
                  <text
                    x="0"
                    y="7"
                    textAnchor="middle"
                    fill={COLORS.white}
                    fontFamily={FONT_FAMILY}
                    fontSize="20"
                    fontWeight="800"
                    letterSpacing="0.16em"
                  >
                    STRATEGY V{i + 5}
                  </text>
                )}
              </g>
            );
          })}

          <text
            x="660"
            y="895"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            ENDLESS PLANS
          </text>

          {/* Protagonist standing beside the endless blueprint stack */}
          <PawnCharacter
            x={270}
            y={860}
            scale={0.9}
            glowIntensity={0.62}
            showFloorHalo
            haloProgress={0.85}
          />

          {/* Right Side: Frozen $0 Revenue Box */}
          <g transform="translate(1360, 540)">
            <rect
              x="-210"
              y="-120"
              width="420"
              height="240"
              rx="20"
              fill="#0A0A0E"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="2.5"
              strokeDasharray="10 10"
            />
            <text
              x="0"
              y="-24"
              textAnchor="middle"
              fill={COLORS.midGrey}
              fontFamily={FONT_FAMILY}
              fontSize="20"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              ACTUAL OUTPUT
            </text>
            <text
              x="0"
              y="62"
              textAnchor="middle"
              fill={COLORS.white}
              fontFamily={FONT_FAMILY}
              fontSize="88"
              fontWeight="900"
            >
              $0
            </text>
          </g>
        </svg>
      </CameraRig>

      {/* HUD Layer */}
      <PillBadge text="FAKE PRODUCTIVITY" x={960} y={96} enterFrame={Math.round(fps * 0.45)} />

      <RollingCounter
        label="ACTUAL REVENUE"
        prefix="$"
        value={0}
        x={1820}
        y={158}
        fontSize={118}
        labelSize={20}
        align="right"
      />

      <PunchlineCallout
        text="PLANS DON'T PAY."
        subtext="EXECUTION BUILDS REVENUE"
        x={960}
        y={945}
        enterFrame={Math.round(durationInFrames * 0.65)}
        exitFrame={durationInFrames - 8}
        fontSize={62}
      />
    </div>
  );
};
