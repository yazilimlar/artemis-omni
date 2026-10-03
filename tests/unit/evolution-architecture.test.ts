import { describe, expect, it } from "vitest";
import { architectureEdges, architectureNodes } from "@/lib/evolution/architecture";
import { VERTEX_BUDGET, vertexCount } from "@/components/scenes/evolution-architecture-map/geometry";
import { adrGraph, groupByMonth, registryStatusSeries } from "@/lib/evolution/derive";
import type { EvolutionEvent } from "@/lib/evolution/load";

function event(over: Partial<EvolutionEvent> & Pick<EvolutionEvent, "id" | "type" | "date">): EvolutionEvent {
  return { title: "", summary: "", references: [], division: null, product: null, outcome: "", ...over };
}

describe("architecture map data", () => {
  it("has 12-20 uniquely identified nodes", () => {
    const ids = architectureNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(12);
    expect(ids.length).toBeLessThanOrEqual(20);
  });

  it("only has edges between existing nodes", () => {
    const ids = new Set(architectureNodes.map((n) => n.id));
    for (const e of architectureEdges) {
      expect(ids.has(e.from), e.from).toBe(true);
      expect(ids.has(e.to), e.to).toBe(true);
    }
  });

  it("stays under 3,000 vertices", () => {
    expect(vertexCount()).toBeLessThan(VERTEX_BUDGET);
  });
});

describe("evolution derivations", () => {
  it("groups events by month, oldest first", () => {
    const groups = groupByMonth([
      event({ id: "b", type: "pr_merged", date: "2026-10-02T00:00:00.000Z" }),
      event({ id: "a", type: "pr_merged", date: "2026-09-01T00:00:00.000Z" }),
      event({ id: "c", type: "pr_merged", date: "2026-10-03T00:00:00.000Z" }),
    ]);
    expect(groups.map((g) => g.key)).toEqual(["2026-09", "2026-10"]);
    expect(groups[1].events.map((e) => e.id)).toEqual(["b", "c"]);
    expect(groups[0].label).toBe("Sep 2026");
  });

  it("builds ADR nodes and supersession links", () => {
    const { nodes, links } = adrGraph([
      event({ id: "EVT-adr-002", type: "adr_added", date: "2026-06-28T00:00:00.000Z", title: "ADR-002: ADR-002 — Cinematic", references: ["ADR-002"] }),
      event({ id: "EVT-adr-015", type: "adr_added", date: "2026-10-01T00:00:00.000Z", title: "ADR-015: Immersive", references: ["ADR-015"] }),
      event({ id: "EVT-adr-002-superseded", type: "adr_superseded", date: "2026-10-01T00:00:00.000Z", references: ["ADR-002", "ADR-015"] }),
    ]);
    expect(links).toEqual([{ from: "ADR-002", to: "ADR-015" }]);
    expect(nodes.find((n) => n.id === "ADR-002")).toMatchObject({ superseded: true, title: "Cinematic" });
    expect(nodes.find((n) => n.id === "ADR-015")?.superseded).toBe(false);
  });

  it("tracks product lifecycle counts over time with zero-filled statuses", () => {
    const { points, statuses } = registryStatusSeries([
      event({ id: "r1", type: "product_registered", date: "2026-07-01T00:00:00.000Z", product: "a", outcome: "lifecycle=concept" }),
      event({ id: "r2", type: "product_registered", date: "2026-07-01T00:00:00.000Z", product: "b", outcome: "lifecycle=concept" }),
      event({ id: "c1", type: "product_status_changed", date: "2026-08-01T00:00:00.000Z", product: "a", summary: "lifecycle: concept -> active_lab; maturity: x -> y" }),
    ]);
    expect(statuses).toEqual(["active_lab", "concept"]);
    const at = (date: string, status: string) => points.find((p) => p.date.startsWith(date) && p.status === status)?.count;
    expect(at("2026-07-01", "concept")).toBe(2);
    expect(at("2026-07-01", "active_lab")).toBe(0);
    expect(at("2026-08-01", "concept")).toBe(1);
    expect(at("2026-08-01", "active_lab")).toBe(1);
  });
});
