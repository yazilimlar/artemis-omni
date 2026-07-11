"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Database,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type CivicBidScope = "construction" | "all";
type CivicBidMode = "live_official" | "sample_fallback" | "source_unavailable";

type ScoringModelItem = {
  key: string;
  label: string;
  weight: number;
  description: string;
};

type ScoreComponent = ScoringModelItem & {
  score: number;
  weightedScore: number;
  note: string;
};

type QueueItem = {
  opportunityId: string;
  title: string;
  agency: string;
  sourceName: string;
  dueDate: string | null;
  compositeScore: number;
  tier: "A" | "B" | "C";
  constructionRelevant: boolean;
  components: ScoreComponent[];
  rationale: string[];
};

type CivicBidQueueResponse = {
  schemaVersion: number;
  product: string;
  status: "ok" | "degraded" | "unavailable";
  mode: CivicBidMode;
  scope: CivicBidScope;
  fromLive: boolean;
  fallbackUsed: boolean;
  retrievedAt: string;
  source: {
    id: string;
    name: string;
    url: string;
    apiUrl: string;
    jurisdiction: string;
    sourceOfTruth: string;
  };
  dataSourceLabel?: string;
  officialSourceOfTruth: string;
  scopeNote?: string;
  warning?: string;
  sourceCount: number;
  excludedCount: number;
  count: number;
  scoringModel: ScoringModelItem[];
  constructionRelevanceThreshold: number;
  data: QueueItem[];
};

function formatDate(value: string | null): string {
  if (!value) return "Date not published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(date);
}

function formatRetrievedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(date);
}

function modeLabel(mode: CivicBidMode): string {
  if (mode === "live_official") return "Live official source";
  if (mode === "sample_fallback") return "Synthetic fallback";
  return "Source unavailable";
}

function modeClass(mode: CivicBidMode): string {
  if (mode === "live_official") return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  if (mode === "sample_fallback") return "border-amber-300/35 bg-amber-400/10 text-amber-100";
  return "border-rose-300/35 bg-rose-400/10 text-rose-100";
}

function tierClass(tier: QueueItem["tier"]): string {
  if (tier === "A") return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  if (tier === "B") return "border-gold/35 bg-gold/10 text-gold-soft";
  return "border-border/70 bg-background/35 text-muted-foreground";
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-4">
      <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-parchment">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

export function CivicBidLiveCockpit() {
  const [scope, setScope] = useState<CivicBidScope>("construction");
  const [response, setResponse] = useState<CivicBidQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetch(
        `/api/civicbid/signal-forge?view=queue&limit=12&scope=${scope}`,
        { cache: "no-store", signal },
      );
      const payload = (await result.json()) as CivicBidQueueResponse;

      if (!result.ok && payload.mode !== "source_unavailable") {
        throw new Error("CivicBid source request failed.");
      }

      setResponse(payload);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "CivicBid source request failed.");
      setResponse(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    const controller = new AbortController();
    void loadQueue(controller.signal);
    return () => controller.abort();
  }, [loadQueue]);

  return (
    <div id="live-signal-forge" className="space-y-6">
      <section className="rounded-xl border border-border/70 bg-navy-deep/55 p-5 shadow-panel lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">CivicBid Signal Forge</span>
              {response ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider",
                    modeClass(response.mode),
                  )}
                >
                  {modeLabel(response.mode)}
                </span>
              ) : null}
            </div>
            <h2 className="display-serif mt-3 text-3xl text-parchment">
              Live public opportunities, ranked for contractor review
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              CivicBid reads the official NYC Current Solicitations dataset, separates source truth
              from contractor relevance, and applies one deterministic five-factor pursuit score.
              The official agency record and bid documents remain controlling.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScope("construction")}
              aria-pressed={scope === "construction"}
              className={cn(
                "rounded-md border px-3 py-2 text-xs transition-colors",
                focusRing,
                scope === "construction"
                  ? "border-gold/55 bg-gold/15 text-parchment"
                  : "border-border/60 bg-background/25 text-muted-foreground hover:border-gold/35 hover:text-foreground",
              )}
            >
              Contractor view
            </button>
            <button
              type="button"
              onClick={() => setScope("all")}
              aria-pressed={scope === "all"}
              className={cn(
                "rounded-md border px-3 py-2 text-xs transition-colors",
                focusRing,
                scope === "all"
                  ? "border-gold/55 bg-gold/15 text-parchment"
                  : "border-border/60 bg-background/25 text-muted-foreground hover:border-gold/35 hover:text-foreground",
              )}
            >
              All procurements
            </button>
            <button
              type="button"
              onClick={() => void loadQueue()}
              disabled={loading}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/25 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-gold/35 hover:text-foreground disabled:cursor-wait disabled:opacity-60",
                focusRing,
              )}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} aria-hidden />
              Refresh
            </button>
          </div>
        </div>

        {response ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span>Retrieved {formatRetrievedAt(response.retrievedAt)}</span>
            <a
              href={response.source.url}
              target="_blank"
              rel="noreferrer"
              className={cn("inline-flex items-center gap-2 text-gold hover:text-gold-soft", focusRing)}
            >
              Open official NYC dataset
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="rounded-lg border border-rose-300/30 bg-rose-400/10 p-5 text-sm text-rose-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Unable to load the CivicBid queue</p>
              <p className="mt-1 text-rose-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {response?.warning ? (
        <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 p-5 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>{response.warning}</p>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy={loading}>
        <MetricCard
          label="Source mode"
          value={response ? modeLabel(response.mode) : loading ? "Loading" : "Unavailable"}
          detail={response?.dataSourceLabel ?? "Waiting for the official public source."}
        />
        <MetricCard
          label="Source rows reviewed"
          value={response ? String(response.sourceCount) : "—"}
          detail="Official records inspected for the current response."
        />
        <MetricCard
          label="Filtered from view"
          value={response ? String(response.excludedCount) : "—"}
          detail={scope === "construction" ? "Rows without detected contractor relevance." : "All source rows remain eligible."}
        />
        <MetricCard
          label="Ranked opportunities"
          value={response ? String(response.count) : "—"}
          detail="Records returned after scope, relevance, and limit controls."
        />
      </section>

      {loading && !response ? (
        <div className="rounded-lg border border-border/60 bg-background/25 p-8 text-center text-sm text-muted-foreground">
          Loading the official opportunity source and contractor ranking…
        </div>
      ) : null}

      {response && response.data.length === 0 ? (
        <div className="rounded-lg border border-border/60 bg-background/25 p-8 text-center">
          <Database className="mx-auto h-6 w-6 text-gold-soft" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-parchment">No opportunities matched this view</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            The source may be unavailable, empty, or contain no records above the declared contractor-relevance threshold.
          </p>
        </div>
      ) : null}

      {response?.data.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {response.data.map((item) => (
            <article
              key={item.opportunityId}
              className="rounded-xl border border-border/70 bg-navy-deep/50 p-5 shadow-panel"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                    {item.agency} · {item.opportunityId}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-parchment">{item.title}</h3>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 font-mono text-[0.62rem]", tierClass(item.tier))}>
                    Tier {item.tier}
                  </span>
                  <span className="rounded-full border border-signal-soft/30 bg-signal-soft/10 px-2.5 py-1 font-mono text-[0.62rem] text-signal-soft">
                    {item.compositeScore}/100
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-md border border-border/60 bg-background/30 p-3 text-xs text-foreground/80">
                <CalendarClock className="h-4 w-4 shrink-0 text-gold-soft" aria-hidden />
                Published due date: {formatDate(item.dueDate)}
              </div>

              <div className="mt-5 space-y-3">
                {item.components.map((component) => (
                  <div key={component.key}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        {component.label} · {component.weight}%
                      </span>
                      <span className="font-mono text-foreground/80">{component.score}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background/70">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${Math.min(100, Math.max(0, component.score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-md border border-signal-soft/20 bg-signal-soft/10 p-3">
                <p className="text-xs leading-relaxed text-foreground/80">
                  {item.rationale.find((note) => note.startsWith("Construction-fit")) ??
                    "Contractor relevance requires manual review."}
                </p>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {response ? (
        <section className="rounded-lg border border-border/60 bg-background/25 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal-soft" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-parchment">Scoring and source boundary</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {response.officialSourceOfTruth} Composite scores support triage only; they do not
                certify eligibility, completeness, compliance, bonding, price, or bid suitability.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {response.scoringModel.map((component) => (
                  <span
                    key={component.key}
                    className="rounded-full border border-border/60 bg-background/35 px-2.5 py-1 text-xs text-muted-foreground"
                    title={component.description}
                  >
                    {component.label} {component.weight}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
