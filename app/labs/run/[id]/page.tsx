import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { requireAuth } from "@/lib/auth/require-auth";
import { DEFAULT_MAX_SESSION_SECONDS, findArtifact, isPublicArtifact } from "@/lib/sandbox/artifacts";
import { createMetadata } from "@/lib/seo/metadata";
import { SandboxFrame } from "./SandboxFrame";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artifact = findArtifact(id);
  return createMetadata({
    title: artifact?.title ?? "Artifact not found",
    path: `/labs/run/${id}`,
    noIndex: true,
  });
}

export default async function RunArtifactPage({ params }: Props) {
  const { id } = await params;
  const artifact = findArtifact(id);
  if (!artifact) notFound();

  // ADR-014: public_safe_demo runs without auth; everything else needs a session.
  if (!isPublicArtifact(artifact)) {
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
                <Link href="/dashboard" className="text-gold-soft underline-offset-4 hover:underline">
                  ← Back to dashboard
                </Link>
              </p>
            </div>
          </Container>
        </section>
      );
    }
  }

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <p className="eyebrow">Sandboxed artifact</p>
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
            maxSessionSeconds={artifact.resource_limits.max_session_seconds ?? DEFAULT_MAX_SESSION_SECONDS}
          />
        </div>
      </Container>
    </section>
  );
}
