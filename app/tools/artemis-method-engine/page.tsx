import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { requireAuth } from "@/lib/auth/require-auth";
import { DEFAULT_MAX_SESSION_SECONDS, findArtifact } from "@/lib/sandbox/artifacts";
import { createMetadata } from "@/lib/seo/metadata";
import { SandboxFrame } from "@/app/labs/run/[id]/SandboxFrame";

const ARTIFACT_ID = "artemis-method-engine";

export const metadata = createMetadata({
  title: "Artemis Method Engine",
  path: "/tools/artemis-method-engine",
  description: "Internal tool: the Artemis Method Engine. Allowlisted sign-in required.",
  noIndex: true,
});

export default async function MethodEngineToolPage() {
  const artifact = findArtifact(ARTIFACT_ID);
  if (!artifact) notFound();

  // ADR-011: this page is gated by the same allowlisted sign-in as /control
  // and /system-map. The artifact HTML itself is served only by
  // /api/sandbox/[id], which repeats the allowlist check (ADR-014).
  const { profile } = await requireAuth();
  if (artifact.allow_outbound !== false && profile?.role !== "owner") {
    return (
      <section className="py-20">
        <Container className="max-w-xl">
          <div role="alert" className="rounded-lg border border-border/70 bg-navy-deep/50 p-8">
            <p className="eyebrow">403 · Owner only</p>
            <h1 className="display-serif mt-3 text-3xl text-parchment">{artifact.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              This artifact makes outbound network requests, so only the owner role can run it
              (ADR-014).
            </p>
            <p className="mt-6 text-sm">
              <Link href="/tools" className="text-gold-soft underline-offset-4 hover:underline">
                ← Back to tools
              </Link>
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <p className="eyebrow">Tools · Sandboxed artifact</p>
        <h1 className="display-serif mt-3 text-3xl text-parchment">{artifact.title}</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge>{artifact.visibility}</Badge>
          <Badge>{artifact.data_mode}</Badge>
          <Badge>{artifact.allow_outbound === false ? "no network" : "outbound allowlist"}</Badge>
        </div>
        <div className="mt-8">
          <SandboxFrame
            id={artifact.id}
            title={artifact.title}
            maxSessionSeconds={
              artifact.resource_limits.max_session_seconds ?? DEFAULT_MAX_SESSION_SECONDS
            }
          />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/tools" className="text-gold-soft underline-offset-4 hover:underline">
            ← Back to tools
          </Link>
        </p>
      </Container>
    </section>
  );
}
