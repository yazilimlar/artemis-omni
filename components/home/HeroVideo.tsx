"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cinematic loop for the homepage and /integrate. The poster renders first; the
 * video source is attached only near the viewport, and never for reduced motion,
 * save-data, or slow connections (the homepage performance posture of ADR-016).
 */

const VIDEO_SRC = "/video/artemis-hero.mp4";
const POSTER_SRC = "/video/artemis-hero-poster.jpg";
/** Measured with ffprobe (10.005 s). */
const LOOP_SECONDS = 10;
const SLOW_NETWORKS = new Set(["slow-2g", "2g", "3g"]);

/** Pure gate for playing the loop; false keeps the poster image. */
export function shouldPlayVideo(env: { reducedMotion: boolean; effectiveType?: string; saveData?: boolean }): boolean {
  if (env.reducedMotion || env.saveData) return false;
  return !(env.effectiveType && SLOW_NETWORKS.has(env.effectiveType));
}

const FACTS = ["SYSTEM ID: ARTEMIS-OMNI-2026", "STATUS: PUBLIC-SAFE PROOF", `LOOP: ${LOOP_SECONDS}s`];

export function HeroVideo({ variant = "full" }: { variant?: "full" | "compact" }) {
  const frame = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"poster" | "video">("poster");
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setMode(
        shouldPlayVideo({
          reducedMotion: motion.matches,
          effectiveType: nav.connection?.effectiveType,
          saveData: nav.connection?.saveData,
        })
          ? "video"
          : "poster",
      );
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = frame.current;
    if (!element || nearViewport) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [nearViewport]);

  const compact = variant === "compact";

  return (
    <div className={compact ? "w-full" : "mx-auto w-full max-w-6xl"}>
      <div
        ref={frame}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-signal-soft/35 bg-navy-deep shadow-[0_0_0_1px_hsl(var(--crescent-blue)/0.12),0_24px_80px_-24px_hsl(var(--crescent-blue)/0.35)]"
      >
        {mode === "video" && nearViewport ? (
          <video
            className="h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Artemis system visualization loop (sample visualization, no audio)"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_SRC}
            alt="Artemis system visualization: wireframe building over a blueprint grid (sample visualization)"
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft/80">
        {FACTS.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>

      {compact ? null : (
        <div className="mt-8 max-w-2xl">
          <h2 className="display-serif text-balance text-3xl text-parchment sm:text-4xl">
            Witness the Living Execution Bridge
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Field reports, schedules, cost codes, and forecasts usually live in separate systems
            that never quite agree. Artemis draws those scattered signals into one reviewable
            control plane, so every executive decision traces back to its source.
          </p>
        </div>
      )}
    </div>
  );
}
