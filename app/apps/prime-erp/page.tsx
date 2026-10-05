import { ExternalLink, LockKeyhole, ShieldCheck, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/seo/metadata";

const primeErpUrl = process.env.NEXT_PUBLIC_PRIME_ERP_URL || "";

export const metadata = createMetadata({
  path: "/apps/prime-erp",
  title: "Prime ERP \u2014 Client Access | Artemis",
  description:
    "Secure client access point for the live Prime Industrial ERP operating dashboard.",
  noIndex: true,
});

export default function PrimeErpAccessPage() {
  const isConfigured = Boolean(primeErpUrl);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.14]" aria-hidden />

        <Container className="py-16 lg:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">
              Controlled Access
            </span>
            <span className="eyebrow">Artemis Apps</span>
          </div>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-gold-soft">
                Prime ERP \u00b7 Client Access
              </p>
              <h1 className="display-serif mt-3 max-w-4xl text-balance text-4xl leading-[1.04] text-parchment sm:text-5xl lg:text-6xl">
                Live operating dashboard for orders, invoices, banking, tax, and reconciliation.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                This page is the stable Artemis access point. The ERP itself remains protected by
                server-side password authentication, and the live service can be moved behind this
                route without changing the client-facing URL.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isConfigured ? (
                  <Button href={primeErpUrl} size="lg">
                    Open Secure ERP
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button href="/contact" size="lg">
                    Access Not Yet Activated
                  </Button>
                )}
                <Button href="/erp" variant="outline" size="lg">
                  View Public ERP Overview
                </Button>
              </div>

              {!isConfigured && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-gold-soft">
                  Deployment note: set NEXT_PUBLIC_PRIME_ERP_URL to the approved secure ERP tunnel
                  or hosted backend URL before sharing this page with a client.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gold/20 bg-navy-deep/70 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-6 w-6 text-gold" />
                <h2 className="text-xl font-semibold text-parchment">Access Model</h2>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Stable Artemis route", "artemis.agoraxai.com/apps/prime-erp"],
                  ["ERP protection", "Server-side password gate on the Prime ERP service"],
                  ["Client mode", "Open in a secure separate tab for reliable login cookies"],
                  ["Next hardening", "Move secrets out of files and into managed environment variables"],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-xl border border-border/60 bg-background/30 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold-soft">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <Workflow className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Full Cycle Control</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Orders, fulfillment, invoices, payments, refunds, bank deposits, ledger postings,
              and exceptions should resolve into one lifecycle view.
            </p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <ShieldCheck className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Client Safe Access</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The public Artemis page is only an access surface. Sensitive ERP data remains behind
              the ERP password and should later move to hardened cloud hosting.
            </p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <ExternalLink className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Portable Backend</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Today this can point to a secure tunnel. Later it can point to Render, Vercel, or a
              private cloud service without changing the Artemis client URL.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
