import hemerocallisSpecimen from "@/data/rainbow/specimens/hemerocallis-fulva.json";
import hemerocallisEngineeringTheme from "@/data/rainbow/themes/hemerocallis-fulva-summer-engineering.json";
import type { RainbowSpecimen, RainbowTheme } from "@/data/rainbow/types";

export type {
  RainbowAssetStatus,
  RainbowAssetWorkflowStatus,
  RainbowColorToken,
  RainbowKnowledgeLayerStatus,
  RainbowRecordStatus,
  RainbowSourceStatus,
  RainbowSpecimen,
  RainbowTheme,
  RainbowThemeMode,
} from "@/data/rainbow/types";

export const rainbowSpecimens = [
  hemerocallisSpecimen as RainbowSpecimen,
];

export const rainbowThemes = [
  hemerocallisEngineeringTheme as RainbowTheme,
];

export const rainbowSpecimenSlugs: Record<string, string> = {
  "hemerocallis-fulva": "RB-2026-00071",
};

export function getRainbowSpecimenById(
  specimenId: string,
): RainbowSpecimen | undefined {
  return rainbowSpecimens.find((specimen) => specimen.specimen_id === specimenId);
}

export function getRainbowSpecimenBySlug(
  slug: string,
): RainbowSpecimen | undefined {
  const specimenId = rainbowSpecimenSlugs[slug];

  if (!specimenId) {
    return undefined;
  }

  return getRainbowSpecimenById(specimenId);
}

export function getRainbowThemesForSpecimen(
  specimenId: string,
): RainbowTheme[] {
  return rainbowThemes.filter((theme) => theme.specimen_id === specimenId);
}

export function getRainbowPublicationBlockers(
  specimen: RainbowSpecimen,
): string[] {
  return specimen.qa.blockers ?? [];
}
