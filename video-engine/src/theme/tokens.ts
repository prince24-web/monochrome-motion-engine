import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', {
  weights: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const FONT_FAMILY = fontFamily;

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 60,
} as const;

export const COLORS = {
  bg: '#070709',
  bgCenter: '#121216',
  white: '#FFFFFF',
  softWhite: '#E6E6EC',
  midGrey: '#8B8B94',
  dimGrey: '#45454E',
  darkGrey: '#27272E',
  dotGrid: 'rgba(255, 255, 255, 0.11)',
  dashedGround: 'rgba(255, 255, 255, 0.36)',
  pillBg: '#FFFFFF',
  pillText: '#0A0A0D',
} as const;

export const LAYOUT = {
  groundY: 952,
  pillTopY: 138,
} as const;
