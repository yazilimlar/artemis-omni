import { createMetadata } from "@/lib/seo/metadata";
import { BidRoomVerityClient } from "./BidRoomVerityClient";

export const metadata = createMetadata({
  title: "BidRoom Verity",
  path: "/labs/bidroom-verity",
  description:
    "Evidence-verified opportunity console: live official records, field-level provenance, computed scores with visible formulas, and no illustrative numbers.",
  noIndex: true,
});

export default function BidRoomVerityPage() {
  return <BidRoomVerityClient />;
}
