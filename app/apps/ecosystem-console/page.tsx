import { requireAuth } from "@/lib/auth/require-auth";
import { EcosystemConsole } from "@/components/ecosystem/EcosystemConsole";
import { CONSOLE_VIEW } from "@/lib/tax-intelligence/ecosystem-console-manifest";
import { createMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const metadata = createMetadata({
  title: "Ecosystem Console — ARTEMIS Tax Intelligence",
  path: "/apps/ecosystem-console",
  description:
    "Private ecosystem console: relationship map, Apolloa formation comparison, development timeline, and task/decision tracking. Synthetic data only.",
  noIndex: true,
});

export default async function EcosystemConsolePage() {
  const { profile } = await requireAuth();
  if (!profile) {
    // Fail closed: no profile, no manifest data — render only the shell.
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-semibold">Ecosystem Console</h1>
        <p className="mt-4">Access pending profile provisioning. No data is available.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-amber-300">
        ARTEMIS · Tax Intelligence
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Ecosystem Console</h1>
      <p className="mt-4 max-w-3xl text-sm text-slate-300">
        Synthetic preview · Relationship map, formation comparison, timeline, and evidence/decision
        tracking for the independent-agora ecosystem. No live data, filings, or registrations are
        connected.
      </p>
      <EcosystemConsole view={CONSOLE_VIEW} />
    </main>
  );
}
