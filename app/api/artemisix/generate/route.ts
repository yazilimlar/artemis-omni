import { NextResponse } from "next/server";
import { generateIX } from "@/lib/artemisix/engine";
import { ixGenerators } from "@/lib/artemisix/catalog";
import type { IXGenerateRequest, IXKind } from "@/lib/artemisix/types";

export const runtime = "nodejs";

const validKinds = new Set<IXKind>(ixGenerators.map((g) => g.kind));

export async function POST(request: Request) {
  let body: Partial<IXGenerateRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const kind = body.kind;
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!kind || !validKinds.has(kind)) {
    return NextResponse.json(
      { error: `Unknown generator kind. Expected one of: ${[...validKinds].join(", ")}.` },
      { status: 400 },
    );
  }
  if (!prompt) {
    return NextResponse.json({ error: "A non-empty prompt is required." }, { status: 400 });
  }
  if (prompt.length > 2000) {
    return NextResponse.json({ error: "Prompt exceeds 2000 characters." }, { status: 413 });
  }

  try {
    const result = await generateIX({ kind, prompt, options: body.options ?? {} });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/artemisix/generate] failed:", err);
    return NextResponse.json({ error: "Generation failed. See server logs." }, { status: 500 });
  }
}
