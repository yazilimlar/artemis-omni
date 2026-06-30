import { NextResponse } from "next/server";
import { getModules, getRegistryStats } from "@/lib/artemisix/registry";

export const runtime = "nodejs";
// Always reflect the current contents of the apps folder.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [modules, stats] = await Promise.all([getModules(), getRegistryStats()]);
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      stats,
      modules,
    });
  } catch (err) {
    console.error("[/api/artemisix/registry] failed:", err);
    return NextResponse.json({ error: "Registry scan failed." }, { status: 500 });
  }
}
