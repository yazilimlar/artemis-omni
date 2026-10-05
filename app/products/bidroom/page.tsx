import Link from "next/link";
import { ArrowRight, Building2, Radar, Wrench } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "BidRoom Product Suite",
  path: "/products/bidroom",
  description: "Stable public entry point for BidRoom Live, specialty contractor pursuit, and AtlasIQ procurement intelligence.",
  noIndex: true,
});

const variants = [
  {
    href: "/products/bidroom/live",
    title: "BidRoom Live",
    label: "Opportunity discovery",
    description: "Public entry point for live bid discovery, source portals, agency notices, deadlines, and pursuit triage.",
    icon: Radar,
  },
  {
    href: "/products/bidroom/contractor",
    title: "BidRoom Contractor",
    label: "Specialty pursuit cockpit",
    description: "Focused on core drilling, concrete demolition, waterproofing, jet grout, and foundation pile scopes.",
    icon: Wrench,
  },
  {
    href: "/products/bidroom/atlasiq",
    title: "BidRoom AtlasIQ",
    label: "Multi-jurisdiction intelligence",
    description: "Federated portal registry, normalized opportunities, smart filters, qualifications, permits, and addenda.",
    icon: Building2,
  },
];

export default function BidRoomProductHub() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <section className="border-b border-[#2d5477] bg-[#06182b]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#7ee7ff]">Artemis construction intelligence</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">BidRoom Product Suite</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#dce9f3]">Stable product routes for opportunity discovery, specialty-contractor pursuit, multi-jurisdiction procurement intelligence, and evidence-linked bid-package review.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-2 lg:px-8">
        {variants.map(({ href, title, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="group border-2 border-[#3e6b91] bg-[#103352] p-6 transition hover:border-[#59dcff] hover:bg-[#17456d] focus:outline-none focus:ring-2 focus:ring-[#ffd86b]">
            <div className="flex items-start justify-between gap-4">
              <Icon className="h-7 w-7 text-[#ffd86b]" aria-hidden />
              <ArrowRight className="h-5 w-5 text-[#7ee7ff] transition-transform group-hover:translate-x-1" aria-hidden />
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#7ee7ff]">{label}</p>
            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-relaxed text-[#e8f1f7]">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
