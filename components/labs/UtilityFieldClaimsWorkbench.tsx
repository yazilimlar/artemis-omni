"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileSpreadsheet,
  Gauge,
  RefreshCw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import {
  getUtilityScenarioSnapshot,
  utilityGroundModes,
  utilityScenarioModes,
  utilityWaterModes,
  type UtilityGroundId,
  type UtilityScenarioModeId,
  type UtilityWaterId,
} from "@/data/utilityFieldClaims";
import { cn } from "@/lib/utils/cn";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const iconByStatus: Record<"pass" | "watch" | "hold", LucideIcon> = {
  pass: CheckCircle2,
  watch: AlertTriangle,
  hold: Clock3,
};

const statusClass: Record<"pass" | "watch" | "hold", string> = {
  pass: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  watch: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  hold: "border-rose-300/25 bg-rose-400/10 text-rose-100",
};

function FormatIndex({ value }: { value: number }) {
  return <>{value >= 0 ? `+${value}` : value}</>;
}

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

function KpiCard({
  label,
  value,
  detail,
  Icon,
}: {
  label: string;
  value: ReactNode;
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
      <p className="mt-3 text-2xl font-semibold text-parchment">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  tone = "gold",
}: {
  label: string;
  value: number;
  tone?: "gold" | "signal" | "emerald" | "amber";
}) {
  const toneClass = {
    gold: "bg-gold",
    signal: "bg-signal",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
  }[tone];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground/80">{value}%</span>
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

export function UtilityFieldClaimsWorkbench() {
  const [modeId, setModeId] = useState<UtilityScenarioModeId>("payment-lag");
  const [groundId, setGroundId] = useState<UtilityGroundId>("soil");
  const [waterId, setWaterId] = useState<UtilityWaterId>("wet");

  const snapshot = useMemo(
    () => getUtilityScenarioSnapshot({ modeId, groundId, waterId }),
    [modeId, groundId, waterId],
  );

  const cpiLabel = snapshot.cpi === null ? "Plan" : snapshot.cpi.toFixed(2);
  const spiLabel = snapshot.spi === null ? "Plan" : snapshot.spi.toFixed(2);

  return (
    <div id="cockpit" className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Cockpit Decision Deck</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">
                Scenario controls for contractor review
              </h2>
            </div>
            <RefreshCw className="h-5 w-5 text-gold-soft" aria-hidden />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Change the mode, ground condition, or water table. The sample bridge recomputes
            cost basis, schedule duration, labor hours, earned-value signals, and claim-to-cash
            exposure from deterministic representative records.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                Actuals & claims mode
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {utilityScenarioModes.map((mode) => (
                  <SegmentedButton
                    key={mode.id}
                    active={mode.id === modeId}
                    onClick={() => setModeId(mode.id)}
                  >
                    <span className="block font-semibold text-foreground/90">{mode.label}</span>
                    <span className="mt-1 block leading-relaxed">{mode.summary}</span>
                  </SegmentedButton>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  Ground
                </p>
                <div className="mt-3 grid gap-2">
                  {utilityGroundModes.map((mode) => (
                    <SegmentedButton
                      key={mode.id}
                      active={mode.id === groundId}
                      onClick={() => setGroundId(mode.id)}
                    >
                      <span className="font-semibold text-foreground/90">{mode.label}</span>
                      <span className="ml-2">{mode.summary}</span>
                    </SegmentedButton>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  Water table
                </p>
                <div className="mt-3 grid gap-2">
                  {utilityWaterModes.map((mode) => (
                    <SegmentedButton
                      key={mode.id}
                      active={mode.id === waterId}
                      onClick={() => setWaterId(mode.id)}
                    >
                      <span className="font-semibold text-foreground/90">{mode.label}</span>
                      <span className="ml-2">{mode.summary}</span>
                    </SegmentedButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Real-Deal Detection Layer</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">
                {snapshot.mode.label}
              </h2>
            </div>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
              {snapshot.confidence}
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Bottleneck
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/86">
                {snapshot.bottleneck}
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Executive action
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/86">
                {snapshot.mode.executiveAction}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-signal-soft/25 bg-signal-soft/10 p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-signal-soft">
              Operating truth
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/86">
              {snapshot.mode.operatingTruth}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Cost basis"
          value={`Index ${snapshot.costIndex}`}
          detail={`P50 exposure ${snapshot.p50Exposure >= 0 ? "+" : ""}${snapshot.p50Exposure}; P80 exposure ${
            snapshot.p80Exposure >= 0 ? "+" : ""
          }${snapshot.p80Exposure}.`}
          Icon={Gauge}
        />
        <KpiCard
          label="Revenue / SOV"
          value={`Index ${snapshot.revenueIndex}`}
          detail="Representative SOV index only; no payment certification."
          Icon={BarChart3}
        />
        <KpiCard
          label="Schedule duration"
          value={`${snapshot.durationDays} days`}
          detail={`CPI ${cpiLabel} · SPI ${spiLabel}.`}
          Icon={Clock3}
        />
        <KpiCard
          label="Labor hours"
          value={snapshot.laborHours.toLocaleString()}
          detail={`${snapshot.ground.label} ground · ${snapshot.water.label} water table.`}
          Icon={Truck}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
          <p className="eyebrow">L/M/C/S/E Composition</p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Cost-code concentration
          </h2>
          <div className="mt-5 space-y-4">
            {snapshot.composition.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel">
          <p className="eyebrow">ERP / CMiC-Style Codes</p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Top exposure locations
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {snapshot.topCostCodes.map((item) => (
              <div
                key={item.code}
                className="rounded-md border border-border/60 bg-background/30 p-4"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {item.code}
                </p>
                <p className="mt-2 text-sm text-foreground/86">{item.label}</p>
                <div className="mt-4">
                  <ProgressBar label="Concentration" value={item.value} tone="signal" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="actuals-claims"
        className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Actuals & Claims Studio</p>
            <h2 className="display-serif mt-2 text-2xl text-parchment">
              Field report to claim approval to cash receipt
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These are source-tagged representative records. They show the custody chain a
              contractor needs to keep visible before field completion, entitlement, approval,
              retainage, and cash timing get mixed together.
            </p>
          </div>
          <FileSpreadsheet className="h-6 w-6 text-gold-soft" aria-hidden />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-md border border-border/60 bg-background/30 p-4">
            <div className="flex items-center gap-2 text-signal-soft">
              <Database className="h-4 w-4" aria-hidden />
              <p className="font-mono text-[0.62rem] uppercase tracking-wider">
                Field completion
              </p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-parchment">
              {snapshot.completedQuantityPct}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Accepted representative quantity for the review period.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              FR-SYN-108 · stationed segment sample · source-tagged
            </p>
          </div>

          <div className="rounded-md border border-border/60 bg-background/30 p-4">
            <div className="flex items-center gap-2 text-gold-soft">
              <ClipboardCheck className="h-4 w-4" aria-hidden />
              <p className="font-mono text-[0.62rem] uppercase tracking-wider">
                Claim / approval
              </p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-parchment">
              {snapshot.claimedQuantityPct}% / {snapshot.approvedQuantityPct}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Claimed quantity compared with approved quantity.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              CL-SYN-022 · pay-item sample · retainage {snapshot.retainagePct}%
            </p>
          </div>

          <div className="rounded-md border border-border/60 bg-background/30 p-4">
            <div className="flex items-center gap-2 text-amber-100">
              <Clock3 className="h-4 w-4" aria-hidden />
              <p className="font-mono text-[0.62rem] uppercase tracking-wider">
                Cash receipt
              </p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-parchment">
              {snapshot.cashReceivedPct}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Payment lag sample: {snapshot.paymentLagDays} days.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              PMT-SYN-019 · demo payment state · not certification
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {snapshot.reconciliationChecks.map((check) => {
            const Icon = iconByStatus[check.status];
            return (
              <div
                key={check.label}
                className={cn("rounded-md border p-4", statusClass[check.status])}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold">{check.label}</p>
                    <p className="mt-2 text-xs leading-relaxed opacity-85">{check.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="executive-control-room"
        className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <p className="eyebrow">Executive Control Room</p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Current condition, consequence, and owner
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { label: "Earned field value", value: snapshot.completedQuantityPct, tone: "emerald" as const },
              { label: "Claimed quantity", value: snapshot.claimedQuantityPct, tone: "gold" as const },
              { label: "Approved quantity", value: snapshot.approvedQuantityPct, tone: "signal" as const },
              { label: "Cash received", value: snapshot.cashReceivedPct, tone: "amber" as const },
            ].map((item) => (
              <ProgressBar key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Action Register</p>
              <h2 className="display-serif mt-2 text-2xl text-parchment">
                Who owns the next move?
              </h2>
            </div>
            <ShieldCheck className="h-6 w-6 text-gold-soft" aria-hidden />
          </div>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Owner
              </dt>
              <dd className="mt-2 text-lg font-semibold text-parchment">
                {snapshot.actionOwner}
              </dd>
            </div>
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Action
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/86">
                {snapshot.mode.executiveAction}
              </dd>
            </div>
            <div className="rounded-md border border-border/60 bg-background/30 p-4">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Forecast note
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/86">
                {snapshot.forecastNote}
              </dd>
            </div>
            <div className="rounded-md border border-gold/20 bg-gold/5 p-4">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-gold-soft">
                Exposure range
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/86">
                P50 <FormatIndex value={snapshot.p50Exposure} /> · P80{" "}
                <FormatIndex value={snapshot.p80Exposure} /> index points.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
