"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type Hotspot = {
  id: string;
  title: string;
  detail: string;
  /** what-it-is / what-it-is-not framing per the implementation doctrine */
  confidence?: string;
};

/**
 * Side panel describing the currently selected hotspot in the experience.
 * Placeholder — future WebGL scenes will populate `hotspot` from scene picks.
 */
export function HotspotPanel({
  hotspot,
  onClose,
  className,
}: {
  hotspot: Hotspot | null;
  onClose?: () => void;
  className?: string;
}) {
  if (!hotspot) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border/60 bg-navy-deep/40 p-4 text-sm text-muted-foreground",
          className,
        )}
      >
        Select a hotspot to inspect what it is, what data connects, and the confidence level.
      </div>
    );
  }
  return (
    <div className={cn("rounded-lg border border-gold/30 bg-navy-deep/60 p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="display-serif text-base text-parchment">{hotspot.title}</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-gold"
            aria-label="Close hotspot"
          >
            ✕
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground/85">{hotspot.detail}</p>
      {hotspot.confidence ? (
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
          {hotspot.confidence}
        </p>
      ) : null}
    </div>
  );
}
