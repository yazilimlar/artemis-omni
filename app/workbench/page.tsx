import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "ARTEMIS Geometric Workbench",
  path: "/workbench",
  description:
    "Parametric geometry and fabrication intelligence — geodesic Goldberg domes, all Platonic & Archimedean solids, Catalan duals, verified topology, and preliminary fabrication data. Public Technical Preview.",
});

const WORKBENCH_URL = "https://workbench.artemis.agoraxai.com";
const WORKBENCH_MIRROR = "https://artemis-geometric-workbench.vercel.app";
const CONTACT = "/contact?product=geometric-workbench";

const features = [
  {
    title: "Geodesic / Goldberg engine",
    body: "Frequency-subdivided icosahedral domes with hex/pent dualization, dome cut, erection maps, and construction sequencing.",
  },
  {
    title: "18 uniform solids",
    body: "All five Platonic and thirteen Archimedean solids rendered from their true polygon faces — triangles to decagons.",
  },
  {
    title: "Catalan duals & chirality",
    body: "Polar-reciprocal duals (rhombic dodecahedron, rhombic triacontahedron) and left/right handedness for the snub solids.",
  },
  {
    title: "Verified topology",
    body: "Every solid is checked live against canonical vertex, edge, and face counts and the Euler characteristic V − E + F = 2.",
  },
  {
    title: "Fabrication intelligence",
    body: "Edge schedules, dihedral and saw-bevel references, flattened panel drawings, strut schedules, and shop cards — classified as preliminary.",
  },
  {
    title: "Classified exports",
    body: "JSON, CSV, SVG, and DXF outputs carry explicit safety classifications and an engineering-review disclaimer.",
  },
];

const useCases = [
  "Early-stage dome and pavilion massing studies",
  "Geometry education: Platonic, Archimedean, and Catalan families",
  "Panelization and fabrication feasibility exploration",
  "Pre-engineering quantity and member-schedule drafts",
];

const classifications = [
  {
    label: "GEOMETRY VERIFIED",
    tone: "text-emerald-400 border-emerald-400/50",
    body: "Rendered topology is validated against canonical mathematical references in the app. Applies to pure geometry only.",
  },
  {
    label: "PRELIMINARY FABRICATION DATA",
    tone: "text-gold border-gold/50",
    body: "Lengths, areas, dihedrals, and saw bevels derive from ideal mathematical geometry — starting points, not shop-final numbers.",
  },
  {
    label: "REQUIRES LICENSED ENGINEERING REVIEW",
    tone: "text-red-400 border-red-400/50",
    body: "No output is a certified, permit-ready, structurally approved, or machine-ready construction document.",
  },
];

const tiers = [
  { name: "Explorer", price: "Free", note: "Full browser workbench — available now in the preview." },
  { name: "Professional Beta", price: "$29/mo planned", note: "Early access program. Non-binding preview pricing; billing is not enabled." },
  { name: "Project Review Service", price: "from $750", note: "Licensed-engineer-coordinated review of your specific geometry, scoped per project." },
  { name: "Studio & Enterprise", price: "Coming later", note: "Teams, shared libraries, Artemis execution-bridge integration." },
];

export default function WorkbenchProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product · Public Technical Preview · v5.8"
        title="ARTEMIS Geometric Workbench"
        description="Parametric geometry and fabrication intelligence — geodesic Goldberg domes, the complete Platonic and Archimedean families, Catalan duals, and classified fabrication data, running entirely in your browser."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Public Technical Preview</Badge>
          <Badge>No account required</Badge>
          <Link
            href={WORKBENCH_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Launch the Workbench
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={WORKBENCH_MIRROR}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            Mirror URL
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </PageHero>

      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border">
              <Image
                src="/images/workbench/palette_ivory.jpg"
                alt="ARTEMIS Geometric Workbench — Executive Ivory palette showing a truncated icosahedron with labeled panels"
                width={1200}
                height={760}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="grid gap-6">
              <div className="overflow-hidden rounded-xl border border-border">
                <Image
                  src="/images/workbench/palette_blueprint.jpg"
                  alt="Blueprint palette — navy and cyan engineering theme"
                  width={1200}
                  height={760}
                  className="h-auto w-full"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <Image
                  src="/images/workbench/palette_obsidian.jpg"
                  alt="Obsidian & Brass palette — the original ARTEMIS identity"
                  width={1200}
                  height={760}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Three switchable palettes — Executive Ivory, Blueprint, and Obsidian &amp; Brass — with a simplified Executive
            mode and a full engineering Workbench mode.
          </p>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <h2 className="mb-6 text-2xl font-semibold">What it does</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="p-5">
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed">{f.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <h2 className="mb-6 text-2xl font-semibold">Use cases</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {useCases.map((u) => (
              <li key={u} className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                {u}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <h2 className="mb-2 text-2xl font-semibold">Output classifications</h2>
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
            Every export and printable report carries an explicit classification. Structural design, connection design,
            material specification, load analysis, code compliance, machine setup, tolerances, and final fabrication
            require qualified professional verification.
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            {classifications.map((c) => (
              <div key={c.label} className={`rounded-xl border p-5 ${c.tone}`}>
                <div className="text-xs font-bold tracking-wider">{c.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <h2 className="mb-2 text-2xl font-semibold">Pricing preview</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Non-binding preview pricing. Recurring billing is not enabled during the Public Technical Preview.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <Card key={t.name} className="p-5">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <div className="mt-1 text-lg font-semibold text-gold">{t.price}</div>
                <CardDescription className="mt-2 text-sm leading-relaxed">{t.note}</CardDescription>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={WORKBENCH_URL}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              Launch the Workbench
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`${CONTACT}&intent=professional-beta`}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:text-gold"
            >
              Join Professional Beta
            </Link>
            <Link
              href={`${CONTACT}&intent=project-review`}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:text-gold"
            >
              Request Professional Review
            </Link>
            <Link
              href="/labs/geometric-workbench/v5-8"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-gold"
            >
              Labs embed (v5.8 archive)
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
