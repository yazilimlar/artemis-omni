"use client";

import * as React from "react";

const MEANDER_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='20' viewBox='0 0 28 20'%3E%3Cpath d='M4 16V4h20v10H10V8h8' fill='none' stroke='%23c9a227' stroke-opacity='0.55' stroke-width='1.8'/%3E%3C/svg%3E\")";

/**
 * Cinematic closer before the footer: the blueprint wireframe build-up,
 * trimmed to its clean segments (the AI-gibberish dashboard middle is cut),
 * ending on the Artemis mark. Ambient autoplay loop; a still poster when
 * the user prefers reduced motion.
 */
export function CinematicCloser() {
  const [mode, setMode] = React.useState<"pending" | "video" | "poster">("pending");

  React.useEffect(() => {
    setMode(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "poster"
        : "video"
    );
  }, []);

  const railStyle = {
    backgroundImage: MEANDER_BG,
    backgroundSize: "28px 20px",
    backgroundRepeat: "repeat-x",
  } as const;

  return (
    <section
      aria-label="Artemis blueprint cinematic"
      className="relative overflow-hidden border-t border-border/60"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-5 opacity-70"
        style={{ ...railStyle, backgroundPosition: "center top" }}
      />
      {mode === "video" ? (
        <video
          className="h-[52vh] min-h-[380px] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/blueprint-build-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/blueprint-build.mp4" type="video/mp4" />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/video/blueprint-build-poster.jpg"
          alt=""
          aria-hidden="true"
          className="h-[52vh] min-h-[380px] w-full object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"
      />
      <p className="absolute bottom-5 right-6 font-mono text-[0.66rem] uppercase tracking-wider text-muted-foreground">
        Sample visualization
      </p>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-5 opacity-70"
        style={{ ...railStyle, backgroundPosition: "center bottom" }}
      />
    </section>
  );
}
