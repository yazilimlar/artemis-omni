# M2.8.1 Decision and Evidence Gates R01

| Field | Value |
|---|---|
| Document ID | M281-GATES-01 |
| Status | DRAFT_ASSUMPTION — SYNTHETIC ONLY |
| Date | 2026-10-26 |
| Integrator | Muse (Lead Integrator), incorporating the Gemini challenger gates (annex `M281_GEMINI_REGULATORY_REVIEW_R01.md`, notes 10–14) |
| Canonical base | `feature/tax-intelligence-m28-documentation-foundation-r1` @ `63864c8609f8` |
| Authorisation | Nothing in this document authorises formation, filing, registration, contracting, collection of originals, or any status upgrade |

## 1. Standing gates (carried, unchanged)

- **U1–U4 remain UNKNOWN.** No AI text, template, or received-looking document upgrades them; only owner Decision entries + evidence do (Decision Register hygiene, D-03).
- **D-01** authorises Supabase-first **architecture and synthetic development only**. Private evidence intake, RLS/security signoff, real account linking, and production deployment remain **blocked**.
- **D-02** is partially resolved: Apolloa's pre-registration status and independent-agora role are owner-confirmed; legal form, jurisdiction, and equity remain **pending owner decision**.
- **No status upgrade on formation alone.** Filing articles, obtaining an EIN, opening a bank account, or filing a DBA — singly or together — upgrades **none** of: importer status, FSVP compliance, sales-tax vendor status, insurance coverage, IP ownership, or agora-participation-to-equity.

## 2. Minimum owner inputs (Phase A — required before any option can be costed or chosen)

Until items 1–7 are supplied, the decision matrix is published as duties + verified fixed fees only, with totals marked **NOT COSTABLE**.

1. **NY office county** (drives publication newspapers/price) — and DE/NJ county equivalents if any.
2. **Actual operating footprint by state**: where people, inventory, packing/storage, and customers/deliveries will be (drives qualification, nexus, stacking).
3. **First activity + date**: food/beverage import, taxable product sales, consulting, or apparel — and whether any Apolloa-branded activity has **already** occurred, and by whom (drives the Certificate-of-Authority 20-day clock, FSVP, and actual-operator booking).
4. **Product/SKU class** for first imports/sales (drives FDA/FSVP/labelling, taxability, insurance class).
5. **Expected NY-source gross income band** for year 1 (drives the IT-204-LL band) and expected sales volume (drives sales-tax filing frequency).
6. **Ownership/membership + manager authority + outside-investor intent** (drives operating agreement, DE-vs-NY governance claims, tax classification — all U2). Percentages, if ever recorded, live only in the private store — never in this repository.
7. **Great Order verified status**: legal form, formation/standing evidence, tax classification, authority to operate a trade name (drives whether the DBA option exists at all).
8. **Importer-of-record, FSVP importer, customs broker, and facility list** for any import scenario (these may be different parties).
9. **Registered-agent choice** for DE (and NJ): paid agent vs a qualifying self-agent.
10. **Insurance intent** for food/product liability (premium is underwriting-priced; no honest figure exists without a broker quote on actual products).

## 3. The Apolloa formation task (tracked obligation)

- **Task:** `OBL-APOLLOA-FORMATION` — status **PLANNED**, deadline **UNKNOWN** (no statutory deadline is claimed absent jurisdiction and actual activities).
- **Trigger to move:** owner completes D-02 (entity, jurisdiction, equity, legal operator) after Phase B counsel/CPA comparison on verified facts.
- **On completion, evidence required to create the LegalEntity record:** filed formation instrument (state filing receipt), EIN confirmation, adopted operating agreement, and — where applicable — foreign-qualification filings and publication certificates. The new legal entity is a **new record** linked to the existing Apolloa Brand/AgoraParticipant records; the initiative record is never edited into an entity, and pre-formation history stays attributed to the actual operator (role model §6.4).

## 4. Actual legal operator for any pre-formation activity (hard gate)

For **any** Apolloa-branded activity before formation — a sale, an import, a contract, a marketplace listing — the following must be named and evidenced **before** the activity, or the activity is **blocked** (not "booked to Apolloa pending formation"):

1. The **actual legal operator**: a verified existing legal person (an evidenced legal entity or a named individual). Apolloa itself can never fill this field while pre-registration.
2. That operator's formation/authority evidence and tax classification (EIN held by the operator, never by Apolloa).
3. **Who signs** for the operator, and under what authority document.
4. **Role holders, separately**: importer of record (CBP), FSVP importer (21 CFR 1.500), sales-tax vendor of record — they may be three different answers.
5. **Which books record it**: all pre-formation revenue, expenses, inventory, imports and contracts are booked to the actual operator. Apolloa may appear only as a **non-legal cost-centre / project / brand dimension** — never as entity, counterparty, or taxpayer. Back-dating activity into a later-formed Apolloa entity without a documented assignment/assumption is prohibited.
6. **Collected-tax separation from the first taxable sale**: collected sales tax is booked as a liability of the actual operator, held for the state, never revenue, never commingled or netted; the remitter pathway is recorded as **U1-UNKNOWN** until processor settlement + tax reports distinguish it.

## 5. Evidence required before any legal/tax status upgrade

| Claimed upgrade | Minimum evidence (all in the private store; repo holds refs/status only) | Explicitly NOT sufficient |
|---|---|---|
| Entity formed | State filing receipt for the formation instrument; jurisdiction + legal form as filed | A name reservation, an EIN letter alone, a website, a brand |
| Entity verified | Formation evidence + independent confirmation (state record / certificate of status) | Owner assertion alone (supports `ASSERTED`/`SUPPORTED` at most) |
| Foreign qualification | Application-for-Authority filing receipt + home-jurisdiction Certificate of Existence | Domestic formation in another state |
| Publication complete (NY) | Both newspaper affidavits + filed Certificate of Publication | Having "run the ads" without the filing |
| Equity / ownership edge active | EXECUTED formation/operating/subscription documents for the **target** entity, `SIGNED_VERIFIED`, + APPROVED owner Decision (validator-enforced) | Participation, services, invoices, narrative text, matching names |
| IP ownership edge active | EXECUTED assignment and/or registration record for the specific asset | Brand use, domain control alone, unsigned contributor agreements |
| Legal operator designated | Verified operator entity + owner designation Decision + trade-name filing evidence where the jurisdiction requires it | Provisional-anchor language (D-02), a DBA alone without operator verification |
| Sales-tax vendor | Certificate of Authority issued for the actual operator + activity analysis (TB-ST-175) | LLC formation, an EIN, marketplace presence |
| Importer / FSVP ready | Importer-of-record arrangement + broker/bond as applicable; facility registrations; per-shipment prior-notice process; FSVP program per food + supplier | Any entity formation, in any state |
| Tax classification (U3) | U1 + U2 evidence + CPA determination recorded as a Decision | Any validator output, any AI summary |

## 6. Great Order reliance gate

Any transitional use of Great Order LLC (DBA or operator) requires, **before reliance**: verified formation and good standing, operating-agreement authority for the activity, tax classification, and an **executed** (not templated) arrangement naming the real legal party for Apolloa-branded activity. Provisional-anchor language is not evidence. Until then, Option 4 in the decision matrix is **NOT COSTABLE** and no Apolloa activity may be attributed to Great Order either.

## 7. Validator-enforced gates (synthetic scope, this package)

The transition rules above are mechanically enforced for registry records by `lib/tax-intelligence/ecosystem.ts` (see role model §11): formation-evidence gate, per-type activation requirements, EXECUTED-only legal basis with referential integrity, authorised-actor Decision binding, tenant isolation, scope and date integrity, allowlist public serialization — negative-tested (N-01…N-28) with positive controls (P-01…P-08). **Limit (Grok residual risk):** the validator checks record fields; the authenticity of the underlying real-world documents and the identity system feeding actor binding remain process controls behind the D-01 gate, which is still blocked.

---
*DRAFT_ASSUMPTION — SYNTHETIC ONLY — UNAPPROVED. Owner inputs in §2 are the only items blocking Phase B; everything else in this package proceeded without them by design.*
