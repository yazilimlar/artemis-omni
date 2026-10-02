"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Homepage hero mount (ADR-016). Renders the static fallback on the server and
 * on first paint; after the browser is idle, and only when motion and network
 * allow, it lazily loads SceneIsland (which applies the full ADR-015 fallback
 * chain). No scene code is part of the homepage's initial bundle.
 */

const SLOW_NETWORKS = new Set(["slow-2g", "2g", "3g"]);

/** Pure gate for the lazy load: false keeps the static fallback. */
export function shouldLoadHero(env: {
  reducedMotion: boolean;
  effectiveType?: string;
  saveData?: boolean;
}): boolean {
  if (env.reducedMotion) return false;
  if (env.saveData) return false;
  if (env.effectiveType && SLOW_NETWORKS.has(env.effectiveType)) return false;
  return true;
}

type Props = {
  fallbackSrc: string;
  fallbackAlt: string;
  maxSessionSeconds: number;
  fpsFloor: number;
};

function Fallback({ fallbackSrc, fallbackAlt }: Pick<Props, "fallbackSrc" | "fallbackAlt">) {
  return (
    <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-lg border border-border/70 bg-[#0c1426]">
      {/* Below the fold: lazy, so React does not hoist a <link rel="preload"> that would compete with LCP. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fallbackSrc}
        alt={fallbackAlt}
        width={512}
        height={512}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function HomeHeroScene({ fallbackSrc, fallbackAlt, maxSessionSeconds, fpsFloor }: Props) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
    const allowed = shouldLoadHero({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      effectiveType: nav.connection?.effectiveType,
      saveData: nav.connection?.saveData,
    });
    if (!allowed) return;
    const start = () => setLoad(true);
    // Safari has no requestIdleCallback; fall back to a short timeout after first paint.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!load) return <Fallback fallbackSrc={fallbackSrc} fallbackAlt={fallbackAlt} />;
  return (
    <LazySceneIsland
      sceneId="site-hero"
      fallbackSrc={fallbackSrc}
      fallbackAlt={fallbackAlt}
      maxSessionSeconds={maxSessionSeconds}
      fpsFloor={fpsFloor}
    />
  );
}

const LazySceneIsland = dynamic(
  () => import("@/components/scenes/SceneIsland").then((module) => module.SceneIsland),
  { ssr: false },
);
