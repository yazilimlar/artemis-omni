import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ArtemisMark } from "@/components/layout/ArtemisMark";
import { brandAssets, brandPalette, getFeatureAsset } from "@/lib/artemis/brandAssets";
import { companyPositioning } from "@/lib/artemis/positioning";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Brand",
  path: "/brand",
  description:
    "The Artemis brand — logo, palette, motifs, and identity concept art. Artemis / Artemis Omni umbrella; 5D Construction Intelligence leads. Concept studies, not the final standard.",
});

export default function BrandPage() {
  const feature = getFeatureAsset();
  const gallery = brandAssets.filter((a) => !a.feature);

  return (
    <>
      <PageHero
        eyebrow="Brand"
        title="The Artemis identity"
        description="Artemis pairs a classical, precise sensibility with engineering discipline. The figure signals intent and accuracy; the system graphics, palette, and motifs carry the project-controls story. These are concept studies — the primary public wordmark stays the readable ARTEMIS."
      />

      {/* Feature poster */}
      <section className="py-14 lg:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-navy-deep/30">
            <Image
              src={feature.src}
              alt={feature.alt}
              width={feature.width}
              height={feature.height}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-auto w-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <ArtemisMark className="h-9 w-9 text-gold" />
              <span className="display-serif text-xl text-parchment">{companyPositioning.umbrellaAlt}</span>
            </div>
            <h2 className="display-serif mt-5 text-balance text-3xl text-parchment sm:text-4xl">
              {feature.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{feature.caption}</p>
            <div className="mt-6 rounded-xl border border-border/60 bg-navy-deep/40 p-4 text-sm text-muted-foreground">
              <p className="eyebrow mb-1">Formal brand expansion</p>
              {companyPositioning.acronymFraming.intro}{" "}
              <span className="text-foreground/85">ARTEMIS — {companyPositioning.acronym}</span>.{" "}
              {companyPositioning.acronymFraming.ambition}
            </div>
          </div>
        </Container>
      </section>

      {/* Palette */}
      <section className="border-t border-border/60 py-14 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Palette"
            title="Executive dark, blueprint cyan, platinum, restrained gold"
            lede="Dark navy grounds the system; blueprint cyan marks data and technical detail; platinum gives structure; warm gold is the trusted accent."
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brandPalette.map((c) => (
              <div key={c.name} className="rounded-xl border border-border/60 bg-navy-deep/40 p-3">
                <div className="h-16 w-full rounded-md border border-border/40" style={{ backgroundColor: c.hex }} />
                <p className="mt-3 text-xs text-foreground/85">{c.name}</p>
                <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{c.hex}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Concept art gallery */}
      <section className="border-t border-border/60 py-14 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Identity studies"
            title="Concept art & logo references"
            lede="Brand concept art and the working brand/system blueprint. Reference studies that inform the production identity — not yet the final standard."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {gallery.map((a) => (
              <figure
                key={a.src}
                className="overflow-hidden rounded-2xl border border-border/60 bg-navy-deep/30"
              >
                <Image
                  src={a.src}
                  alt={a.alt}
                  width={a.width}
                  height={a.height}
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="h-auto w-full"
                />
                <figcaption className="border-t border-border/50 p-4">
                  <p className="display-serif text-base text-parchment">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Motifs + note */}
      <section className="border-t border-border/60 py-14 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Motifs"
            title="Greek meander, blueprint grid, lunar mark"
            lede="Subtle architectural accents — used to frame, not to dominate. Project controls, cashflow, schedule, and risk stay central to the product story."
          />
          <div className="mt-8 space-y-5">
            <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-6">
              <p className="eyebrow mb-3">Greek meander</p>
              <div className="meander-divider" aria-hidden />
            </div>
            <div className="rounded-xl border border-border/60 bg-blueprint-grid bg-grid p-10">
              <p className="eyebrow">Blueprint grid</p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Usage: the readable <span className="text-parchment">ARTEMIS</span> wordmark is
            primary. The crescent + peak mark and meander accents support it. Concept posters
            are brand art for identity and editorial contexts — the homepage and product pages
            lead with construction intelligence.
          </p>
        </Container>
      </section>
    </>
  );
}
