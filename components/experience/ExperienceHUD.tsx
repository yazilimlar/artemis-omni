"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { ExperienceMode } from "@/components/experience/ModeController";

/**
 * Heads-up display for the Experience Engine. Placeholder only — shows the active
 * mode and slots for future telemetry (camera, confidence, data source). No 3D.
 */
export function ExperienceHUD({
  mode,
  className,
}: {
  mode: ExperienceMode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-border/60 bg-navy-deep/60 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-silver/80",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-node" />
        Artemis Experience
      </span>
      <span className="text-gold-soft">mode: {mode}</span>
      <span className="hidden sm:inline">human-reviewed · audit-aware</span>
    </div>
  );
}
