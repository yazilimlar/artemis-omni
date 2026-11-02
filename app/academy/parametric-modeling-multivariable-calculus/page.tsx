import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Parametric Modeling & Multivariable Calculus — Artemis Academy",
  path: "/academy/parametric-modeling-multivariable-calculus",
  description:
    "An interactive Artemis Academy lesson in ten examples, simple to complex: parametric curves, Bézier modeling, surfaces, gradients, partial derivatives, a swept-pipe CAD solid and the double integral — with Desmos and GeoGebra formulas for every step, six view themes, and occlusion and light-mode rendering adopted from the Desmos 3D graphers credited in its Reference Library.",
});

const contextItems = [
  {
    label: "Lesson",
    value: "Parametric Modeling · Multivariable Calculus · 10 interactive examples",
  },
  {
    label: "Platform",
    value: "Interactive presentation · Desmos 2D/3D + GeoGebra 3D formulas",
  },
  {
    label: "Rendering",
    value: "Occlusion + light modes · adopted from the credited Desmos 3D graphers",
  },
] as const;

export default function ParametricModelingPage() {
  return (
    <main className="min-h-screen bg-[#0b1526] text-[#e9edf3]">
      <header className="border-b border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 border border-[#8fa3c8] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#e9edf3] transition-colors hover:bg-[#e9edf3] hover:text-[#0b1526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Academy
            </Link>

            <div className="min-w-[220px] flex-1">
              <p className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Artemis · Academy · Mathematics
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-[#e9edf3]">
                Parametric Modeling &amp; Multivariable Calculus
              </p>
            </div>

            <a
              href="/academy/parametric-modeling-multivariable-calculus.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#c9a45c] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#c9a45c] transition-colors hover:bg-[#c9a45c] hover:text-[#0b1526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2"
            >
              Open full screen <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-[#22345a]">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
          <h1 className="max-w-[24ch] text-3xl font-semibold leading-[1.08] sm:text-5xl">
            One knob makes a curve. Two knobs make a world.
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[#b9c4d9]">
            Parametric modeling and multivariable calculus, in a nutshell, as
            ten live examples that build on each other: a point driven by one
            parameter becomes a curve, a Bézier spline — the modeling tool
            behind CAD — a mountain whose gradient and partial derivatives you
            can slice, a torus and a Möbius strip, a pipe swept along a curve
            the way a CAD kernel builds a solid, and finally volume under a
            surface and the butterfly curve. Every example carries the exact
            formula to paste into Desmos or GeoGebra, a presenter line, and a
            calculus hook. Even the ARTEMIS Academy wordmark at the top of the
            lesson is drawn by the subject itself: a Fourier series of
            rotating vectors tracing the letters.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {contextItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#22345a] bg-[#0e1c36] p-4"
              >
                <dt className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-medium leading-snug text-[#e9edf3]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-3 py-3 sm:px-5 sm:py-5" aria-labelledby="parametric-modeling-title">
        <div className="mx-auto max-w-[1500px] overflow-hidden border-2 border-[#22345a] bg-[#0e1c36] shadow-[0_18px_45px_rgba(3,8,20,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#22345a] bg-[#13264a] px-4 py-2 text-white">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c9a45c]" aria-hidden />
              <h2
                id="parametric-modeling-title"
                className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
              >
                Parametric Modeling &amp; Multivariable Calculus — Interactive Lesson
              </h2>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#b9c4d9]">
              Academy · Embedded lesson
            </span>
          </div>
          <iframe
            src="/academy/parametric-modeling-multivariable-calculus.html"
            title="Parametric Modeling and Multivariable Calculus — interactive Artemis Academy lesson"
            className="block h-[calc(100dvh-11rem)] min-h-[720px] w-full border-0 bg-[#0b1526]"
            loading="eager"
            allow="clipboard-write"
          />
        </div>
      </section>

      <aside className="border-t border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="flex items-start gap-3 text-xs leading-relaxed text-[#b9c4d9]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a45c]" aria-hidden />
            <span>
              An educational lesson. All formulas are standard mathematics;
              the surface and solid rendering modes are adopted from the
              Desmos 3D graphers credited, with links, in the lesson&apos;s
              Reference Library. External tools (Desmos, GeoGebra) remain the
              property of their owners.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.desmos.com/3d"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a45c] px-5 py-2.5 text-sm font-semibold text-[#0b1526] transition hover:bg-[#d8ba74]"
            >
              Desmos 3D
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="https://www.geogebra.org/3d"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#8fa3c8] px-5 py-2.5 text-sm font-semibold text-[#e9edf3] transition hover:bg-[#13264a]"
            >
              GeoGebra 3D
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </aside>
    </main>
  );
}
