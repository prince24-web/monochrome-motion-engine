import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const ReferralTreeScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const l1 = clampedInterpolate(frame, [10, 42], [0, 1], EASING.expoOut);
  const l2 = clampedInterpolate(frame, [52, 92], [0, 1], EASING.expoOut);
  const l3 = clampedInterpolate(frame, [102, 150], [0, 1], EASING.expoOut);

  const root = { x: 960, y: 280 };
  const tier1 = [
    { x: 520, y: 470 },
    { x: 960, y: 470 },
    { x: 1400, y: 470 },
  ];
  const tier2 = tier1.flatMap((p) => [
    { x: p.x - 135, y: 690, px: p.x, py: p.y },
    { x: p.x, y: 690, px: p.x, py: p.y },
    { x: p.x + 135, y: 690, px: p.x, py: p.y },
  ]);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Root -> Tier 1 edges */}
        {tier1.map((n, i) => (
          <line key={`e1-${i}`} x1={root.x} y1={root.y} x2={root.x + (n.x - root.x) * l1} y2={root.y + (n.y - root.y) * l1} stroke="rgba(255,255,255,0.55)" strokeWidth="2.8" strokeDasharray="8 8" />
        ))}

        {/* Tier 1 -> Tier 2 edges */}
        {l2 > 0.01 &&
          tier2.map((n, i) => (
            <line key={`e2-${i}`} x1={n.px} y1={n.py} x2={n.px + (n.x - n.px) * l2} y2={n.py + (n.y - n.py) * l2} stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
          ))}

        {/* Root Node */}
        <circle cx={root.x} cy={root.y} r="28" fill={COLORS.white} filter="url(#soft-glow)" />

        {/* Tier 1 Nodes */}
        {tier1.map((n, i) => (
          <circle key={`t1-${i}`} cx={n.x} cy={n.y} r={20 * l1} fill={COLORS.white} opacity={l1} filter="url(#soft-glow)" />
        ))}

        {/* Tier 2 Nodes */}
        {tier2.map((n, i) => (
          <circle key={`t2-${i}`} cx={n.x} cy={n.y} r={14 * l2} fill={COLORS.softWhite} opacity={l2} />
        ))}

        {/* Tier 3 Multiplier Row */}
        {l3 > 0.01 && (
          <text x="960" y="835" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="900" letterSpacing="0.16em" opacity={l3} filter="url(#soft-glow)">
            1 → 3 → 9 → 27 → THOUSANDS
          </text>
        )}

        <text x="960" y="915" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
          WORD OF MOUTH COMPOUNDS FOR FREE
        </text>
      </svg>

      <PillBadge text="THE REFERRAL ENGINE" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
