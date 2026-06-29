type GeodesicRenderCardProps = {
  title?: string;
  caption?: string;
};

export function GeodesicRenderCard({
  title = "Geodesic intelligence render",
  caption = "A lightweight SVG render inspired by the geodesic and fabrication workbenches, rebuilt without raw model data.",
}: GeodesicRenderCardProps) {
  return (
    <div className="cinematic-breathe relative overflow-hidden rounded-2xl border border-signal-soft/20 bg-navy-deep/55 p-5 shadow-panel">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            Spatial proof
          </p>
          <h3 className="display-serif mt-2 text-2xl text-parchment">{title}</h3>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">{caption}</p>
        </div>
      </div>

      <svg
        viewBox="0 0 520 340"
        className="mt-5 h-auto w-full"
        role="img"
        aria-label="Animated geodesic dome render"
      >
        <ellipse cx="260" cy="286" rx="180" ry="22" fill="hsl(var(--signal-blue) / 0.14)" />
        <g className="orbital-spin" opacity="0.85">
          <ellipse cx="260" cy="176" rx="178" ry="58" fill="none" stroke="hsl(var(--crescent-blue) / 0.26)" />
          <ellipse cx="260" cy="176" rx="112" ry="168" fill="none" stroke="hsl(var(--gold) / 0.18)" />
        </g>
        <path
          d="M90 270C106 158 172 78 260 52C348 78 414 158 430 270Z"
          fill="hsl(var(--signal-blue) / 0.10)"
          stroke="hsl(var(--crescent-blue) / 0.42)"
          strokeWidth="2"
        />
        <g stroke="hsl(var(--platinum) / 0.36)" strokeWidth="1.2">
          <path d="M90 270 260 52 430 270" />
          <path d="M140 270 260 52 380 270" />
          <path d="M190 270 260 52 330 270" />
          <path d="M240 270 260 52 280 270" />
          <path d="M116 226C184 206 336 206 404 226" />
          <path d="M142 182C204 164 316 164 378 182" />
          <path d="M178 132C218 120 302 120 342 132" />
          <path d="M214 88C236 82 284 82 306 88" />
          <path d="M112 235 180 132 260 52 340 132 408 235" />
          <path d="M156 270 204 164 260 52 316 164 364 270" />
        </g>
        <g fill="hsl(var(--gold-soft))">
          {[260, 180, 340, 204, 316, 140, 380].map((x, index) => (
            <circle
              key={x + index}
              cx={x}
              cy={[52, 132, 132, 164, 164, 226, 226][index]}
              r="4"
              className="signal-pulse"
              style={{ animationDelay: `${index * 160}ms` }}
            />
          ))}
        </g>
        <path
          d="M118 278C196 294 324 294 402 278"
          stroke="hsl(var(--gold-soft))"
          strokeWidth="2.5"
          fill="none"
          className="plot-line-draw"
        />
      </svg>
    </div>
  );
}
