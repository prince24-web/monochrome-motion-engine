import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
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
  const stepF = Math.max(12, Math.floor((durationInFrames - 60) / sheets));
  const visibleSheets = Math.min(sheets, Math.floor(frame / stepF) + 1);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Isometric Stack of Blueprint Plans Piling Up on the Left */}
        {Array.from({ length: visibleSheets }, (_, i) => {
          const dropF = Math.max(0, frame - i * stepF);
          const pop = spring({ frame: dropF, fps, config: { damping: 14, stiffness: 180 } });
          const baseY = 820 - i * 44;
          const y = baseY - (1 - pop) * 90;
          const cx = 620;
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
                <text x="0" y="7" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="800" letterSpacing="0.16em">
                  STRATEGY V{i + 5}
                </text>
              )}
            </g>
          );
        })}

        <text x="620" y="905" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="20" fontWeight="700" letterSpacing="0.18em">
          ENDLESS PLANS
        </text>

        {/* Right Side: Frozen $0 Revenue Box */}
        <g transform="translate(1320, 550)">
          <rect x="-210" y="-120" width="420" height="240" rx="20" fill="#0A0A0E" stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" strokeDasharray="10 10" />
        </g>
      </svg>

      <RollingCounter label="ACTUAL REVENUE" prefix="$" value={0} x={1320} y={550} fontSize={118} labelSize={20} />
      <PillBadge text="FAKE PRODUCTIVITY" x={960} y={136} enterFrame={Math.round(fps * 0.8)} />
    </div>
  );
};
