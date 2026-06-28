import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { changeRegister } from "@/lib/artemis/data/syntheticWorkbenchData";

const statusTone: Record<string, string> = {
  Approved: "text-gold",
  "In review": "text-silver",
  Pending: "text-muted-foreground",
};

/** Change / exposure register — synthetic change orders with cost codes (C-####). */
export function ConstructionControlsMatrix() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-navy-deep/40">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/60 text-muted-foreground">
            <th className="px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider">Cost code</th>
            <th className="px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-right font-mono text-[0.62rem] uppercase tracking-wider">Exposure</th>
          </tr>
        </thead>
        <tbody>
          {changeRegister.map((c) => (
            <tr key={c.id} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3 font-mono text-foreground/85">{c.id}</td>
              <td className="px-4 py-3 font-mono text-muted-foreground">{c.costCode}</td>
              <td className="px-4 py-3 text-foreground/85">{c.description}</td>
              <td className={cn("px-4 py-3", statusTone[c.status])}>{c.status}</td>
              <td className="px-4 py-3 text-right font-mono text-parchment">{c.exposure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
