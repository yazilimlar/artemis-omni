"use client";

import { useEffect, useMemo, useState } from "react";

const versions = {
  latest: {
    label: "v6.0.0-alpha",
    status: "Latest",
    src: "/workbench/releases/v6.0.0-alpha/index.html",
    note: "Current ARTEMIS Geometric Workbench with v6 BOM integrity, canonical terminology, palettes, and fabrication intelligence.",
  },
  legacy: {
    label: "v5.9",
    status: "Superseded",
    src: "https://artemis-omni-gpfr7u24n-gokmen1313-3041s-projects.vercel.app/labs/geometric-workbench/v5-8/index.html",
    note: "Frozen pre-v6 production deployment retained for comparison and backward review only.",
  },
} as const;

const displayScales = [0.75, 0.85, 1] as const;
const SCALE_STORAGE_KEY = "artemis_workbench_display_scale_v1";

type VersionKey = keyof typeof versions;
type DisplayScale = (typeof displayScales)[number];

function isDisplayScale(value: number): value is DisplayScale {
  return displayScales.includes(value as DisplayScale);
}

export function WorkbenchVersionShell() {
  const [version, setVersion] = useState<VersionKey>("latest");
  const [displayScale, setDisplayScale] = useState<DisplayScale>(0.75);
  const selected = versions[version];
  const frameKey = useMemo(() => `${version}-${selected.src}`, [selected.src, version]);
  const inverseScale = 100 / displayScale;

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(SCALE_STORAGE_KEY));
      if (isDisplayScale(stored)) setDisplayScale(stored);
    } catch {
      // Storage may be unavailable in hardened/private browser contexts.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SCALE_STORAGE_KEY, String(displayScale));
    } catch {
      // Scale remains functional for the current session without persistence.
    }
  }, [displayScale]);

  return (
    <main className="flex h-screen overflow-hidden flex-col bg-[#05080d] text-white">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0a111c] px-4 py-3 shadow-xl">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-gold">ARTEMIS Intelligent Systems</div>
          <h1 className="truncate text-lg font-semibold">Geometric Workbench</h1>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
            {selected.label}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${version === "latest" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
            {selected.status}
          </span>

          <label className="sr-only" htmlFor="workbench-display-scale">Workbench display scale</label>
          <select
            id="workbench-display-scale"
            value={displayScale}
            onChange={(event) => setDisplayScale(Number(event.target.value) as DisplayScale)}
            className="rounded-lg border border-white/15 bg-[#111a28] px-3 py-2 text-sm text-white"
            title="Change the Workbench interface scale without changing browser zoom"
          >
            <option value={0.75}>Interface scale — 75%</option>
            <option value={0.85}>Interface scale — 85%</option>
            <option value={1}>Interface scale — 100%</option>
          </select>

          <label className="sr-only" htmlFor="workbench-version">Workbench version</label>
          <select
            id="workbench-version"
            value={version}
            onChange={(event) => setVersion(event.target.value as VersionKey)}
            className="rounded-lg border border-white/15 bg-[#111a28] px-3 py-2 text-sm text-white"
          >
            <option value="latest">Latest — v6.0.0-alpha</option>
            <option value="legacy">Superseded — v5.9</option>
          </select>
          <a href="/workbench" className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-gold hover:text-gold">
            Product home
          </a>
          <a href="/contact?product=geometric-workbench" className="rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-background hover:opacity-90">
            Support
          </a>
        </div>
      </header>

      <div className={`border-b px-4 py-2 text-xs ${version === "latest" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-100" : "border-amber-500/25 bg-amber-500/10 text-amber-100"}`}>
        {selected.note} Interface scale is currently {Math.round(displayScale * 100)}% and can be changed from the header.
      </div>

      <section className="relative min-h-0 flex-1 overflow-hidden">
        <iframe
          key={frameKey}
          title={`ARTEMIS Geometric Workbench ${selected.label}`}
          src={selected.src}
          className="absolute left-0 top-0 border-0"
          style={{
            width: `${inverseScale}%`,
            height: `${inverseScale}%`,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </section>
    </main>
  );
}
