"use client";

import { useState } from "react";
import { ArtemisEmblem } from "@/components/showcase/ArtemisEmblem";

/**
 * DianaDemonstrator — click-to-load facade for the Diana 3D demonstrator.
 *
 * The demonstrator is a 5.7 MB self-contained Three.js page, so nothing loads
 * until the visitor asks for it. The facade is a static branded panel;
 * the iframe is only created on click. Keyboard accessible, reduced-motion safe.
 */
export function DianaDemonstrator() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-gold/25 bg-lunar shadow-panel">
      {loaded ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src="/labs/diana-3d/"
          title="Diana 3D interactive demonstrator"
          allow="fullscreen"
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label="Load the interactive Diana 3D demonstrator"
          className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,182,90,0.10),transparent_65%)]"
            aria-hidden="true"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6" aria-hidden="true">
            <ArtemisEmblem className="h-20 w-20 opacity-90" />
            <span className="flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-sm text-gold-soft transition-colors group-hover:bg-gold/20">
              <svg width="14" height="14" viewBox="0 0 22 22" fill="currentColor">
                <polygon points="7,4.5 17.5,11 7,17.5" />
              </svg>
              Load interactive 3D
            </span>
            <span className="font-papermono text-[0.66rem] uppercase tracking-wider text-muted-foreground">
              diana-3d · 5.7 MB · loads on click
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
