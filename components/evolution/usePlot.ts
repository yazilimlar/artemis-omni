"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as Plot from "@observablehq/plot";

/**
 * Renders an Observable Plot into a container and re-renders it when the
 * container width changes. Plot output is SVG with `currentColor` text, so it
 * follows the page theme.
 */
export function usePlot(
  build: (width: number) => ReturnType<typeof Plot.plot>,
  deps: readonly unknown[],
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const draw = () => {
      const width = Math.max(320, container.clientWidth);
      const chart = build(width);
      container.replaceChildren(chart);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
