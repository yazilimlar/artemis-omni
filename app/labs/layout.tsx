import type { ReactNode } from "react";

/** Labs section frame — engineer's notebook grid behind every labs page. */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return <div className="labs-notebook">{children}</div>;
}
