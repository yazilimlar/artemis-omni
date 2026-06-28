"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Experience modes inspired by the advanced demo references. These establish the
 * naming and state shape now so future WebGL / Three.js / R3F camera + interaction
 * logic can be introduced behind the same boundary without refactoring callers.
 *
 * NOTE: placeholder only — no 3D engine is imported or implemented yet.
 */
export type ExperienceMode =
  | "manual-explore"
  | "system-orbit"
  | "guided-executive-tour"
  | "risk-timeline"
  | "focus-jump"
  | "explode-system"
  | "data-path"
  | "blueprint";

export const EXPERIENCE_MODES: { id: ExperienceMode; label: string; hint: string }[] = [
  { id: "manual-explore", label: "Manual Explore", hint: "Free navigation of the scene." },
  { id: "system-orbit", label: "System Orbit", hint: "Orbit the whole system." },
  { id: "guided-executive-tour", label: "Guided Executive Tour", hint: "Narrated decision walkthrough." },
  { id: "risk-timeline", label: "Risk Timeline", hint: "Risk/opportunity over time." },
  { id: "focus-jump", label: "Focus Jump", hint: "Jump to a specific node." },
  { id: "explode-system", label: "Explode System", hint: "Separate the layers." },
  { id: "data-path", label: "Data Path", hint: "Trace data from source to decision." },
  { id: "blueprint", label: "Blueprint", hint: "Technical blueprint overlay." },
];

export function ModeController({
  active,
  onChange,
  className,
}: {
  active: ExperienceMode;
  onChange: (mode: ExperienceMode) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="tablist" aria-label="Experience modes">
      {EXPERIENCE_MODES.map((m) => {
        const isActive = m.id === active;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={m.hint}
            onClick={() => onChange(m.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs transition-colors",
              isActive
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-border/70 bg-navy-deep/40 text-foreground/70 hover:border-gold/40 hover:text-gold",
            )}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
