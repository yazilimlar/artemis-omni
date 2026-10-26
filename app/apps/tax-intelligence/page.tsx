import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { CLIENT_IDS, type TaxClientId } from "@/lib/tax-intelligence/access";
import { createMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const metadata = createMetadata({
  title: "Tax Intelligence — Private Client Applications",
  path: "/apps/tax-intelligence",
  description: "Private, access-controlled client tax intelligence workspace.",
  noIndex: true,
});

const clients = [
  { id: "personal", name: "Personal", description: "Individual tax planning", ownership: "Individual" },
  { id: "great-order", name: "Great Order LLC", description: "Existing operating business", ownership: "10% proposed AGOraXai interest" },
  { id: "artemis", name: "ARTEMIS", description: "Independent pre-formation venture", ownership: "100% personal; 40% proposed AGOraXai interest" },
  { id: "agoraxai", name: "AGOraXai", description: "Pre-formation open platform", ownership: "50% personal / 40% ARTEMIS / 10% Great Order" },
  { id: "apolloa", name: "Apolloa", description: "Pre-formation joint venture", ownership: "50% personal / 50% cofounder" },
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
  const supabase = await createClient();
  const { data: memberships, error } = await supabase.rpc("tax_my_client_ids");
  // RPC failure is never interpreted as access. The server renders no client data.
  const permitted: TaxClientId[] = error ? [] : (memberships ?? [])
    .map((row: { client_id: string }) => row.client_id)
    .filter((id: string): id is TaxClientId => CLIENT_IDS.some(known => known === id));
  if (permitted.length === 0) {
    return <main className="mx-auto max-w-3xl px-6 py-20"><h1 className="text-3xl font-semibold">Tax Intelligence</h1><p className="mt-4">No client workspace has been assigned to this account. Contact the owner for access.</p></main>;
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-amber-300">ARTEMIS · Private Client Applications</p>
      <h1 className="mt-3 text-4xl font-semibold">Tax Intelligence</h1>
      <p className="mt-4 max-w-3xl text-sm text-slate-300">MVP R1 · Synthetic portfolio information only. No financial records, tax calculations, uploads, or filings are connected.</p>
      <section aria-label="Client workspaces" className="mt-10 grid gap-4 md:grid-cols-2">
        {clients.filter(client => permitted.some(id => id === client.id)).map((client) => (
          <article key={client.name} className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{client.description}</p>
            <p className="mt-4 text-xs text-amber-200">{client.ownership}</p>
          </article>
        ))}
      </section>
      <section className="mt-10 rounded-xl border border-amber-500/30 p-6">
        <h2 className="text-xl font-semibold">Security and audit gates</h2>
        <p className="mt-3 text-sm text-slate-300">Server-side login and existing ARTEMIS allowlist are required. Database-backed client authorization is enabled. Evidence storage, transaction reconciliation, and validated tax calculations remain blocked pending implementation and testing.</p>
      </section>
    </main>
  );
}
