# Milestone — CivicBid SourceLedger Command Deck

- **Version name:** CivicBid SourceLedger Command Deck
- **Date:** 2026-07-09
- **Route:** `/labs/civicbid-sourceledger-command-deck`
- **Branch:** `feature/civicbid-sourceledger-command-deck`
- **Status:** Labs experiment · public-safe sample cockpit

## Why it exists

The prior CivicBid Signal Forge page was strategically strong but visibly weak: the public
product area could stop at "Scanning public bid signals…", which read as a dead scanner.
SourceLedger Command Deck replaces that failure mode with a deterministic, fully rendered
cockpit built on clearly labeled sample data. It explains source confidence, bid readiness,
compliance friction, and the next bid-room action for every signal — with zero client-side
fetching, so the page can never render an empty or loading state.

## Review comments addressed

1. The original page had a strong concept and compliance posture — preserved.
2. The visible cockpit proof was insufficient — the deck now renders complete sections
   (source ledger, radar, scoring explainer, friction map, actions) on first paint.
3. The "Scanning public bid signals…" state weakened credibility — removed entirely; the
   page is a static server component with no loading states.
4. The page needed deterministic sample fallback data — all data is inline, deterministic,
   and labeled "Sample mode / not a certified live bid feed".
5. The source-health layer needed to be more visible — the Source Ledger section leads the
   cockpit, with method, role, mode, confidence basis, and human review boundary per source.
6. The readiness score needed explainability — the weight formula is rendered on the page
   (30% urgency, 25% documents, 20% source confidence, 15% construction fit, 10% compliance
   clarity) plus a per-row "Why this score" line.
7. The page needed bid-room actions, not just intelligence — six illustrative (disabled)
   bid-room actions with an explicit demo note.
8. Signal Forge and Intelligence Bridge needed clearer separation — a three-way version
   comparison section links all three routes and states each one's role.
9. External reviews included useful themes, but some claims were not supported — those
   claims were deliberately excluded (see anti-claim policy below).

## Product boundary

- Official portals remain authoritative. The deck is decision support only.
- Not legal advice, compliance certification, or a bid-submission system.
- Not a substitute for PASSPort, agency portals, bid documents, estimator judgment,
  counsel review, or contracting officer instructions.
- No logins scraped, no credentials used, no automated portal submission.
- Every friction check is a human-review gate, not an automated pass/fail.

## Public-safe data policy (anti-claim rules)

The page must never include: testimonials, pricing, "200+ contractors" or similar adoption
claims, early-access modal behavior, proprietary trained models, "thousands of sources",
live scraping, credential use, login scraping, automated portal submission, live API
coverage claims (unless implemented and verified), performance metrics or SLA claims,
customer names, private project data, or API keys/secrets. Sample data is deterministic and
labeled; it is not a certified live bid feed.

## What changed from Signal Forge

| Aspect | Signal Forge | SourceLedger Command Deck |
| --- | --- | --- |
| Rendering | Client components with panel switcher | Static server component, no client state |
| Data | Sample library via shared lib | Deterministic inline sample rows |
| Failure mode | Could show loading/empty states | Cannot — everything renders on first paint |
| Source health | Panel inside cockpit | Leading Source Ledger section with review boundaries |
| Scoring | Formula in a panel | Formula + per-row "Why this score" explainability |
| Actions | None | Six illustrative bid-room actions (disabled demo) |
| Lineage | Standalone | Explicit three-version comparison with links |

## What must be verified before production

- Live Socrata coverage (Current Solicitations, City Record) — implement, verify uptime and
  schema stability before claiming live data.
- Checkbook NYC XML schema normalization.
- Document custody workflow with the official PASSPort path (manual, human-driven).
- Scoring weights validated against real pursuit outcomes with a pilot team.
- Compliance extraction accuracy reviewed by counsel/compliance staff.
- Human review workflow (bid captain assignment, go/no-go gates) agreed with the pilot team.

## Next upgrade path

1. Pilot: 3 agencies, 5 connectors, 25 watchlist opportunities, weekly pursuit briefing.
2. Wire bid-room actions to approved workflows behind human review gates.
3. Re-introduce verified live feeds with health telemetry (never silently degrade to a
   spinner — always fall back to labeled sample mode).
4. Lifecycle Watch data from Checkbook NYC / PASSPort Public once schemas are normalized.
5. Hand off awarded pursuits into Artemis execution, cost, forecast, and cashflow controls.
