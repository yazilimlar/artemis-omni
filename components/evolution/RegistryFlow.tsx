"use client";

import * as Plot from "@observablehq/plot";
import { useMemo } from "react";
import { registryStatusSeries } from "@/lib/evolution/derive";
import type { EvolutionEvent } from "@/lib/evolution/load";
import { usePlot } from "./usePlot";

const PALETTE = ["#4fb3ff", "#d9b46a", "#6fcf97", "#e06c75", "#a78bfa", "#56d6c2", "#f2a65a", "#7a8aa3"];

/** Products per registry status over time, as a stacked area. */
export function RegistryFlow({ events }: { events: EvolutionEvent[] }) {
  const { points, statuses } = useMemo(() => registryStatusSeries(events), [events]);

  const ref = usePlot(
    (width) =>
      Plot.plot({
        width,
        height: 340,
        marginLeft: 40,
        style: { background: "transparent", color: "inherit", fontSize: "12px" },
        x: { type: "time", label: null, grid: true },
        y: { label: "Products", grid: true },
        color: { domain: statuses, range: PALETTE, legend: true },
        marks: [
          Plot.areaY(points.map((p) => ({ ...p, when: new Date(p.date) })), {
            x: "when",
            y: "count",
            fill: "status",
            curve: "step-after",
            fillOpacity: 0.85,
            title: (d: { status: string; count: number }) => `${d.status}: ${d.count}`,
            tip: true,
          }),
          Plot.ruleY([0]),
        ],
      }),
    [points, statuses],
  );

  if (points.length === 0) return <p className="text-sm text-muted-foreground">No registry events in the archive.</p>;

  const last = points.filter((p) => p.date === points[points.length - 1].date);
  return (
    <div>
      <div ref={ref} className="overflow-x-auto rounded-lg border border-border/70 bg-navy-deep/40 p-4" />
      <details className="mt-3 text-sm text-muted-foreground">
        <summary className="cursor-pointer text-foreground/80">Latest snapshot as text</summary>
        <ul className="mt-2 space-y-1">
          {last.map((p) => (
            <li key={p.status}>
              <span className="font-mono text-xs">{p.status}</span>: {p.count}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
