import type { ImplementationPhase } from "@/components/showcase/ImplementationPhaseCard";

/** The Artemis transition method — current state to AI-enabled operations. */
export const implementationPhases: ImplementationPhase[] = [
  { phase: "Phase 0", marker: "Diagnostic", title: "Map the real current state", summary: "Systems, workflows, bottlenecks, Excel/email breakpoints, data owners, and decision cycles." },
  { phase: "Phase 1", marker: "Semantics", title: "Define meaning before automating", summary: "Terms, system-of-record boundaries, source fields, formulas, and what is actual vs forecast vs assumption." },
  { phase: "Phase 2", marker: "Prototype", title: "Prove the logic on safe data", summary: "A controlled demo on sanitized data, validated against the current workflow with measured savings." },
  { phase: "Phase 3", marker: "Training", title: "Train the process, not just the tool", summary: "Human review points, exception handling, owner roles, and an operating cadence staff actually use." },
  { phase: "Phase 4", marker: "Implementation", title: "Connect and automate the repeatable", summary: "Controlled integrations, dashboards, audit trails, documented assumptions, and governance." },
  { phase: "Phase 5", marker: "Optimization", title: "Measure ROI and refine", summary: "Reduce friction, improve forecasting, tighten confidence, and scale to more departments." },
  { phase: "Phase 6", marker: "Operating System", title: "A repeatable operating layer", summary: "Finance, operations, documents, reporting, and executive decisions in one governed system." },
];

/** Why companies struggle to operationalize AI (homepage problem framing). */
export const aiStruggles: { title: string; body: string }[] = [
  { title: "AI is treated as a chat tool", body: "Clever answers, not a governed system. Nothing connects to the project's data of record." },
  { title: "No semantic model", body: "Terms, sources, and formulas are undefined, so outputs can't be trusted or audited." },
  { title: "No human-review design", body: "Either everything is manual, or automation runs unchecked. Neither is accountable." },
  { title: "Adoption fails", body: "Staff are trained on a tool, not a process — so the system isn't used, and accuracy is zero." },
];
