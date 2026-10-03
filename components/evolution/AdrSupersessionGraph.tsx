"use client";

import * as Plot from "@observablehq/plot";
import { useMemo } from "react";
import { adrGraph } from "@/lib/evolution/derive";
import type { EvolutionEvent } from "@/lib/evolution/load";
import { usePlot } from "./usePlot";

/**
 * ADR lineage as a static hierarchical layout (no force simulation, no d3 import):
 * x is the ADR date, y is the ADR number (one row each), arrows run from a
 * superseded ADR to the ADR that replaced it.
 */
export function AdrSupersessionGraph({ events }: { events: EvolutionEvent[] }) {
  const { nodes, links } = useMemo(() => adrGraph(events), [events]);

  const ref = usePlot(
    (width) => {
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const arrows = links.flatMap((l) => {
        const a = byId.get(l.from);
        const b = byId.get(l.to);
        return a && b ? [{ x1: new Date(a.date), y1: a.num, x2: new Date(b.date), y2: b.num }] : [];
      });
      const data = nodes.map((n) => ({
        ...n,
        when: new Date(n.date),
        tip: `${n.id}: ${n.title}\n${n.date.slice(0, 10)}${n.superseded ? "\nSuperseded" : ""}`,
      }));
      return Plot.plot({
        width,
        height: Math.max(260, nodes.length * 22 + 70),
        marginLeft: 56,
        marginRight: 24,
        style: { background: "transparent", color: "inherit", fontSize: "12px" },
        x: { type: "time", label: null, grid: true },
        y: { label: null, reverse: true, tickFormat: (d: number) => `ADR-${String(d).padStart(3, "0")}`, ticks: nodes.length },
        marks: [
          Plot.ruleY(data, { y: "num", stroke: "currentColor", strokeOpacity: 0.08 }),
          Plot.arrow(arrows, {
            x1: "x1",
            y1: "y1",
            x2: "x2",
            y2: "y2",
            stroke: "#e06c75",
            strokeWidth: 2,
            bend: true,
            headLength: 14,
          }),
          Plot.dot(data, {
            x: "when",
            y: "num",
            r: 6,
            fill: (d: { superseded: boolean }) => (d.superseded ? "#e06c75" : "#d9b46a"),
            stroke: "currentColor",
            strokeOpacity: 0.4,
            title: "tip",
            tip: true,
          }),
        ],
      });
    },
    [nodes, links],
  );

  if (nodes.length === 0) return <p className="text-sm text-muted-foreground">No ADR events in the archive.</p>;

  return (
    <div>
      <div ref={ref} className="overflow-x-auto rounded-lg border border-border/70 bg-navy-deep/40 p-4" />
      <p className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#d9b46a" }} aria-hidden /> ADR in force
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#e06c75" }} aria-hidden /> Superseded
          (arrow points to the replacement)
        </span>
      </p>
      <details className="mt-3 text-sm text-muted-foreground">
        <summary className="cursor-pointer text-foreground/80">Table view</summary>
        <ul className="mt-2 space-y-1">
          {nodes.map((n) => (
            <li key={n.id}>
              <span className="font-mono text-xs">{n.id}</span> {n.title} ({n.date.slice(0, 10)})
              {links.filter((l) => l.from === n.id).map((l) => ` — superseded by ${l.to}`)}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
