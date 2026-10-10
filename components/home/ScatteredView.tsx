import { Link2Off } from "lucide-react";

const FRAGMENTS = [
  { title: "Daily field report", meta: "PDF · 14 pages · Friday", rotate: "-rotate-3", offset: "md:translate-y-3" },
  { title: "Master schedule", meta: "Desktop file · v23", rotate: "rotate-2", offset: "" },
  { title: "Cost code ledger", meta: "Spreadsheet · 3 tabs", rotate: "-rotate-2", offset: "md:translate-y-5" },
  { title: "Cash forecast", meta: "Email thread · 11 replies", rotate: "rotate-3", offset: "md:translate-y-2" },
  { title: "Change log", meta: "Shared drive · 2 copies", rotate: "-rotate-1", offset: "" },
];

/**
 * The "before" state: project signals scattered across separate systems
 * that never quite agree. Generic artifact names only — no real projects.
 */
export function ScatteredView() {
  return (
    <div
      role="img"
      aria-label="Illustration of project signals scattered across five disconnected systems: a field report PDF, a master schedule file, a cost code spreadsheet, a cash forecast email thread, and a change log on a shared drive."
      className="rounded-2xl border border-border/60 bg-navy-deep/40 p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-center gap-4 md:gap-5">
        {FRAGMENTS.map((f) => (
          <div
            key={f.title}
            className={`w-52 rounded-xl border border-dashed border-border/70 bg-background/60 p-4 shadow-sm ${f.rotate} ${f.offset}`}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link2Off className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[0.66rem] uppercase tracking-wider">
                Disconnected
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{f.title}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{f.meta}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Separate systems that never quite agree — no shared source, no traceable handoff.
      </p>
    </div>
  );
}
