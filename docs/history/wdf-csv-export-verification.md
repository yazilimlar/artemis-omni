# WDF CSV export verification

Scope: fix/wdf-csv-export-verification from clean main c1e17789634d54fa9137e396ce91c9418991a355. Sole writer in isolated cloud clone. Infrastructure-construction / CivicBid; public-safe prototype; mixed explicit public official data and user scenarios. Only this lab's export helpers, focused tests and this record change. Existing page executor/publication authorization applies. No shared system, permission or data changes.

Observed: the cloud browser renders the prior "Exported 51 opportunities" toast but does not report a completed download, both framed and standalone. No app console error. This is not proof of failure in ordinary user browsers; browser download completion remains unverified.

Improvement: radar and award exports open one dialog with a real user-activated Download CSV link and a read-only, selectable CSV fallback. Blob URLs remain valid until dialog close, rather than expiring after 4–5 seconds. Status says prepared/requested and never claims the file was saved. Shared CSV escaping prefixes formula triggers without dropping their first character and preserves quotes, commas and newlines. No external upload, storage bridge or sandbox weakening.

Verification: unit checks for field preservation, quoting and honest/manual download UI. Build, preview rendering and browser download verification recorded in PR. Do not describe a successful download until actual file completion is observed.
