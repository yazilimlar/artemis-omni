import { ArrowLeft, ArrowRight, FlaskConical, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Estimate Workspace · Controlled Access",
  path: "/labs/pending-contracts/george-mount-vernon/estimates/2wtc",
  description:
    "Access-controlled entry point for an independent HVAC estimate workspace. The workspace itself is gated; this page contains no project data.",
  noIndex: true,
});

const contextItems = [
  {
    label: "Access",
    value: "Authorized addresses only · one-time email code",
  },
  {
    label: "Status",
    value: "Live · gated workspace (ArtLoop R0.7)",
  },
  {
    label: "This page",
    value: "Entry point only · no project data",
  },
] as const;

export default function WtcEstimateWorkspaceEntryPage() {
  return (
    <main className="min-h-screen bg-[#0c1210] text-[#e8ece7]">
      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col px-4 py-10 sm:px-8">
        <p className="flex items-center gap-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8fa398]">
          <FlaskConical className="h-4 w-4" aria-hidden />
          Artemis Labs · Pending contracts · Estimates
        </p>
        <h1 className="mt-6 max-w-[16ch] text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Estimate workspace, behind a gate.
        </h1>
        <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-[#b9c4bb] sm:text-lg">
          An independent HVAC estimating workspace for a pending contract, verified
          release by release under the ArtLoop protocol. The workspace holds
          controlled bid material, so it lives behind an access gate: authorized
          addresses sign in with a one-time code sent by email. Nothing about the
          project is published on this page.
        </p>
        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          {contextItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#263129] bg-[#111714] p-4">
              <dt className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8fa398]">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm font-medium leading-snug text-[#e8ece7]">{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://artloop-ws.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#7fd1a8] px-6 py-3 text-sm font-semibold text-[#0c1210] transition hover:bg-[#93dcb6]"
          >
            <Lock className="h-4 w-4" aria-hidden />
            Open the workspace
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <p className="flex items-center gap-2 text-sm text-[#8fa398]">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            You will be asked for an authorized email address.
          </p>
        </div>
        <div className="mt-auto pt-14">
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#8fa398] transition hover:text-[#e8ece7]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to Labs
          </Link>
        </div>
      </div>
    </main>
  );
}
