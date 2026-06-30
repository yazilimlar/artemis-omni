export function BlueprintFluxDiagram() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-signal-soft/20 bg-navy-deep/50 p-5 shadow-panel">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            System architecture
          </p>
          <h3 className="display-serif mt-2 text-2xl text-parchment">Blueprint flux diagram</h3>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
          Public-safe
        </span>
      </div>

      <svg
        viewBox="0 0 760 360"
        className="h-auto w-full"
        role="img"
        aria-label="Artemis system architecture diagram from sources to dashboard and operational reports"
      >
        <defs>
          <filter id="fluxGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="8" y="8" width="744" height="344" rx="24" fill="hsl(var(--background) / 0.36)" stroke="hsl(var(--border) / 0.78)" />
        <g fill="hsl(var(--platinum) / 0.92)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" letterSpacing="1">
          <text x="46" y="54">INPUTS</text>
          <text x="333" y="54">ARTEMIS CORE</text>
          <text x="592" y="54">OUTPUTS</text>
        </g>

        <g>
          {[
            ["Brand identity", 70, 102],
            ["Sensor nets", 70, 182],
            ["Data lakes", 70, 262],
          ].map(([label, x, y]) => (
            <g key={label}>
              <rect x={Number(x)} y={Number(y)} width="150" height="48" rx="12" fill="hsl(var(--signal-blue) / 0.12)" stroke="hsl(var(--crescent-blue) / 0.34)" />
              <text x={Number(x) + 18} y={Number(y) + 30} fill="hsl(var(--foreground) / 0.84)" fontFamily="var(--font-sans)" fontSize="15" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g transform="translate(336 126)">
          <circle cx="70" cy="70" r="72" fill="hsl(var(--navy-deep) / 0.92)" stroke="hsl(var(--gold) / 0.38)" />
          <circle cx="70" cy="70" r="46" fill="hsl(var(--platinum) / 0.18)" stroke="hsl(var(--gold) / 0.42)" />
          <path d="M42 78C50 103 88 108 108 86C89 96 59 93 42 78Z" fill="hsl(var(--crescent-blue) / 0.72)" />
          <path d="M70 28 102 108 86 104 70 60 54 104 38 108 70 28Z" fill="hsl(var(--gold-soft))" />
          <path d="M70 28 86 104 70 60 54 104Z" fill="hsl(var(--gold))" />
          <text x="70" y="164" textAnchor="middle" fill="hsl(var(--gold-soft))" fontFamily="var(--font-mono)" fontSize="12" fontWeight="800" letterSpacing="1.3">
            REVIEWED CORE
          </text>
        </g>

        <g stroke="hsl(var(--crescent-blue))" strokeWidth="2" fill="none" filter="url(#fluxGlow)">
          <path d="M220 126C265 126 292 164 336 182" className="flow-line" />
          <path d="M220 206C274 206 294 196 336 196" className="flow-line" />
          <path d="M220 286C278 282 298 230 342 212" className="flow-line" />
          <path d="M476 182C532 160 552 118 604 116" className="flow-line" />
          <path d="M476 206C532 206 552 206 604 206" className="flow-line" />
          <path d="M476 232C532 258 552 286 604 286" className="flow-line" />
        </g>

        <g>
          {[
            ["Executive dashboard", 604, 92, "chart"],
            ["Operational reports", 604, 182, "doc"],
            ["Pilot action log", 604, 272, "action"],
          ].map(([label, x, y]) => (
            <g key={label}>
              <rect x={Number(x)} y={Number(y)} width="122" height="56" rx="14" fill="hsl(var(--gold) / 0.11)" stroke="hsl(var(--gold) / 0.34)" />
              <text x={Number(x) + 16} y={Number(y) + 33} fill="hsl(var(--foreground) / 0.86)" fontFamily="var(--font-sans)" fontSize="13" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g className="signal-pulse" fill="hsl(var(--crescent-blue))">
          <circle cx="252" cy="126" r="4" />
          <circle cx="298" cy="202" r="4" />
          <circle cx="544" cy="206" r="4" />
          <circle cx="552" cy="286" r="4" />
        </g>
      </svg>
    </div>
  );
}
