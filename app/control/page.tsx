import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  UNREVIEWED,
  isPubliclyListed,
  loadDivisions,
  loadProducts,
  type RegistryProduct,
} from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Registry Control",
  path: "/control",
  description: "Read-only view of the Artemis product and division registries.",
  noIndex: true,
});

type DivisionGroup = {
  key: string;
  title: string;
  note: string | null;
  products: RegistryProduct[];
};

function hasUnreviewedField(product: RegistryProduct): boolean {
  return [
    product.division,
    product.product_family,
    product.lifecycle,
    product.maturity,
    product.visibility,
    product.data_mode,
    product.canonical_route,
  ].includes(UNREVIEWED);
}

function groupByDivision(products: RegistryProduct[]): DivisionGroup[] {
  const divisions = loadDivisions();
  const known = new Set(divisions.map((division) => division.id));

  const registered = divisions.map((division) => ({
    key: division.id,
    title: division.name,
    note: `${division.id} · ${division.status}`,
    products: products.filter((product) => product.division === division.id),
  }));

  const unknownIds = [
    ...new Set(
      products
        .map((product) => product.division)
        .filter((id) => id !== UNREVIEWED && !known.has(id)),
    ),
  ];
  const unknown = unknownIds.map((id) => ({
    key: id,
    title: id,
    note: "Not in the division registry's divisions list",
    products: products.filter((product) => product.division === id),
  }));

  const unreviewed = {
    key: UNREVIEWED,
    title: "Division UNREVIEWED",
    note: "Ownership not yet established by evidence or owner decision",
    products: products.filter((product) => product.division === UNREVIEWED),
  };

  return [...registered, ...unknown, unreviewed];
}

function Cell({ value }: { value: string | null }) {
  if (value === null) return <span className="text-muted-foreground/60">—</span>;
  if (value === UNREVIEWED) return <span className="text-amber-200">{value}</span>;
  return <>{value}</>;
}

const columns = [
  "id",
  "name",
  "division",
  "lifecycle",
  "visibility",
  "data_mode",
  "canonical_route",
  "blockers",
  "next_gate",
];

export default function ControlPage() {
  const products = loadProducts();
  const divisions = loadDivisions();
  const groups = groupByDivision(products);

  const totals = [
    { label: "Products", value: products.length },
    { label: "Divisions", value: divisions.length },
    { label: "Listed publicly", value: products.filter(isPubliclyListed).length },
    { label: "With UNREVIEWED fields", value: products.filter(hasUnreviewedField).length },
  ];

  return (
    <>
      <PageHero
        eyebrow="Control · Registry Truth Table"
        title="Every registered product, exactly as the registry records it."
        description="A read-only view of the Product Registry, grouped by the Division Registry. Values are registry facts, not live telemetry; nothing on this page changes state."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>noindex</Badge>
          <Badge>read-only</Badge>
          <Badge>registry facts only</Badge>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {totals.map((total) => (
              <div
                key={total.label}
                className="rounded-lg border border-border/70 bg-navy-deep/50 p-5 shadow-panel"
              >
                <dt className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  {total.label}
                </dt>
                <dd className="display-serif mt-2 text-4xl text-parchment">{total.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            &ldquo;Listed publicly&rdquo; applies the /labs listing rule: visibility public, a
            route path, and a reviewed lifecycle. &ldquo;With UNREVIEWED fields&rdquo; counts
            products where any classified field or the canonical route is UNREVIEWED.
          </p>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="space-y-14">
          {groups.map((group) => (
            <div key={group.key}>
              <SectionHeading
                eyebrow={group.note ?? undefined}
                title={group.title}
                description={`${group.products.length} registered product${group.products.length === 1 ? "" : "s"}`}
              />
              {group.products.length > 0 ? (
                <div className="mt-6 overflow-x-auto rounded-lg border border-border/70 bg-navy-deep/40">
                  <table className="w-full min-w-[960px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/70">
                        {columns.map((column) => (
                          <th
                            key={column}
                            scope="col"
                            className="whitespace-nowrap px-4 py-3 font-mono text-[0.62rem] font-normal uppercase tracking-wider text-signal-soft"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs text-muted-foreground">
                      {group.products.map((product) => (
                        <tr key={product.id} className="border-b border-border/40 last:border-0">
                          <th scope="row" className="whitespace-nowrap px-4 py-3 font-normal text-parchment">
                            {product.id}
                          </th>
                          <td className="px-4 py-3 font-sans text-sm text-parchment">
                            {product.name}
                          </td>
                          <td className="px-4 py-3">
                            <Cell value={product.division} />
                          </td>
                          <td className="px-4 py-3">
                            <Cell value={product.lifecycle} />
                          </td>
                          <td className="px-4 py-3">
                            <Cell value={product.visibility} />
                          </td>
                          <td className="px-4 py-3">
                            <Cell value={product.data_mode} />
                          </td>
                          <td className="break-all px-4 py-3">
                            <Cell value={product.canonical_route} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {product.known_blockers.length}
                          </td>
                          <td className="px-4 py-3">
                            <Cell value={product.next_gate} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
