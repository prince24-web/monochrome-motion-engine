import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const SplitPathForkScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const forkDraw = clampedInterpolate(frame, [0, Math.round(fps * 1.1)], [0, 1], EASING.expoOut);
  const leftClimb = clampedInterpolate(frame, [20, durationInFrames - 20], [0, 1], EASING.smoothInOut);
  const rightBeam = clampedInterpolate(frame, [Math.round(fps * 1.2), durationInFrames - 15], [0, 1], EASING.expoOut);

  // Left: struggling pawn pushing heavy boulder up steep slope
  const slopeX = 240 + leftClimb * 230;
  const slopeY = 820 - leftClimb * 220;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Center vertical divider line */}
        <line
          x1="960"
          y1="210"
          x2="960"
          y2="920"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeDasharray="8 12"
        />

        {/* LEFT HALF: HARD EFFORT (Boulder uphill) */}
        <g opacity={0.45 + 0.35 * forkDraw}>
          <text
            x="480"
            y="280"
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="24"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            THE EFFORT GAME
          </text>
          <text
            x="480"
            y="324"
            textAnchor="middle"
            fill={COLORS.dimGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            1 HR = 1 UNIT
          </text>

          {/* Steep jagged uphill slope */}
          <path
            d="M 150 860 L 290 790 L 340 755 L 430 680 L 510 635 L 620 555 L 780 460"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
          />

          {/* Struggling pawn pushing heavy wireframe boulder */}
          <g transform={`translate(${slopeX}, ${slopeY})`}>
            {/* Heavy boulder */}
            <polygon
              points="75,-90 125,-68 138,-18 102,16 48,8 36,-48"
              fill="#0C0C10"
              stroke={COLORS.softWhite}
              strokeWidth="3"
            />
            {/* Leaning pawn */}
            <g transform="rotate(18)">
              <PawnCharacter x={0} y={0} scale={0.62} glowIntensity={0.2} bob={false} armPose="reachRight" />
            </g>
          </g>
        </g>

        {/* RIGHT HALF: LEVERAGE (Multiplying Laser Prism) */}
        <g opacity={forkDraw}>
          <text
            x="1440"
            y="280"
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="24"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            THE LEVERAGE GAME
          </text>
          <text
            x="1440"
            y="324"
            textAnchor="middle"
            fill={COLORS.softWhite}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            1 HR = 10,000 UNITS
          </text>

          {/* Horizontal rail */}
          <line x1="1060" y1="780" x2="1810" y2="780" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeDasharray="10 10" />

          {/* Calm Architect Pawn on left of prism */}
          <PawnCharacter x={1155} y={780} scale={0.78} glowIntensity={0.85} armPose="reachRight" />

          {/* Single input beam into Multiplying Prism */}
          <line
            x1="1225"
            y1="675"
            x2={1225 + 155 * Math.min(1, rightBeam * 2)}
            y2="675"
            stroke={COLORS.white}
            strokeWidth="4"
            filter="url(#soft-glow)"
          />

          {/* Glowing Wireframe Multiplying Prism */}
          <polygon
            points="1440,565 1515,745 1365,745"
            fill="#0B0B10"
            stroke={COLORS.white}
            strokeWidth="3.5"
            filter="url(#soft-glow)"
          />

          {/* Fan of 7 multiplied output beams shooting out of the prism */}
          {rightBeam > 0.35 &&
            [-3, -2, -1, 0, 1, 2, 3].map((idx) => {
              const fanT = clampedInterpolate(rightBeam, [0.35, 1], [0, 1], EASING.expoOut);
              const targetX = 1485 + 295 * fanT;
              const targetY = 675 + idx * 42 * fanT;
              return (
                <g key={idx}>
                  <line
                    x1="1485"
                    y1="675"
                    x2={targetX}
                    y2={targetY}
                    stroke={COLORS.white}
                    strokeWidth={idx === 0 ? 3.5 : 2.2}
                    opacity={0.45 + 0.55 * fanT}
                    filter="url(#soft-glow)"
                  />
                  <circle cx={targetX} cy={targetY} r="5.5" fill={COLORS.white} />
                </g>
              );
            })}
        </g>
      </svg>

      <PillBadge text="TWO DIFFERENT GAMES" x={960} y={146} enterFrame={12} />
    </div>
  );
};
