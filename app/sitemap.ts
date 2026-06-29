import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getSlugs } from "@/lib/content";
import { tools } from "@/lib/tools";
import { audiences } from "@/data/audiences";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/solutions",
    "/products",
    "/labs",
    "/labs/construction-intelligence-workbench",
    "/labs/utility-intelligence-bridge",
    "/labs/geodesic-intelligence",
    "/labs/diana-moonshot",
    "/academy",
    "/tools",
    "/case-studies",
    "/demo",
    "/portfolio",
    "/library",
    "/library/programs",
    "/insights",
    "/departments",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const content = (["academy", "labs", "case-studies"] as const).flatMap((collection) =>
    getSlugs(collection).map((slug) => ({
      url: `${base}/${collection}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  const toolRoutes = tools
    .filter((t) => t.status === "live")
    .map((t) => ({
      url: `${base}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const audienceRoutes = audiences.map((audience) => ({
    url: `${base}/for/${audience.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...content, ...toolRoutes, ...audienceRoutes];
}
