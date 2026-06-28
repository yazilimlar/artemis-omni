"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ModeController, type ExperienceMode } from "@/components/experience/ModeController";
import { ExperienceHUD } from "@/components/experience/ExperienceHUD";
import { BlueprintOverlay } from "@/components/experience/BlueprintOverlay";
import { HotspotPanel, type Hotspot } from "@/components/experience/HotspotPanel";
import { InsightCards } from "@/components/experience/InsightCards";

/**
 * ArtemisExperienceShell — the client boundary and layout for the future
 * cinematic Artemis Experience Engine.
 *
 * This is a LIGHTWEIGHT PLACEHOLDER. It establishes:
 *  - the RSC/Client boundary ("use client" here and in every child),
 *  - the state shape (active mode + selected hotspot),
 *  - the layout (viewport + HUD + mode controller + hotspot panel + insights),
 *  - extension points where WebGL / Three.js / React Three Fiber, camera controls,
 *    and interactive mode logic will mount later.
 *
 * No 3D engine is imported or implemented yet.
 */
export function ArtemisExperienceShell({
  className,
  initialMode = "manual-explore",
}: {
  className?: string;
  initialMode?: ExperienceMode;
}) {
  const [mode, setMode] = React.useState<ExperienceMode>(initialMode);
  const [hotspot, setHotspot] = React.useState<Hotspot | null>(null);

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-navy-deep/30 p-4", className)}>
      <ExperienceHUD mode={mode} className="mb-3" />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Viewport — WebGL / R3F scene mounts here in a future branch */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-silver/15 bg-lunar-radial">
          <BlueprintOverlay active={mode === "blueprint"} />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div>
              <p className="eyebrow">Experience Viewport</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Cinematic scene mounts here in a future branch (WebGL / React Three
                Fiber). This placeholder establishes the boundary and layout only.
              </p>
              <button
                type="button"
                onClick={() =>
                  setHotspot({
                    id: "sample",
                    title: "Sample hotspot",
                    detail:
                      "In the live engine, selecting a scene element shows what it is, the connected data, the logic applied, and the human-review point.",
                    confidence: "Illustrative · confidence stated per output",
                  })
                }
                className="mt-5 rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-xs text-gold hover:bg-gold/15"
              >
                Simulate hotspot select
              </button>
            </div>
          </div>
        </div>

        {/* Side rail */}
        <div className="flex flex-col gap-3">
          <HotspotPanel hotspot={hotspot} onClose={() => setHotspot(null)} />
          <InsightCards />
        </div>
      </div>

      <ModeController active={mode} onChange={setMode} className="mt-4" />
    </div>
  );
}

export default ArtemisExperienceShell;
