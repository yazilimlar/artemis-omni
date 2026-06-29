import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/artemis/products";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Products",
  path: "/products",
  description:
    "Artemis product modules — Construct (5D beachhead), Twin/Atlas, Flow, Docs, Connect, plus roadmap modules Ops and Desk.",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Artemis modules"
        description="Artemis Construct (5D Construction Intelligence) leads as the public beachhead. The other modules extend the same disciplined, audit-aware approach across the business."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
              <p className="eyebrow">Current public lead</p>
              <p className="mt-1 text-sm text-foreground/85">
                <span className="text-parchment">Artemis Construct</span> — 5D Construction
                Intelligence is the public beachhead.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-4">
              <p className="eyebrow">Module-level</p>
              <p className="mt-1 text-sm text-foreground/85">
                <span className="text-parchment">Artemis Flow</span> is a finance/cashflow
                module — not the company name.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-4">
              <p className="eyebrow">Future / internal</p>
              <p className="mt-1 text-sm text-foreground/85">
                The broader Business OS (Docs, Connect, Ops, Twin/Atlas) is a roadmap,
                introduced as credibility compounds.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const linked = Boolean(p.route);
              const inner = (
                <Card className={linked ? "flex h-full flex-col" : "flex h-full flex-col opacity-70"}>
                  <div className="flex items-center justify-between gap-2">
                    <Badge>{p.status === "beachhead" ? "Beachhead" : p.status}</Badge>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                      {p.kicker}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{p.name}</CardTitle>
                  <CardDescription className="flex-1">{p.summary}</CardDescription>
                  {linked ? (
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="mt-5 text-sm text-muted-foreground">Roadmap module</span>
                  )}
                </Card>
              );
              return linked ? (
                <Link key={p.slug} href={p.route!} className="group">
                  {inner}
                </Link>
              ) : (
                <div key={p.slug}>{inner}</div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
