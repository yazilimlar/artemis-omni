type OrganizationArchitectureDiagramProps = {
  title?: string;
  subtitle?: string;
  organizationName?: string;
  mode?: "client" | "product" | "labs";
};

const inputs = [
  ["Strategy", 44, 96],
  ["Teams", 44, 166],
  ["Systems", 44, 236],
  ["Documents", 44, 306],
] as const;

const operatingLayers = [
  ["Governance", 292, 88],
  ["Workflow", 292, 156],
  ["Evidence", 292, 224],
  ["Review", 292, 292],
] as const;

const outputs = [
  ["Executive dashboard", 626, 96],
  ["Operating reports", 626, 166],
  ["Action log", 626, 236],
  ["Pilot roadmap", 626, 306],
] as const;

const modeCopy = {
  client: {
    eyebrow: "Client company architecture",
    badge: "Organization-ready",
    center: "Client Operating Core",
    bridge: "Artemis implementation bridge",
    footer: "A public-safe model for how Artemis connects a company without exposing private systems.",
  },
  product: {
    eyebrow: "Product operating layer",
    badge: "Reusable system",
    center: "Product Portfolio Core",
    bridge: "Shared Artemis proof layer",
    footer: "Each module inherits the same source, logic, review, confidence, and action standard.",
  },
  labs: {
    eyebrow: "Client organization architecture",
    badge: "Proof standard",
    center: "Organization Proof Core",
    bridge: "Labs validation bridge",
    footer: "Labs artifacts become credible when they show how a real organization would govern them.",
  },
} as const;

export function OrganizationArchitectureDiagram({
  title = "Client company operating blueprint",
  subtitle = "A reusable public-safe architecture for showing how Artemis connects the client organization: strategy, teams, systems, documents, operations, finance, review, and executive action.",
  organizationName = "Client Organization",
  mode = "client",
}: OrganizationArchitectureDiagramProps) {
  const copy = modeCopy[mode];

  return (
    <div className="cinematic-breathe relative overflow-hidden rounded-2xl border border-signal-soft/20 bg-navy-deep/55 p-5 shadow-panel">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
      <div
        className="absolute -right-28 top-10 -z-10 h-64 w-64 rounded-full bg-signal-soft/10 blur-3xl"
        aria-hidden
      />
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            {copy.eyebrow}
          </p>
          <h3 className="display-serif mt-2 text-2xl text-parchment">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <span className="w-fit rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
          {copy.badge}
        </span>
      </div>

      <svg
        viewBox="0 0 860 420"
        className="h-auto w-full"
        role="img"
        aria-label={`${organizationName} operating architecture diagram`}
      >
        <defs>
          <linearGradient id="orgScan" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--crescent-blue) / 0)" />
            <stop offset="48%" stopColor="hsl(var(--crescent-blue) / 0.34)" />
            <stop offset="100%" stopColor="hsl(var(--gold-soft) / 0)" />
          </linearGradient>
          <filter id="orgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="8" y="8" width="844" height="404" rx="24" fill="hsl(var(--background) / 0.36)" stroke="hsl(var(--border) / 0.78)" />
        <rect x="24" y="24" width="812" height="372" rx="18" fill="none" stroke="hsl(var(--silver) / 0.08)" />
        <rect x="-150" y="18" width="190" height="380" fill="url(#orgScan)" className="scan-sweep" />

        <g fill="hsl(var(--platinum) / 0.9)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="800" letterSpacing="1.2">
          <text x="44" y="56">COMPANY INPUTS</text>
          <text x="292" y="56">OPERATING LAYER</text>
          <text x="626" y="56">EXECUTIVE OUTPUTS</text>
        </g>

        <g>
          {inputs.map(([label, x, y]) => (
            <g key={label}>
              <rect x={x} y={y} width="156" height="46" rx="12" fill="hsl(var(--signal-blue) / 0.12)" stroke="hsl(var(--crescent-blue) / 0.34)" />
              <circle cx={x + 21} cy={y + 23} r="7" fill="hsl(var(--crescent-blue) / 0.68)" />
              <text x={x + 42} y={y + 29} fill="hsl(var(--foreground) / 0.86)" fontFamily="var(--font-sans)" fontSize="15" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g>
          {operatingLayers.map(([label, x, y], index) => (
            <g key={label}>
              <rect x={x} y={y} width="142" height="44" rx="12" fill="hsl(var(--background) / 0.44)" stroke="hsl(var(--silver) / 0.18)" />
              <text x={x + 20} y={y + 28} fill={index === 3 ? "hsl(var(--gold-soft))" : "hsl(var(--foreground) / 0.82)"} fontFamily="var(--font-sans)" fontSize="14" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g transform="translate(430 124)">
          <circle cx="80" cy="80" r="78" fill="hsl(var(--navy-deep) / 0.94)" stroke="hsl(var(--gold) / 0.38)" strokeWidth="2" />
          <circle cx="80" cy="80" r="58" fill="hsl(var(--platinum) / 0.16)" stroke="hsl(var(--crescent-blue) / 0.26)" />
          <path d="M44 88C54 118 100 123 124 96C101 110 65 106 44 88Z" fill="hsl(var(--crescent-blue) / 0.74)" />
          <path d="M80 34 116 126 98 120 80 68 62 120 44 126 80 34Z" fill="hsl(var(--gold-soft))" />
          <path d="M80 34 98 120 80 68 62 120Z" fill="hsl(var(--gold))" />
          <circle cx="80" cy="80" r="92" fill="none" stroke="hsl(var(--crescent-blue) / 0.18)" className="orbital-spin" strokeDasharray="4 13" />
          <text x="80" y="176" textAnchor="middle" fill="hsl(var(--gold-soft))" fontFamily="var(--font-mono)" fontSize="11" fontWeight="800" letterSpacing="1.1">
            {copy.bridge}
          </text>
        </g>

        <g stroke="hsl(var(--crescent-blue))" strokeWidth="2" fill="none" filter="url(#orgGlow)">
          <path d="M200 119C242 119 254 107 292 110" className="flow-line" />
          <path d="M200 189C242 189 254 178 292 178" className="flow-line" />
          <path d="M200 259C242 259 254 245 292 246" className="flow-line" />
          <path d="M200 329C242 329 254 314 292 314" className="flow-line" />
          <path d="M434 110C466 116 482 140 496 168" className="flow-line" />
          <path d="M434 178C462 180 480 188 492 198" className="flow-line" />
          <path d="M434 246C462 244 480 232 492 220" className="flow-line" />
          <path d="M434 314C466 304 482 274 496 240" className="flow-line" />
          <path d="M602 174C626 142 636 119 676 119" className="flow-line" />
          <path d="M606 199C642 196 658 189 676 189" className="flow-line" />
          <path d="M606 222C642 226 658 246 676 259" className="flow-line" />
          <path d="M602 247C626 286 638 316 676 329" className="flow-line" />
        </g>

        <g>
          {outputs.map(([label, x, y]) => (
            <g key={label}>
              <rect x={x} y={y} width="174" height="46" rx="12" fill="hsl(var(--gold) / 0.11)" stroke="hsl(var(--gold) / 0.34)" />
              <path d={`M${x + 20} ${y + 30}l9-9 8 7 12-15`} stroke="hsl(var(--gold-soft))" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x={x + 56} y={y + 29} fill="hsl(var(--foreground) / 0.86)" fontFamily="var(--font-sans)" fontSize="14" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g fill="hsl(var(--crescent-blue))" className="signal-pulse">
          <circle cx="242" cy="119" r="4" />
          <circle cx="262" cy="259" r="4" />
          <circle cx="480" cy="188" r="4" />
          <circle cx="648" cy="246" r="4" />
        </g>

        <g fill="hsl(var(--platinum) / 0.86)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" letterSpacing="0.8">
          <text x="430" y="376" textAnchor="middle">{organizationName}</text>
          <text x="510" y="218" textAnchor="middle">{copy.center}</text>
        </g>
      </svg>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ["Source-labeled", "Every input is tied to a system, document, person, or review gate."],
          ["Human-reviewed", "Artemis highlights decisions; leaders still own approvals and judgment."],
          ["Pilot-ready", "The first implementation path is scoped before deep integration work begins."],
        ].map(([label, detail]) => (
          <div key={label} className="rounded-xl border border-border/60 bg-background/35 p-3">
            <p className="font-mono text-[0.58rem] uppercase tracking-wider text-signal-soft">
              {label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.footer}</p>
    </div>
  );
}
