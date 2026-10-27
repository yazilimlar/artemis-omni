import { Card } from "@/components/ui/card";
import type { ConsoleView } from "@/lib/tax-intelligence/ecosystem-console-manifest";
import { FormationCompare } from "./FormationCompare";
import { NetworkMap } from "./NetworkMap";
import { TaskBoard } from "./TaskBoard";
import { Timeline } from "./Timeline";

/**
 * ARTEMIS Ecosystem Console — composes the manifest views into labelled
 * sections. Everything rendered comes from the projected ConsoleView; the
 * console holds no data of its own and offers no write path.
 */
export function EcosystemConsole({ view }: { view: ConsoleView }) {
  return (
    <div className="mt-10 space-y-14">
      <Card className="border-amber-500/30 bg-slate-900/50">
        <h2 className="text-xl font-semibold">About this console</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-slate-100">Synthetic data only.</strong> Nothing here is live
            financial data, a formation record, or a filing.
          </p>
          <p>
            Derived from manifest version{" "}
            <span className="font-mono text-amber-200">{view.version}</span>, generated from{" "}
            <span className="font-mono text-amber-200">{view.generatedFrom}</span>.
          </p>
          <p>
            Apolloa is an independent agora participant, pre-registration, and is{" "}
            <strong className="text-slate-100">not a legal entity</strong>. Participation in the
            platform records no ownership, equity, agency, or subsidiary relationship, and no
            ownership edges are recorded in the map below.
          </p>
          <p>
            Statuses are derived from origin and evidence — a proposal can never display as a
            recorded fact, and UNKNOWN values stay visible as UNKNOWN.
          </p>
        </div>
      </Card>
      <p className="mt-4"><a href="/apps/finance-console">Finance &amp; Compliance Console</a></p>

      <section aria-labelledby="ec-relationship-map">
        <h2 id="ec-relationship-map" className="text-2xl font-semibold">
          Relationship map
        </h2>
        <div className="mt-4">
          <NetworkMap view={view} />
        </div>
      </section>

      <section aria-labelledby="ec-formation-comparison">
        <h2 id="ec-formation-comparison" className="text-2xl font-semibold">
          Formation comparison
        </h2>
        <div className="mt-4">
          <FormationCompare view={view} />
        </div>
      </section>

      <section aria-labelledby="ec-development-timeline">
        <h2 id="ec-development-timeline" className="text-2xl font-semibold">
          Development timeline
        </h2>
        <div className="mt-4">
          <Timeline view={view} />
        </div>
      </section>

      <section aria-labelledby="ec-tasks-decisions">
        <h2 id="ec-tasks-decisions" className="text-2xl font-semibold">
          Tasks &amp; decisions
        </h2>
        <div className="mt-4">
          <TaskBoard view={view} />
        </div>
      </section>
    </div>
  );
}
