import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/seo/metadata";
import { tools } from "@/lib/tools";
import { audiences } from "@/data/audiences";

export const metadata = createMetadata({
  title: "Site Map",
  path: "/site-map",
  description:
    "Every public page on the Artemis site, grouped in one tree. Start anywhere.",
});

type SiteLink = { label: string; href: string };
type SiteGroup = { heading: string; links: SiteLink[] };

const labRoutes: SiteLink[] = [
  { label: "Labs index", href: "/labs" },
  { label: "Utility Intelligence Bridge", href: "/labs/utility-intelligence-bridge" },
  { label: "3D Model", href: "/labs/utility-intelligence-bridge/3d-model" },
  { label: "Dual Story", href: "/labs/utility-intelligence-bridge/dual-story" },
  { label: "Field Claims", href: "/labs/utility-intelligence-bridge/field-claims" },
  { label: "QA Capture Studio", href: "/labs/utility-intelligence-bridge/qa-capture-studio" },
  { label: "Artemis IX-19", href: "/labs/artemisix19" },
  { label: "CivicBid Intelligence Bridge", href: "/labs/civicbid-intelligence-bridge" },
  { label: "Construction Intelligence Workbench", href: "/labs/construction-intelligence-workbench" },
  { label: "NYC Sewer Simulator", href: "/labs/nyc-sewer-simulator" },
  { label: "Geodesic Intelligence", href: "/labs/geodesic-intelligence" },
  { label: "Lego Build Studio", href: "/labs/lego-build-studio" },
  { label: "Lego Build Studio · Music", href: "/labs/lego-build-studio-music" },
  { label: "Lego Build Studio · Artemis", href: "/labs/lego-build-studio-artemis" },
  { label: "Lego Build Studio · Artemis Music", href: "/labs/lego-build-studio-artemis-music" },
  { label: "Diana Moonshot", href: "/labs/diana-moonshot" },
  { label: "Tax Architecture 2026", href: "/labs/tax-architecture-2026" },
  { label: "Türkiye Atlas", href: "/labs/turkiye-atlas" },
  { label: "Troy Time Atlas", href: "/labs/troy-time-atlas" },
  { label: "George Aegean Quest", href: "/labs/george-aegean-quest" },
];

const toolLinks: SiteLink[] = tools
  .filter((t) => t.status === "live")
  .map((t) => ({ label: t.title, href: `/tools/${t.slug}` }));

const audienceLinks: SiteLink[] = audiences.map((a) => ({
  label: a.label,
  href: `/for/${a.slug}`,
}));

const groups: SiteGroup[] = [
  {
    heading: "Start",
    links: [{ label: "Home", href: "/" }],
  },
  {
    heading: "Platform",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Solutions", href: "/solutions" },
      { label: "Products", href: "/products" },
      { label: "Geometric Workbench", href: "/workbench" },
      { label: "Demo", href: "/demo" },
    ],
  },
  {
    heading: "Proof & work",
    links: [
      ...labRoutes,
      { label: "Case Studies", href: "/case-studies" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Academy", href: "/academy" },
      { label: "Library", href: "/library" },
      { label: "Library Programs", href: "/library/programs" },
      { label: "Insights", href: "/insights" },
      { label: "Tools", href: "/tools" },
      ...toolLinks,
    ],
  },
  {
    heading: "Audiences",
    links: audienceLinks,
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Departments", href: "/departments" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <>
      <PageHero
        eyebrow="Site map"
        title="Every page, one tree."
        description="The whole public site at a glance. Pick any branch and go."
      />
      <section className="py-14 lg:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <nav
                key={group.heading}
                aria-label={`Site map: ${group.heading}`}
                className="rounded-2xl border border-border/60 bg-navy-deep/40 p-6"
              >
                <h2 className="eyebrow">{group.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-baseline justify-between gap-3"
                      >
                        <span className="text-sm text-foreground/85 transition-colors group-hover:text-gold">
                          {link.label}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {link.href}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
