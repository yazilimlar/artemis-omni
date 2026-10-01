# ADR-008 - Client Work as a First-Class Concept

- **Status:** Accepted
- **Date:** 2026-10-01
- **Extends:** ADR-004, ADR-006

## Context

The Phase 1 inventory (PR #67, item C13) found client and third-party brand work in the
repository alongside Artemis products. ADR-006 defines divisions, products, shared
capabilities and Labs, but it has no concept for work done for, operated for, or branded
by another party. The owner recorded these classifications in PR #67:

| Item | Recorded classification |
|---|---|
| Pınar Evleri | `client_or_owner_related`; `data_boundary: to_be_confirmed` |
| LEVARA L28 / Artemis Nomad | `internal_asset` (`reference_demo`); external brand Levara (manufacturer) referenced, not owned |
| Exemplary Contractor | `internal_asset` (`placeholder_persona`); a placeholder, not a client |
| Prime Industrial ERP | `internal_product`; `operator: great_order`; external end customer |

The registry stores these only as comments, because the schema has no fields for them
(see the proposed schema additions in `ENGINEERING/PRODUCT_REGISTRY.yaml`).

## Decision

Client work is a first-class concept in Artemis.

### Ownership buckets

Every product or asset declares one ownership bucket:

- `internal_product`: an Artemis product;
- `internal_asset`: an Artemis-owned demo, reference, persona or personal project;
- `client_or_partner_work`: **new.** Work built for, operated with, or owned by a client
  or partner. It is distinct from `internal_product` and `internal_asset`.

Subclasses such as `reference_demo`, `placeholder_persona`, `personal_demo` and `demo`
remain subclasses, not buckets.

### Recorded owner decisions apply

The PR #67 classifications in the table above apply as recorded. In particular:

- an external brand that is referenced, such as Levara, is not owned by Artemis and
  must not be presented as an Artemis brand;
- a placeholder persona such as Exemplary Contractor is not a client relationship;
- Prime Industrial ERP stays an `internal_product`, with its operator relationship
  governed by ADR-009.

### Requirements for client work

Anything in the `client_or_partner_work` bucket requires:

1. an explicit `data_boundary`. While it is `to_be_confirmed`, the item's classification
   stays `UNREVIEWED`, following the PR #67 classification rule;
2. a signed relationship record before it is promoted beyond its current visibility;
3. compliance with ADR-006: it must not import another product's private data or
   implementation, and other products must not import its private data;
4. compliance with ADR-004 for any credentials, tokens or persistent client data.

### Open items

- PR #67 recorded Pınar Evleri as `client_or_owner_related`, a value that predates this
  ADR. Mapping it to `client_or_partner_work` is left to the registry refinement PR and
  needs owner confirmation.
- Where the signed relationship record is stored is not decided. It must not be committed
  if it contains confidential terms or personal data.

## Consequences

- Client and partner work can be identified and reviewed separately from Artemis products.
- Pınar Evleri stays `UNREVIEWED` until its data boundary is confirmed and a relationship
  record exists.
- The registry schema needs an ownership-bucket field. Adding it is a later governance
  change.

## Non-goals

This ADR does not:

- modify any registry YAML or apply the proposed schema fields;
- change any route, code or publication state;
- confirm any data boundary;
- define commercial, contractual or legal terms with any client or partner.
