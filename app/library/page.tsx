import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { libraryItems } from "@/lib/artemis/library";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Library",
  path: "/library",
  description:
    "The Artemis library — doctrine, methods, strategy, tools, and showcases, with public/reference classification.",
});

export default function LibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Doctrine, methods, and showcases"
        description="The knowledge behind Artemis — the implementation doctrine, the transition method, tools, and public-safe showcases."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {libraryItems.map((item) => {
              const inner = (
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <Badge>{item.kind}</Badge>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                      {item.classification}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-lg">{item.title}</CardTitle>
                  <CardDescription className="flex-1">{item.summary}</CardDescription>
                  {item.href ? (
                    <span className="mt-4 text-sm text-gold">Open →</span>
                  ) : (
                    <span className="mt-4 text-sm text-muted-foreground">Internal reference</span>
                  )}
                </Card>
              );
              return item.href ? (
                <Link key={item.slug} href={item.href} className="group">
                  {inner}
                </Link>
              ) : (
                <div key={item.slug}>{inner}</div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
