import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clampedInterpolate, EASING } from '../theme/easing';
import { COLORS, FONT_FAMILY } from '../theme/tokens';

interface PunchlineCalloutProps {
  text: string;
  subtext?: string;
  x?: number;
  y?: number;
  enterFrame: number;
  exitFrame?: number;
  fontSize?: number;
  align?: 'center' | 'left' | 'right';
}

/**
 * Bold, high-impact 2–3 word climax flash callout (56–74px, 900 weight, white bloom)
 * designed to punctuate key narrative beats outside the camera zoom layer.
 */
export const PunchlineCallout: React.FC<PunchlineCalloutProps> = ({
  text,
  subtext,
  x = 960,
  y = 920,
  enterFrame,
  exitFrame,
  fontSize = 62,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;
  if (exitFrame !== undefined && frame > exitFrame) return null;

  const pop = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 210, mass: 0.7 },
  });

  const fadeOut =
    exitFrame !== undefined
      ? clampedInterpolate(frame, [exitFrame - 12, exitFrame], [1, 0], EASING.smoothOut)
      : 1;

  const opacity = Math.min(1, pop * 1.4) * fadeOut;
  const scale = 0.84 + 0.16 * pop;
  const translateY = (1 - pop) * 20;
  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${translateX}, -50%) translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(4)})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        fontFamily: FONT_FAMILY,
        pointerEvents: 'none',
        padding: '12px 32px',
        borderRadius: 18,
        background:
          'radial-gradient(ellipse at center, rgba(7,7,9,0.88) 0%, rgba(7,7,9,0.55) 70%, rgba(7,7,9,0) 100%)',
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.025em',
          color: COLORS.white,
          textTransform: 'uppercase',
          textShadow: '0 0 36px rgba(255, 255, 255, 0.48), 0 4px 18px rgba(0, 0, 0, 0.9)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: COLORS.midGrey,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
            whiteSpace: 'nowrap',
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
