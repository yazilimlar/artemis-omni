"use client";

import * as React from "react";
import { ValueChainDiagram } from "./ValueChainDiagram";
import { ScatteredView } from "./ScatteredView";

type Mode = "scattered" | "unified";

/**
 * Before/after toggle for the value chain: the scattered reality of
 * disconnected project systems versus the unified, reviewable chain.
 */
export function ValueChainToggle() {
  const [mode, setMode] = React.useState<Mode>("unified");

  return (
    <div>
      <div
        role="group"
        aria-label="Signal view: scattered systems or unified chain"
        className="mb-5 inline-flex rounded-full border border-border/60 bg-navy-deep/40 p-1"
      >
        {(["scattered", "unified"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === m
                ? "bg-gold text-lunar"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "scattered" ? "Scattered" : "Unified"}
          </button>
        ))}
      </div>
      <div key={mode} className="vc-fade">
        {mode === "unified" ? (
          <ValueChainDiagram idPrefix="section-value-chain" />
        ) : (
          <ScatteredView />
        )}
      </div>
    </div>
  );
}
