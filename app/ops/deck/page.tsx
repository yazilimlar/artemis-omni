import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type BranchGroup = {
  label: string;
  description: string;
  branches: { name: string; note?: string }[];
};

type ReviewColumn = {
  label: string;
  items: { branch: string; status: "idle" | "active" | "done" }[];
};

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const branchGroups: BranchGroup[] = [
  {
    label: "Canonical",
    description: "Authoritative branches. Source of truth for production.",
    branches: [
      { name: "main", note: "Desired production source" },
    ],
  },
  {
    label: "Active Feature",
    description: "Branches under active development for new features.",
    branches: [
      { name: "feature/civicbid-sourceledger-command-deck", note: "Current feature candidate" },
      { name: "ops/release-control-dashboard", note: "This branch" },
    ],
  },
  {
    label: "Donor / Inspect",
    description: "Can be inspected for UI ideas but never merged wholesale.",
    branches: [
      { name: "feature/artemisix19-autonomous-generator", note: "GitHub default but not canonical" },
    ],
  },
  {
    label: "Quarantined",
    description: "Previously deployed. Reference only.",
    branches: [
      { name: "test/civicbid-signal-forge", note: "Current live production source" },
    ],
  },
  {
    label: "Superseded",
    description: "Replaced by newer work.",
    branches: [
      { name: "feature/artemis-atlas-handcrafted-guru-selection-v00" },
      { name: "feature/priam-lens-a0-3" },
      { name: "feature/rainbow-botanics-prismaflora-m2" },
      { name: "feature/rainbow-botanics-prismaflora-preview" },
    ],
  },
  {
    label: "Experimental",
    description: "Short-lived spikes or experiments.",
    branches: [
      { name: "feature/publish-standalone-labs" },
      { name: "fix/civicbid-signal-forge-cockpit" },
    ],
  },
  {
    label: "Archive",
    description: "Stale branches kept for reference.",
    branches: [
      { name: "claude/evolution-console" },
      { name: "claude/troy-time-atlas" },
    ],
  },
  {
    label: "Investigate",
    description: "Unknown or ambiguous origin. Requires triage.",
    branches: [],
  },
];

const reviewBoard: ReviewColumn[] = [
  { label: "Draft", items: [] },
  { label: "Preview", items: [] },
  { label: "Needs Review", items: [{ branch: "feature/civicbid-sourceledger-command-deck", status: "active" }] },
  { label: "Approved", items: [] },
  { label: "Ready for Main", items: [] },
  { label: "Live", items: [{ branch: "test/civicbid-signal-forge", status: "done" }] },
  { label: "Archived", items: [{ branch: "feature/artemis-atlas-handcrafted-guru-selection-v00", status: "done" }] },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function GroupBadge({ label }: { label: string }) {
  const colorMap: Record<string, string> = {
    Canonical: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    "Active Feature": "border-sky-500/40 bg-sky-500/10 text-sky-300",
    "Donor / Inspect": "border-amber-500/40 bg-amber-500/10 text-amber-300",
    Quarantined: "border-red-500/40 bg-red-500/10 text-red-300",
    Superseded: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    Experimental: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    Archive: "border-zinc-600/30 bg-zinc-600/10 text-zinc-500",
    Investigate: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider ${colorMap[label] ?? "border-border bg-muted text-muted-foreground"}`}>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function OpsDeckPage() {
  return (
    <div className="min-h-dvh bg-lunar-radial">
      <Container className="py-10 lg:py-14">

        {/* ---- Header ---- */}
        <div className="border-b border-border/60 pb-6">
          <Badge>Operations</Badge>
          <h1 className="display-serif mt-3 text-3xl text-parchment sm:text-4xl">
            Artemis Release Control Panel
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Static reference dashboard for release management, branch governance, and deployment status.
            No client state, no API calls, no real deploy or promote actions.
          </p>
        </div>

        {/* ---- Current Production + Canonical Source ---- */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">

          {/* Production Card */}
          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>Current Production</CardTitle>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Quarantined
              </span>
            </div>
            <CardDescription>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Domain</dt>
                  <dd className="font-mono text-foreground">artemis.agoraxai.com</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Source</dt>
                  <dd className="font-mono text-foreground">test/civicbid-signal-forge</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Commit</dt>
                  <dd className="font-mono text-foreground">b9a7263</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Desired source</dt>
                  <dd className="font-mono text-gold-soft">main</dd>
                </div>
              </dl>
            </CardDescription>
          </Card>

          {/* Canonical Source Card */}
          <Card>
            <CardTitle>Canonical Source</CardTitle>
            <CardDescription>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Repo</dt>
                  <dd className="font-mono text-foreground">yazilimlar/artemis-omni</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Vercel project</dt>
                  <dd className="font-mono text-foreground">artemis-omni</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Production branch</dt>
                  <dd className="font-mono text-gold-soft">main</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Active feature</dt>
                  <dd className="font-mono text-foreground">feature/civicbid-sourceledger-command-deck</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Control branch</dt>
                  <dd className="font-mono text-foreground">ops/release-control-dashboard</dd>
                </div>
              </dl>
            </CardDescription>
          </Card>

        </div>

        {/* ---- Branch Registry ---- */}
        <section className="mt-10">
          <h2 className="display-serif text-xl text-parchment">Branch Registry</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All known branches grouped by governance category.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {branchGroups.map((group) => (
              <Card key={group.label} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-mono text-sm font-medium text-foreground">{group.label}</h3>
                  <GroupBadge label={group.label} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.description}</p>
                {group.branches.length > 0 ? (
                  <ul className="mt-3 space-y-1">
                    {group.branches.map((b) => (
                      <li key={b.name}>
                        <code className="block truncate rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground/90">
                          {b.name}
                        </code>
                        {b.note && (
                          <span className="ml-1.5 text-[0.65rem] text-muted-foreground">{b.note}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground/60">No branches listed</p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* ---- Review / Approval Board ---- */}
        <section className="mt-10">
          <h2 className="display-serif text-xl text-parchment">Review / Approval Board</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual pipeline: Draft → Preview → Needs Review → Approved → Ready for Main → Live → Archived
          </p>
          <div className="mt-5 grid gap-3 overflow-x-auto sm:grid-cols-4 lg:grid-cols-7">
            {reviewBoard.map((col) => (
              <div key={col.label} className="min-w-[140px] rounded-lg border border-border/50 bg-navy-deep/30 p-3">
                <h3 className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-gold-soft">
                  {col.label}
                </h3>
                <div className="mt-2 space-y-1.5">
                  {col.items.length > 0 ? (
                    col.items.map((item) => (
                      <div
                        key={item.branch}
                        className="rounded-md border border-border/40 bg-muted/40 px-2 py-1.5"
                      >
                        <code className="block truncate font-mono text-[0.65rem] text-foreground/80">
                          {item.branch}
                        </code>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-center text-[0.6rem] italic text-muted-foreground/50">Empty</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Test / Live Comparison ---- */}
        <section className="mt-10">
          <h2 className="display-serif text-xl text-parchment">Test / Live Comparison</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual status switcher — no real deployment toggling.
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="border-sky-500/30">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-sky-300">Preview / Test</span>
              </div>
              <CardDescription>
                <p className="mt-3 text-sm">
                  This environment runs from feature branches. It includes unreviewed changes,
                  experimental components, and work-in-progress code.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-gold-soft">→</span> Preview deployments created by Vercel for each branch
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-soft">→</span> Not production — no live data or real integrations
                  </li>
                </ul>
              </CardDescription>
            </Card>
            <Card className="border-emerald-500/30">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-300">Live</span>
              </div>
              <CardDescription>
                <p className="mt-3 text-sm">
                  The production environment serves reviewed, approved code deployed from <code className="rounded bg-muted/60 px-1 font-mono text-xs">main</code>.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-gold-soft">→</span> Currently sourced from <code className="rounded bg-muted/60 px-1 font-mono text-xs">test/civicbid-signal-forge</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-soft">→</span> Transition to <code className="rounded bg-muted/60 px-1 font-mono text-xs">main</code> is the next milestone
                  </li>
                </ul>
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* ---- Warning Panel ---- */}
        <section className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="flex items-center gap-2">
            <span className="text-lg text-amber-400">⚠</span>
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-amber-300">
              Operational Warnings
            </h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-amber-200/80">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">•</span>
              <span>Do not use GitHub default branch blindly. The current default (<code className="rounded bg-amber-500/10 px-1 font-mono text-xs">feature/artemisix19-autonomous-generator</code>) is not canonical.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">•</span>
              <span>Do not start work from <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">test/*</code>, <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">claude/*</code>, <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">opencode/*</code>, <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">archive/*</code>, or ambiguous <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">HEAD</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">•</span>
              <span>Do not run <code className="rounded bg-amber-500/10 px-1 font-mono text-xs">vercel --prod</code>. Production deployments require explicit approval.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">•</span>
              <span>Do not promote preview deployments manually. Use the Vercel dashboard with caution.</span>
            </li>
          </ul>
        </section>

        {/* ---- Future Phase ---- */}
        <section className="mt-10">
          <h2 className="display-serif text-xl text-parchment">Future Phase</h2>
          <Card className="mt-5">
            <CardDescription>
              <p className="text-sm leading-relaxed">
                A real admin deployment switcher would require the following, none of which is
                implemented in this static dashboard:
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold-soft">→</span>
                  <span>Authentication and role-based access control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold-soft">→</span>
                  <span>GitHub API integration for branch listing, PR status, and merge validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold-soft">→</span>
                  <span>Vercel API integration for deployment trigger, status, and rollback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold-soft">→</span>
                  <span>Audit log of all deployments, approvals, and rollbacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold-soft">→</span>
                  <span>Approval workflow with required reviewers per environment</span>
                </li>
              </ul>
            </CardDescription>
          </Card>
        </section>

      </Container>
    </div>
  );
}
