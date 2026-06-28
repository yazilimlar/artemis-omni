"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Blueprint overlay — a subtle grid/annotation layer shown over the experience
 * viewport (e.g. in Blueprint mode). Placeholder; pure CSS, no 3D.
 */
export function BlueprintOverlay({
  active = false,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-blueprint-grid bg-grid transition-opacity duration-500",
        active ? "opacity-70" : "opacity-20",
        className,
      )}
    >
      <span className="absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-widest text-silver/50">
        blueprint
      </span>
    </div>
  );
}
