import { notFound } from "next/navigation";
import { RainbowBotanicalPlate } from "@/components/rainbow/RainbowBotanicalPlate";
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

export default async function RainbowBotanicsSpecimenPage({ params }: PageProps) {
  const { slug } = await params;
  const specimen = getRainbowSpecimenBySlug(slug);

  if (!specimen) notFound();

  const [theme] = getRainbowThemesForSpecimen(specimen.specimen_id);
  const blockers = getRainbowPublicationBlockers(specimen);

  return (
    <RainbowBotanicalPlate
      specimen={specimen}
      theme={theme}
      blockers={blockers}
      referenceImage={referenceImage}
    />
  );
}
