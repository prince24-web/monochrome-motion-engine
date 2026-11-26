import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PillBadge } from '../../components/PillBadge';
import { clampedInterpolate, EASING } from '../../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../../theme/tokens';

interface Props {
  durationInFrames: number;
}

export const VersionZeroShipScene: React.FC<Props> = ({ durationInFrames }) => {
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

  const shipT = clampedInterpolate(frame, [12, durationInFrames - 18], [0, 1], EASING.smoothInOut);
  const cubeX = 1080 + shipT * 610;
  const versionLabel = shipT < 0.3 ? 'V0.1' : shipT < 0.65 ? 'V1.0' : 'V4.0';

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <line x1="960" y1="220" x2="960" y2="900" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {/* Left: Polished Unshipped Draft (99% READY, STUCK) */}
        <g transform="translate(480, 560)" opacity="0.45">
          <rect x="-120" y="-120" width="240" height="240" rx="22" fill="#0A0A0E" stroke={COLORS.midGrey} strokeWidth="3" strokeDasharray="12 10" />
          <text x="0" y="-6" textAnchor="middle" fill={COLORS.softWhite} fontFamily={FONT_FAMILY} fontSize="34" fontWeight="800">
            99% READY
          </text>
          <text x="0" y="34" textAnchor="middle" fill={COLORS.midGrey} fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" letterSpacing="0.16em">
            STILL IN DRAFTS
          </text>
        </g>

        {/* Right: Ugly V0.1 Launching & Upgrading Live */}
        <g>
          <line x1="1060" y1="620" x2="1760" y2="620" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeDasharray="10 10" />
          <line x1="1060" y1="620" x2={cubeX} y2="620" stroke={COLORS.white} strokeWidth="4.5" filter="url(#soft-glow)" />

          <g transform={`translate(${cubeX}, 540)`} filter="url(#soft-glow)">
            <circle cx="0" cy="0" r="115" fill="url(#hero-aura)" opacity="0.7" />
            <rect
              x={-54 - shipT * 18}
              y={-54 - shipT * 18}
              width={108 + shipT * 36}
              height={108 + shipT * 36}
              rx={shipT * 18}
              fill="#0B0B10"
              stroke={COLORS.white}
              strokeWidth="4"
            />
            <text x="0" y="10" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="32" fontWeight="900">
              {versionLabel}
            </text>
          </g>

          <text x="1410" y="740" textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontSize="22" fontWeight="800" letterSpacing="0.18em">
            SHIPPED &amp; UPGRADING LIVE
          </text>
        </g>
      </svg>

      <PillBadge text="SHIP VERSION 0.1" x={960} y={136} enterFrame={Math.round(fps * 0.7)} />
    </div>
  );
};
