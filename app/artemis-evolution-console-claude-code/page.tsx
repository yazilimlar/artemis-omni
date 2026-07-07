import {
  ArrowRight,
  Bot,
  Cloud,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe,
  Layers,
  Lock,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Evolution Console",
  path: "/artemis-evolution-console-claude-code",
  description:
    "A living system record for how Artemis is created, tested, deployed, and improved through AI-assisted implementation loops — architecture, builder roles, operating loop, safety boundary, and handover protocol.",
});

/* ------------------------------------------------------------------ */
/* Content model                                                       */
/* ------------------------------------------------------------------ */

const architectureLayers = [
  {
    icon: Globe,
    name: "AGOraXAI / Squarespace",
    role: "External presence",
    body: "Media, traffic, brand storytelling, and public-facing identity. The front door that routes attention toward the Artemis platform.",
  },
  {
    icon: Rocket,
    name: "Artemis / Vercel",
    role: "Product platform",
    body: "The software product itself — this site. Every route, lab, tool, and demo lives here as a deployable, versioned application.",
  },
  {
    icon: GitBranch,
    name: "GitHub",
    role: "Source of truth",
    body: "Version history, branch isolation, review, and recovery. Any state of the platform can be inspected, compared, or restored.",
  },
  {
    icon: Layers,
    name: "Next.js / React / TypeScript",
    role: "Application framework",
    body: "Typed, route-based application architecture with Tailwind and a shadcn-style component system for a consistent executive visual language.",
  },
  {
    icon: Cloud,
    name: "Vercel deployment",
    role: "Preview & production",
    body: "Branch pushes generate preview deployments; merges to the production branch deploy live. Rollback and revert are first-class operations.",
  },
  {
    icon: Bot,
    name: "AI build tools",
    role: "Implementation layer",
    body: "ChatGPT, Codex, Claude Code, Kimi, Gemini, and 9Router-style model routing — orchestrated as builders inside a governed workflow.",
  },
  {
    icon: Network,
    name: "APIs",
    role: "Controlled connections",
    body: "External data and service connections are added deliberately, scoped narrowly, and never expose credentials on public pages.",
  },
  {
    icon: Database,
    name: "Future data & auth layer",
    role: "Supabase or equivalent",
    body: "A planned authenticated tier: private workspaces, databases, and audit logs — kept fully separate from the public-safe surface.",
  },
];

const builderMatrix = [
  {
    tool: "ChatGPT",
    role: "Strategist",
    body: "Strategy, architecture, critique, prompt design, and documentation. Shapes what should be built before code is written.",
  },
  {
    tool: "Codex",
    role: "Implementer",
    body: "Implementation and direct code changes — turning specified intent into working diffs.",
  },
  {
    tool: "Claude Code",
    role: "Repo engineer",
    body: "Refactoring, testing, page building, and repository-level work — multi-file changes verified with typecheck, lint, and build.",
  },
  {
    tool: "Kimi",
    role: "Variant generator",
    body: "Alternate implementations and design variants — parallel takes on the same brief so the best version can be selected.",
  },
  {
    tool: "Vercel",
    role: "Deployment rail",
    body: "Preview deployments for every branch, production deploys on merge, and instant rollback when something regresses.",
  },
  {
    tool: "GitHub",
    role: "Memory & recovery",
    body: "Branch history, pull-request review, and recovery. Nothing is lost; every change has an author, a diff, and a reason.",
  },
  {
    tool: "9Router",
    role: "Model routing",
    body: "A local AI routing / proxy concept — directing each task to the model best suited for it, under one workflow.",
  },
];

const operatingLoop = [
  { step: "Idea", detail: "A need or improvement is identified." },
  { step: "Prompt", detail: "The intent is written as a precise, scoped brief." },
  { step: "Branch", detail: "Work starts on an isolated Git branch — never on production." },
  { step: "AI Build", detail: "An AI builder implements the change end to end." },
  { step: "Typecheck / Lint / Build", detail: "Automated gates must pass before anything ships." },
  { step: "Vercel Preview", detail: "A live preview URL is generated for the branch." },
  { step: "Human Review", detail: "A person inspects the preview and the diff." },
  { step: "Production Merge", detail: "Approved work merges and deploys to production." },
  { step: "Evolution Log", detail: "The change is recorded in docs/evolution/ for the next builder." },
];

const safetyRules = [
  "No API keys",
  "No .env.local contents",
  "No secrets or tokens of any kind",
  "No SSNs, EINs, or bank data",
  "No raw ERP data",
  "No private local file paths",
  "No client-specific records unless sanitized or approved",
];

const timeline = [
  {
    phase: "Phase 0",
    title: "Local experiments",
    body: "Standalone HTML tools, AI-generated prototypes, and local-only apps — fast, disposable, and private by default.",
  },
  {
    phase: "Phase 1",
    title: "AGOraXAI context",
    body: "The Squarespace brand presence takes shape and the Artemis subdomain direction is set: a dedicated product platform beside the media brand.",
  },
  {
    phase: "Phase 2",
    title: "Vercel + Next.js foundation",
    body: "The platform moves to a typed, route-based Next.js application with Git-backed deployment — the foundation everything now builds on.",
  },
  {
    phase: "Phase 3",
    title: "Labs & proof library",
    body: "Route-based demos, labs, and a proof library turn one-off experiments into a navigable, growing body of work.",
  },
  {
    phase: "Phase 4",
    title: "Public-safe rebuilds",
    body: "Standalone tools and demos are progressively rebuilt as sanitized, native pages — synthetic data only, nothing private exposed.",
  },
  {
    phase: "Phase 5",
    title: "Authenticated platform",
    body: "The future tier: private workspaces, APIs, a database, auth, and audit logs — a governed platform behind the public surface.",
    future: true,
  },
];

const handoverRules = [
  {
    icon: Lock,
    title: "Never edit production blindly",
    body: "Production is the output of the loop, not the workspace. All changes start from intent, on a branch.",
  },
  {
    icon: GitBranch,
    title: "Work on a branch or isolated route",
    body: "New work lives on its own Git branch and, where appropriate, its own route — so nothing existing is disturbed.",
  },
  {
    icon: Layers,
    title: "Preserve existing routes",
    body: "The homepage, Labs, Tools, and every published page must keep working exactly as before your change.",
  },
  {
    icon: ShieldCheck,
    title: "Do not expose secrets",
    body: "No keys, tokens, environment variables, private paths, or client data may appear in code, content, or commits.",
  },
  {
    icon: Workflow,
    title: "Run typecheck, lint, and build",
    body: "All three gates must pass locally before a change is proposed. A red build never ships.",
  },
  {
    icon: Eye,
    title: "Return a Vercel preview link",
    body: "Every proposed change comes with a live preview deployment so a human can inspect it in the real environment.",
  },
  {
    icon: FileText,
    title: "Document changes in docs/evolution/",
    body: "Each change gets a short evolution log entry: what changed, why, and what the next builder should know.",
  },
  {
    icon: Sparkles,
    title: "Only merge after review",
    body: "Human review is the final gate. Approval — not automation — is what promotes work to production.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function EvolutionConsolePage() {
  return (
    <>
      <PageHero
        eyebrow="System Record"
        title="Artemis Evolution Console"
        description="How this AI-enabled execution platform was created, evolved, and safely maintained. A living system record for how Artemis is created, tested, deployed, and improved through AI-assisted implementation loops."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Execution Bridge</Badge>
          <Badge>AI-Assisted Build Loop</Badge>
          <Badge>Public-Safe by Design</Badge>
        </div>
      </PageHero>

      {/* What is Artemis */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Position"
            title="An execution bridge, not a chatbot"
            description="Artemis is a public-safe AI implementation platform. It is not a demo gallery and not a chat interface — it is the bridge between intent and shipped software: ideas enter as prompts, and verified, reviewed, deployed pages come out the other side."
          />
        </Container>
      </section>

      {/* Origin story */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Origin"
            title="From local experiments to a governed platform"
            description="Artemis did not start as a platform. It evolved — from local experiments and standalone HTML tools, through AI-generated prototypes and route-based demos, into public-safe Vercel deployments. Each stage kept what worked, rebuilt what didn't, and moved everything private behind the boundary."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Local experiments", body: "Disposable prototypes proved ideas fast, with zero exposure." },
              { label: "Standalone HTML tools", body: "Single-file apps established the tool patterns still in use." },
              { label: "Route-based demos", body: "Prototypes became addressable pages inside one application." },
              { label: "Public-safe rebuilds", body: "The best work was rebuilt natively, sanitized, and published." },
            ].map((item) => (
              <Card key={item.label}>
                <CardTitle className="text-base">{item.label}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Architecture */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Architecture"
            title="The whole machine, in eight layers"
            description="Every part of the system has one job and a clear boundary. Brand presence, product platform, source of truth, framework, deployment, AI builders, controlled APIs, and the future authenticated tier."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {architectureLayers.map((layer) => (
              <Card key={layer.name}>
                <layer.icon className="h-5 w-5 text-gold" aria-hidden />
                <CardTitle className="mt-4 text-base">{layer.name}</CardTitle>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-gold-soft">
                  {layer.role}
                </p>
                <CardDescription>{layer.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* AI builder matrix */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Builder Matrix"
            title="Every AI tool has a defined role"
            description="Artemis is built by a roster of AI tools working inside one governed workflow. No tool free-lances: each has a role, and every output passes the same gates before it ships."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {builderMatrix.map((builder) => (
              <Card key={builder.tool}>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{builder.tool}</CardTitle>
                  <Badge>{builder.role}</Badge>
                </div>
                <CardDescription>{builder.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Operating loop */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Operating Loop"
            title="Minimum founder involvement, by design"
            description="The founder supplies intent and final approval. Everything in between — implementation, verification, preview — is handled by the loop. This is what makes the platform maintainable with minimal hands-on time."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {operatingLoop.map((item, i) => (
              <li key={item.step}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-xs text-gold">
                      {i + 1}
                    </span>
                    <CardTitle className="text-base">{item.step}</CardTitle>
                  </div>
                  <CardDescription>{item.detail}</CardDescription>
                </Card>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Vercel&apos;s Git workflow underwrites the loop: branch pushes and pull requests
            generate preview deployments, merges to the production branch deploy live, and
            rollbacks and reverts are part of the standard deployment flow.
          </p>
        </Container>
      </section>

      {/* Public-safety boundary */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="Safety Boundary"
              title="What never crosses onto a public page"
              description="Artemis maintains a hard boundary between the public-safe surface and everything private. Public pages must use synthetic, sanitized, or explicitly approved data only. The following never appear here, in any form:"
            />
            <Card className="border-gold/25">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold" aria-hidden />
                <CardTitle className="text-base">The boundary, enforced</CardTitle>
              </div>
              <ul className="mt-4 space-y-2.5">
                {safetyRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70"
                      aria-hidden
                    />
                    {rule}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
                Private apps, credentials, raw client files, and sensitive operational data
                live behind the boundary — never in this repository, never on this domain.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Evolution timeline */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Timeline"
            title="Six phases of evolution"
            description="Each phase changed what Artemis is — not just what it contains. Phases 0 through 4 are history; Phase 5 is the roadmap."
          />
          <div className="mt-12 space-y-4">
            {timeline.map((item) => (
              <Card key={item.phase} className="sm:flex sm:items-baseline sm:gap-8">
                <div className="flex shrink-0 items-center gap-3 sm:w-44">
                  <span className="font-mono text-xs uppercase tracking-wider text-gold">
                    {item.phase}
                  </span>
                  {item.future ? <Badge>Planned</Badge> : null}
                </div>
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Handover */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Handover Protocol"
            title="How any AI builder should continue Artemis"
            description="This is the operating method any builder — human or AI — must follow to extend the platform. It is what keeps a system built by many tools coherent, recoverable, and safe."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {handoverRules.map((rule) => (
              <Card key={rule.title}>
                <rule.icon className="h-5 w-5 text-gold" aria-hidden />
                <CardTitle className="mt-4 text-base">{rule.title}</CardTitle>
                <CardDescription>{rule.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <SectionHeading
            eyebrow="Continue"
            title="See the platform the loop produces"
            description="Explore the labs, tools, and demos that this system record describes — every one of them shipped through the loop on this page."
          />
          <div className="flex flex-wrap gap-3">
            <Button href="/labs" size="lg">
              Explore Labs
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="outline" size="lg">
              About Artemis
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
