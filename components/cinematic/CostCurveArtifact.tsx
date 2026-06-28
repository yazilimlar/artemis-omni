import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The primary floating artifact: a 5D cashflow forecast curve.
 * Rendered as a lightweight, crisp SVG (no WebGL) so it works everywhere and
 * costs almost nothing to paint. An S-curve (planned vs actual) with a forecast
 * band — the canonical project-controls cash-flow visual.
 */
export function CostCurveArtifact({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="5D cashflow forecast curve: Bid Estimate versus Actuals with PM Forecast and system-generated projection band"
    >
      <defs>
        <linearGradient id="cc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(41 64% 56% / 0.35)" />
          <stop offset="100%" stopColor="hsl(41 64% 56% / 0)" />
        </linearGradient>
        <linearGradient id="cc-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(210 18% 78%)" />
          <stop offset="100%" stopColor="hsl(41 64% 56%)" />
        </linearGradient>
      </defs>

      {/* Blueprint grid */}
      <g stroke="hsl(210 18% 78% / 0.10)" strokeWidth="1">
        {[40, 80, 120, 160].map((y) => (
          <line key={`h${y}`} x1="16" y1={y} x2="304" y2={y} />
        ))}
        {[80, 144, 208, 272].map((x) => (
          <line key={`v${x}`} x1={x} y1="16" x2={x} y2="184" />
        ))}
      </g>

      {/* Axes */}
      <line x1="16" y1="184" x2="304" y2="184" stroke="hsl(210 18% 78% / 0.4)" strokeWidth="1.2" />
      <line x1="16" y1="16" x2="16" y2="184" stroke="hsl(210 18% 78% / 0.4)" strokeWidth="1.2" />

      {/* Forecast band */}
      <path
        d="M16 168 C 90 150, 150 96, 210 60 S 300 26, 304 22 L304 40 C 260 44, 200 86, 150 116 S 70 162, 16 176 Z"
        fill="hsl(41 64% 56% / 0.08)"
      />

      {/* Planned S-curve (silver, dashed) */}
      <path
        d="M16 176 C 90 160, 150 104, 210 66 S 300 30, 304 26"
        fill="none"
        stroke="hsl(210 18% 78% / 0.55)"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />

      {/* Actual S-curve (gold) + area */}
      <path
        d="M16 178 C 84 168, 138 120, 196 82 S 286 40, 304 34 L304 184 L16 184 Z"
        fill="url(#cc-fill)"
      />
      <path
        d="M16 178 C 84 168, 138 120, 196 82 S 286 40, 304 34"
        fill="none"
        stroke="url(#cc-line)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Data nodes */}
      {[
        [16, 178],
        [110, 138],
        [196, 82],
        [304, 34],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="hsl(42 38% 92%)" />
      ))}
    </svg>
  );
}
