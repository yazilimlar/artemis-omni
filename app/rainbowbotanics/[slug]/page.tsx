import {
  getRainbowSpecimenMetadata,
  getRainbowStaticParams,
  RainbowSpecimenPage,
} from "@/components/rainbow/RainbowSpecimenPage";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

const routeBase = "/rainbowbotanics";

export const dynamicParams = false;

export const generateStaticParams = getRainbowStaticParams;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return getRainbowSpecimenMetadata(slug, routeBase);
}

export default async function RainbowBotanicsCanonicalPage({ params }: PageProps) {
  const { slug } = await params;
  return <RainbowSpecimenPage slug={slug} />;
}
