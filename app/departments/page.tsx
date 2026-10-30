import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { departments } from "@/lib/artemis/departments";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Departments",
  path: "/departments",
  description:
    "Where Artemis implementation maps onto real org functions — estimating, project controls, finance, operations, engineering, and the executive.",
});

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Where Artemis fits in the org"
        description="AI implementation lands in specific departments with specific pain. Every output is human-reviewed and audit-aware."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <Card key={d.slug} className="flex h-full flex-col">
                <CardTitle className="text-lg">{d.name}</CardTitle>
                <CardDescription>{d.summary}</CardDescription>
                <div className="mt-4">
                  <p className="eyebrow">Pain points</p>
                  <ul className="mt-2 space-y-1">
                    {d.painPoints.map((p) => (
                      <li key={p} className="text-xs text-muted-foreground">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 border-t border-border/50 pt-3 text-sm text-foreground/85">
                  <span className="text-gold">Artemis: </span>
                  {d.artemisRole}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Artemis Art</p>
            <h2 className="display-serif mt-4 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
              Sala Rotonda — the Octavian Rotunda
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              An Artemis art experience for the Vatican Museums, Greco-Roman bodies,
              and octagonal spatial memory — the Art department&apos;s gateway page.
            </p>
          </div>
          <Button href="/departments/art/sala-rotonda" size="lg">
            Open Sala Rotonda
          </Button>
        </Container>
      </section>
    </>
  );
}
