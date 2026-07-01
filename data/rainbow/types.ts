export type RainbowSourceStatus =
  | "verified"
  | "historical"
  | "traditional"
  | "interpretive"
  | "needs_source"
  | "not_applicable";

export type RainbowRecordStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "archived";

export type RainbowAssetWorkflowStatus =
  | "not_started"
  | "draft"
  | "review"
  | "approved"
  | "published";

export type RainbowKnowledgeLayerStatus =
  | "not_started"
  | "draft"
  | "review"
  | "approved"
  | "published";

export type RainbowRange = {
  min?: number;
  max?: number;
  unit?: string;
};

export type RainbowAssetStatus = {
  status: RainbowAssetWorkflowStatus;
  version?: string;
  path?: string;
  notes?: string;
};

export type RainbowSpecimen = {
  schema_version: "1.0.0";
  specimen_id: string;
  record_status: RainbowRecordStatus;
  identity: {
    scientific_name: string;
    authority?: string;
    primary_common_name: string;
    spectrum_designation: string;
    classification_tags?: string[];
  };
  taxonomy: {
    kingdom: string;
    clade?: string;
    order: string;
    family: string;
    genus: string;
    species: string;
    synonyms?: string[];
    taxonomic_notes?: string;
  };
  names: {
    common: string[];
    regional?: string[];
    historical?: string[];
    indigenous?: {
      name: string;
      language_or_community: string;
      source_status: RainbowSourceStatus;
    }[];
    pronunciation?: string;
    etymology?: string;
    source_status: RainbowSourceStatus;
  };
  observation: {
    capture_year: number;
    capture_dates?: string[];
    observer_role: string;
    capture_set: string[];
    source_photo_count?: number;
  };
  location: {
    privacy_level:
      | "private_exact"
      | "rounded_public"
      | "regional_public"
      | "withheld";
    public_location_label: string;
    native_range?: string;
    naturalized_range?: string;
    usda_zones?: string;
    habitat?: string;
    soil?: string;
    hydrology?: string;
    atlas_status:
      | "not_started"
      | "placeholder"
      | "mapped_private"
      | "public_safe"
      | "published";
  };
  morphology: {
    growth_habit?: string;
    height_cm?: RainbowRange;
    spread_cm?: RainbowRange;
    flower_diameter_cm?: RainbowRange;
    flower_duration?: string;
    diagnostic_features?: string[];
    measurement_status?: RainbowSourceStatus;
  };
  phenology: {
    bloom_season?: string;
    current_bloom_stage?: string;
    annual_observations?: {
      year: number;
      first_bloom_date?: string;
      peak_bloom_date?: string;
      note: string;
    }[];
  };
  ecology: {
    pollinator_value?: string;
    known_pollinators?: string[];
    companion_species?: string[];
    wildlife_interactions?: string[];
    ecological_notes?: string;
    source_status?: RainbowSourceStatus;
  };
  engineering: {
    root_architecture?: string;
    soil_stabilization?: string;
    water_management?: string;
    urban_resilience?: string;
    geometry?: string;
    biomimicry_notes?: string;
    claim_status?: RainbowSourceStatus;
  };
  knowledge_layers: {
    layer: string;
    status: RainbowKnowledgeLayerStatus;
    summary?: string;
    source_status: RainbowSourceStatus;
  }[];
  assets: Record<string, RainbowAssetStatus | undefined>;
  ai_metadata: {
    identification_confidence?: number;
    candidate_species?: string[];
    vision_model_notes?: string;
    color_analysis_status?: string;
    health_score?: number;
    model_reviewers?: string[];
  };
  references: {
    title: string;
    url?: string;
    note?: string;
    source_status: RainbowSourceStatus;
  }[];
  qa: {
    privacy_checked: boolean;
    claims_checked: boolean;
    accessibility_checked?: boolean;
    visual_assets_checked?: boolean;
    human_approved: boolean;
    blockers?: string[];
  };
  revision_history: {
    date: string;
    change: string;
    actor?: string;
  }[];
};

export type RainbowThemeMode =
  | "overview"
  | "scientific"
  | "engineering"
  | "heritage"
  | "ecology"
  | "atlas"
  | "art"
  | "social";

export type RainbowColorToken = {
  name: string;
  hex: string;
};

export type RainbowTheme = {
  schema_version: "1.0.0";
  theme_id: string;
  specimen_id: string;
  mode: RainbowThemeMode;
  palette: {
    background: RainbowColorToken;
    surface: RainbowColorToken;
    surface_alt?: RainbowColorToken;
    text: RainbowColorToken;
    muted_text?: RainbowColorToken;
    primary: RainbowColorToken;
    secondary: RainbowColorToken;
    accent: RainbowColorToken;
    line: RainbowColorToken;
    focus: RainbowColorToken;
    warning?: RainbowColorToken;
  };
  extracted_colors?: {
    role: string;
    name: string;
    hex: string;
    source: string;
    confidence?: number;
  }[];
  habitat: {
    theme_name: string;
    texture?: string;
    map_style?: string;
  };
  season: {
    state: "spring" | "summer" | "autumn" | "winter" | "unknown";
    phenology_state?: string;
    time_of_day_variant?: string;
  };
  typography: {
    heading_style?: string;
    body_style?: string;
    technical_style?: string;
    label_style?: string;
  };
  blueprint?: {
    background?: RainbowColorToken;
    drafting_line?: RainbowColorToken;
    dimension_line?: RainbowColorToken;
    grid?: RainbowColorToken;
  };
  heritage?: {
    style?: string;
    paper?: RainbowColorToken;
    ink?: RainbowColorToken;
    texture?: string;
  };
  accessibility: {
    contrast_checked: boolean;
    minimum_body_contrast?: number;
    reduced_motion_supported: boolean;
    notes?: string;
  };
};
