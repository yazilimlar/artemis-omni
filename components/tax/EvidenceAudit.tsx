import { EVIDENCE_BADGE, EVIDENCE_LABEL } from "@/lib/tax/format";
import type { EvidenceItem } from "@/types/tax-architecture";

type EvidenceAuditProps = { evidence: EvidenceItem[] };

export function EvidenceAudit({ evidence }: EvidenceAuditProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <h3 className="text-2xl font-semibold text-white">Evidence Audit</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
        Every major number should ultimately trace to payroll records, bank data, invoices,
        returns, ledgers, depreciation schedules, or a documented advisor assumption. Status
        badges make the weakest links visible.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.06] text-white/60">
            <tr>
              <th scope="col" className="p-4 font-medium">Input</th>
              <th scope="col" className="p-4 font-medium">Value</th>
              <th scope="col" className="p-4 font-medium">Status</th>
              <th scope="col" className="p-4 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="p-4 font-medium text-white">{item.label}</td>
                <td className="p-4 text-white/70">{item.value}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${EVIDENCE_BADGE[item.status]}`}
                  >
                    {EVIDENCE_LABEL[item.status]}
                  </span>
                </td>
                <td className="p-4 text-white/55">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
