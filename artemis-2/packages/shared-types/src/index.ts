export type ProductStatus = "concept" | "pilot" | "active" | "retired";
export type ProductTier = "explore" | "free" | "self-service" | "pilot" | "professional" | "enterprise" | "sponsor";
export type LeadStatus = "new" | "qualified" | "contacted" | "converted" | "closed";
export type ContactChannel = "email" | "sms" | "whatsapp" | "phone";
export type ConsentPurpose = "inquiry-response" | "transactional-email" | "marketing-email" | "sms" | "whatsapp" | "phone" | "analytics";

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  department: string;
  status: ProductStatus;
  tiers: ProductTier[];
  canonicalUrl: string;
  updatedAt: string;
}

export interface AttributionRecord {
  sessionId: string;
  landingPath: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  capturedAt: string;
}

export interface ConsentRecord {
  id: string;
  subjectId: string;
  purpose: ConsentPurpose;
  granted: boolean;
  sourceUrl: string;
  policyVersion: string;
  consentTextVersion: string;
  recordedAt: string;
  revokedAt?: string;
}

export interface LeadRecord {
  id: string;
  reference: string;
  status: LeadStatus;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  productSlug?: string;
  requestType: "question" | "demo" | "pricing" | "pilot" | "partnership" | "support";
  message: string;
  preferredChannel: ContactChannel;
  attribution?: AttributionRecord;
  createdAt: string;
  updatedAt: string;
}
