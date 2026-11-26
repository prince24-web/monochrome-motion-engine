import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PawnCharacter } from '../../components/PawnCharacter';
import { SpotlightCone } from '../../components/SpotlightCone';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ActionWinsFinaleScene: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = clampedInterpolate(frame, [0, 16], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  const riseT = clampedInterpolate(frame, [8, Math.round(fps * 1.6)], [0, 1], EASING.expoOut);
  const h1 = clampedInterpolate(frame, [Math.round(fps * 0.6), Math.round(fps * 1.3)], [0, 1], EASING.expoOut);
  const h2 = clampedInterpolate(frame, [Math.round(fps * 1.5), Math.round(fps * 2.2)], [0, 1], EASING.expoOut);

  const baseY = 920;
  const actionH = 420 * riseT;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <SpotlightCone topX={1240} topWidth={130} bottomX={1240} bottomY={baseY - actionH + 30} bottomWidth={420} />

        <line x1="260" y1={baseY} x2="1660" y2={baseY} stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" strokeDasharray="12 12" />

        {/* Short Dim Pillar: OVERTHINKING */}
        <g opacity="0.38">
          <rect x="520" y={baseY - 95} width="260" height="95" rx="12" fill="#0B0B10" stroke={COLORS.midGrey} strokeWidth="2.5" />
          <text x="650" y={baseY + 46} textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="21" fontWeight="700" letterSpacing="0.18em">
            THINKING
          </text>
        </g>

        {/* Towering Illuminated Pillar: SHIPPING */}
        <g filter="url(#soft-glow)">
          <rect x="1110" y={baseY - actionH} width="260" height={actionH} rx="14" fill="rgba(255,255,255,0.16)" stroke={COLORS.white} strokeWidth="4" />
        </g>
        <text x="1240" y={baseY + 46} textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
          TAKING ACTION
        </text>

        <PawnCharacter x={1240} y={baseY - actionH} scale={0.95} glowIntensity={0.95} armPose="celebrate" />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 245,
          transform: `translate(-50%, -50%) translateY(${(1 - h1) * 16}px)`,
          opacity: h1,
          fontFamily: FONT_FAMILY,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: COLORS.softWhite,
          whiteSpace: 'nowrap',
        }}
      >
        CLARITY COMES FROM
      </div>
      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 335,
          transform: `translate(-50%, -50%) translateY(${(1 - h2) * 18}px)`,
          opacity: h2,
          fontFamily: FONT_FAMILY,
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: COLORS.white,
          textShadow: '0 0 40px rgba(255,255,255,0.48)',
          whiteSpace: 'nowrap',
        }}
      >
        ACTION.
      </div>
    </div>
  );
};
