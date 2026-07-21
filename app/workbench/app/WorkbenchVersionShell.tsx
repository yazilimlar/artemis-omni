"use client";

import { useMemo, useState } from "react";

const versions = {
  latest: {
    label: "v6.0.0-alpha",
    status: "Latest",
    src: "/workbench/runtime/latest/",
    note: "Current ARTEMIS Geometric Workbench with v6 BOM integrity, canonical terminology, palettes, and fabrication intelligence.",
  },
  legacy: {
    label: "v5.9",
    status: "Superseded",
    src: "https://artemis-omni-gpfr7u24n-gokmen1313-3041s-projects.vercel.app/labs/geometric-workbench/v5-8/index.html",
    note: "Frozen pre-v6 production deployment retained for comparison and backward review only.",
  },
} as const;

type VersionKey = keyof typeof versions;

export function WorkbenchVersionShell() {
  const [version, setVersion] = useState<VersionKey>("latest");
  const selected = versions[version];
  const frameKey = useMemo(() => `${version}-${selected.src}`, [version, selected.src]);

  return (
    <main className="flex min-h-screen flex-col bg-[#05080d] text-white">
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
        {selected.note}
      </div>

      <section className="relative min-h-0 flex-1">
        <iframe
          key={frameKey}
          title={`ARTEMIS Geometric Workbench ${selected.label}`}
          src={selected.src}
          className="absolute inset-0 h-full w-full border-0"
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </section>
    </main>
  );
}
