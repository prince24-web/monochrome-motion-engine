import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const FourPillarsMatrixScene: React.FC<Props> = ({ durationInFrames }) => {
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

  // Midpoint highlight: dim cards 0 & 1 (PERMISSION NEEDED), ignite cards 2 & 3 (PERMISSIONLESS)
  const splitFrame = Math.round(durationInFrames * 0.44);
  const splitT = clampedInterpolate(frame, [splitFrame, splitFrame + 28], [0, 1], EASING.expoOut);

  const cards = [
    { id: 'labor', title: 'LABOR', sub: 'PEOPLE', permissionless: false },
    { id: 'capital', title: 'CAPITAL', sub: 'MONEY', permissionless: false },
    { id: 'code', title: 'CODE', sub: 'SOFTWARE', permissionless: true },
    { id: 'media', title: 'MEDIA', sub: 'CONTENT', permissionless: true },
  ];

  const cardW = 340;
  const cardH = 470;
  const gap = 52;
  const totalW = cards.length * cardW + (cards.length - 1) * gap;
  const startX = (VIDEO_CONFIG.width - totalW) / 2;
  const baseY = 335;

  const cursorBlink = Math.floor(frame / 16) % 2 === 0 ? 1 : 0.2;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {cards.map((card, i) => {
          const enterDelay = i * 9;
          const pop = spring({
            frame: Math.max(0, frame - enterDelay),
            fps,
            config: { damping: 16, stiffness: 170 },
          });

          const cx = startX + i * (cardW + gap) + cardW / 2;
          const cy = baseY + cardH / 2;

          const cardOpacity = card.permissionless
            ? 0.65 + 0.35 * splitT
            : 0.9 - 0.62 * splitT;
          const cardScale = card.permissionless
            ? 1 + 0.06 * splitT
            : 1 - 0.04 * splitT;
          const translateY = (1 - pop) * 70;

          return (
            <g
              key={card.id}
              transform={`translate(${cx}, ${cy + translateY}) scale(${cardScale * (0.9 + 0.1 * pop)})`}
              opacity={cardOpacity * pop}
            >
              {/* Aura behind active permissionless cards */}
              {card.permissionless && splitT > 0.1 && (
                <circle cx="0" cy="0" r="245" fill="url(#hero-aura)" opacity={splitT * 0.55} />
              )}

              {/* Monolith Card Shell */}
              <rect
                x={-cardW / 2}
                y={-cardH / 2}
                width={cardW}
                height={cardH}
                rx="22"
                fill="#0B0B10"
                stroke={card.permissionless && splitT > 0.3 ? COLORS.white : 'rgba(255,255,255,0.45)'}
                strokeWidth={card.permissionless && splitT > 0.3 ? '3.5' : '2.2'}
                filter={card.permissionless && splitT > 0.3 ? 'url(#soft-glow)' : undefined}
              />

              {/* Custom Vector Icon per Pillar */}
              <g transform="translate(0, -52)">
                {card.id === 'labor' && (
                  <g stroke={COLORS.white} strokeWidth="2.8" fill="none">
                    <circle cx="0" cy="-48" r="14" />
                    <line x1="0" y1="-34" x2="0" y2="-4" />
                    <line x1="-54" y1="-4" x2="54" y2="-4" />
                    <line x1="-54" y1="-4" x2="-54" y2="18" />
                    <line x1="0" y1="-4" x2="0" y2="18" />
                    <line x1="54" y1="-4" x2="54" y2="18" />
                    <circle cx="-54" cy="30" r="11" />
                    <circle cx="0" cy="30" r="11" />
                    <circle cx="54" cy="30" r="11" />
                  </g>
                )}

                {card.id === 'capital' && (
                  <g stroke={COLORS.white} strokeWidth="2.8" fill="none">
                    <ellipse cx="0" cy="-32" rx="48" ry="16" />
                    <ellipse cx="0" cy="-4" rx="48" ry="16" />
                    <ellipse cx="0" cy="24" rx="48" ry="16" />
                    <line x1="-48" y1="-32" x2="-48" y2="24" />
                    <line x1="48" y1="-32" x2="48" y2="24" />
                  </g>
                )}

                {card.id === 'code' && (
                  <g>
                    <text
                      x="-6"
                      y="16"
                      textAnchor="middle"
                      fill={COLORS.white}
                      fontFamily={FONT_FAMILY}
                      fontSize="68"
                      fontWeight="800"
                    >
                      {'</>'}
                    </text>
                    <rect
                      x="58"
                      y="-24"
                      width="10"
                      height="46"
                      fill={COLORS.white}
                      opacity={cursorBlink}
                    />
                  </g>
                )}

                {card.id === 'media' && (
                  <g stroke={COLORS.white} fill="none">
                    <circle cx="0" cy="0" r="12" fill={COLORS.white} />
                    {[0, 1, 2].map((w) => {
                      const waveR = 24 + ((frame * 1.4 + w * 28) % 84);
                      const waveOp = Math.max(0, 1 - waveR / 108);
                      return (
                        <circle
                          key={w}
                          cx="0"
                          cy="0"
                          r={waveR}
                          strokeWidth="2.6"
                          opacity={waveOp}
                        />
                      );
                    })}
                  </g>
                )}
              </g>

              {/* Title & Subtitle */}
              <text
                x="0"
                y="95"
                textAnchor="middle"
                fill={COLORS.white}
                fontFamily={FONT_FAMILY}
                fontSize="36"
                fontWeight="800"
                letterSpacing="0.1em"
              >
                {card.title}
              </text>
              <text
                x="0"
                y="134"
                textAnchor="middle"
                fill={COLORS.midGrey}
                fontFamily={FONT_FAMILY}
                fontSize="18"
                fontWeight="700"
                letterSpacing="0.18em"
              >
                {card.sub}
              </text>

              {/* Padlock icon on Permission-Required cards when dimmed */}
              {!card.permissionless && splitT > 0.1 && (
                <g transform="translate(0, 184)" opacity={splitT}>
                  <path
                    d="M -10 0 L -10 -10 A 10 10 0 0 1 10 -10 L 10 0"
                    fill="none"
                    stroke={COLORS.softWhite}
                    strokeWidth="2.5"
                  />
                  <rect x="-15" y="0" width="30" height="22" rx="4" fill="#0B0B10" stroke={COLORS.softWhite} strokeWidth="2.5" />
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom Group Labels */}
        <g opacity={splitT}>
          <text
            x={startX + cardW + gap / 2}
            y={baseY + cardH + 64}
            textAnchor="middle"
            fill={COLORS.midGrey}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            PERMISSION REQUIRED
          </text>
          <text
            x={startX + 3 * cardW + 2.5 * gap}
            y={baseY + cardH + 64}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontSize="20"
            fontWeight="800"
            letterSpacing="0.18em"
          >
            ZERO PERMISSION NEEDED
          </text>
        </g>
      </svg>

      <PillBadge text="THE 4 FORMS OF LEVERAGE" x={960} y={148} enterFrame={6} exitFrame={splitFrame - 4} />
      <PillBadge text="PERMISSIONLESS LEVERAGE" x={960} y={148} enterFrame={splitFrame + 6} />
    </div>
  );
};
