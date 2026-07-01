import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Flower2,
  MapPinned,
  Palette,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import {
  getRainbowPublicationBlockers,
  getRainbowSpecimenBySlug,
  getRainbowThemesForSpecimen,
  rainbowSpecimenSlugs,
} from "@/data/rainbow";
import { createMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

const routeBase = "/rainbowbotanics-2026";
const referenceImage = "/rainbow-botanics/hemerocallis-fulva/bloom-reference.jpg";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(rainbowSpecimenSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const specimen = getRainbowSpecimenBySlug(slug);

  if (!specimen) {
    return createMetadata({
      title: "Rainbow Botanics draft not found",
      path: `${routeBase}/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${specimen.identity.scientific_name} draft preview`,
    description:
      "A source-safe Rainbow Botanics draft preview for review before public launch.",
    path: `${routeBase}/${slug}`,
    ogImage: referenceImage,
    noIndex: true,
  });
}

function titleCaseStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default async function RainbowBotanicsSpecimenPage({ params }: PageProps) {
  const { slug } = await params;
  const specimen = getRainbowSpecimenBySlug(slug);

  if (!specimen) notFound();

  const [theme] = getRainbowThemesForSpecimen(specimen.specimen_id);
  const blockers = getRainbowPublicationBlockers(specimen);
  const palette = theme?.extracted_colors ?? [];
  const activeAssets = Object.entries(specimen.assets)
    .filter(([, asset]) => asset)
    .map(([key, asset]) => ({
      key,
      status: asset?.status ?? "not_started",
      notes: asset?.notes,
    }));

  return (
    <main className="min-h-screen bg-[#071613] text-parchment">
      <section className="relative overflow-hidden border-b border-[#8F6E2F]/45">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,140,0,0.22),transparent_26%),radial-gradient(circle_at_82%_0%,rgba(34,139,34,0.2),transparent_28%),linear-gradient(135deg,#071613_0%,#10241E_52%,#21110A_100%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-[0.1]" aria-hidden />
        <Container className="relative grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge tone="sanitize">Draft Preview</StatusBadge>
                <StatusBadge tone="private">Noindex</StatusBadge>
                <StatusBadge tone="reference">{specimen.specimen_id}</StatusBadge>
              </div>
              <p className="eyebrow mt-8">Rainbow Botanical Library</p>
              <h1 className="display-serif mt-4 max-w-3xl text-balance text-5xl leading-tight text-parchment lg:text-7xl">
                {specimen.identity.scientific_name}
              </h1>
              <p className="mt-4 text-xl text-gold-soft">
                {specimen.identity.primary_common_name}
                {specimen.names.common.length ? ` / ${specimen.names.common.join(" / ")}` : ""}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-parchment/72">
                A source-safe draft page for the Prismaflora Foundry Pipeline. This page
                uses repository fixtures, a cropped field-photo derivative, and visible QA
                gates before any public catalog launch.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#8F6E2F]/45 bg-[#10241E]/80 p-4">
                <Flower2 className="h-5 w-5 text-[#FFD700]" aria-hidden />
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
                  Spectrum
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  {specimen.identity.spectrum_designation}
                </p>
              </div>
              <div className="rounded-lg border border-[#8F6E2F]/45 bg-[#10241E]/80 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden />
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
                  Privacy
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  {titleCaseStatus(specimen.location.privacy_level)}
                </p>
              </div>
              <div className="rounded-lg border border-[#8F6E2F]/45 bg-[#10241E]/80 p-4">
                <Database className="h-5 w-5 text-sky-200" aria-hidden />
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
                  Record
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  {titleCaseStatus(specimen.record_status)}
                </p>
              </div>
            </div>
          </div>

          <figure className="relative overflow-hidden rounded-lg border border-[#8F6E2F]/55 bg-[#10241E]/80 shadow-2xl">
            <Image
              src={referenceImage}
              alt="Source-safe cropped field reference of Hemerocallis fulva bloom"
              width={864}
              height={1000}
              priority
              className="aspect-[0.9] h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 border-t border-[#8F6E2F]/45 bg-[#071613]/82 p-4 backdrop-blur">
              <p className="font-mono text-[0.66rem] uppercase tracking-wider text-gold-soft">
                Field-photo derivative
              </p>
              <p className="mt-1 text-sm text-parchment/72">
                Cropped review image. Raw source photos, EXIF, and exact coordinates are
                not exposed in this preview.
              </p>
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-b border-[#8F6E2F]/30 py-10">
        <Container className="grid gap-5 lg:grid-cols-[1fr_0.9fr_1.1fr]">
          <Card className="rounded-lg border-[#8F6E2F]/45 bg-[#10241E]/72">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Ruler className="h-5 w-5 text-[#FFD700]" aria-hidden />
              Morphology
            </CardTitle>
            <CardDescription className="mt-4 text-parchment/72">
              {specimen.morphology.growth_habit}
            </CardDescription>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[#8F6E2F]/25 pb-2">
                <dt className="text-parchment/55">Height</dt>
                <dd className="text-right text-parchment/85">
                  {specimen.morphology.height_cm?.min}-{specimen.morphology.height_cm?.max} cm
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#8F6E2F]/25 pb-2">
                <dt className="text-parchment/55">Flower</dt>
                <dd className="text-right text-parchment/85">
                  {specimen.morphology.flower_diameter_cm?.min}-
                  {specimen.morphology.flower_diameter_cm?.max} cm
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-parchment/55">Bloom stage</dt>
                <dd className="text-right text-parchment/85">
                  {specimen.phenology.current_bloom_stage}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="rounded-lg border-[#8F6E2F]/45 bg-[#10241E]/72">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPinned className="h-5 w-5 text-[#FFD700]" aria-hidden />
              Atlas Status
            </CardTitle>
            <CardDescription className="mt-4 text-parchment/72">
              {specimen.location.public_location_label}
            </CardDescription>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{titleCaseStatus(specimen.location.atlas_status)}</Badge>
              <Badge>{titleCaseStatus(specimen.location.privacy_level)}</Badge>
              <Badge>{specimen.location.usda_zones}</Badge>
            </div>
          </Card>

          <Card className="rounded-lg border-[#8F6E2F]/45 bg-[#10241E]/72">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Palette className="h-5 w-5 text-[#FFD700]" aria-hidden />
              Adaptive Palette
            </CardTitle>
            <div className="mt-5 grid grid-cols-5 overflow-hidden rounded-md border border-[#8F6E2F]/35">
              {palette.map((color) => (
                <div key={`${color.role}-${color.hex}`} className="min-h-20">
                  <div className="h-12" style={{ backgroundColor: color.hex }} />
                  <div className="bg-[#071613]/90 p-2">
                    <p className="truncate text-[0.68rem] text-parchment/80">{color.name}</p>
                    <p className="font-mono text-[0.62rem] text-parchment/45">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>

      <section className="border-b border-[#8F6E2F]/30 py-14 lg:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Knowledge Architecture</p>
              <h2 className="display-serif mt-3 text-3xl text-parchment sm:text-4xl">
                Layered Botanical Digital Twin
              </h2>
            </div>
            <span className="rounded-md border border-[#8F6E2F]/45 bg-[#10241E]/70 px-4 py-2 font-mono text-xs uppercase tracking-wider text-gold-soft">
              Standards-backed draft
            </span>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {specimen.knowledge_layers.map((layer) => (
              <Card key={layer.layer} className="rounded-lg border-[#8F6E2F]/35 bg-[#10241E]/58">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{layer.layer}</CardTitle>
                  <StatusBadge tone={layer.source_status === "needs_source" ? "sanitize" : "reference"}>
                    {titleCaseStatus(layer.source_status)}
                  </StatusBadge>
                </div>
                <CardDescription className="mt-4 text-parchment/68">
                  {layer.summary}
                </CardDescription>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
                  {titleCaseStatus(layer.status)}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[#8F6E2F]/30 py-14 lg:py-16">
        <Container className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-lg border-[#8F6E2F]/45 bg-[#10241E]/72">
            <CardTitle>Engineering Interpretation</CardTitle>
            <CardDescription className="mt-4 text-parchment/72">
              {specimen.engineering.biomimicry_notes}
            </CardDescription>
            <ul className="mt-6 grid gap-3 text-sm text-parchment/74">
              {[
                specimen.engineering.geometry,
                specimen.engineering.root_architecture,
                specimen.engineering.soil_stabilization,
                specimen.engineering.water_management,
              ]
                .filter(Boolean)
                .map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD700]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </Card>

          <Card className="rounded-lg border-amber-300/35 bg-amber-300/10">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-100" aria-hidden />
              Publication Blockers
            </CardTitle>
            <CardDescription className="mt-4 text-amber-50/82">
              This preview is intentionally visible before launch so the review gates are
              obvious. These blockers must be resolved before indexing, social publishing,
              or production catalog placement.
            </CardDescription>
            <ul className="mt-6 grid gap-3 text-sm text-amber-50/82">
              {blockers.map((blocker) => (
                <li key={blocker} className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Asset Foundry</p>
              <h2 className="display-serif mt-3 text-3xl text-parchment sm:text-4xl">
                Draft asset package state
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="sanitize">Human approval required</StatusBadge>
              <StatusBadge tone="private">Raw media protected</StatusBadge>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeAssets.map((asset) => (
              <Card key={asset.key} className="rounded-lg border-[#8F6E2F]/35 bg-[#10241E]/58">
                <p className="font-mono text-[0.66rem] uppercase tracking-wider text-gold-soft">
                  {titleCaseStatus(asset.key)}
                </p>
                <CardTitle className="mt-3 text-lg">{titleCaseStatus(asset.status)}</CardTitle>
                {asset.notes ? (
                  <CardDescription className="text-parchment/68">{asset.notes}</CardDescription>
                ) : null}
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
