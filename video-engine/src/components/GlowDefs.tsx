import React from 'react';

export const GlowDefs: React.FC = () => {
  return (
    <defs>
      {/* Subtle crisp white bloom for lines, rings, and active icons */}
      <filter id="soft-glow" x="-250%" y="-250%" width="600%" height="600%">
        <feGaussianBlur stdDeviation="5" result="blur1" />
        <feGaussianBlur stdDeviation="12" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Strong hero bloom for THE 1% person, protagonist aura, and bright focal bursts */}
      <filter id="strong-glow" x="-350%" y="-350%" width="800%" height="800%">
        <feGaussianBlur stdDeviation="10" result="blur1" />
        <feGaussianBlur stdDeviation="24" result="blur2" />
        <feGaussianBlur stdDeviation="44" result="blur3" />
        <feMerge>
          <feMergeNode in="blur3" />
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Volumetric spotlight softness */}
      <filter id="spotlight-blur" x="-30%" y="-20%" width="160%" height="140%">
        <feGaussianBlur stdDeviation="22" />
      </filter>

      {/* Radial spotlight beam gradient */}
      <linearGradient id="spotlight-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
      </linearGradient>

      {/* Radial white glow behind characters */}
      <radialGradient id="hero-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
};
