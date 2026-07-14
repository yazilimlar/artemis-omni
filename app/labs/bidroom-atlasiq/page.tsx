import { createMetadata } from "@/lib/seo/metadata";
import BidRoomAtlasIQ from "../../../src/app/labs/bidroom-atlasiq/BidRoomAtlasIQ";

export const metadata = createMetadata({
  title: "BidRoom AtlasIQ",
  path: "/labs/bidroom-atlasiq",
  description:
    "Federated public-works opportunity intelligence across federal, state, authority, and city procurement sources with scope, qualification, permit, addendum, and bid-type filters.",
});

export default function BidRoomAtlasIQPage() {
  return <BidRoomAtlasIQ />;
}
