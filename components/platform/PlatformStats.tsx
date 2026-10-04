import { Container } from "@/components/ui/container";
import type { EvolutionEvent, EvolutionStats } from "@/lib/evolution/load";

/**
 * Four public stat cards. `events` must already be filtered with filterForPublic.
 * Scene and decision counts come from the public events, not from the archive's
 * totals, so internal-only items are never counted as "live" or "published".
 */
export function PlatformStats({
  events,
  stats,
  generatedAt,
}: {
  events: EvolutionEvent[];
  stats: EvolutionStats;
  generatedAt: string | null;
}) {
  const count = (type: EvolutionEvent["type"]) => events.filter((e) => e.type === type).length;
  const cards: { label: string; value: number | undefined; note?: string }[] = [
    { label: "Capabilities shipped", value: count("milestone_shipped") },
    {
      label: "Architectural decisions",
      value: count("adr_added"),
      note: stats.adrs_total ? `of ${stats.adrs_total} recorded` : undefined,
    },
    { label: "Products registered", value: stats.products_total },
    { label: "3D scenes live", value: count("scene_registered") },
  ];

  return (
    <section className="border-b border-border/60 py-12 lg:py-16">
      <Container>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
              <dt className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">{card.label}</dt>
              <dd className="display-serif mt-2 text-4xl text-parchment">{card.value ?? "—"}</dd>
              {card.note ? <p className="mt-1 text-xs text-muted-foreground">{card.note}</p> : null}
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          {generatedAt ? `Generated from the repository ${generatedAt.slice(0, 10)}. ` : ""}
          Public-safe items only.
        </p>
      </Container>
    </section>
  );
}
