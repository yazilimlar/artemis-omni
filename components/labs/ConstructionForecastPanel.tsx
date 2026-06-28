import * as React from "react";
import { forecastSeries, forecastLegend } from "@/lib/artemis/data/syntheticWorkbenchData";

/**
 * Forecast panel — a lightweight inline SVG line chart (no chart library, no 3D/canvas)
 * comparing Bid Estimate vs Actuals vs PM Forecast vs System Projection across
 * synthetic forecast periods. Cumulative cost in $M (synthetic).
 */
const W = 640;
const H = 300;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 20;
const PAD_B = 40;
const MAX = 30; // $M ceiling for the synthetic data

const n = forecastSeries.length;
const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / (n - 1);
const y = (v: number) => PAD_T + (1 - v / MAX) * (H - PAD_T - PAD_B);

function path(key: "bid" | "actual" | "pmForecast" | "systemProjection") {
  let d = "";
  forecastSeries.forEach((p, i) => {
    const v = p[key];
    if (v == null) return;
    d += `${d === "" ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
  });
  return d.trim();
}

export function ConstructionForecastPanel() {
  return (
    <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="display-serif text-lg text-parchment">Forecast comparison</p>
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
          Cumulative cost · $M · synthetic
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Synthetic forecast comparison: Bid Estimate versus Actuals versus PM Forecast versus System Projection across forecast periods"
      >
        {/* gridlines */}
        <g stroke="hsl(210 18% 78% / 0.10)" strokeWidth="1">
          {[0, 10, 20, 30].map((v) => (
            <line key={v} x1={PAD_L} y1={y(v)} x2={W - PAD_R} y2={y(v)} />
          ))}
        </g>
        {/* y labels */}
        <g fill="hsl(215 18% 65%)" fontSize="10" fontFamily="monospace">
          {[0, 10, 20, 30].map((v) => (
            <text key={v} x={PAD_L - 8} y={y(v) + 3} textAnchor="end">
              {v}
            </text>
          ))}
        </g>
        {/* x labels */}
        <g fill="hsl(215 18% 65%)" fontSize="10" fontFamily="monospace">
          {forecastSeries.map((p, i) => (
            <text key={p.period} x={x(i)} y={H - PAD_B + 18} textAnchor="middle">
              {p.period}
            </text>
          ))}
        </g>
        {/* series */}
        {forecastLegend.map((s) => (
          <path
            key={s.key}
            d={path(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.key === "systemProjection" ? 2.4 : 1.8}
            strokeDasharray={s.key === "pmForecast" ? "5 4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {/* legend */}
      <div className="mt-3 flex flex-wrap gap-4">
        {forecastLegend.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
