import { createMetadata } from "@/lib/seo/metadata";
import { WorkbenchVersionShell } from "./WorkbenchVersionShell";

export const metadata = createMetadata({
  title: "ARTEMIS Geometric Workbench",
  path: "/workbench/app",
  description:
    "The canonical ARTEMIS Geometric Workbench application — currently serving the v5.8 production runtime.",
});

export default function WorkbenchAppPage() {
  return <WorkbenchVersionShell />;
}
