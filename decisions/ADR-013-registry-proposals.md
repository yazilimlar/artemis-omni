# ADR-013 - Registry Proposals via GitHub Pull Request

- **Status:** Accepted
- **Date:** 2026-10-01
- **Extends:** ADR-006, ADR-011, ADR-012

## Context

`ENGINEERING/PRODUCT_REGISTRY.yaml` is canonical in git. Every change so far has gone
through a reviewed pull request (#69, #73). `/control` (ADR-011) shows the registry
read-only, and ADR-012 added roles. Neither ADR authorizes the web app to write anything.

Milestone M5 lets an authenticated owner propose a registry change from the web app
without using git directly. The registry must stay canonical in git, and no database
copy is created.

Facts that constrain the design, verified 2026-10-01:

- `yazilimlar/artemis-omni` is a **public** repository. Branch names and PR bodies are
  world-readable and permanent.
- `main` is protected by a repository ruleset that blocks direct update, creation,
  deletion and non-fast-forward pushes. The **Repository admin role has bypass mode
  `always`**, so an admin-owned token can push to `main` directly.

## Decision

Authenticated users with role `owner` may submit registry change proposals from
`/control/propose`. Each proposal opens a pull request against `main` through the GitHub
REST API. **A human reviews and merges every proposal. The web app never writes to
`main`.**

### Who may propose

- The ADR-011 gate (session plus email allowlist) applies first. After that, the ADR-012
  profile must have role `owner`. `role` is not user-writable (ADR-012).
- Users with any other role, or no profile, see the form disabled with the message
  "Only owner role can submit registry proposals."
- The role is re-checked on the server for every submission, not only when the page
  renders.

### Scope of a proposal (v1)

- One field on one existing product per proposal.
- Allowed fields:
  - `visibility`, `lifecycle`, `maturity`: values from `status_definitions` in the
    registry, plus `UNREVIEWED`;
  - `canonical_route`: a path starting with `/`, `null`, or `UNREVIEWED`.
- No schema changes, new products, deletions or bulk edits.
- **The PR diff must change only the target field.** If re-serializing the YAML would alter
  any other line, including comments or folded scalars, the proposal is rejected and no
  PR is opened. The implementation chooses the comment-preserving YAML approach.
- The file is updated using the blob SHA it was read at, so a concurrent change to the
  registry makes the write fail instead of overwriting it.

### Secrets and execution

- **Token:** a fine-grained GitHub token with `contents: write` and
  `pull_requests: write` on `yazilimlar/artemis-omni` only, stored in Vercel as
  `GITHUB_PROPOSAL_TOKEN` (type Secret, all environments). It never gets a `NEXT_PUBLIC_`
  prefix and is never sent to the browser. The owner creates it; AI tools do not (ADR-004).
  It must have an expiry date and be rotated before it expires.
- **Server-side only:** all GitHub API calls run in a Server Action or Route Handler, in a
  server-only module.
- **Fail closed:** a missing token or any non-2xx GitHub response aborts the proposal with
  an error. Nothing is retried silently.

### Precondition: the token must not be able to bypass `main` protection

Proposals stay disabled until the token's identity cannot write `main` directly. One of
these must hold before `GITHUB_PROPOSAL_TOKEN` is set in any environment:

1. the ruleset's Repository admin bypass mode is changed from `always` to `pull_request`,
   so admins can bypass only when merging a PR, not by pushing; or
2. the token belongs to an identity that is not a bypass actor, such as a GitHub App
   installation or a non-admin machine account with write access.

The implementation PR must record which option was chosen and how it was verified.

### Audit

Every proposal PR body records:

- the submitter's Supabase **user id** and role. **Not the email:** the repository is
  public, so PR bodies would publish personal addresses (see the backlog cleanup in
  7316c13);
- the UTC submission timestamp;
- the blob SHA of the registry file the proposal was based on;
- the product id, field, old value → new value, and the reason;
- the proposed diff;
- a link back to `/control`.

The branch name is `proposal/{user-id-prefix}-{productId}-{timestamp}`, with no email or
email slug. The commit message cites the proposal source and this ADR.

### Rate limit

One open proposal per user per product at a time. The check uses open PRs whose head
branch matches that user and product prefix.

## Consequences

- Owners can propose registry changes without git, and review stays mandatory.
- The app holds a write-capable credential for the first time. Its blast radius is limited
  by the fine-grained scope, the ruleset precondition, and server-only execution.
- PR review on GitHub stays the single approval point, and CI runs on every proposal.
- The implementation needs a comment-preserving YAML library or an equivalent targeted
  edit. Choosing it, and any new dependency, belongs to the implementation PR.

## Non-goals

This ADR does not:

- write the registry directly or auto-merge proposals;
- allow schema changes, new products or product deletion;
- provide user or role management;
- support bulk or multi-field proposals;
- store proposals in a database;
- create or hold the GitHub token.
