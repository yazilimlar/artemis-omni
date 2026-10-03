import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import type { EvolutionStats } from "@/lib/evolution/load";

/** Six headline numbers from data/evolution.json; styled like the /control totals. */
export function StatsPanel({ stats, generatedAt }: { stats: EvolutionStats; generatedAt: string | null }) {
  const cards: { label: string; value: number | undefined; note?: string }[] = [
    { label: "ADRs", value: stats.adrs_total, note: `${stats.adrs_superseded ?? "—"} superseded` },
    { label: "Products", value: stats.products_total },
    { label: "Scenes", value: stats.scenes_total },
    { label: "Milestones shipped", value: stats.milestones_shipped },
    { label: "PRs merged", value: stats.prs_merged },
    { label: "Verified capabilities", value: stats.verified_capabilities },
  ];

  return (
    <section className="border-b border-border/60 py-12 lg:py-16">
      <Container>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {cards.map((card) => (
            <div key={card.label} className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
              <dt className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">{card.label}</dt>
              <dd className="display-serif mt-2 text-4xl text-parchment">{card.value ?? "—"}</dd>
              {card.note ? <p className="mt-1 text-xs text-muted-foreground">{card.note}</p> : null}
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge>noindex</Badge>
          <Badge>live derived</Badge>
          <span>{generatedAt ? `Generated ${generatedAt}` : "No data file found"}</span>
        </div>
      </Container>
    </section>
  );
}
