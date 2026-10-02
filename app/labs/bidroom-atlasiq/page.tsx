import { createMetadata } from "@/lib/seo/metadata";
import BidRoomAtlasIQ from "../../../src/app/labs/bidroom-atlasiq/BidRoomAtlasIQ";
import "./atlasiq-force-colors.css";

export const metadata = createMetadata({
  title: "BidRoom AtlasIQ (Labs review)",
  path: "/labs/bidroom-atlasiq",
  description:
    "Federated public-works opportunity intelligence across federal, state, authority, and city procurement sources with scope, qualification, permit, addendum, and bid-type filters.",
  noIndex: true,
});

export default function BidRoomAtlasIQPage() {
  return (
    <div className="atlasiq-force-light" data-atlasiq-css="force-colors-v2">
      <BidRoomAtlasIQ />
    </div>
  );
}
