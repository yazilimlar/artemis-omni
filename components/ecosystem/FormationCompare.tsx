import type { ConsoleView } from "@/lib/tax-intelligence/ecosystem-console-manifest";

/**
 * Apolloa formation comparison.
 *
 * Every figure shown comes from the manifest view: verified fixed fees plus
 * named variables only. No all-in total exists — publication pricing, several
 * state fees, and income-banded charges remain UNKNOWN — so the Total cell
 * renders exactly "NOT COSTABLE" for every option, never a number.
 */

function shortSha(sha: string | null): string {
  return sha ? sha.slice(0, 8) : "no commit";
}

const TH_CLASS =
  "border-b border-slate-600/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-400";
const TD_CLASS = "border-b border-slate-700/40 px-3 py-3 align-top text-slate-300";

export function FormationCompare({ view }: { view: ConsoleView }) {
  return (
    <div className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-6">
      <p className="max-w-3xl text-sm text-slate-300">
        Verified fixed fees + named variables only; no all-in totals exist. Publication pricing,
        several state fees, and income-banded charges are still UNKNOWN, so every option&apos;s total
        is NOT COSTABLE.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th scope="col" className={TH_CLASS}>Option</th>
              <th scope="col" className={TH_CLASS}>Formation</th>
              <th scope="col" className={TH_CLASS}>Foreign qualification</th>
              <th scope="col" className={TH_CLASS}>Publication</th>
              <th scope="col" className={TH_CLASS}>Annual state charges</th>
              <th scope="col" className={TH_CLASS}>What establishes it</th>
              <th scope="col" className={TH_CLASS}>Open unknowns</th>
              <th scope="col" className={TH_CLASS}>Total</th>
            </tr>
          </thead>
          <tbody>
            {view.formationOptions.map((option) => (
              <tr key={option.id}>
                <td className={`${TD_CLASS} font-medium text-slate-100`}>
                  {option.name}
                  <span className="block font-mono text-xs font-normal text-slate-400">{option.id}</span>
                </td>
                <td className={TD_CLASS}>{option.formation}</td>
                <td className={TD_CLASS}>{option.foreignQualification}</td>
                <td className={TD_CLASS}>{option.publication}</td>
                <td className={TD_CLASS}>{option.annualState}</td>
                <td className={TD_CLASS}>{option.formationEvidence}</td>
                <td className={TD_CLASS}>{option.openUnknowns}</td>
                <td className={TD_CLASS}>
                  <span className="font-mono font-semibold text-amber-300">NOT COSTABLE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 border-t border-slate-700/50 pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Provenance</h3>
        <ul className="mt-2 space-y-1 font-mono text-xs text-slate-400">
          {view.formationOptions.map((option) => (
            <li key={option.id}>
              {option.id}: {option.provenance.sourcePath} · {shortSha(option.provenance.commitSha)} ·{" "}
              {option.provenance.sourceStatus}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
