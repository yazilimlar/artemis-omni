"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ERAS } from "@/data/troy/eras";
import { atlasMotion } from "@/lib/time-atlas/motion";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { TroyScene } from "./scene/TroyScene";
import { EraCaption } from "./ui/EraCaption";
import { TimelineRail } from "./ui/TimelineRail";
import { LayerToggles } from "./ui/LayerToggles";
import { PoiSheet } from "./ui/PoiSheet";

const ERA_STOPS = ERAS.map((era) => era.order / (ERAS.length - 1));

/**
 * Full-viewport vertical experience: a sticky 3D stage with a scroll-driven
 * timeline underneath it. The canvas keeps pointer events (tap = POI select)
 * while `touch-action: pan-y` lets vertical drags scroll the timeline.
 */
export function TroyExperience() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const setActiveEra = useTimeAtlas((s) => s.setActiveEra);
  const activeEraId = useTimeAtlas((s) => s.activeEraId);
  const selectedPoiId = useTimeAtlas((s) => s.selectedPoiId);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const eraTint = useTransform(
    scrollYProgress,
    ERA_STOPS,
    ERAS.map((era) => era.overlayTint),
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = value * (ERAS.length - 1);
    atlasMotion.eraIndex = index;
    const nearest = ERAS[Math.min(ERAS.length - 1, Math.max(0, Math.round(index)))];
    if (nearest.id !== useTimeAtlas.getState().activeEraId) setActiveEra(nearest.id);
  });

  // Land on the fully realized era (600 BC), one section down.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.clientHeight;
  }, []);

  // Pointer + device-tilt parallax, honoring prefers-reduced-motion.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      atlasMotion.reducedMotion = mql.matches;
    };
    syncReduced();
    const onPointer = (e: PointerEvent) => {
      atlasMotion.parallaxX = (e.clientX / window.innerWidth - 0.5) * 2;
      atlasMotion.parallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    // No permission prompt: on iOS (which requires one) we simply fall back
    // to pointer parallax; on Android tilt works out of the box.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      atlasMotion.parallaxX = Math.max(-1, Math.min(1, e.gamma / 28));
      atlasMotion.parallaxY = Math.max(-1, Math.min(1, (e.beta - 42) / 28));
    };
    mql.addEventListener("change", syncReduced);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, true);
    return () => {
      mql.removeEventListener("change", syncReduced);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt, true);
    };
  }, []);

  const jumpToEra = (order: number) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: order * el.clientHeight, behavior: "smooth" });
  };

  const showToggles = activeEraId === "troy-600bc" && !selectedPoiId;

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-[60] snap-y snap-proximity overflow-y-auto overscroll-contain bg-[#241a2e]"
    >
      {/* Sticky 3D stage — pinned for the whole timeline. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Golden-hour sky behind the transparent canvas. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #f6c67f 0%, #eba96c 26%, #dd9a66 38%, #96586a 62%, #241a2e 100%)",
          }}
          aria-hidden
        />
        <TroyScene />
        {/* Era mood tint driven by scroll. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: eraTint }}
          aria-hidden
        />
        {/* Cinematic vignette. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 110px 18px rgba(10,6,18,0.42)" }}
          aria-hidden
        />

        {/* HUD */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-[max(env(safe-area-inset-top),1rem)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Artemis Time Atlas
          </p>
          <h1 className="mt-0.5 font-serif text-lg tracking-wide text-parchment">
            Troy <span className="text-white/40">·</span> Ilion
          </h1>
        </header>

        <TimelineRail onJump={jumpToEra} />

        <div className="absolute inset-x-0 bottom-0 z-20">
          <LayerToggles visible={showToggles} />
        </div>

        <PoiSheet />
      </div>

      {/* Scroll sections — the first one overlaps the sticky stage. */}
      <div className="-mt-[100svh]">
        {ERAS.map((era) => (
          <section
            key={era.id}
            className="pointer-events-none relative flex h-[100svh] snap-start flex-col items-center justify-end px-4 pb-24"
            aria-label={`${era.year} — ${era.title}`}
          >
            <EraCaption era={era} />
          </section>
        ))}
      </div>
    </div>
  );
}
