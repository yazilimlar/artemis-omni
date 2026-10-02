import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SceneIsland } from "@/components/scenes/SceneIsland";
import scenes from "@/data/scene-registry.json";
import { requireAuth } from "@/lib/auth/require-auth";
import { createMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ id: string }> };

function findScene(id: string) {
  return scenes.find((scene) => scene.id === id) ?? null;
}

/** "public/textures/x.png" -> "/textures/x.png" (same-origin URL). */
function publicUrl(repoPath: string): string {
  return repoPath.replace(/^public(?=\/)/, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const scene = findScene(id);
  return createMetadata({
    title: scene?.title ?? "Scene not found",
    path: `/labs/scenes/${id}`,
    // Public scenes and explicitly approved public_safe_demo scenes are indexable,
    // matching other public_safe_demo labs; everything else stays noindex.
    noIndex:
      !scene ||
      !(scene.visibility === "public" || (scene.visibility === "public_safe_demo" && scene.approved_public)),
  });
}

export default async function ScenePage({ params }: Props) {
  const { id } = await params;
  const scene = findScene(id);
  if (!scene) notFound();

  // ADR-015: public_safe_demo scenes need explicit approval; everything else needs a session.
  if (scene.visibility === "public_safe_demo" && !scene.approved_public) notFound();
  if (scene.visibility !== "public_safe_demo" && scene.visibility !== "public") await requireAuth();

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <p className="eyebrow">Immersive scene</p>
        <h1 className="display-serif mt-3 text-3xl text-parchment">{scene.title}</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge>{scene.visibility}</Badge>
          <Badge>{scene.data_mode}</Badge>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A registered 3D scene (ADR-015). It upgrades from a static image only when your device
          allows motion and WebGL, and falls back to the image automatically if performance drops.
        </p>
        <div className="mt-8">
          <SceneIsland
            sceneId={scene.id}
            fallbackSrc={publicUrl(scene.fallback_2d)}
            fallbackAlt={`${scene.title}: static preview`}
            maxSessionSeconds={scene.resource_limits.max_session_seconds}
            fpsFloor={scene.resource_limits.fps_floor}
          />
        </div>
      </Container>
    </section>
  );
}
