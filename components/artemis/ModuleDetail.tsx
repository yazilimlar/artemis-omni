import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/artemis/products";

/** Shared detail view for a product module page. Keeps route files tiny. */
export function ModuleDetail({ product }: { product: Product }) {
  return (
    <>
      <PageHero eyebrow={product.kicker} title={product.name} description={product.summary}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{product.status === "beachhead" ? "Public beachhead" : product.status}</Badge>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All products
          </Link>
        </div>
      </PageHero>

      <section className="py-14 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Capabilities</p>
            <ul className="mt-4 space-y-3">
              {product.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-xl border border-border/60 bg-navy-deep/40 p-6">
            <p className="eyebrow">Who it&apos;s for</p>
            <p className="mt-3 text-sm text-muted-foreground">{product.audience}</p>
            <div className="mt-6 border-t border-border/50 pt-5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pilot-ready as an implementation framework. Outputs are human-reviewed and
                audit-aware, with source-labeled assumptions and controlled integrations.
              </p>
              <Button href="/contact" className="mt-5 w-full">
                Request a Pilot
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
