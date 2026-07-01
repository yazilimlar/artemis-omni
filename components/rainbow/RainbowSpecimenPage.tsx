import { notFound } from "next/navigation";
import { RainbowBotanicalPlate } from "@/components/rainbow/RainbowBotanicalPlate";
import {
  getRainbowPublicationBlockers,
  getRainbowSpecimenBySlug,
  getRainbowThemesForSpecimen,
  rainbowSpecimenSlugs,
} from "@/data/rainbow";
import { createMetadata } from "@/lib/seo/metadata";

export const rainbowReferenceImage =
  "/rainbow-botanics/hemerocallis-fulva/bloom-reference.jpg";

export function getRainbowStaticParams() {
  return Object.keys(rainbowSpecimenSlugs).map((slug) => ({ slug }));
}

export function getRainbowSpecimenMetadata(slug: string, routeBase: string) {
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
      "A source-safe Rainbow Botanics interactive botanical plate for review before public launch.",
    path: `${routeBase}/${slug}`,
    ogImage: rainbowReferenceImage,
    noIndex: true,
  });
}

export function RainbowSpecimenPage({ slug }: { slug: string }) {
  const specimen = getRainbowSpecimenBySlug(slug);

  if (!specimen) notFound();

  const [theme] = getRainbowThemesForSpecimen(specimen.specimen_id);
  const blockers = getRainbowPublicationBlockers(specimen);

  return (
    <RainbowBotanicalPlate
      specimen={specimen}
      theme={theme}
      blockers={blockers}
      referenceImage={rainbowReferenceImage}
    />
  );
}
