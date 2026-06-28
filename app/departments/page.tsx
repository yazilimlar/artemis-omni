import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
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
    </>
  );
}
