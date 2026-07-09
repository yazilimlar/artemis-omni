# Handover — CivicBid SourceLedger Command Deck

Branch: `feature/civicbid-sourceledger-command-deck`
Route: `/labs/civicbid-sourceledger-command-deck`

## Files created

- `app/labs/civicbid-sourceledger-command-deck/page.tsx` — the entire cockpit. Static
  server component, no client state, no API calls, all sample data inline as constants.
- `docs/milestones/2026-07-09-civicbid-sourceledger-command-deck.md` — milestone record.
- `docs/handoffs/civicbid-sourceledger-command-deck-claude-handover.md` — this file.

## Files intentionally NOT changed

- `app/labs/civicbid-signal-forge/page.tsx` and `components/labs/civicbid/*` — the revised
  Signal Forge work is preserved as-is (its own deterministic-sample refactor predates this
  branch and remains untouched by this feature).
- `/labs/civicbid-intelligence-bridge` — not present in this checkout; production copy
  untouched.
- All existing Labs routes and Artemis positioning files.

## How to run

```bash
npm install        # if needed
npm run dev
# open http://localhost:3000/labs/civicbid-sourceledger-command-deck
```

## How to validate

```bash
npm run lint
npm run typecheck
npm run build
```

Manual checks:

- The page renders completely with no loading spinner or empty state (it is static).
- "Sample mode" labels visible in the Signal Radar section.
- All four Source Ledger cards show method / role / mode / confidence basis / boundary.
- Readiness formula section shows the five weights and the "not an award prediction" note.
- Six bid-room action buttons are visibly disabled with the demo note underneath.
- Version comparison links to `/labs/civicbid-intelligence-bridge` and
  `/labs/civicbid-signal-forge` work.
- Responsive: cards stack at mobile widths; no horizontal page scroll.

## What NOT to claim

Never add: testimonials, pricing, contractor counts ("200+ contractors"), early-access
modals, proprietary trained models, "thousands of sources", live scraping, credential use,
login scraping, automated portal submission, live API coverage (until implemented and
verified), performance/SLA metrics, customer names, private project data, or secrets.
The phrase "no login scraping" in the disclaimer is compliance language, not a capability
claim — keep it.

## Remaining tasks

- [ ] Decide whether the Signal Forge revisions (currently uncommitted working-tree changes
      on the parent branch) should be committed separately.
- [ ] Add the deck to the Labs listing (`lib/artemis/proofLibrary.ts`) if it should be
      discoverable rather than link-only.
- [ ] Wire "Request CivicBid Pilot" CTA to a dedicated intake if `/contact` is not final.
- [ ] Pilot scoping per the milestone doc before any live-data claims.

## Suggested deployment steps

1. This checkout (`Desktop/motion graphic/artemis-omni`) is a stale fork of production.
   The canonical production repo is `~/Documents/artemis-for-codex/artemis-omni-codex-local`
   (production = lineage of commit `0fa1338` + `ed92e64`). Port this page there before any
   production deploy — it is a single self-contained page file plus two docs, so the port
   is a straight copy.
2. Deploy a Vercel preview first (`vercel deploy` from the linked repo), verify the route
   and both comparison links, then promote to production (`vercel deploy --prod`).
3. Never deploy `--prod` from this Desktop checkout — it would remove production-only
   routes (Intelligence Bridge, Kings Highway, Troy Time Atlas, and others).
