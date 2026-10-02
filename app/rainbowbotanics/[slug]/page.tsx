import Link from "next/link";
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
  return (
    <>
      <RainbowSpecimenPage slug={slug} />
      <div className="bg-[#0b251b] px-6 py-5 text-center">
        <Link
          href="/labs/scenes/botanical-garden"
          className="font-mono text-xs uppercase tracking-wider text-[#d2b86c] underline-offset-4 hover:underline"
        >
          Explore in 3D →
        </Link>
      </div>
    </>
  );
}
