"use client";

import * as React from "react";
import { ExternalLink, FlaskConical, Radar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const views = [
  {
    id: "civicbid",
    label: "CivicBid review",
    eyebrow: "Preserved reference",
    description: "Inspect The Bid Room v2.1 donor interface inside its governed review wrapper.",
    href: "/labs/civicbid-signal-forge",
    icon: FlaskConical,
  },
  {
    id: "bidroom-live",
    label: "BidRoom Live",
    eyebrow: "Official-source launchpad",
    description: "Move from public opportunity discovery to source verification and pursuit workflow.",
    href: "/products/bidroom/live",
    icon: Radar,
  },
] as const;

type ViewId = (typeof views)[number]["id"];

export function BidRoomViewSwitcher() {
  const [activeViewId, setActiveViewId] = React.useState<ViewId>("civicbid");
  const activeView = views.find((view) => view.id === activeViewId) ?? views[0];

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2" role="tablist" aria-label="Choose a BidRoom view">
        {views.map(({ id, label, eyebrow, description, icon: Icon }) => {
          const selected = id === activeViewId;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="bidroom-view-panel"
              onClick={() => setActiveViewId(id)}
              className={cn(
                "group border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-gold bg-gold/10 shadow-gold"
                  : "border-border bg-navy-deep/55 hover:border-signal-soft/60 hover:bg-navy/70",
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center border",
                    selected ? "border-gold/60 bg-gold/15 text-gold" : "border-border bg-background/45 text-signal-soft",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {eyebrow}
                  </span>
                  <span className="mt-1 block text-lg font-bold text-foreground">{label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <section
        id="bidroom-view-panel"
        role="tabpanel"
        aria-label={activeView.label}
        className="mt-5 overflow-hidden border border-border bg-navy-deep/65 shadow-panel"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/70 px-4 py-3">
          <div>
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-gold">Current view</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{activeView.label}</p>
          </div>
          <a
            href={activeView.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open individually <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
        <iframe
          key={activeView.id}
          src={activeView.href}
          title={`${activeView.label} interactive view`}
          className="block h-[78dvh] min-h-[720px] w-full border-0 bg-background"
          loading="eager"
        />
      </section>
    </div>
  );
}
