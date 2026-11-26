import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { RollingCounter } from '../../components/RollingCounter';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const PromiseLedgerScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const repT = clampedInterpolate(frame, [8, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const promises = [
    'SHOWED UP ON TIME',
    'DELIVERED AS PROMISED',
    'OWNED MISTAKE FAST',
    'NO SHORTCUTS TAKEN',
    'PROTECTED THE CLIENT',
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        {/* Minimalist Ledger Frame */}
        <rect x="440" y="265" width="760" height="585" rx="22" fill="#0A0A0E" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />

        {promises.map((p, idx) => {
          const threshold = idx / promises.length;
          const lit = repT >= threshold;
          const ry = 335 + idx * 102;
          return (
            <g key={p} transform={`translate(495, ${ry})`} opacity={lit ? 1 : 0.22}>
              <circle cx="0" cy="0" r="20" fill={lit ? COLORS.white : 'none'} stroke={COLORS.white} strokeWidth="2.5" filter={lit ? 'url(#soft-glow)' : undefined} />
              {lit && <polyline points="-8,1 -2,7 9,-6" fill="none" stroke={COLORS.bg} strokeWidth="3.5" strokeLinecap="round" />}
              <text x="44" y="8" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="24" fontWeight="700" letterSpacing="0.12em">
                {p}
              </text>
            </g>
          );
        })}
      </svg>

      <RollingCounter label="KEPT PROMISES" value={Math.max(1, repT * 500)} x={1485} y={545} fontSize={96} labelSize={20} />
      <PillBadge text="THE CHARACTER LEDGER" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
