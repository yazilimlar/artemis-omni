"use client";

/**
 * High-frequency motion channel between the DOM layer (scroll, pointer,
 * device tilt) and the R3F scene. Written by event handlers, read inside
 * useFrame — never triggers React re-renders.
 */
export const atlasMotion = {
  /** Continuous timeline position, 0..ERAS.length-1 (1 = 600 BC section). */
  eraIndex: 1,
  /** Pointer/tilt parallax target, both axes roughly -1..1. */
  parallaxX: 0,
  parallaxY: 0,
  /** True when the user prefers reduced motion — disables auto-pan/parallax. */
  reducedMotion: false,
};

/** Distance-based weight for a ghost era overlay at timeline slot `order`. */
export function eraProximity(order: number): number {
  return Math.max(0, 1 - Math.abs(atlasMotion.eraIndex - order));
}
