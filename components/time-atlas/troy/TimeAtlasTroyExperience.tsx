"use client";

import * as React from "react";
import {
  Anchor,
  Clock3,
  Compass,
  Info,
  Landmark,
  MapPin,
  Shield,
  Sparkles,
  Waves,
  Wheat,
} from "lucide-react";
import { eras } from "@/data/troy/eras";
import { layers, type LayerId } from "@/data/troy/layers";
import { pois, type Poi } from "@/data/troy/pois";
import { kmlAnchors } from "@/data/troy/kmlAnchors";
import { cn } from "@/lib/utils/cn";

type TimeAtlasTroyExperienceProps = {
  surface: "canonical" | "development";
};

const layerIcons: Record<LayerId, React.ComponentType<{ className?: string }>> = {
  agriculture: Wheat,
  defense: Shield,
  religion: Landmark,
  trade: Anchor,
  water: Waves,
};

function getScenePosition(poi: Poi) {
  const [x = 0, , z = 0] = poi.scenePosition ?? [0, 0, 0];
  return {
    left: Math.min(88, Math.max(10, 50 + x * 0.78)),
    top: Math.min(82, Math.max(14, 47 + z * 0.72)),
  };
}

function confidenceTone(confidence: Poi["confidence"]) {
  if (confidence === "High") {
    return "border-emerald-300/50 bg-emerald-300/12 text-emerald-100";
  }
  if (confidence === "Medium") {
    return "border-sky-300/45 bg-sky-300/12 text-sky-100";
  }
  if (confidence === "Speculative") {
    return "border-amber-300/45 bg-amber-300/12 text-amber-100";
  }
  return "border-slate-300/45 bg-slate-300/12 text-slate-100";
}

export function TimeAtlasTroyExperience({ surface }: TimeAtlasTroyExperienceProps) {
  const [activeLayer, setActiveLayer] = React.useState<LayerId | "all">("all");
  const [activePoiId, setActivePoiId] = React.useState("citadel");

  const visiblePois = React.useMemo(() => {
    return activeLayer === "all" ? pois : pois.filter((poi) => poi.layer === activeLayer);
  }, [activeLayer]);

  React.useEffect(() => {
    if (!visiblePois.some((poi) => poi.id === activePoiId)) {
      setActivePoiId(visiblePois[0]?.id ?? "citadel");
    }
  }, [activePoiId, visiblePois]);

  const activePoi = visiblePois.find((poi) => poi.id === activePoiId) ?? pois[0];
  const activeLayerMeta = layers.find((layer) => layer.id === activePoi.layer);
  const activeEra = eras.find((era) => era.status === "active");

  return (
    <section className="relative isolate overflow-hidden bg-[#081015] text-stone-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(74,163,199,0.22),transparent_32%),linear-gradient(180deg,#0b1419_0%,#12100b_52%,#050708_100%)]" />
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(300px,0.82fr)_minmax(480px,1.18fr)] lg:px-8 lg:py-8">
        <header className="flex flex-col justify-between gap-5 rounded-lg border border-white/10 bg-black/24 p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-6 lg:min-h-[calc(100dvh-4rem)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a574]">
              <span>Artemis Time Atlas</span>
              <span className="rounded-full border border-white/15 px-2.5 py-1 tracking-normal text-stone-300">
                Priam Lens A0.3
              </span>
              {surface === "development" ? (
                <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 tracking-normal text-cyan-100">
                  development-env001
                </span>
              ) : null}
            </div>

            <div className="space-y-3">
              <h1 className="display-serif max-w-3xl text-4xl leading-[0.96] text-stone-50 sm:text-5xl lg:text-6xl">
                Troy / Ilion c. 600 BC
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                A mobile-first museum-quality diorama proving the fixed terrain,
                changing civilization thesis with local provisional data only.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-stone-400">
                  Active era
                </div>
                <div className="mt-1 font-semibold text-stone-100">{activeEra?.label}</div>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-stone-400">
                  POIs
                </div>
                <div className="mt-1 font-semibold text-stone-100">{pois.length}</div>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-stone-400">
                  Data mode
                </div>
                <div className="mt-1 font-semibold text-stone-100">Local</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                <Clock3 className="h-4 w-4 text-[#d4a574]" />
                Time layers
              </div>
              <div className="grid grid-cols-2 gap-2">
                {eras.map((era) => (
                  <button
                    key={era.id}
                    type="button"
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm transition",
                      era.status === "active"
                        ? "border-[#d4a574]/70 bg-[#d4a574]/16 text-stone-50"
                        : "border-white/10 bg-white/[0.035] text-stone-300 opacity-75",
                    )}
                    style={{ boxShadow: era.status === "active" ? `0 0 0 1px ${era.color}55 inset` : undefined }}
                    disabled={era.status !== "active"}
                  >
                    <span className="block font-semibold">{era.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-stone-400">
                      {era.status === "active" ? "Active layer" : "Ghost teaser"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-amber-300/20 bg-amber-200/8 p-4 text-sm leading-6 text-amber-50/90">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4" />
              Historical credibility guardrail
            </div>
            All geometry in this A0.3 route is interpretive. Public claims must
            keep confidence level, evidence snippet, and source note visible.
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0d1614] shadow-2xl shadow-black/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                <Compass className="h-4 w-4 text-cyan-200" />
                Fixed terrain diorama
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLayer("all")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                    activeLayer === "all"
                      ? "border-stone-100/50 bg-stone-100/16 text-stone-50"
                      : "border-white/10 bg-white/[0.03] text-stone-300 hover:bg-white/[0.08]",
                  )}
                >
                  All
                </button>
                {layers.map((layer) => {
                  const Icon = layerIcons[layer.id];
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setActiveLayer(layer.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                        activeLayer === layer.id
                          ? "border-white/40 bg-white/15 text-stone-50"
                          : "border-white/10 bg-white/[0.03] text-stone-300 hover:bg-white/[0.08]",
                      )}
                      style={{ color: activeLayer === layer.id ? layer.color : undefined }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {layer.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto aspect-[9/16] max-h-[760px] min-h-[560px] w-full max-w-[520px] overflow-hidden bg-[#13231f] sm:min-h-[640px] lg:max-h-none lg:min-h-[calc(100dvh-16rem)]">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(12,57,66,0.55),transparent_38%),linear-gradient(30deg,rgba(167,124,74,0.18),transparent_48%),radial-gradient(circle_at_50%_42%,rgba(212,165,116,0.25),transparent_30%)]" />
              <div className="absolute left-[-18%] top-[8%] h-[20%] w-[140%] rotate-[-10deg] rounded-full bg-[#33524c]/70 blur-md" />
              <div className="absolute bottom-[9%] left-[-16%] h-[24%] w-[138%] rotate-[8deg] rounded-[50%] bg-[#6d7d45]/38 blur-sm" />
              <div className="absolute bottom-[24%] right-[-35%] h-[18%] w-[92%] rotate-[-19deg] rounded-full bg-[#2a778d]/65 blur-[2px]" />
              <div className="absolute left-[31%] top-[31%] h-[28%] w-[40%] rotate-[-11deg] rounded-[42%] border border-[#d4a574]/30 bg-[#6e4a2f]/82 shadow-[0_24px_60px_rgba(0,0,0,0.46)]" />
              <div className="absolute left-[36%] top-[34%] h-[16%] w-[30%] rotate-[-11deg] rounded-[38%] border border-[#e5bd80]/45 bg-[#a87542]/72" />
              <div className="absolute left-[43%] top-[38%] h-[8%] w-[12%] rotate-[-11deg] rounded-sm border border-[#f0d9a9]/45 bg-[#d4a574]/85 shadow-lg" />

              <div className="absolute left-[14%] top-[18%] rounded-full border border-white/15 bg-black/22 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-200">
                Dardanelles
              </div>
              <div className="absolute bottom-[18%] right-[7%] rounded-full border border-white/15 bg-black/22 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-200">
                Scamander plain
              </div>

              {visiblePois.map((poi) => {
                const position = getScenePosition(poi);
                const layer = layers.find((item) => item.id === poi.layer);
                const isActive = poi.id === activePoi.id;
                return (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => setActivePoiId(poi.id)}
                    className={cn(
                      "absolute z-20 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d4a574]",
                      isActive
                        ? "border-white bg-[#d4a574] shadow-[#d4a574]/35"
                        : "border-white/45 bg-black/45 backdrop-blur",
                    )}
                    style={{ left: `${position.left}%`, top: `${position.top}%` }}
                    aria-label={`Show ${poi.name}`}
                  >
                    <MapPin className="h-4 w-4" style={{ color: isActive ? "#081015" : layer?.color }} />
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4 z-30 rounded-md border border-white/12 bg-black/42 p-3 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-stone-50">
                      {activePoi.name}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-stone-300">
                      {activePoi.description}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      confidenceTone(activePoi.confidence),
                    )}
                  >
                    {activePoi.confidence}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.86fr]">
            <article className="rounded-lg border border-white/10 bg-black/26 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                <Sparkles className="h-4 w-4 text-[#d4a574]" />
                Selected evidence
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                {activePoi.evidenceSnippet}
              </p>
              <p className="mt-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-xs leading-5 text-stone-400">
                Source note: {activePoi.sourceNote}
              </p>
            </article>

            <aside className="rounded-lg border border-white/10 bg-black/26 p-4">
              <div className="text-sm font-semibold text-stone-200">
                Provisional anchors
              </div>
              <div className="mt-3 space-y-2">
                {kmlAnchors.map((anchor) => (
                  <div key={anchor.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-stone-100">{anchor.label}</span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-stone-400">
                        {anchor.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-stone-400">{anchor.note}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
