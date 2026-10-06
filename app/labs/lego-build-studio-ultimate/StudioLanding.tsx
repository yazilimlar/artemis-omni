"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Eye,
  Landmark,
  ListChecks,
  Moon,
  Music,
  Palette,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { labSandbox } from "@/lib/standalone-labs";

const STATS = [
  { value: "10", label: "World monuments" },
  { value: "40", label: "LEGO part types" },
  { value: "9", label: "Generative music modes" },
  { value: "10", label: "Color modes" },
];

const FEATURES = [
  {
    icon: Landmark,
    title: "10 world monuments",
    text: "Hagia Sophia, Selimiye Mosque, St Peter's Basilica, the Pantheon of Rome, the Panthéon of Paris, the Parthenon, the Great Pyramid of Giza, One World Trade Center, the Empire State Building and the Burj Khalifa — each procedurally modeled brick by brick.",
  },
  {
    icon: Boxes,
    title: "Fourier crane fleet",
    text: "Up to three tower cranes install every part, their hooks traveling along true Fourier-epicycle paths — with optional trails that reveal the mathematics.",
  },
  {
    icon: Music,
    title: "9 generative scores",
    text: "Deep techno, deep house, psytrance, hip-hop, rap, rock, classical, pop and jazz — synthesized live with Web Audio, each mode showing its governing formula.",
  },
  {
    icon: Palette,
    title: "Color laboratory",
    text: "Ten live color modes from Realistic to Medieval — including Shuffle and Rainbow-by-time/height that recolor the whole build as it rises.",
  },
  {
    icon: ListChecks,
    title: "Live bill of materials",
    text: "All 40 part types tracked live beneath an overall completion bar, with clickable five-stage progress chips per monument.",
  },
  {
    icon: Sparkles,
    title: "ARTEMIS inscription",
    text: "The studio badge draws ARTEMIS with a Fourier epicycle chain and links out to artemis.agoraxai.com.",
  },
  {
    icon: Eye,
    title: "Clean-view mode",
    text: "One keypress hides every panel for a pure cinematic presentation of the construction.",
  },
  {
    icon: Moon,
    title: "Day / night",
    text: "Smooth sky transitions, auto-orbit, a rewindable build timeline and full keyboard control.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pick a monument",
    text: "Ten landmarks, from Hagia Sophia's great dome to the Burj Khalifa's needle — each with its own five-stage build plan.",
  },
  {
    n: "02",
    title: "Press play",
    text: "Cranes swing in, the timeline runs, and the bill of materials ticks live as thousands of bricks find their places.",
  },
  {
    n: "03",
    title: "Make it yours",
    text: "Remix the palette, switch the score, scrub the timeline — or drop into clean view and just watch it rise.",
  },
];

export default function StudioLanding() {
  const [launched, setLaunched] = useState(false);

  return (
    <main className="min-h-dvh bg-[#0b0f0d] text-[#e9eef6] antialiased">
      {/* top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 text-sm text-[#8593a6] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Artemis Labs
        </Link>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-[#9fb0c6]">
          v5.0 · Ultimate Edition
        </span>
      </header>

      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 text-center sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 mx-auto h-72 max-w-3xl rounded-full bg-[#4da3ff]/10 blur-3xl"
        />
        <p className="relative mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#4da3ff]">
          Artemis Labs · Interactive Demo
        </p>
        <h1 className="relative mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          LEGO Build Studio
          <span className="block bg-gradient-to-r from-[#4da3ff] via-[#5ce0b0] to-[#e3ac3f] bg-clip-text text-transparent">
            Ultimate Edition
          </span>
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#9fb0c6] sm:text-lg">
          Ten world monuments rebuilt brick by brick before your eyes — raised by
          a Fourier-series crane fleet, scored by nine generative music modes,
          and tracked live down to the last 1×1 plate.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setLaunched(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#4da3ff] to-[#2b7fd4] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(43,127,212,0.45)] transition hover:brightness-110"
          >
            <Play className="h-4 w-4" /> Launch the Studio
          </button>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore the build <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* stats */}
        <dl className="relative mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col bg-[#0e1412] px-4 py-6">
              <dt className="order-2 mt-1 block text-xs uppercase tracking-wider text-[#5d6b7d]">
                {s.label}
              </dt>
              <dd className="order-1 text-3xl font-bold text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-10 px-6 py-14">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Everything a build site needs
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#8593a6]">
          A construction simulator, a color laboratory and a generative
          concert — in one page.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-[#101613] p-5 transition hover:border-[#4da3ff]/40 hover:bg-[#121a17]"
            >
              <f.icon className="h-6 w-6 text-[#4da3ff]" />
              <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8593a6]">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-white/10 bg-[#0d1210]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-mono text-sm text-[#e3ac3f]">{s.n}</p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#8593a6]">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => setLaunched(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#4da3ff] to-[#2b7fd4] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(43,127,212,0.45)] transition hover:brightness-110"
            >
              <Play className="h-4 w-4" /> Open the Ultimate Edition
            </button>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-[#5d6b7d]">
          Artistic demonstration with illustrative geometry and generative
          audio. It is not a LEGO product, a construction model, or engineering
          advice. Built with Muse · Monument &amp; interaction design
          contributions by DeepSeek · Refinement by Grok (xAI).
        </p>
      </footer>

      {/* fullscreen studio overlay */}
      {launched && (
        <div className="fixed inset-0 z-[70]">
          <iframe
            sandbox={labSandbox("lego-build-studio-ultimate")}
            referrerPolicy="no-referrer"
            loading="lazy"
            title="LEGO Build Studio · Ultimate Edition"
            src="/standalone/lego-build-studio-ultimate.html"
            className="h-dvh w-screen border-0 bg-[#101513]"
            allow="fullscreen; clipboard-write"
            allowFullScreen
          />
          <button
            onClick={() => setLaunched(false)}
            aria-label="Close studio"
            className="absolute right-5 top-5 z-[71] inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/80"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      )}
    </main>
  );
}
