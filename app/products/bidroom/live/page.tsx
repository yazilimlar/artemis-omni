import Link from "next/link";
import { ArrowRight, ExternalLink, Radar } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "BidRoom Live",
  path: "/products/bidroom/live",
  description: "Public BidRoom entry point for opportunity discovery, official source portals, deadlines, and pursuit triage.",
});

export default function BidRoomLivePage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <section className="border-b-4 border-[#ddb04e] bg-[#06182b]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-center gap-3 text-[#7ee7ff]"><Radar className="h-7 w-7"/><span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Opportunity discovery</span></div>
          <h1 className="mt-5 text-5xl font-black sm:text-7xl">BidRoom Live</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#dce9f3]">The stable public entry point for finding public-works opportunities, checking official notices, and moving into the appropriate BidRoom intelligence workflow.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products/bidroom/contractor" className="inline-flex items-center gap-2 bg-[#ddb04e] px-5 py-3 font-bold text-[#071426] hover:bg-[#f2d06b]">Open Contractor Cockpit <ArrowRight className="h-4 w-4"/></Link>
            <Link href="/products/bidroom/atlasiq" className="inline-flex items-center gap-2 border-2 border-[#59dcff] px-5 py-3 font-bold text-white hover:bg-[#17456d]">Open AtlasIQ <ArrowRight className="h-4 w-4"/></Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-3 lg:px-8">
        {[
          ["NYC City Record","https://a856-cityrecord.nyc.gov/","Official NYC notices, solicitations, addenda, and awards."],
          ["PASSPort","https://passport.cityofnewyork.us/","NYC sourcing events, vendor actions, and solicitation documents."],
          ["SAM.gov","https://sam.gov/content/opportunities","Federal contract opportunities and notices."],
        ].map(([name,href,description])=><a key={name} href={href} target="_blank" rel="noreferrer" className="border-2 border-[#3e6b91] bg-[#103352] p-5 hover:border-[#59dcff] hover:bg-[#17456d]"><div className="flex justify-between gap-3"><h2 className="text-xl font-black">{name}</h2><ExternalLink className="h-4 w-4 text-[#7ee7ff]"/></div><p className="mt-3 text-sm leading-relaxed text-[#e8f1f7]">{description}</p></a>)}
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-8">
        <Link href="/products/bidroom" className="font-mono text-sm font-bold uppercase tracking-wider text-[#7ee7ff] hover:text-white">View all BidRoom variants →</Link>
      </section>
    </main>
  );
}
