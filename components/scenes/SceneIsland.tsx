"use client";

import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";
import dynamic from "next/dynamic";

/**
 * The single 3D island (ADR-015). Renders the static 2D fallback first and on
 * the server, then upgrades to the registered scene only when every check in
 * the fallback chain passes.
 */

export type RenderInputs = {
  /** True on the server and before the client has measured anything. */
  ssr?: boolean;
  reducedMotion: boolean;
  hasWebGL: boolean;
  lowDevice: boolean;
  fpsBelowFloor: boolean;
  errorThrown: boolean;
  sessionExpired?: boolean;
};

export type FallbackReason =
  | "ssr"
  | "reduced_motion"
  | "no_webgl"
  | "low_device"
  | "fps_floor"
  | "error"
  | "session_expired";

/** First matching reason in ADR-015 chain order, or null when the scene may render. */
export function fallbackReason(inputs: RenderInputs): FallbackReason | null {
  if (inputs.ssr) return "ssr";
  if (inputs.reducedMotion) return "reduced_motion";
  if (!inputs.hasWebGL) return "no_webgl";
  if (inputs.lowDevice) return "low_device";
  if (inputs.fpsBelowFloor) return "fps_floor";
  if (inputs.errorThrown) return "error";
  if (inputs.sessionExpired) return "session_expired";
  return null;
}

export function decideRender(inputs: RenderInputs): "scene" | "fallback" {
  return fallbackReason(inputs) === null ? "scene" : "fallback";
}

/**
 * ADR-015: hardwareConcurrency < 4, or deviceMemory < 4 where supported.
 * deviceMemory is Chromium-only; an unknown value is not a downgrade reason.
 */
export function isLowDevice(nav: { hardwareConcurrency?: number; deviceMemory?: number }): boolean {
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return true;
  return false;
}

/** Tracks per-second FPS samples; true once `seconds` consecutive samples fall below `floor`. */
export function fpsBreached(samples: readonly number[], floor: number, seconds = 3): boolean {
  let run = 0;
  for (const fps of samples) {
    run = fps < floor ? run + 1 : 0;
    if (run >= seconds) return true;
  }
  return false;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Scenes registered with `type: "canvas-2d"` (ADR-020): drawn with Canvas 2D, so WebGL is not required. */
export const CANVAS_2D_SCENES: ReadonlySet<string> = new Set(["bubble-sort"]);

type SceneProps = { paused?: boolean };

/** Registered scene components; each is code-split and never server-rendered. */
const SCENES: Record<string, ComponentType<SceneProps>> = {
  "hello-orb": dynamic(() => import("./hello-orb"), { ssr: false }),
  "spatial-proof-surface": dynamic(() => import("./spatial-proof-surface"), { ssr: false }),
  "botanical-garden": dynamic(() => import("./botanical-garden"), { ssr: false }),
  "evolution-architecture-map": dynamic(() => import("./evolution-architecture-map"), { ssr: false }),
  "gaussian-surface": dynamic(() => import("./gaussian-surface"), { ssr: false }),
  "bubble-sort": dynamic(() => import("./bubble-sort"), { ssr: false }),
  // ADR-016 homepage hero: Canvas 2D, no three.js (keeps the homepage budget).
  "site-hero": dynamic(() => import("./site-hero"), { ssr: false }),
};

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneIsland({
  sceneId,
  fallbackSrc,
  fallbackAlt,
  maxSessionSeconds,
  fpsFloor,
}: {
  sceneId: string;
  fallbackSrc: string;
  fallbackAlt: string;
  maxSessionSeconds: number;
  fpsFloor: number;
}) {
  const [inputs, setInputs] = useState<RenderInputs>({
    ssr: true,
    reducedMotion: true,
    hasWebGL: false,
    lowDevice: true,
    fpsBelowFloor: false,
    errorThrown: false,
    sessionExpired: false,
  });
  const [paused, setPaused] = useState(false);
  const Scene = SCENES[sceneId];
  const mode = Scene ? decideRender(inputs) : "fallback";

  // Measure the client once mounted.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const measure = () =>
      setInputs((current) => ({
        ...current,
        ssr: false,
        reducedMotion: motion.matches,
        hasWebGL: CANVAS_2D_SCENES.has(sceneId) || detectWebGL(),
        lowDevice: isLowDevice({ hardwareConcurrency: nav.hardwareConcurrency, deviceMemory: nav.deviceMemory }),
      }));
    measure();
    motion.addEventListener("change", measure);
    return () => motion.removeEventListener("change", measure);
  }, [sceneId]);

  // While the scene runs: session limit, FPS monitor, pause when hidden.
  useEffect(() => {
    if (mode !== "scene") return;
    const expire = window.setTimeout(
      () => setInputs((current) => ({ ...current, sessionExpired: true })),
      maxSessionSeconds * 1000,
    );

    const samples: number[] = [];
    let frames = 0;
    let windowStart = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - windowStart >= 1000) {
        samples.push((frames * 1000) / (now - windowStart));
        frames = 0;
        windowStart = now;
        // Skip the first sample: it includes scene start-up.
        if (fpsBreached(samples.slice(1), fpsFloor)) {
          setInputs((current) => ({ ...current, fpsBelowFloor: true }));
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // rAF stops in hidden tabs; reset the window so the gap is not read as low FPS.
    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setPaused(hidden);
      samples.length = 0;
      frames = 0;
      windowStart = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(expire);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode, maxSessionSeconds, fpsFloor]);

  return (
    <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-lg border border-border/70 bg-[#0c1426]">
      {mode === "scene" && Scene ? (
        <SceneErrorBoundary onError={() => setInputs((current) => ({ ...current, errorThrown: true }))}>
          <Scene paused={paused} />
        </SceneErrorBoundary>
      ) : (
        // A plain <img> keeps the fallback dependency-free; it is a small same-origin file.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallbackSrc} alt={fallbackAlt} width={512} height={512} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
