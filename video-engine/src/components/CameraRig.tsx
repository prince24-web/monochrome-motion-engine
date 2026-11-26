import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clampedInterpolate, EASING } from '../theme/easing';

export interface CameraKeyframe {
  /** Normalized progress across the scene (0..1) */
  t: number;
  /** Zoom factor (1.0 = full 1920x1080 frame, >1.0 = punch-in) */
  scale: number;
  /** Focal offset X from canvas center (960). E.g. -300 centers camera on x=660. */
  x?: number;
  /** Focal offset Y from canvas center (540). E.g. -120 centers camera on y=420. */
  y?: number;
  /** Optional subtle camera roll in degrees */
  rotate?: number;
}

interface CameraRigProps {
  durationInFrames: number;
  keyframes: CameraKeyframe[];
  easing?: (t: number) => number;
  microDrift?: boolean;
  children: React.ReactNode;
}

/**
 * Virtual 2D camera wrapper for Remotion scenes.
 * Smoothly interpolates between normalized keyframes (t: 0..1) so every scene
 * has intentional zoom-ins, pans, and pull-backs instead of a locked-off frame.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  durationInFrames,
  keyframes,
  easing = EASING.smoothInOut,
  microDrift = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const normT = durationInFrames > 1 ? Math.max(0, Math.min(1, frame / (durationInFrames - 1))) : 0;

  // Find active segment
  let scale = keyframes[0]?.scale ?? 1;
  let x = keyframes[0]?.x ?? 0;
  let y = keyframes[0]?.y ?? 0;
  let rotate = keyframes[0]?.rotate ?? 0;

  if (keyframes.length >= 2) {
    if (normT <= keyframes[0].t) {
      scale = keyframes[0].scale;
      x = keyframes[0].x ?? 0;
      y = keyframes[0].y ?? 0;
      rotate = keyframes[0].rotate ?? 0;
    } else if (normT >= keyframes[keyframes.length - 1].t) {
      const last = keyframes[keyframes.length - 1];
      scale = last.scale;
      x = last.x ?? 0;
      y = last.y ?? 0;
      rotate = last.rotate ?? 0;
    } else {
      for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (normT >= a.t && normT <= b.t) {
          const span = Math.max(0.0001, b.t - a.t);
          const local = (normT - a.t) / span;
          scale = clampedInterpolate(local, [0, 1], [a.scale, b.scale], easing);
          x = clampedInterpolate(local, [0, 1], [a.x ?? 0, b.x ?? 0], easing);
          y = clampedInterpolate(local, [0, 1], [a.y ?? 0, b.y ?? 0], easing);
          rotate = clampedInterpolate(local, [0, 1], [a.rotate ?? 0, b.rotate ?? 0], easing);
          break;
        }
      }
    }
  }

  // Subtle organic handheld breath so the frame never feels frozen
  const driftX = microDrift ? Math.sin(frame * 0.035) * 2.2 : 0;
  const driftY = microDrift ? Math.cos(frame * 0.028) * 1.6 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '960px 540px',
        transform: `scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(3)}deg) translate3d(${(-x + driftX).toFixed(2)}px, ${(-y + driftY).toFixed(2)}px, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
