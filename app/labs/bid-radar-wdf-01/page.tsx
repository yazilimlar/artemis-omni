import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "WDF Bid Radar · Intelligence Studio",
  path: "/labs/bid-radar-wdf-01",
  description: "Public procurement intelligence: award history, agency activity, source health and explicitly assumed pursuit economics. Official notices remain controlling.",
  noIndex: true,
});

export default function WdfBidRadarPage() {
  return <iframe
    sandbox={labSandbox("bid-radar-wdf-01")}
    referrerPolicy="no-referrer"
    loading="lazy"
    title="WDF Bid Radar · Intelligence Studio"
    src="/standalone/bid-radar-wdf-01/index.html"
    className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#f1f5f6]"
  />;
}
