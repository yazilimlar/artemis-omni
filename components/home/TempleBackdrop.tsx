"use client";

import * as React from "react";

/**
 * Full-bleed Temple of Artemis backdrop with scroll-linked parallax.
 *
 * The layer is 118% of the hero height, anchored so the pediment sits at the
 * hero's top edge at rest. As the hero scrolls out, the layer drifts upward
 * and scales slightly — a slow dolly that runs pediment → columns → stairs.
 * Static when the user prefers reduced motion.
 */
export function TempleBackdrop() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const section = el.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // 0 while the hero fills the viewport, 1 as its bottom edge reaches the top.
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      el.style.transform =
        `translate3d(0, ${(-progress * 12).toFixed(2)}%, 0) ` +
        `scale(${(1.04 + progress * 0.05).toFixed(3)})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 top-0 h-[118%] will-change-transform"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <picture className="absolute inset-0 block h-full w-full">
        <source
          media="(min-width: 768px)"
          srcSet="/images/temple-bg-desktop.webp"
          type="image/webp"
        />
        <source media="(min-width: 768px)" srcSet="/images/temple-bg-desktop.jpg" />
        <source srcSet="/images/temple-bg-mobile.webp" type="image/webp" />
        <img
          src="/images/temple-bg-mobile.jpg"
          alt=""
          className="h-full w-full object-cover object-top"
          fetchPriority="high"
        />
      </picture>
      {/* Blueprint duotone: brand blue takes the photo's hue, keeps its light. */}
      <div className="absolute inset-0 bg-[#274b8f] opacity-45 mix-blend-color" />
      {/* Readability washes. --lunar flips with the theme (dark at night,
          light in day), so overlaid type stays readable in both. */}
      <div className="absolute inset-0 bg-lunar/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-lunar/40 via-transparent to-background" />
      {/* Fine blueprint grid drawn over the faded photo, whisper-quiet. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
    </div>
  );
}
