import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  UNREVIEWED,
  linkableRoute,
  loadDivisions,
  loadProducts,
  type RegistryProduct,
} from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "System Map",
  path: "/system-map",
  description: "Artemis divisions, the products registered under them, and their canonical routes.",
  noIndex: true,
});

type Branch = {
  key: string;
  title: string;
  note: string;
  products: RegistryProduct[];
};

function ProductLeaf({ product, inTree = false }: { product: RegistryProduct; inTree?: boolean }) {
  const route = linkableRoute(product);
  return (
    <li className={inTree ? "relative pl-6" : "min-w-0"}>
      {inTree ? (
        <span className="absolute left-0 top-[1.15rem] h-px w-4 bg-border" aria-hidden />
      ) : null}
      <div className="rounded-md border border-border/60 bg-background/30 px-4 py-3">
        <p className="text-sm text-parchment">{product.name}</p>
        <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">{product.id}</p>
        <p className="mt-2 break-all font-mono text-xs">
          {route ? (
            <Link href={route} className="text-gold-soft underline-offset-4 hover:underline">
              {route}
            </Link>
          ) : (
            <span className="text-muted-foreground/70">not yet routed</span>
          )}
        </p>
      </div>
    </li>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="min-w-0 rounded-lg border border-border/70 bg-navy-deep/50 p-6 shadow-panel">
      <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
        {branch.note}
      </p>
      <h2 className="display-serif mt-2 text-balance text-2xl text-parchment">{branch.title}</h2>
      {branch.products.length > 0 ? (
        <ul className="mt-5 space-y-3 border-l border-border/70">
          {branch.products.map((product) => (
            <ProductLeaf key={product.id} product={product} inTree />
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">No registered products.</p>
      )}
    </article>
  );
}

export default function SystemMapPage() {
  const products = loadProducts();
  const divisions = loadDivisions();
  const known = new Set(divisions.map((division) => division.id));

  const unclassified = products.filter((product) => product.lifecycle === UNREVIEWED);
  const classified = products.filter((product) => product.lifecycle !== UNREVIEWED);

  const branches: Branch[] = divisions.map((division) => ({
    key: division.id,
    title: division.name,
    note: `${division.id} · ${division.status}`,
    products: classified.filter((product) => product.division === division.id),
  }));

  const otherOwners = [
    ...new Set(classified.map((product) => product.division).filter((id) => !known.has(id))),
  ];
  for (const owner of otherOwners) {
    branches.push({
      key: owner,
      title: owner,
      note:
        owner === UNREVIEWED
          ? "Division UNREVIEWED"
          : "Not in the division registry's divisions list",
      products: classified.filter((product) => product.division === owner),
    });
  }

  return (
    <>
      <PageHero
        eyebrow="System Map · Divisions → Products → Routes"
        title="How Artemis divisions, products, and routes connect."
        description="Built from the Division Registry and Product Registry. A route is a delivery surface, not proof of a supported product; registry facts only."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>noindex</Badge>
          <Badge>registry facts only</Badge>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Divisions"
            title="Classified products by division"
            description={`${classified.length} products with a reviewed lifecycle, across ${branches.length} owners.`}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch.key} branch={branch} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Unclassified"
            title="Lifecycle UNREVIEWED"
            description={`${unclassified.length} registered products whose lifecycle has not been established. Their division may also be unreviewed.`}
          />
          <ul className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {unclassified.map((product) => (
              <ProductLeaf key={product.id} product={product} />
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
