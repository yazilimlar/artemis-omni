import * as React from "react";
import { SceneFallback } from "@/components/cinematic/SceneFallback";

/**
 * The visual shown to users who prefer reduced motion (and as the SSR default).
 * Renders the static scene with no animation. Semantically separate from
 * SceneFallback so the intent is explicit at the call site.
 */
export function ReducedMotionFallback({ className }: { className?: string }) {
  return <SceneFallback className={className} />;
}
