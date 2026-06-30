import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo/metadata";
import { getModules, getRegistryStats } from "@/lib/artemisix/registry";
import {
  dimensions,
  departments,
  getDepartment,
  getDimension,
} from "@/lib/artemisix/taxonomy";
import { connections, maintenanceLoop } from "@/lib/artemisix/agents";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "ArtemisIX Modules",
  path: "/artemisix/modules",
  description:
    "The ArtemisIX module registry — every Artemis demonstrator app classified by dimension and department, discovered and maintained autonomously.",
});

const statusTone: Record<string, string> = {
  live: "text-emerald-400",
  simulation: "text-gold-soft",
  "key-required": "text-muted-foreground",
};

export default async function ModulesPage() {
  const [modules, stats] = await Promise.all([getModules(), getRegistryStats()]);

  const byDept = departments
    .map((d) => ({ dept: d, items: modules.filter((m) => m.department === d.code) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="ArtemisIX · Registry"
        title="Modules, dimensions & departments"
        description="Every Artemis demonstrator, classified along the dimensional ladder and routed to a department. The registry scans the apps folder on each request — drop in a new app and it self-registers."
      />

      {/* Stats + dimensions */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl border border-border/70 bg-navy-deep/40 px-5 py-3">
              <span className="display-serif text-3xl text-parchment">{stats.total}</span>
              <span className="ml-2 text-sm text-muted-foreground">live modules</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-navy-deep/40 px-5 py-3">
              <span className="display-serif text-3xl text-parchment">{byDept.length}</span>
              <span className="ml-2 text-sm text-muted-foreground">departments</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-navy-deep/40 px-5 py-3">
              <span className="display-serif text-3xl text-parchment">
                {Object.keys(stats.byDimension).length}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">active dimensions</span>
            </div>
            <Link
              href="/api/artemisix/registry"
              className="ml-auto inline-flex items-center gap-1 text-sm text-gold hover:text-gold-soft"
            >
              Live registry API →
            </Link>
          </div>

          {/* Dimensional ladder */}
          <h2 className="display-serif mt-12 text-2xl text-parchment">The dimensional ladder</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((d) => (
              <div
                key={d.code}
                className="rounded-lg border border-border/70 bg-navy-deep/40 p-4"
              >
                <div className="flex items-center gap-2">
                  <Badge>{d.code}</Badge>
                  <span className="font-medium text-parchment">{d.name}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {stats.byDimension[d.code] ?? 0}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{d.blurb}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Modules by department */}
      <section className="pb-12 lg:pb-16">
        <Container>
          {byDept.map(({ dept, items }) => (
            <div key={dept.code} className="mb-12">
              <div className="flex items-baseline gap-3">
                <h2 className={`display-serif text-2xl ${dept.accent}`}>{dept.name}</h2>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {dept.code} · {items.length} modules
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{dept.blurb}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => {
                  const dim = getDimension(m.dimension);
                  return (
                    <a
                      key={m.slug}
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block h-full"
                    >
                      <Card className="flex h-full flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <Badge>{m.dimension} · {dim?.name}</Badge>
                          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                            {m.moduleCode}
                          </span>
                        </div>
                        <CardTitle className="mt-4 text-lg">{m.moduleName}</CardTitle>
                        <CardDescription className="flex-1">{m.summary}</CardDescription>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gold">Open app →</span>
                          <span className="font-mono text-[0.6rem] text-muted-foreground">
                            {m.sizeKb} KB
                          </span>
                        </div>
                      </Card>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Autonomy: connections + maintenance loop */}
      <section className="border-t border-border/60 py-12 lg:py-16">
        <Container>
          <h2 className="display-serif text-2xl text-parchment">
            Autonomous operation — multiple AI & connections
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            ArtemisIX orchestrates several providers and a self-maintaining registry. Each connection
            upgrades from simulation to live the moment its key is present.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Connections
              </h3>
              <ul className="mt-3 space-y-3">
                {connections.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-parchment">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.role} — {c.powers}
                      </div>
                      <div className="mt-0.5 font-mono text-[0.6rem] text-muted-foreground">
                        {c.activatedBy}
                      </div>
                    </div>
                    <span className={`font-mono text-[0.6rem] uppercase ${statusTone[c.status]}`}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Self-maintenance loop
              </h3>
              <ol className="mt-3 space-y-3">
                {maintenanceLoop.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="display-serif text-xl text-gold">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-parchment">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 border-t border-border/60 pt-3">
                <Link href="/artemisix" className="text-sm text-gold hover:text-gold-soft">
                  ← Back to the ArtemisIX studio
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
