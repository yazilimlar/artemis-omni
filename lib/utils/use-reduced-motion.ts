"use client";

import * as React from "react";

/**
 * Returns true when the user prefers reduced motion OR the viewport is small
 * enough that the cinematic layer should be skipped for performance.
 * Defaults to `true` (safe: static fallback) until measured on the client,
 * so we never ship heavy animation on first paint.
 */
export function usePrefersStatic(mobileBreakpoint = 768): boolean {
  const [prefersStatic, setPrefersStatic] = React.useState(true);

  React.useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

    const update = () => setPrefersStatic(motion.matches || small.matches);
    update();

    motion.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, [mobileBreakpoint]);

  return prefersStatic;
}
