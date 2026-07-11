import { artemisPublicStructure } from "@/data/artemisPublicStructure";

export const dynamic = "force-static";

export function GET() {
  return Response.json(artemisPublicStructure, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Disposition": 'inline; filename="artemis-public-structure.json"',
    },
  });
}
