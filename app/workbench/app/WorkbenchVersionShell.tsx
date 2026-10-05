"use client";

import { useMemo } from "react";
import { labSandbox } from "@/lib/standalone-labs";

// Phase 1 triage: the served runtime is v5.8 (see next.config.mjs
// /workbench/runtime/latest rewrite). The label matches the runtime;
// the previous v6.0.0-alpha / v5.9 switcher offered two options that
// loaded the identical file.
const version = {
  label: "v5.8",
  status: "Production",
  src: "/workbench/runtime/latest",
  note: "Current production runtime of the ARTEMIS Geometric Workbench.",
} as const;

export function WorkbenchVersionShell() {
  const frameKey = useMemo(() => `v5-8-${version.src}`, []);

  return (
    <main className="flex h-screen overflow-hidden flex-col bg-[#05080d] text-white">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0a111c] px-4 py-3 shadow-xl">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-gold">ARTEMIS Intelligent Systems</div>
          <h1 className="truncate text-lg font-semibold">Geometric Workbench</h1>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
            {version.label}
          </span>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            {version.status}
          </span>
          <a href="/workbench" className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-gold hover:text-gold">
            Product home
          </a>
          <a href="/contact?product=geometric-workbench" className="rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-background hover:opacity-90">
            Support
          </a>
        </div>
      </header>

      <div className="border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs text-emerald-100">
        {version.note}
      </div>

      <section className="relative min-h-0 flex-1">
        <iframe
          sandbox={labSandbox("geometric-workbench-runtime")}
          referrerPolicy="no-referrer"
          loading="lazy"
          key={frameKey}
          title={`ARTEMIS Geometric Workbench ${version.label}`}
          src={version.src}
          className="absolute inset-0 h-full w-full border-0"
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </section>
    </main>
  );
}
