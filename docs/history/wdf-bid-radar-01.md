# WDF Bid Radar 01 publication

Branch: labs/bid-radar-wdf-01. Baseline: 67048e539665b926c1aa1ddf018829a43a05f5a1.
Division: infrastructure-construction. Product family: civicbid (additional prototype, not a replacement canonical product). Lifecycle: prototype. Maturity: public-safe demo. Visibility: public URL, noindex. Data mode: mixed explicit public official snapshots/live browser refresh and user assumptions. Change type: scoped lab publication.

Owner requested publication at /labs/bid-radar-wdf-01 and explicitly authorized this task's executor and reviewed deployment workflow. The isolated clone owns only this concern. Open PR file lists checked; no overlap with these paths.

Scope: new full-screen iframe route, public/standalone/bid-radar-wdf-01 assets, one appended standalone sandbox entry, focused tests and this record. No existing route, canonical product, private data, auth, environment, DNS, dependency or unrelated configuration changes. ADR-001/004/005/006/010/014 and the current standalone-lab isolation implementation govern this addition.

Donor: approved WDF Intelligence Studio v5 preview deployment dpl_GBXMwuBdnsyuys2zY16S8KzqrNPm. Only the shipped runtime, dated public datasets and licensed self-hosted variable fonts were selectively recovered. Vercel's injected preview feedback script was removed. Original Artemis/CivicBid and Vercel previews remain unchanged.

Isolation: registry sandbox with scripts, downloads, dialogs and official-source popups, never same-origin. Assets receive existing response-level sandbox/CORS headers. No cookie/session access or storage bridge. Scenario entries remain in memory and clear on reload; export before leaving. URL mutation errors from opaque origins are caught. Manual intake uses a validated button handler rather than form submission. No private WDF material is deployed.

Data: 2,663 NYC City Record construction-related Award notices, 2021–2026, retrieved November 11, 2026, plus 51 solicitation notices. Award amounts are published notice values, not unique contracts or spending; 65 repeated agency/PIN groups disclosed. Publication dates are not legal award dates. Source refreshes are user-triggered; API/network failure retains the dated snapshot, never inventing records. Private/Westchester/MTA/Port Authority feeds not integrated. All price/probability/economic scenarios are user assumptions.

Verification: recorded in the PR after typecheck, lint, unit tests, build and deployed browser checks. Public-domain verification follows reviewed merge. Known baseline standalone-isolation test failures must be reported separately, never silently patched as part of this concern.

Local verification (2026-11-11): typecheck PASS; lint PASS; full optimized build and scene budgets PASS using non-secret placeholder public Supabase values for existing auth-page prerender. New WDF tests 3/3 PASS. Full suite: 268 pass / 3 fail; clean baseline: 265 pass / same 3 fail (pre-existing hard-coded standalone frame count, unrelated Three.js import map and CDN SRI checks). Independent read-only source review found one unguarded filter history mutation; fixed. CORS headers cover modules, fonts and snapshots. Preview browser QA still required before release.
