import React from 'react';
import { COLORS, FONT_FAMILY } from '../theme/tokens';

interface RollingCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  x: number;
  y: number;
  fontSize?: number;
  labelSize?: number;
  opacity?: number;
  align?: 'center' | 'left' | 'right';
}

export const RollingCounter: React.FC<RollingCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  x,
  y,
  fontSize = 112,
  labelSize = 22,
  opacity = 1,
  align = 'center',
}) => {
  const formatted = `${prefix}${Math.round(value).toLocaleString('en-US')}${suffix}`;
  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${translateX}, -50%)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        fontFamily: FONT_FAMILY,
        pointerEvents: 'none',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: labelSize,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.midGrey,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize,
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: COLORS.white,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 28px rgba(255, 255, 255, 0.28)',
          whiteSpace: 'nowrap',
        }}
      >
        {formatted}
      </div>
    </div>
  );
};
