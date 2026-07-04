import { confidenceBand } from "@/lib/tax/format";

export type TaxCardRow = {
  label: string;
  value: string;
  emphasis?: "good" | "bad";
};

export type TaxAccent = "gold" | "blue" | "violet";

const ACCENT: Record<TaxAccent, { bar: string; ring: string; text: string }> = {
  gold: { bar: "bg-amber-300/70", ring: "border-amber-300/25", text: "text-amber-200" },
  blue: { bar: "bg-sky-300/70", ring: "border-sky-300/25", text: "text-sky-200" },
  violet: { bar: "bg-violet-300/70", ring: "border-violet-300/25", text: "text-violet-200" },
};

const CONF_TONE = {
  high: "text-emerald-300",
  medium: "text-amber-300",
  low: "text-rose-300",
} as const;

type TaxPositionCardProps = {
  title: string;
  subtitle: string;
  accent: TaxAccent;
  primaryLabel: string;
  primaryValue: string;
  rows: TaxCardRow[];
  confidencePercent: number;
};

export function TaxPositionCard({
  title,
  subtitle,
  accent,
  primaryLabel,
  primaryValue,
  rows,
  confidencePercent,
}: TaxPositionCardProps) {
  const a = ACCENT[accent];
  const band = confidenceBand(confidencePercent);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border ${a.ring} bg-white/[0.04] p-5 shadow-2xl backdrop-blur`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${a.bar}`} aria-hidden />
      <div className="mb-4">
        <p className={`text-[0.68rem] font-medium uppercase tracking-[0.22em] ${a.text}`}>
          {subtitle}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
        <p className="text-sm text-white/55">{primaryLabel}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
          {primaryValue}
        </p>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-white/55">{row.label}</dt>
            <dd
              className={
                row.emphasis === "good"
                  ? "font-semibold text-emerald-300"
                  : row.emphasis === "bad"
                    ? "font-semibold text-rose-300"
                    : "font-medium text-white/85"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Confidence</span>
          <span className={CONF_TONE[band.tone]}>
            {band.label} · {confidencePercent}%
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10" aria-hidden>
          <div
            className={`h-2 rounded-full ${a.bar}`}
            style={{ width: `${Math.max(0, Math.min(100, confidencePercent))}%` }}
          />
        </div>
      </div>
    </section>
  );
}
