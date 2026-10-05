"use client";

import * as React from "react";
import Link from "next/link";
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
const viewIds: readonly ViewId[] = views.map((view) => view.id);

function isViewId(value: string | null): value is ViewId {
  return value === "civicbid" || value === "bidroom-live";
}

export function BidRoomViewSwitcher() {
  const [activeViewId, setActiveViewId] = React.useState<ViewId>("civicbid");
  const tabRefs = React.useRef<Record<ViewId, HTMLButtonElement | null>>({
    civicbid: null,
    "bidroom-live": null,
  });

  // Honor ?view= on load so a review state can be shared or bookmarked.
  React.useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("view");
    if (isViewId(initial)) {
      setActiveViewId(initial);
    }
  }, []);

  const selectView = (id: ViewId, focusTab = false) => {
    setActiveViewId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("view", id);
    window.history.replaceState(null, "", url.toString());
    if (focusTab) {
      tabRefs.current[id]?.focus();
    }
  };

  const onTabListKeyDown = (event: React.KeyboardEvent) => {
    const current = viewIds.indexOf(activeViewId);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (current + 1) % viewIds.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + viewIds.length) % viewIds.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = viewIds.length - 1;
    if (next !== null) {
      event.preventDefault();
      selectView(viewIds[next], true);
    }
  };

  const activeView = views.find((view) => view.id === activeViewId) ?? views[0];
  // Embedded views hide their own header chrome (?embedded=switchboard) so the
  // switchboard is the single navigation frame — no navigation inside the box.
  const frameSrc = `${activeView.href}?embedded=switchboard`;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <li>
            <Link
              href="/products/bidroom"
              className="transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              BidRoom Nexus
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/60">
            /
          </li>
          <li>
            <Link
              href="/products/bidroom/switchboard"
              className="transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Review Switchboard
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/60">
            /
          </li>
          <li aria-current="page" className="text-gold">
            {activeView.label}
          </li>
        </ol>
      </nav>

      <div
        className="grid gap-3 md:grid-cols-2"
        role="tablist"
        aria-label="Choose a BidRoom view"
        onKeyDown={onTabListKeyDown}
      >
        {views.map(({ id, label, eyebrow, description, icon: Icon }) => {
          const selected = id === activeViewId;
          return (
            <button
              key={id}
              ref={(element) => {
                tabRefs.current[id] = element;
              }}
              type="button"
              role="tab"
              id={`bidroom-view-tab-${id}`}
              aria-selected={selected}
              aria-controls="bidroom-view-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectView(id)}
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
          src={frameSrc}
          title={`${activeView.label} interactive view`}
          className="block h-[78dvh] min-h-[720px] w-full border-0 bg-background"
          loading="lazy"
        />
      </section>
    </div>
  );
}
