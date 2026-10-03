import type { EvolutionEvent, EvolutionEventType } from "./load";

/** Pure derivations over events; safe to import from client components. */

export type MonthGroup = { key: string; label: string; events: EvolutionEvent[] };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Events in chronological order (date, then id), grouped by UTC month. */
export function groupByMonth(events: readonly EvolutionEvent[]): MonthGroup[] {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const groups: MonthGroup[] = [];
  for (const event of sorted) {
    const key = event.date.slice(0, 7);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      const month = Number(key.slice(5, 7));
      group = { key, label: `${MONTHS[month - 1] ?? "?"} ${key.slice(0, 4)}`, events: [] };
      groups.push(group);
    }
    group.events.push(event);
  }
  return groups;
}

export const TYPE_LABELS: Record<EvolutionEventType, string> = {
  adr_added: "ADR added",
  adr_superseded: "ADR superseded",
  product_registered: "Product registered",
  product_status_changed: "Product status changed",
  route_added: "Route added",
  route_removed: "Route removed",
  milestone_shipped: "Milestone shipped",
  pr_merged: "PR merged",
  registry_changed: "Registry changed",
  security_fix: "Security fix",
  scene_registered: "Scene registered",
};

/** Dot colours; mid-tone hues that read on both the dark and light themes. */
export const TYPE_COLORS: Record<EvolutionEventType, string> = {
  adr_added: "#d9b46a",
  adr_superseded: "#e06c75",
  product_registered: "#4fb3ff",
  product_status_changed: "#7cc7e8",
  route_added: "#7a8aa3",
  route_removed: "#b07a7a",
  milestone_shipped: "#6fcf97",
  pr_merged: "#a78bfa",
  registry_changed: "#f2a65a",
  security_fix: "#ff6b6b",
  scene_registered: "#56d6c2",
};

export type AdrNode = { id: string; num: number; title: string; date: string; superseded: boolean };
export type AdrLink = { from: string; to: string };

const adrNumber = (id: string) => Number(id.replace("ADR-", ""));

/** ADR nodes (from adr_added) and supersession links (from adr_superseded: references[0] superseded by references[1]). */
export function adrGraph(events: readonly EvolutionEvent[]): { nodes: AdrNode[]; links: AdrLink[] } {
  const links: AdrLink[] = events
    .filter((e) => e.type === "adr_superseded" && e.references.length >= 2)
    .map((e) => ({ from: e.references[0], to: e.references[1] }));
  const superseded = new Set(links.map((l) => l.from));
  const nodes = events
    .filter((e) => e.type === "adr_added")
    .map((e) => {
      const id = e.references[0] ?? e.id;
      return {
        id,
        num: adrNumber(id),
        title: e.title.replace(/^ADR-\d+:\s*(ADR-\d+\s*[—-]\s*)?/, ""),
        date: e.date,
        superseded: superseded.has(id),
      };
    })
    .sort((a, b) => a.num - b.num);
  return { nodes, links };
}

export type StatusPoint = { date: string; status: string; count: number };

/**
 * Products per lifecycle status over time, from product_registered and
 * product_status_changed events. One snapshot per distinct event date, every
 * status present in every snapshot (zero-filled) so the stack is well formed.
 */
export function registryStatusSeries(events: readonly EvolutionEvent[]): {
  points: StatusPoint[];
  statuses: string[];
} {
  const relevant = events
    .filter((e) => (e.type === "product_registered" || e.type === "product_status_changed") && e.product)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const current = new Map<string, string>();
  const snapshots: { date: string; counts: Map<string, number> }[] = [];
  const statuses = new Set<string>();

  const snapshot = (date: string) => {
    const counts = new Map<string, number>();
    for (const status of current.values()) counts.set(status, (counts.get(status) ?? 0) + 1);
    const last = snapshots[snapshots.length - 1];
    if (last && last.date === date) last.counts = counts;
    else snapshots.push({ date, counts });
  };

  for (const event of relevant) {
    const product = event.product as string;
    let status: string | null = null;
    if (event.type === "product_registered") {
      status = event.outcome.match(/lifecycle=(\S+)/)?.[1] ?? null;
    } else {
      status = event.summary.match(/lifecycle: \S+ -> (\S+?)(?:;|$)/)?.[1] ?? null;
    }
    if (!status) continue;
    current.set(product, status);
    statuses.add(status);
    snapshot(event.date);
  }

  const ordered = [...statuses].sort();
  const points = snapshots.flatMap(({ date, counts }) =>
    ordered.map((status) => ({ date, status, count: counts.get(status) ?? 0 })),
  );
  return { points, statuses: ordered };
}
