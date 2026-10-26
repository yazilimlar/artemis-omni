# Owner Decision D-01 — Architecture Authorization Record v0.1

**Recorded from owner instruction in ChatGPT, 2026-10-26.**
**Decision:** APPROVED FOR ARCHITECTURE AND SYNTHETIC DEVELOPMENT ONLY.
**Scope:** Supabase-first single-source-of-truth architecture: PostgreSQL for structured entity/document/relationship/approval metadata, private Supabase Storage for future original documents, and independent encrypted backup with verified restoration. Modular adapters; Google Drive/Paperless-ngx optional future integrations, not authoritative stores by default.
**Explicit restrictions:** No confidential original intake, real account linking, live processor/bank import, production deployment, RLS/storage/security signoff, tax filing, legal determination, or mainline merge authorized by this decision. All real-data workflows remain blocked until independent authentication, RLS, tenant isolation, storage access, audit, backup/restore and privacy verification pass and owner approves the relevant gate.
**Decision hygiene:** This records a user-stated architecture preference; it is not cryptographic identity proof, legal signature, or operational approval. D-02 remains pending. Do not infer ownership, entity structure, or account access.
**Next:** Muse updates D-01 in the decision register with a reference to this record and creates a synthetic-only security and recovery acceptance test plan. No environment provisioning or access-control changes unless separately authorized.
