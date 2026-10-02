import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { GeodesicRenderCard } from "@/components/showcase/GeodesicRenderCard";
import { OrganizationArchitectureDiagram } from "@/components/showcase/OrganizationArchitectureDiagram";
import { productsEditorial, type ProductEditorial } from "@/data/products-editorial";
import {
  linkableRoute,
  loadDivisions,
  loadProducts,
  mergeRegistryOverlay,
  type RegistryProduct,
} from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Products",
  path: "/products",
  description:
    "Artemis product modules — Construct (5D beachhead), Twin/Atlas, Flow, Docs, Connect, plus roadmap modules Ops and Desk.",
});

function EditorialProductCard({ p }: { p: ProductEditorial }) {
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
}

function RegistryProductCard({ product, divisionName }: { product: RegistryProduct; divisionName: string }) {
  const route = linkableRoute(product);
  const inner = (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <Badge>Registry</Badge>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
          {divisionName}
        </span>
      </div>
      <CardTitle className="mt-4">{product.name}</CardTitle>
      <CardDescription className="flex-1">Registered in the Artemis Product Registry.</CardDescription>
      {route ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
          Explore
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </Card>
  );
  return route ? (
    <Link href={route} className="group">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

export default function ProductsPage() {
  // Seven editorial modules (data/products-editorial.ts) first, then registry
  // products that pass the M1 public listing rule (isPubliclyListed).
  const entries = mergeRegistryOverlay(loadProducts(), productsEditorial);
  const divisionNames = new Map(loadDivisions().map((division) => [division.id, division.name]));
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Artemis modules"
        description="Artemis Construct (5D Construction Intelligence) leads as the public beachhead. The other modules extend the same disciplined, audit-aware approach across the business."
      />

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Product System"
            title="Product modules share one operating layer"
            description="Products become stronger when they use the same reviewed implementation standard: source-labeled inputs, applied logic, confidence notes, human review, and named executive action."
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <OrganizationArchitectureDiagram
              mode="product"
              title="Product operating layer"
              subtitle="The module portfolio is presented as a connected implementation system rather than a collection of disconnected demos."
              organizationName="Artemis Product Portfolio"
            />
            <GeodesicRenderCard
              title="Spatial proof surface"
              caption="Geometry, fabrication logic, and project visualization stay public-safe here while signaling the direction of deeper private workbench systems."
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) =>
              entry.editorial ? (
                <EditorialProductCard key={entry.editorial.slug} p={entry.editorial} />
              ) : entry.product ? (
                <RegistryProductCard
                  key={entry.product.id}
                  product={entry.product}
                  divisionName={divisionNames.get(entry.product.division) ?? "Unclassified"}
                />
              ) : null,
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
