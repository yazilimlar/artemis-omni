"use client";

import { useMemo, useState } from "react";
import { groupByMonth, TYPE_COLORS, TYPE_LABELS } from "@/lib/evolution/derive";
import type { EvolutionEvent } from "@/lib/evolution/load";

const OPEN_MONTHS = 3;

/**
 * Public timeline: events grouped by month, newest month first, one line each.
 * Plain markup with no scroll animation, so it is already the reduced-motion view.
 * Events must already be filtered with filterForPublic; this renders no links.
 */
export function PlatformTimeline({ events }: { events: EvolutionEvent[] }) {
  const [showAll, setShowAll] = useState(false);
  const groups = useMemo(() => groupByMonth(events).reverse(), [events]);

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No public events yet.</p>;
  }

  const visible = showAll ? groups : groups.slice(0, OPEN_MONTHS);
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        {visible.map((group) => (
          <section
            key={group.key}
            aria-label={group.label}
            className="rounded-lg border border-border/70 bg-navy-deep/40 p-5"
          >
            <h3 className="font-mono text-[0.68rem] uppercase tracking-wider text-signal-soft">{group.label}</h3>
            <ol className="mt-3 space-y-4">
              {[...group.events].reverse().map((event) => (
                <li key={event.id} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: TYPE_COLORS[event.type] }}
                    aria-hidden
                  />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {event.date.slice(0, 10)} · {TYPE_LABELS[event.type]}
                    </p>
                    <p className="text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      {groups.length > OPEN_MONTHS ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="mt-6 rounded-full border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold"
        >
          {showAll ? "Show recent months only" : `Show ${groups.length - OPEN_MONTHS} earlier months`}
        </button>
      ) : null}
    </div>
  );
}
