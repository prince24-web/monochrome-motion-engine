import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const GlassBridgeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const walkT = clampedInterpolate(frame, [10, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const bridgeY = 670;
  const heroX = 330 + walkT * 1240;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Left & Right Cliffs */}
        <path d="M 100 940 L 100 670 L 380 670 L 380 940 Z" fill="#0B0B10" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
        <path d="M 1540 940 L 1540 670 L 1820 670 L 1820 940 Z" fill="#0B0B10" stroke={COLORS.white} strokeWidth="3.5" />

        {/* Suspension Bridge Deck & Cables */}
        <line x1="380" y1={bridgeY} x2={380 + 1160 * Math.min(1, walkT * 1.3)} y2={bridgeY} stroke={COLORS.white} strokeWidth="5" filter="url(#soft-glow)" />
        <path d="M 380 490 Q 960 660 1540 490" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
        <line x1="380" y1="490" x2="380" y2={bridgeY} stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
        <line x1="1540" y1="490" x2="1540" y2={bridgeY} stroke="rgba(255,255,255,0.5)" strokeWidth="3" />

        <PawnCharacter x={heroX} y={bridgeY} scale={0.86} glowIntensity={0.85} />

        <text x="240" y="750" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.16em">
          UNKNOWN
        </text>
        <text x="1680" y="750" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="800" letterSpacing="0.16em">
          OPPORTUNITY
        </text>
        <text x="960" y="765" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
          BRIDGE OF KEPT PROMISES
        </text>
      </svg>

      <PillBadge text="OPPORTUNITY FLOWS TO TRUST" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
