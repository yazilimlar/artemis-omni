# ADR-009 - Great Order Operator Relationship

- **Status:** Accepted (operational). Legal review deferred.
- **Date:** 2026-10-01
- **Extends:** ADR-006, ADR-008

## Context

The Phase 1 inventory (PR #67, unknown U1) recorded that Great Order (greatorder.org) is
referenced as an organization, and that Prime Industrial ERP is operated for Great Order
and serves Great Order's clients. Neither `ENGINEERING/DIVISION_REGISTRY.yaml` nor
`ENGINEERING/PROJECT_GENOME.yaml` records this relationship. The `prime-industrial-erp`
registry entry lists `great_order_relationship_requires_adr` as a known blocker.

Repository evidence: the standalone Prime ERP page under `public/prime-erp/` describes
syncing orders from a Squarespace Commerce store at greatorder.org. PR #59 prepared a
persistent backend, so ADR-004 applies to that product.

## Decision

Great Order is an operator organization. It is not an Artemis division.

- Prime Industrial ERP is operated for Great Order and serves Great Order's clients.
- Governance of Prime Industrial ERP stays under Artemis ownership, through the registries,
  ADRs and review rules in ADR-005 and ADR-006.
- Under ADR-008, Prime Industrial ERP stays an `internal_product` that has an operator
  relationship.
- In the Product Registry, the relationship is recorded with an `operator: great_order`
  field on the Prime Industrial ERP entry.
- This ADR documents the relationship operationally. Further legal and organizational
  questions are deferred.

## Consequences

- Great Order must not be added to the Division Registry or treated as an Artemis brand.
- Great Order's operational data is subject to ADR-004 and to the data-boundary rule in
  ADR-008. The Prime Industrial ERP data boundary stays `to_be_confirmed` (inventory U3)
  until the owner confirms it.
- `operator` is one of the proposed schema additions listed in
  `ENGINEERING/PRODUCT_REGISTRY.yaml`. Today it is recorded only as a comment. The field
  is applied in the registry refinement PR.
- Once that field is applied, the `great_order_relationship_requires_adr` blocker can be
  cleared.

## Non-goals

This ADR does not:

- establish any legal entity, contract, liability or ownership arrangement;
- modify any registry YAML;
- change any route, code, credential or deployment;
- confirm the Prime Industrial ERP data boundary.
