# M2.8 D-02 Clarification — AgoraXAI Platform Participation R01

**Status:** OWNER-DESCRIBED BUSINESS MODEL; D-02 LEGAL CLASSIFICATION STILL PENDING.
**Date:** 2026-10-26.

Owner clarification: AgoraXAI hosts multiple independent "agoras" and supports their online presence, marketing, strategy, and software development. Apolloa is an independent agora participant, analogous to an independent seller on a marketplace, not an owned subsidiary or subordinate business unit by virtue of participating.

Apolloa's industry scope includes food and beverage import/export, consulting, apparel design, and other activities. AgoraXAI platform participation does not establish equity ownership, legal identity, beneficial ownership, agency, common tax classification, revenue share, liability assumption, or right to bind another participant. Apolloa's legal entity registration, IP ownership, contract parties, tax treatment, and precise platform agreements remain UNKNOWN until evidenced.

**Required model change:** Separate `Platform`, `AgoraParticipant`, `LegalEntity`, `Brand`, `Industry`, `Capability`, `ServiceProvider`, and `Contract` roles. A single entity/brand may play multiple roles. Add a typed `participates_in_platform` relation distinct from `owns_equity_in`, `owns_ip`, `provides_services_to`, and `has_contract_with`. Each relation carries evidence, confidence, status, effective dates, tenant and legal-entity scope.

**Draft diagram:**
- AgoraXAI — platform hosting and support ecosystem
- Apolloa — independent participant agora; food/beverage trade, consulting, apparel design
- Other agoras — independent participants, no identities assumed
- ARTEMIS — possible technology/service provider to AgoraXAI (separate relation, not platform ownership)
- Great Order LLC — provisional legal/operating anchor, legal scope and ownership unverified

**Do not** depict Apolloa as a child company of AgoraXAI, or treat independent participant as proof of separate incorporation. Do not infer any ownership percentages. Revise entity/relationship register v0.2 and three-view visualization (ownership/control, platform participation/capabilities, contracts/financial flows) after review. No operational changes, production deployment, live integrations or private-document intake authorized.
