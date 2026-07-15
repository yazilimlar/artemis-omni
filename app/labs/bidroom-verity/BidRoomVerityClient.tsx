"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  ScanSearch,
  ShieldQuestion,
} from "lucide-react";
import { assessEvidenceQuality, type EvidenceQuality } from "@/lib/civicbid/evidenceQuality";
import {
  scoreOpportunity,
  SIGNAL_FORGE_SCORING_MODEL,
  type SignalForgeScore,
  type SignalTier,
} from "@/lib/civicbid/signalForgeScoring";
import type { CivicBidOpportunity } from "@/types/civicbid";
import { cn } from "@/lib/utils/cn";

type ApiScope = "construction" | "all";

interface SignalForgeApiResponse {
  status: "ok" | "degraded" | "unavailable";
  mode: "live_official" | "sample_fallback" | "source_unavailable";
  scope: ApiScope;
  fromLive: boolean;
  fallbackUsed: boolean;
  retrievedAt: string;
  source: { id: string; name: string; url: string; jurisdiction: string };
  officialSourceOfTruth: string;
  warning?: string;
  sourceCount: number;
  excludedCount: number;
  count: number;
  data: CivicBidOpportunity[];
}

interface VerityRecord {
  opportunity: CivicBidOpportunity;
  score: SignalForgeScore;
  evidence: EvidenceQuality;
}

type SortKey = "signal" | "evidence" | "due";

const easternDateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatEastern(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${easternDateTime.format(parsed)} ET`;
}

function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.ceil((parsed.getTime() - Date.now()) / 86_400_000);
}

function tierClasses(tier: SignalTier): string {
  if (tier === "A") return "border-gold/60 bg-gold/10 text-gold";
  if (tier === "B") return "border-signal/60 bg-signal/10 text-signal";
  return "border-border bg-muted/40 text-muted-foreground";
}

function stateClasses(state: string): string {
  switch (state) {
    case "published":
      return "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400";
    case "normalized":
      return "border-signal/50 bg-signal/10 text-signal";
    case "generated":
      return "border-amber-600/40 bg-amber-600/10 text-amber-700 dark:text-amber-400";
    default:
      return "border-red-600/40 bg-red-600/10 text-red-700 dark:text-red-400";
  }
}

const chip =
  "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em]";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
  );
}

export function BidRoomVerityClient() {
  const [response, setResponse] = React.useState<SignalForgeApiResponse | null>(null);
  const [records, setRecords] = React.useState<VerityRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [scope, setScope] = React.useState<ApiScope>("construction");
  const [search, setSearch] = React.useState("");
  const [agency, setAgency] = React.useState("all");
  const [tier, setTier] = React.useState<"all" | SignalTier>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("signal");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [ageTick, setAgeTick] = React.useState(0);

  const load = React.useCallback(async (nextScope: ApiScope) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch(`/api/civicbid/signal-forge?scope=${nextScope}&limit=50`, {
        cache: "no-store",
      });
      const payload = (await result.json()) as SignalForgeApiResponse;
      const now = new Date();
      setResponse(payload);
      setRecords(
        (payload.data ?? []).map((opportunity) => ({
          opportunity,
          score: scoreOpportunity(opportunity, now),
          evidence: assessEvidenceQuality(opportunity),
        })),
      );
    } catch {
      setError("The Signal Forge API could not be reached from this page.");
      setResponse(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load(scope);
  }, [load, scope]);

  React.useEffect(() => {
    const timer = window.setInterval(() => setAgeTick((tick) => tick + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const retrievalAgeMinutes = React.useMemo(() => {
    void ageTick;
    if (!response?.retrievedAt) return null;
    const retrieved = new Date(response.retrievedAt).getTime();
    if (Number.isNaN(retrieved)) return null;
    return Math.max(0, Math.round((Date.now() - retrieved) / 60_000));
  }, [response, ageTick]);

  const agencies = React.useMemo(
    () =>
      Array.from(new Set(records.map((record) => record.opportunity.agency))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [records],
  );

  const visible = React.useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = records.filter((record) => {
      if (agency !== "all" && record.opportunity.agency !== agency) return false;
      if (tier !== "all" && record.score.tier !== tier) return false;
      if (needle) {
        const haystack = [
          record.opportunity.title,
          record.opportunity.agency,
          record.opportunity.description,
          record.opportunity.id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
    const sorted = [...filtered];
    if (sortKey === "signal") {
      sorted.sort((a, b) => b.score.compositeScore - a.score.compositeScore);
    } else if (sortKey === "evidence") {
      sorted.sort((a, b) => (b.evidence.score ?? -1) - (a.evidence.score ?? -1));
    } else {
      sorted.sort((a, b) => {
        const aDue = daysUntil(a.opportunity.dueDate);
        const bDue = daysUntil(b.opportunity.dueDate);
        if (aDue === null && bDue === null) return 0;
        if (aDue === null) return 1;
        if (bDue === null) return -1;
        return aDue - bDue;
      });
    }
    return sorted;
  }, [records, search, agency, tier, sortKey]);

  const modeBadge = !response
    ? null
    : response.mode === "live_official"
      ? { label: "Live official source", className: "border-emerald-600/50 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400" }
      : response.mode === "sample_fallback"
        ? { label: "Sample fallback — synthetic data", className: "border-amber-600/50 bg-amber-600/10 text-amber-700 dark:text-amber-400" }
        : { label: "Source unavailable", className: "border-red-600/50 bg-red-600/10 text-red-700 dark:text-red-400" };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products/bidroom"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-foreground/80 transition hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              BidRoom hub
            </Link>
            <div className="min-w-[240px] flex-1">
              <SectionLabel>
                <span className="inline-flex items-center gap-2">
                  <ScanSearch className="h-3.5 w-3.5" aria-hidden />
                  BidRoom family · evidence iteration
                </span>
              </SectionLabel>
              <h1 className="mt-1 font-serif text-2xl font-black tracking-tight">BidRoom Verity</h1>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                A verified opportunity console. Every number on this page is computed at runtime from
                retrieved records with the formulas shown below — nothing is hard-coded, and heuristic
                values are labeled as such.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2" aria-label="BidRoom family">
              <Link
                href="/products/bidroom/switchboard"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-foreground/80 transition hover:border-gold/60 hover:text-gold"
              >
                Switchboard
              </Link>
              <Link
                href="/labs/civicbid-signal-forge"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-foreground/80 transition hover:border-gold/60 hover:text-gold"
              >
                Classic donor
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        {/* Source health strip */}
        <section
          aria-label="Source health"
          className="rounded-lg border border-border bg-muted/20 p-4"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div>
              <SectionLabel>Source status</SectionLabel>
              <div className="mt-1 flex items-center gap-2">
                {modeBadge ? (
                  <span className={cn(chip, modeBadge.className)}>{modeBadge.label}</span>
                ) : (
                  <span className={cn(chip, "border-border text-muted-foreground")}>
                    {loading ? "Retrieving…" : "No response"}
                  </span>
                )}
              </div>
            </div>
            <div>
              <SectionLabel>Dataset</SectionLabel>
              <p className="mt-1 text-sm">
                {response?.source.name ?? "—"}
                {response?.source.url ? (
                  <a
                    href={response.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-signal underline-offset-2 hover:underline"
                  >
                    open dataset
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                ) : null}
              </p>
            </div>
            <div>
              <SectionLabel>Retrieved</SectionLabel>
              <p className="mt-1 text-sm">
                {response ? formatEastern(response.retrievedAt) ?? response.retrievedAt : "—"}
                {retrievalAgeMinutes !== null ? (
                  <span className="ml-2 text-muted-foreground">({retrievalAgeMinutes} min ago)</span>
                ) : null}
              </p>
            </div>
            <div>
              <SectionLabel>Records</SectionLabel>
              <p className="mt-1 text-sm">
                {response
                  ? `${response.count} shown · ${response.sourceCount} retrieved · ${response.excludedCount} excluded by scope`
                  : "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load(scope)}
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[0.66rem] font-semibold uppercase tracking-wide transition hover:border-gold/60 hover:text-gold disabled:opacity-50"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} aria-hidden />
              Refresh
            </button>
          </div>

          {response?.fallbackUsed ? (
            <p className="mt-3 flex items-start gap-2 rounded-md border border-amber-600/40 bg-amber-600/10 p-3 text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {response.warning ??
                "The official source was unavailable; clearly labeled synthetic samples are shown. Synthetic records receive no evidence score."}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 flex items-start gap-2 rounded-md border border-red-600/40 bg-red-600/10 p-3 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            {response?.officialSourceOfTruth ??
              "The official agency record and bid documents remain controlling."}{" "}
            This dataset is a discovery source; deadlines are displayed in Eastern Time under the
            assumption that the source publishes source-local timestamps without an explicit timezone.
          </p>
        </section>

        {/* Controls */}
        <section aria-label="Filters" className="mt-5 flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1">
            <SectionLabel>Search</SectionLabel>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, agency, id, scope text…"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-gold/60"
            />
          </label>
          <label className="flex flex-col gap-1">
            <SectionLabel>Agency</SectionLabel>
            <select
              value={agency}
              onChange={(event) => setAgency(event.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-gold/60"
            >
              <option value="all">All agencies</option>
              {agencies.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <SectionLabel>Signal tier</SectionLabel>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as "all" | SignalTier)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-gold/60"
            >
              <option value="all">All tiers</option>
              <option value="A">Tier A</option>
              <option value="B">Tier B</option>
              <option value="C">Tier C</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <SectionLabel>Sort</SectionLabel>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-gold/60"
            >
              <option value="signal">Signal score</option>
              <option value="evidence">Evidence quality</option>
              <option value="due">Due date</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <SectionLabel>Scope</SectionLabel>
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value as ApiScope)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-gold/60"
            >
              <option value="construction">Construction-relevant</option>
              <option value="all">All procurement</option>
            </select>
          </label>
        </section>

        {/* Records */}
        <section aria-label="Opportunities" className="mt-5 space-y-3">
          {loading && records.length === 0 ? (
            <p className="rounded-lg border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              Retrieving live records from the official source…
            </p>
          ) : null}
          {!loading && visible.length === 0 ? (
            <p className="rounded-lg border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              No records match the current filters.
            </p>
          ) : null}

          {visible.map((record) => {
            const { opportunity, score, evidence } = record;
            const due = formatEastern(opportunity.dueDate);
            const dueDays = daysUntil(opportunity.dueDate);
            const isOpen = expanded === opportunity.id;
            return (
              <article
                key={opportunity.id}
                className="rounded-lg border border-border bg-background transition hover:border-gold/40"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : opportunity.id)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-left"
                >
                  <div className="min-w-[260px] flex-1">
                    <h2 className="text-sm font-bold leading-snug">{opportunity.title}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {opportunity.agency} · {opportunity.jurisdiction} · id {opportunity.id}
                      {opportunity.idProvenance === "generated" ? " (generated)" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(chip, tierClasses(score.tier))} title="Signal heuristic — reproducible but uncalibrated">
                      Signal {score.compositeScore} · {score.tier}
                    </span>
                    <span
                      className={cn(
                        chip,
                        evidence.score === null
                          ? "border-red-600/40 bg-red-600/10 text-red-700 dark:text-red-400"
                          : "border-border text-foreground/80",
                      )}
                      title="Evidence Quality — materiality-weighted field coverage with safety gates"
                    >
                      Evidence {evidence.score === null ? "N/A" : `${evidence.score}`} ·{" "}
                      {evidence.fieldsPresent}/{evidence.fieldsTotal} fields
                    </span>
                    <span
                      className={cn(
                        chip,
                        dueDays !== null && dueDays < 0
                          ? "border-red-600/40 bg-red-600/10 text-red-700 dark:text-red-400"
                          : dueDays !== null && dueDays <= 7
                            ? "border-amber-600/40 bg-amber-600/10 text-amber-700 dark:text-amber-400"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {due
                        ? dueDays !== null && dueDays < 0
                          ? `Due ${due} · passed`
                          : `Due ${due} · ${dueDays}d`
                        : "No published deadline"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-border px-4 py-4">
                    {evidence.criticalWarnings.length > 0 ? (
                      <div className="mb-4 space-y-1">
                        {evidence.criticalWarnings.map((warning) => (
                          <p
                            key={warning}
                            className="flex items-start gap-2 rounded-md border border-red-600/40 bg-red-600/10 p-2 text-xs text-red-700 dark:text-red-400"
                          >
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                            {warning}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div>
                        <SectionLabel>Field provenance</SectionLabel>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-border text-muted-foreground">
                                <th className="py-1.5 pr-3 font-semibold">Field</th>
                                <th className="py-1.5 pr-3 font-semibold">State</th>
                                <th className="py-1.5 font-semibold">Value / note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {evidence.fields.map((entry) => (
                                <tr key={entry.key} className="border-b border-border/50 align-top">
                                  <td className="py-1.5 pr-3 whitespace-nowrap">{entry.label}</td>
                                  <td className="py-1.5 pr-3">
                                    <span className={cn(chip, stateClasses(entry.state))}>{entry.state}</span>
                                  </td>
                                  <td className="py-1.5 text-muted-foreground">
                                    {entry.value ? (
                                      <span className="text-foreground/90">
                                        {entry.value.length > 160
                                          ? `${entry.value.slice(0, 160)}…`
                                          : entry.value}
                                      </span>
                                    ) : null}
                                    <span className="block">{entry.note}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {evidence.gatesApplied.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {evidence.gatesApplied.map((gate) => (
                              <p key={gate} className="text-xs text-amber-700 dark:text-amber-400">
                                Gate applied: {gate}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-5">
                        <div>
                          <SectionLabel>Signal score breakdown (computed)</SectionLabel>
                          <div className="mt-2 space-y-2">
                            {score.components.map((component) => (
                              <div key={component.key}>
                                <div className="flex items-center justify-between text-xs">
                                  <span>
                                    {component.label}{" "}
                                    <span className="text-muted-foreground">({component.weight}%)</span>
                                  </span>
                                  <span className="font-mono">
                                    {component.score} → {component.weightedScore}
                                  </span>
                                </div>
                                <div className="mt-1 h-1.5 rounded-full bg-muted">
                                  <div
                                    className="h-1.5 rounded-full bg-gold"
                                    style={{ width: `${component.score}%` }}
                                  />
                                </div>
                                <p className="mt-0.5 text-[0.68rem] text-muted-foreground">{component.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-md border border-border bg-muted/20 p-3">
                          <SectionLabel>Contractor FIT</SectionLabel>
                          <p className="mt-1 flex items-start gap-2 text-xs text-muted-foreground">
                            <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                            Not available — no contractor profile is configured. FIT requires a versioned
                            profile (scope capabilities, bonding capacity, geography, project-size range,
                            labor and equipment), so this console shows no FIT number rather than an
                            illustrative one.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {opportunity.sourceUrl ? (
                            <a
                              href={opportunity.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md border border-emerald-600/50 bg-emerald-600/10 px-3 py-2 font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-600/20 dark:text-emerald-400"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                              Verify at source
                              <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                          ) : null}
                          <span className="text-[0.68rem] text-muted-foreground">
                            Dataset-level destination; locate record id {opportunity.id} in the official
                            dataset. Retrieved {formatEastern(opportunity.retrievedAt) ?? opportunity.retrievedAt}.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        {/* Methodology */}
        <section aria-label="Methodology" className="mt-8 rounded-lg border border-border bg-muted/20 p-4">
          <SectionLabel>Methodology & limitations</SectionLabel>
          <div className="mt-3 grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold">Signal score (reproducible heuristic)</h3>
              <table className="mt-2 w-full text-left text-xs">
                <tbody>
                  {SIGNAL_FORGE_SCORING_MODEL.map((component) => (
                    <tr key={component.key} className="border-b border-border/50">
                      <td className="py-1.5 pr-3">{component.label}</td>
                      <td className="py-1.5 pr-3 font-mono">{component.weight}%</td>
                      <td className="py-1.5 text-muted-foreground">{component.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-muted-foreground">
                Weights are human-authored and have not been calibrated against contractor bid/no-bid
                outcomes. Treat tiers as triage ordering, not decision intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold">Evidence Quality (field coverage with gates)</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Ten material fields are weighted by materiality (deadline 20, scope 15, identity /
                agency / title / method / evidence link 10 each, published date / category /
                jurisdiction 5 each). Field states earn credit — published 100%, normalized 85%,
                generated 30%, missing 0% — and non-compensating gates cap the total: dataset-level
                evidence caps at 65, no evidence at 40, a missing deadline at 49, and synthetic sample
                records receive N/A instead of a score. Coverage is always shown separately so a high
                score cannot conceal missing critical fields.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Known limitations: the source dataset is a discovery feed, not the controlling
                solicitation record; source timestamps carry no explicit timezone (Eastern Time is
                assumed); and opportunity monetary scale is not displayed anywhere on this page because
                the source publishes no estimate — no illustrative bands are substituted.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-6 pb-10 text-center text-xs text-muted-foreground">
          BidRoom Verity — public-safe evidence console. Live data: NYC Open Data Current
          Solicitations. The official agency record and bid documents remain controlling.
        </footer>
      </div>
    </main>
  );
}
