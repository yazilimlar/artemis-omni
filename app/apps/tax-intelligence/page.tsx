import { requireAuth } from "@/lib/auth/require-auth";
import { createMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const metadata = createMetadata({
  title: "Tax Intelligence — Private Client Applications",
  path: "/apps/tax-intelligence",
  description: "Private, access-controlled client tax intelligence workspace.",
  noIndex: true,
});

const clients = [
  { name: "Personal", description: "Individual tax planning", ownership: "Individual" },
  { name: "Great Order LLC", description: "Existing operating business", ownership: "10% proposed AGOraXai interest" },
  { name: "ARTEMIS", description: "Independent pre-formation venture", ownership: "100% personal; 40% proposed AGOraXai interest" },
  { name: "AGOraXai", description: "Pre-formation open platform", ownership: "50% personal / 40% ARTEMIS / 10% Great Order" },
  { name: "Apolloa", description: "Pre-formation joint venture", ownership: "50% personal / 50% cofounder" },
] as const;

export default async function TaxIntelligencePage() {
  const { profile } = await requireAuth();
  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-semibold">Tax Intelligence</h1>
        <p className="mt-4">Access pending profile provisioning. No client data is available.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-amber-300">ARTEMIS · Private Client Applications</p>
      <h1 className="mt-3 text-4xl font-semibold">Tax Intelligence</h1>
      <p className="mt-4 max-w-3xl text-sm text-slate-300">MVP R1 · Synthetic portfolio information only. No financial records, tax calculations, uploads, or filings are connected.</p>
      <section aria-label="Client workspaces" className="mt-10 grid gap-4 md:grid-cols-2">
        {clients.map((client) => (
          <article key={client.name} className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{client.description}</p>
            <p className="mt-4 text-xs text-amber-200">{client.ownership}</p>
          </article>
        ))}
      </section>
      <section className="mt-10 rounded-xl border border-amber-500/30 p-6">
        <h2 className="text-xl font-semibold">Security and audit gates</h2>
        <p className="mt-3 text-sm text-slate-300">Server-side login and existing ARTEMIS allowlist are required. Client-level authorization, encrypted evidence storage, transaction reconciliation, and validated tax calculations remain blocked pending implementation and testing.</p>
      </section>
    </main>
  );
}
