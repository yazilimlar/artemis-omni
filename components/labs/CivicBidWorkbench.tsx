"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileSearch,
  Gauge,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  civicBidModes,
  getCivicBidMode,
  type CivicBidModeId,
} from "@/data/civicBid";
import { cn } from "@/lib/utils/cn";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const iconByMode: Record<CivicBidModeId, LucideIcon> = {
  "market-terrain": BarChart3,
  "solicitation-join": CalendarClock,
  "compliance-copilot": ShieldCheck,
  "subcontractor-map": Users,
  "lifecycle-watch": Bell,
};

function SegmentedButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-left text-xs transition-colors",
        focusRing,
        active
          ? "border-gold/55 bg-gold/15 text-parchment"
          : "border-border/60 bg-background/25 text-muted-foreground hover:border-gold/35 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ProgressBar({
  label,
  value,
  tone = "gold",
}: {
  label: string;
  value: number;
  tone?: "gold" | "signal" | "emerald" | "amber" | "rose";
}) {
  const toneClass = {
    gold: "bg-gold",
    signal: "bg-signal",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
    rose: "bg-rose-300",
  }[tone];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground/80">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-background/60">
        <div
          className={cn("h-2 rounded-full", toneClass)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  detail,
  Icon,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border/60 bg-background/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 shrink-0 text-gold-soft" aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold text-parchment">Index {value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

export function CivicBidWorkbench() {
  const [modeId, setModeId] = useState<CivicBidModeId>("solicitation-join");

  const mode = useMemo(() => getCivicBidMode(modeId), [modeId]);
  const ModeIcon = iconByMode[mode.id];

  return (
    <div id="civicbid-workbench" className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">CivicBid Decision Deck</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">
                Choose the procurement intelligence mode
              </h2>
            </div>
            <Search className="h-5 w-5 text-gold-soft" aria-hidden />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Switch the product mode to see how CivicBid turns public award/status fragments
            into a pursuit operating system. The sample scores are deterministic indices, not a
            live bid feed or certified procurement record.
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {civicBidModes.map((item) => {
              const Icon = iconByMode[item.id];
              return (
                <SegmentedButton
                  key={item.id}
                  active={item.id === modeId}
                  onClick={() => setModeId(item.id)}
                >
                  <span className="flex items-center gap-2 font-semibold text-foreground/90">
                    <Icon className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                    {item.label}
                  </span>
                  <span className="mt-1 block leading-relaxed">{item.summary}</span>
                </SegmentedButton>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Executive Watch Tower</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">{mode.label}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
              <ModeIcon className="h-3.5 w-3.5" aria-hidden />
              Synthetic
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Decision gate
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/86">
                {mode.decisionGate}
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Action owner
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/86">
                {mode.actionOwner}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-signal-soft/25 bg-signal-soft/10 p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-signal-soft">
              Operating truth
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/86">
              {mode.operatingTruth}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {mode.kpis.map((kpi, index) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            detail={kpi.detail}
            Icon={[Gauge, CalendarClock, ClipboardCheck, FileSearch][index] ?? Gauge}
          />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
          <p className="eyebrow">Pursuit Signal Stack</p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">Mode scoring</h2>
          <div className="mt-5 space-y-4">
            <ProgressBar label="Opportunity heat" value={mode.scores.opportunity} tone="gold" />
            <ProgressBar label="Timing pressure" value={mode.scores.timing} tone="amber" />
            <ProgressBar label="Compliance load" value={mode.scores.compliance} tone="rose" />
            <ProgressBar label="Outreach value" value={mode.scores.outreach} tone="signal" />
            <ProgressBar label="Review confidence" value={mode.scores.confidence} tone="emerald" />
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Watchlist Builder</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">
                What the bid room should check next
              </h2>
            </div>
            <Database className="h-6 w-6 text-gold-soft" aria-hidden />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {mode.watchlist.map((item, index) => (
              <div
                key={item}
                className="rounded-md border border-border/60 bg-background/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gold/25 bg-gold/10 font-mono text-[0.62rem] text-gold-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/86">{item}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-emerald-300/25 bg-emerald-400/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" aria-hidden />
              <p className="text-sm leading-relaxed text-emerald-50/85">
                Human review remains the control point. CivicBid can prioritize the pursuit
                queue, but approved source links and bid team judgment govern action.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
