import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { requireAuth } from "@/lib/auth/require-auth";
import { loadProducts, loadRegistrySchema } from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";
import { ProposalForm } from "./ProposalForm";

export const metadata = createMetadata({
  title: "Propose registry change",
  path: "/control/propose",
  noIndex: true,
});

export default async function ProposePage() {
  const { profile } = await requireAuth();
  const isOwner = profile?.role === "owner";

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-2xl">
        <p className="eyebrow">Control · Proposal</p>
        <h1 className="display-serif mt-3 text-4xl text-parchment">Propose a registry change</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge>noindex</Badge>
          <Badge>opens a pull request</Badge>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          One field on one product per proposal. The registry stays canonical in git: submitting
          opens a pull request that a human reviews and merges (ADR-013).
        </p>

        {isOwner ? (
          <ProposalForm
            products={loadProducts().map((product) => ({
              id: product.id,
              name: product.name,
              visibility: product.visibility,
              lifecycle: product.lifecycle,
              maturity: product.maturity,
              canonical_route: product.canonical_route,
            }))}
            schema={loadRegistrySchema()}
          />
        ) : (
          <div className="mt-8 rounded-lg border border-border/70 bg-navy-deep/50 p-6 shadow-panel">
            <p className="text-sm text-parchment">Only owner role can submit registry proposals.</p>
          </div>
        )}

        <p className="mt-10 text-sm">
          <Link href="/control" className="text-gold-soft underline-offset-4 hover:underline">
            ← Back to registry control
          </Link>
        </p>
      </Container>
    </section>
  );
}
