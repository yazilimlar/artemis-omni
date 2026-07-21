import { createMetadata } from "@/lib/seo/metadata";
import { WorkbenchVersionShell } from "./WorkbenchVersionShell";

export const metadata = createMetadata({
  title: "ARTEMIS Geometric Workbench v6.0.0-alpha",
  path: "/workbench/app",
  description:
    "The canonical ARTEMIS Geometric Workbench application. Launch the latest v6.0.0-alpha release or intentionally review the superseded v5.9 reference.",
});

export default function WorkbenchAppPage() {
  return <WorkbenchVersionShell />;
}
