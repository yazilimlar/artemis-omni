import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Private Links",
  path: "/labs/private-links",
  description:
    "Directory of ARTEMIS applications hosted behind Vercel sign-in. This page is only a directory — authentication is enforced on each destination, not here.",
  noIndex: true,
});

const privateLinks = [
  {
    id: "0001.HVAC-cont-org-demo",
    title: "ARTEMIS Dynamic Floor Intelligence",
    description:
      "Dynamic floor-group cost intelligence for the ArtPlex model, with the Galaxy-G organization and delivery lens. Group length is selectable from 1 to 64 consecutive floors.",
    href: "https://artemis-five-floor-intelligence.vercel.app/",
    access: "Vercel sign-in required",
  },
] as const;

export default function PrivateLinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Private Links"
        title="Private links directory"
        description="Applications that live behind Vercel sign-in. This directory is public and holds no data — every destination enforces its own authentication."
      />

      <section className="pb-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {privateLinks.map((item) => (
              <Card key={item.id} className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{item.id}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    {item.access}
                  </span>
                </div>
                <CardTitle className="mt-4 text-lg">{item.title}</CardTitle>
                <CardDescription className="flex-1">{item.description}</CardDescription>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Open protected application
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            A listing here grants nothing: opening a destination asks for Vercel
            sign-in first, and access is decided there.{" "}
            <Link href="/labs" className="underline underline-offset-4">
              Back to Labs
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
