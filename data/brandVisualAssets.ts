export type BrandVisualAsset = {
  slug: string;
  title: string;
  assetType: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  role: string;
  usage: string;
  boundary: string;
  orientation: "portrait" | "landscape";
};

export const brandVisualAssets = [
  {
    slug: "diana-blue-white-poster",
    title: "Diana Blue / White Systems Poster",
    assetType: "Cinematic poster",
    src: "/brand/artemis-diana-blue-white-poster.jpg",
    width: 1042,
    height: 1600,
    alt: "Artemis blue and white cinematic poster with wireframe archer, mechanical bow, Greek architectural frame, constellations, and blue signal beam.",
    role: "Primary Labs visual for the Diana Moonshot brand experience.",
    usage: "Use as a concept poster, Labs cover visual, or cinematic narrative reference.",
    boundary:
      "Brand concept reference only; it does not redefine current product categories or publish private client material.",
    orientation: "portrait",
  },
  {
    slug: "diana-blue-white-logo-study",
    title: "Diana Blue / White Logo Study",
    assetType: "Logo poster study",
    src: "/brand/artemis-diana-blue-white-logo-study.jpg",
    width: 1061,
    height: 1500,
    alt: "Artemis intelligent systems logo study with blue-white archer, mechanical bow, constellation field, and metallic architectural border.",
    role: "Logo-library reference for blue, platinum, and gold visual language.",
    usage: "Use on brand-system pages where the complete poster should be visible and clearly labeled as reference.",
    boundary:
      "Public concept asset; do not treat embedded poster wording as product copy or final logo standard.",
    orientation: "portrait",
  },
  {
    slug: "conceptual-architecture-plaque",
    title: "Conceptual Architecture Plaque",
    assetType: "Graphite relief study",
    src: "/brand/artemis-conceptual-architecture-plaque.jpg",
    width: 912,
    height: 1400,
    alt: "Artemis conceptual architecture plaque with graphite background, bronze wireframe archer relief, and mechanical bow.",
    role: "Restraint reference for graphite, bronze, and dimensional brand surfaces.",
    usage: "Use as a secondary visual when the page needs a quieter industrial brand reference.",
    boundary:
      "Historical concept reference; not a claim that robotics products are currently offered.",
    orientation: "portrait",
  },
  {
    slug: "gold-platinum-brand-wall",
    title: "Gold and Platinum Brand Wall",
    assetType: "Environmental concept",
    src: "/brand/artemis-gold-platinum-brand-wall.jpg",
    width: 1800,
    height: 1207,
    alt: "Wide Artemis gold and platinum brand wall concept showing graphite and gold archer relief panels in an executive technical environment.",
    role: "Environmental brand reference for premium materials, wall graphics, and executive presentation spaces.",
    usage: "Use as a wide supporting visual for brand-system and experience-system sections.",
    boundary:
      "Concept environment only; use with implementation and proof language so it does not read as an unrelated product promise.",
    orientation: "landscape",
  },
] satisfies BrandVisualAsset[];

export const featuredBrandVisualAsset = brandVisualAssets[0];
