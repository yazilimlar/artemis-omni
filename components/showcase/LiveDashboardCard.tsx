import { ArtemisEmblem } from "@/components/showcase/ArtemisEmblem";

type LiveDashboardCardProps = {
  title?: string;
  subtitle?: string;
  variant?: "cashflow" | "flux" | "field";
};

const bars = [38, 54, 48, 70, 62, 84, 78, 92];

const variantCopy = {
  cashflow: {
    title: "Cashflow intelligence",
    subtitle: "Bid, actuals, PM forecast, system projection",
    metrics: [
      ["EAC", "$26.4M", "text-gold-soft"],
      ["Cash window", "+$1.2M", "text-emerald-200"],
      ["Exposure", "$480K", "text-amber-100"],
      ["Confidence", "82%", "text-signal-soft"],
    ],
  },
  flux: {
    title: "AI data stream flux",
    subtitle: "Source health, review gates, exception velocity",
    metrics: [
      ["Sources", "14", "text-signal-soft"],
      ["Reviewed", "91%", "text-emerald-200"],
      ["Exceptions", "23", "text-amber-100"],
      ["Latency", "04m", "text-gold-soft"],
    ],
  },
  field: {
    title: "Field production pulse",
    subtitle: "Installed quantities, blockers, risk and opportunity",
    metrics: [
      ["Progress", "67%", "text-emerald-200"],
      ["Blocked", "05", "text-amber-100"],
      ["Variance", "-2.4%", "text-gold-soft"],
      ["Actions", "12", "text-signal-soft"],
    ],
  },
} as const;

export function LiveDashboardCard({
  title,
  subtitle,
  variant = "cashflow",
}: LiveDashboardCardProps) {
  const copy = variantCopy[variant];
  return (
    <div className="cinematic-breathe relative overflow-hidden rounded-2xl border border-signal-soft/20 bg-navy-deep/55 p-5 shadow-panel">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
      <div
        className="absolute -right-24 -top-24 -z-10 h-56 w-56 rounded-full bg-signal-soft/10 blur-3xl"
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            Live executive panel
          </p>
          <h3 className="display-serif mt-2 text-2xl leading-tight text-parchment">
            {title ?? copy.title}
          </h3>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            {subtitle ?? copy.subtitle}
          </p>
        </div>
        <ArtemisEmblem className="h-14 w-14 shrink-0 drop-shadow-[0_0_18px_rgba(0,207,255,0.18)]" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {copy.metrics.map(([label, value, tone]) => (
          <div key={label} className="rounded-xl border border-border/60 bg-background/35 p-3">
            <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className={`mt-1 text-xl font-semibold tracking-tight ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-border/60 bg-background/35 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
              Forecast corridor
            </p>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider text-emerald-200">
              Breathing
            </span>
          </div>
          <svg
            className="mt-3 h-44 w-full"
            viewBox="0 0 420 180"
            role="img"
            aria-label="Animated forecast corridor plot"
          >
            <path d="M20 30H400M20 75H400M20 120H400M20 165H400" stroke="currentColor" className="text-silver/10" />
            <path d="M20 152C68 142 82 120 128 126C174 132 184 82 230 90C282 99 296 50 340 62C370 70 386 54 400 42V165H20Z" fill="hsl(var(--signal-blue) / 0.14)" />
            <path d="M20 158C70 148 88 136 128 140C176 145 184 105 230 112C282 121 298 84 340 92C372 100 386 82 400 72" stroke="hsl(var(--gold-soft))" strokeWidth="3" fill="none" className="plot-line-draw" />
            <path d="M20 146C68 132 88 106 128 112C174 118 184 68 230 76C282 84 296 35 340 46C372 54 386 39 400 26" stroke="hsl(var(--crescent-blue))" strokeWidth="3" fill="none" className="plot-line-draw" style={{ animationDelay: "0.45s" }} />
            {[20, 128, 230, 340, 400].map((x, index) => (
              <circle
                key={x}
                cx={x}
                cy={[146, 112, 76, 46, 26][index]}
                r="4"
                fill="hsl(var(--crescent-blue))"
                className="signal-pulse"
                style={{ animationDelay: `${index * 180}ms` }}
              />
            ))}
          </svg>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/35 p-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            Data stream flux
          </p>
          <svg
            className="mt-3 h-44 w-full"
            viewBox="0 0 220 180"
            role="img"
            aria-label="Animated data stream bar plot"
          >
            <path d="M18 24V158H204" stroke="currentColor" className="text-silver/18" />
            {bars.map((height, index) => (
              <rect
                key={height + index}
                x={28 + index * 21}
                y={158 - height}
                width="12"
                height={height}
                rx="3"
                fill={index % 3 === 0 ? "hsl(var(--gold-soft))" : "hsl(var(--crescent-blue))"}
                className="plot-bar-rise"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
            <path d="M28 124C58 104 74 116 96 90C126 54 145 82 172 46C186 28 196 34 204 24" stroke="hsl(var(--platinum))" strokeWidth="2" fill="none" className="flow-line" />
          </svg>
        </div>
      </div>
    </div>
  );
}
