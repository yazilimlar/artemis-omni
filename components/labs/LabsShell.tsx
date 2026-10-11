"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { labCategoryMeta, labCategoryOrder, type LabCategory } from "@/data/labs-editorial";
import { LabsAtlas, ATLAS_STYLE_META, type AtlasNode, type AtlasStyle } from "@/components/labs/LabsAtlas";

type View = "index" | "atlas";
type PathId = "all" | "executive" | "engineer" | "finance";

const PATHS: Record<PathId, { label: string; order: LabCategory[] | null; caption: string }> = {
  all: { label: "All paths", order: null, caption: "" },
  executive: {
    label: "Executive",
    order: ["construction", "controls", "brand", "bid", "explorations"],
    caption: "Start with the flagship proofs, then the numbers and the brand behind them.",
  },
  engineer: {
    label: "Engineer",
    order: ["construction", "explorations", "controls", "brand", "bid"],
    caption: "Start with the working systems and simulators, then the playgrounds.",
  },
  finance: {
    label: "Finance",
    order: ["controls", "bid", "construction", "brand", "explorations"],
    caption: "Start with the commercial lens: controls, procurement, then the field systems.",
  },
};

const VIEW_KEY = "labs-view";
const PATH_KEY = "labs-path";
const STYLE_KEY = "labs-atlas-style";

const ATLAS_STYLE_IDS: AtlasStyle[] = [
  "constellation",
  "forum",
  "archipelago",
  "orbit",
  "strata",
  "radial",
  "pantheon",
  "colosseum",
  "agora",
  "geodesic",
  "octagon",
  "rotonda",
];

/**
 * LabsShell — the interactive frame for /labs.
 *
 * Owns the Index | Atlas view toggle (persisted) and the HVAC-style narrative
 * path selector (persisted). Server-rendered section slots pass through
 * untouched; only ordering and visibility are client-driven.
 */
export function LabsShell({
  flagshipSection,
  sections,
  moreLabs,
  nodes,
}: {
  flagshipSection: ReactNode;
  sections: { id: LabCategory; node: ReactNode }[];
  moreLabs: ReactNode;
  nodes: AtlasNode[];
}) {
  const [view, setView] = useState<View>("index");
  const [path, setPath] = useState<PathId>("all");
  const [atlasStyle, setAtlasStyle] = useState<AtlasStyle>("constellation");
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(VIEW_KEY);
      if (v === "index" || v === "atlas") setView(v);
      const p = window.localStorage.getItem(PATH_KEY);
      if (p === "executive" || p === "engineer" || p === "finance") setPath(p);
      const s = window.localStorage.getItem(STYLE_KEY);
      if (s && (ATLAS_STYLE_IDS as string[]).includes(s)) setAtlasStyle(s as AtlasStyle);
    } catch {
      /* private mode — defaults stand */
    }
  }, []);

  function pickView(v: View) {
    setView(v);
    try {
      window.localStorage.setItem(VIEW_KEY, v);
    } catch { /* ignore */ }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickAtlasStyle(s: AtlasStyle) {
    setAtlasStyle(s);
    try {
      window.localStorage.setItem(STYLE_KEY, s);
    } catch { /* ignore */ }
  }

  function pickPath(p: PathId) {
    setPath(p);
    try {
      window.localStorage.setItem(PATH_KEY, p);
    } catch { /* ignore */ }
  }

  const ordered = useMemo(() => {
    const order = PATHS[path].order;
    if (!order) return sections;
    const rank = new Map(order.map((c, i) => [c, i]));
    return [...sections].sort(
      (a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99),
    );
  }, [sections, path]);

  const visibleCats = useMemo(
    () => labCategoryOrder.filter((c) => sections.some((s) => s.id === c)),
    [sections],
  );

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* View toggle */}
      <section className="border-b border-border/60 py-8">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex items-center gap-1 rounded-full border border-border/60 p-1"
              role="group"
              aria-label="Labs display mode"
            >
              {(["index", "atlas"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => pickView(v)}
                  className={`rounded-full px-4 py-1.5 font-papermono text-xs capitalize transition-colors ${
                    view === v ? "bg-gold/15 text-gold-soft" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v === "index" ? "◧ Index" : "✦ Atlas"}
                </button>
              ))}
            </div>
            {view === "index" ? (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose your path">
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  Choose your path
                </span>
                {(Object.keys(PATHS) as PathId[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={path === p}
                    onClick={() => pickPath(p)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      path === p
                        ? "border-gold/50 bg-gold/10 text-gold-soft"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {PATHS[p].label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {view === "index" && PATHS[path].caption ? (
            <p className="mt-4 text-sm text-muted-foreground">{PATHS[path].caption}</p>
          ) : null}
        </div>
      </section>

      {view === "index" ? (
        <>
          {/* Category jump nav */}
          <section className="border-b border-border/60 py-8">
            <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
              <nav aria-label="Browse labs by category" className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  Browse
                </span>
                <a href="#flagships" className="text-sm text-gold-soft underline-offset-4 hover:underline">
                  Flagships
                </a>
                {ordered
                  .map((s) => s.id)
                  .filter((c) => visibleCats.includes(c))
                  .map((cat) => (
                    <a
                      key={cat}
                      href={`#labs-${cat}`}
                      className="text-sm text-foreground/75 underline-offset-4 transition-colors hover:text-gold hover:underline"
                    >
                      {labCategoryMeta[cat].label}
                    </a>
                  ))}
              </nav>
            </div>
          </section>

          {flagshipSection}
          {ordered.map((s) => (
            <div key={s.id}>{s.node}</div>
          ))}
          {moreLabs}
        </>
      ) : (
        <section className="border-b border-border/60 py-16 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
            <p className="eyebrow">Atlas view</p>
            <h2 className="display-serif mt-3 text-balance text-3xl text-parchment sm:text-4xl">
              {ATLAS_STYLE_META[atlasStyle].title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {ATLAS_STYLE_META[atlasStyle].blurb}
            </p>
            <div className="mt-8">
              <LabsAtlas nodes={nodes} style={atlasStyle} onStyleChange={pickAtlasStyle} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
