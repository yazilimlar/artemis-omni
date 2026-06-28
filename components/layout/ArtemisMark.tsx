import * as React from "react";

/**
 * Artemis mark — a crescent with a compass/dividers motif, pairing the Artemis
 * identity with the engineering/surveying tradition.
 * Pure inline SVG so it inherits `currentColor` and scales crisply.
 */
export function ArtemisMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Artemis Omni"
      className={className}
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
      {/* Crescent */}
      <path
        d="M30 8a17 17 0 1 0 0 32 14 14 0 0 1 0-32Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Compass / dividers */}
      <path
        d="M24 14l5 18M24 14l-5 18"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="14" r="1.6" fill="currentColor" />
    </svg>
  );
}
