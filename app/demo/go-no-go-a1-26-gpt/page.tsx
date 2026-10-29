import { createMetadata } from "@/lib/seo/metadata";
import A1Cockpit from "./A1Cockpit";

export const metadata = createMetadata({
  title: "Go / No-Go A1 · GPT Demonstration",
  path: "/demo/go-no-go-a1-26-gpt",
  description:
    "A public-safe, synthetic demonstration of evidence-driven bid evaluation, estimating readiness and atomic activity records. No live WDF data or approvals.",
  noIndex: true,
});

export default function GoNoGoA1GPTPage() {
  return <A1Cockpit />;
}
