import React from 'react';
import { useCurrentFrame } from 'remotion';
import { PillBadge } from '../components/PillBadge';
import { RollingCounter } from '../components/RollingCounter';
import { NestedZoomGridProps } from '../schema/storyboard';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY, VIDEO_CONFIG } from '../theme/tokens';

interface Props {
  config: NestedZoomGridProps;
  durationInFrames: number;
}

export const NestedZoomGridScene: React.FC<Props> = ({ config, durationInFrames }) => {
  const frame = useCurrentFrame();

  const enterOpacity = clampedInterpolate(frame, [0, 14], [0, 1], EASING.smoothOut);
  const exitOpacity = clampedInterpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    EASING.smoothOut
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);

  // Phase 1 (0..52%): Outer 10x10 grid with 1 glowing square + 50,000,000 counter
  // Phase 2 (52%..100%): Camera zooms smoothly into that single square revealing inner 10x10 grid + 1 glowing inner square
  const zoomStart = Math.round(durationInFrames * 0.48);
  const zoomEnd = Math.round(durationInFrames * 0.76);
  const zoomT = clampedInterpolate(frame, [zoomStart, zoomEnd], [0, 1], EASING.expoInOut);

  const outerCounterVal = clampedInterpolate(
    frame,
    [14, zoomStart - 16],
    [config.outerCounterValue * 0.45, config.outerCounterValue],
    EASING.expoOut
  );
  const outerUiOpacity = clampedInterpolate(frame, [zoomStart - 6, zoomStart + 14], [1, 0], EASING.smoothOut);

  const innerReveal = clampedInterpolate(frame, [zoomEnd - 12, zoomEnd + 16], [0, 1], EASING.smoothOut);
  const innerHighlight = clampedInterpolate(
    frame,
    [zoomEnd + 10, zoomEnd + 28],
    [0, 1],
    EASING.expoOut
  );

  // Outer 10x10 grid geometry centered at (960, 560)
  const gridSize = 520;
  const cellSize = gridSize / 10; // 52px
  const gridLeft = 960 - gridSize / 2;
  const gridTop = 560 - gridSize / 2;

  // Target cell to zoom into: row 2, col 4
  const targetCol = 4;
  const targetRow = 2;
  const targetCx = gridLeft + targetCol * cellSize + cellSize / 2;
  const targetCy = gridTop + targetRow * cellSize + cellSize / 2;

  // Scale so the 52px cell fills ~500px (scale = 9.6)
  const cameraScale = 1 + zoomT * 8.6;
  const camX = 960 + (targetCx - 960) * zoomT;
  const camY = 560 + (targetCy - 560) * zoomT;

  // Inner 10x10 cell geometry inside the zoomed square
  const innerHighlightIdx = 56; // row 5, col 6

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity }}>
      <svg
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
      >
        <g
          transform={`translate(960, 560) scale(${cameraScale}) translate(${-camX}, ${-camY})`}
        >
          {/* Outer 10x10 grid */}
          {Array.from({ length: 100 }, (_, idx) => {
            const col = idx % 10;
            const row = Math.floor(idx / 10);
            const x = gridLeft + col * cellSize + 3;
            const y = gridTop + row * cellSize + 3;
            const w = cellSize - 6;
            const isTarget = col === targetCol && row === targetRow;

            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={w}
                  rx="2.5"
                  fill={isTarget ? `rgba(255,255,255,${(1 - zoomT * 0.92).toFixed(2)})` : '#0A0A0E'}
                  stroke={isTarget ? COLORS.white : 'rgba(255,255,255,0.28)'}
                  strokeWidth={isTarget ? 2.2 / Math.sqrt(cameraScale) : 1.3}
                  filter={isTarget && zoomT < 0.5 ? 'url(#soft-glow)' : undefined}
                />

                {/* Nested 10x10 grid inside the target cell */}
                {isTarget && innerReveal > 0.01 && (
                  <g opacity={innerReveal}>
                    {Array.from({ length: 100 }, (_, j) => {
                      const ic = j % 10;
                      const ir = Math.floor(j / 10);
                      const pad = 1.4;
                      const innerCell = (w - pad * 2) / 10;
                      const ix = x + pad + ic * innerCell + 0.35;
                      const iy = y + pad + ir * innerCell + 0.35;
                      const iw = innerCell - 0.7;
                      const isInnerTarget = j === innerHighlightIdx;

                      return (
                        <rect
                          key={j}
                          x={ix}
                          y={iy}
                          width={iw}
                          height={iw}
                          rx="0.3"
                          fill={
                            isInnerTarget && innerHighlight > 0.05
                              ? `rgba(255,255,255,${innerHighlight.toFixed(2)})`
                              : 'rgba(255,255,255,0.06)'
                          }
                          stroke={
                            isInnerTarget && innerHighlight > 0.05
                              ? COLORS.white
                              : 'rgba(255,255,255,0.34)'
                          }
                          strokeWidth="0.22"
                        />
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Bottom caption during outer phase */}
        <text
          x="960"
          y="878"
          textAnchor="middle"
          fill={COLORS.softWhite}
          fontFamily={FONT_FAMILY}
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.18em"
          opacity={outerUiOpacity}
        >
          {config.bottomCaption}
        </text>
      </svg>

      {/* Outer phase pill + rolling counter */}
      <PillBadge text={config.outerPill} x={960} y={102} enterFrame={8} exitFrame={zoomStart} />
      <RollingCounter
        label={config.outerCounterLabel}
        value={outerCounterVal}
        x={960}
        y={212}
        fontSize={86}
        labelSize={19}
        opacity={outerUiOpacity}
      />

      {/* Inner zoomed phase pill */}
      <PillBadge text={config.innerPill} x={960} y={205} enterFrame={zoomEnd + 4} />
    </div>
  );
};
