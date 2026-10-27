import { requireAuth } from "@/lib/auth/require-auth";
import { FinanceConsole } from "@/components/finance/FinanceConsole";
import { FINANCE_VIEW } from "@/lib/tax-intelligence/finance-console";
import { createMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
export const metadata = createMetadata({ title: "Finance Console — ARTEMIS Tax Intelligence", path: "/apps/finance-console", description: "Private finance and compliance console. Synthetic data only.", noIndex: true });
export default async function FinanceConsolePage(){ const { profile } = await requireAuth(); if(!profile){ return (<main className="mx-auto max-w-3xl px-6 py-20"><h1 className="text-3xl font-semibold">Finance Console</h1><p className="mt-4">Access pending profile provisioning. No data is available.</p></main>); } return (<main className="mx-auto max-w-6xl px-6 py-16"><p className="text-sm uppercase tracking-widest text-amber-300">ARTEMIS · Tax Intelligence</p><h1 className="mt-3 text-4xl font-semibold">Finance &amp; Compliance Console</h1><p className="mt-4 max-w-3xl text-sm text-slate-300">Synthetic preview. No live data, filings, or registrations are connected.</p><FinanceConsole view={FINANCE_VIEW} /></main>); }
