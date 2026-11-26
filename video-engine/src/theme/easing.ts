import { Easing, interpolate } from 'remotion';

export const EASING = {
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
  expoInOut: Easing.bezier(0.87, 0, 0.13, 1),
  smoothOut: Easing.bezier(0.22, 1, 0.36, 1),
  smoothInOut: Easing.bezier(0.45, 0, 0.55, 1),
  snapBack: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

export function clampedInterpolate(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: (t: number) => number = EASING.expoOut
): number {
  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
}

export function fadeInOut(
  frame: number,
  startFrame: number,
  endFrame: number,
  fadeInDuration = 16,
  fadeOutDuration = 14
): number {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return 0;
  const fadeIn = interpolate(
    frame,
    [startFrame, startFrame + fadeInDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.smoothOut }
  );
  const fadeOut = interpolate(
    frame,
    [endFrame - fadeOutDuration, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.smoothOut }
  );
  return Math.min(fadeIn, fadeOut);
}
