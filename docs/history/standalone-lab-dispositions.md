# Standalone Lab Dispositions — 2026-10

Closes the standalone-lab security finding from the site audit (#89) and the ADR-014 /
ADR-015 follow-ups. Branch `security/standalone-lab-dispositions`; dispositions confirmed by
the owner at the Step 5 checkpoint, with flag scope revisited once (see "Sandbox tokens").

## The finding

Standalone HTML labs under `public/standalone/` and `public/labs/` ran **same-origin** with
the Artemis site (no iframe `sandbox`), and several loaded Three.js and map libraries from
third-party CDNs (jsDelivr, cdnjs, unpkg) at mixed versions **without integrity pinning**.
Since M3 (ADR-011), Supabase session cookies are JavaScript-readable (`@supabase/ssr` sets
`httpOnly: false`), so an XSS bug in any lab, or a compromised CDN response, could read a
signed-in user's session.

## Mechanism

- **Opaque-origin sandbox, twice.** Every retained lab is isolated by (a) the iframe
  `sandbox` attribute on its `app/` wrapper and (b) a `Content-Security-Policy: sandbox …`
  **response header** on its raw URL — so a *direct* visit to the raw file is isolated too.
  No lab is granted `allow-same-origin`. Verified in Chrome: the lab frame reports
  `self.origin === "null"`.
- **Single source of truth.** `data/standalone-labs.json` lists each lab's paths and tokens;
  `next.config.mjs` generates the headers from it, `lib/standalone-labs.ts` gives the iframes
  the same tokens (unknown ids or tokens fail the build). A strict catch-all
  (`sandbox allow-scripts`) covers any other file under `/standalone/`.
- **CORS for own files.** Sandboxed frames are cross-origin to the site, so raw lab paths
  send `Access-Control-Allow-Origin: *` (public static files) — this keeps same-origin fetches
  (`troy-time-atlas-600bc.kml`, LEVARA `./index.html`) and module loads working.
- **Self-hosted Three.js.** Import maps now point to `public/vendor/three@<ver>/`, served with
  `Cache-Control: public, max-age=31536000, immutable` and CORS.
- **SRI** on every remaining CDN `<script>`/`<link>` (with `crossorigin="anonymous"`).

## Inventory and dispositions

Dispositions: **C** = retain with isolation (iframe sandbox + response CSP), **C-header** =
retain, isolated by response CSP only (no iframe wrapper exists), **D** = retire,
**EXEMPT** = could not be isolated without breaking (see below). No lab needed **A**
(migrate to `sandbox/`).

| # | File (`public/…`) | Served by | External origins (before → after) | Disposition | Sandbox tokens |
|---|---|---|---|---|---|
| 1 | `standalone/tax-architecture-2026.html` | `/labs/tax-architecture-2026` (iframe) | jsDelivr `three@0.164.1` + 2 addons → **self-hosted** | C | `allow-scripts allow-downloads allow-modals` |
| 2 | `standalone/finance-architecture-5d.html` | `/labs/finance-architecture-5d` (iframe) | jsDelivr `three@0.164.1` + 2 addons → **self-hosted** | C | `allow-scripts allow-downloads allow-modals` |
| 3 | `standalone/troy-time-atlas-600bc.html` | `/labs/troy-time-atlas`, `/labs/developmentandtest/troy-time-atlas` | jsDelivr `three@0.160.0` → **self-hosted**; Google Fonts (kept) | C | `allow-scripts allow-downloads` |
| 4 | `standalone/artemis-atlas-kings-highway-v0.html` | `/labs/developmentandtest/kings-highway` | jsDelivr `three@0.160.0` → **self-hosted**; Google Fonts (kept) | C | `allow-scripts allow-downloads` |
| 5 | `standalone/turkiye-atlas.html` | `/labs/turkiye-atlas` | mapbox-gl 3.24.0, leaflet 1.9.4, maplibre-gl 5.24.0 → **SRI on all 6 tags** | C | `allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox` |
| 6 | `standalone/george-aegean-quest.html` | `/labs/george-aegean-quest` | none | C (+ storage patch) | `allow-scripts` |
| 7 | `standalone/levara-l28-financial-twin/{runtime,index}.html` | `/labs/levara-l28-financial-twin` | none | **EXEMPT** | — (same-origin) |
| 8 | `standalone/levara-l28-success-gate-immersive/{index.html,app.js}` | `/labs/levara-l28-success-gate-immersive` | none | C | `allow-scripts` |
| 9 | `standalone/utility-intelligence-bridge/3d-model/index.html` | top-level via rewrite `/labs/utility-intelligence-bridge/3d-model` | none | C-header | `allow-scripts` |
| 10 | `labs/geometric-workbench/v5-8/index.html` | `/workbench/runtime/latest` (iframe on `/workbench/app`) | cdnjs three r128 + jsDelivr OrbitControls 0.128 → **SRI on both** | C | `allow-scripts allow-downloads allow-modals allow-popups` |
| 11 | `labs/artemis-meander/index.html` | URL only (`/labs/artemis-meander/index.html`) | none | C-header | `allow-scripts` |
| 12 | `labs/artemis-meander-classic-archive/index.html` | URL only | none | C-header | `allow-scripts` |
| 13 | `labs/auremeander/index.html` | URL only | — (**0-byte file**) | **D — retired** | — |
| 14 | `labs/rainbow-house-botanical-field-v9.html` | URL only | none | C-header | `allow-scripts` |
| 15 | `labs/rainbow-house-owner-cockpit-m8.html` | URL only | unpkg leaflet, jsDelivr `@turf/turf@7` (unpinned) | **D — retired (privacy)** | — |

Out of scope (not under the two directories): `public/prime-erp/`, `public/civicbid/`,
`public/dayos*/`, `public/rainbow-botanics/`.

### Sandbox tokens

The owner first approved `allow-scripts` only (Troy + `allow-downloads`). A follow-up scan
found that strict flag set would break working features, so the owner approved **per-lab
minimal tokens** matching the features each lab actually uses (no `allow-same-origin`
anywhere):

- `allow-downloads` — CSV export (tax, finance), PNG/JSON exports (workbench, turkiye), KML
  downloads (troy, kings-highway).
- `allow-modals` — print review and copy-URL dialogs (tax, finance), alerts (workbench).
- `allow-popups` — workbench print views opened in new windows; turkiye external links, with
  `allow-popups-to-escape-sandbox` so the opened site is not itself sandboxed.

### Retired (D)

- **`labs/rainbow-house-owner-cockpit-m8.html` — privacy.** The page's saved state embedded a
  **precise residential latitude/longitude** and persisted it to `localStorage`, on a public,
  directly reachable URL. The owner ordered immediate retirement. Verified: the coordinate no
  longer appears anywhere in the working tree.
  - ⚠️ **Residual:** the file remains in **git history** (1 commit, `e7c7fa0`, public
    repository) and in any previous Vercel deployment that served it. Removing it from history
    requires a history rewrite and force-push, which the session protocol forbids without
    explicit owner authorization; consider also purging old deployments.
- **`labs/auremeander/index.html`** — an empty (0-byte) file with no inbound links.

### Exempt — could not be isolated without breaking

- **`standalone/levara-l28-financial-twin/`.** The app is a gzip+base64 payload inside
  `index.html` that `runtime.html` decodes and `document.write`s. The decoded app calls
  `localStorage` **unguarded** (theme initialization, theme switching, evidence checklist) and
  `print()`. Sandboxed, initialization throws `SecurityError: … The document is sandboxed and
  lacks the 'allow-same-origin' flag` (observed in Chrome), so theme, checklist and Print/PDF
  break. It stays same-origin (it loads **no external origins**, so CDN risk is nil; residual
  risk is an XSS bug in its own first-party code). It is excluded from the strict catch-all and
  recorded as `"sandbox": null` with this reason in `data/standalone-labs.json`.
  - **Follow-up:** guard storage inside the payload (decode → patch → re-encode), then sandbox
    with `allow-scripts allow-modals`.

## Before / after (hardened cases)

**Iframe wrappers** (rows 1–6, 8, 10; `app/…/page.tsx`, `WorkbenchVersionShell.tsx`):

```diff
 <iframe
+  sandbox={labSandbox("tax-architecture-2026")}   // e.g. "allow-scripts allow-downloads allow-modals"
+  referrerPolicy="no-referrer"
+  loading="lazy"
   title="…"
   src="/standalone/tax-architecture-2026.html"
   allow="fullscreen; clipboard-write; geolocation"
   allowFullScreen
 />
```

The LEVARA financial-twin wrapper gets `referrerPolicy` and `loading` only (exempt).

**Response headers** (`next.config.mjs`, generated from `data/standalone-labs.json`):

```
/standalone/tax-architecture-2026.html
  Content-Security-Policy: sandbox allow-scripts allow-downloads allow-modals
  Access-Control-Allow-Origin: *
/standalone/:path((?!levara-l28-financial-twin/).*)        # strict catch-all
  Content-Security-Policy: sandbox allow-scripts
/vendor/:path*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
```

Directory rules under `/labs/` and `/workbench/` use `:path+` so they cover the lab files but
not the bare directory URL (e.g. `/labs/artemis-meander` remains the site's unsandboxed 404).

**Import maps** (rows 1–4):

```diff
-{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/"}}
+{"imports":{"three":"/vendor/three@0.164.1/build/three.module.js","three/addons/":"/vendor/three@0.164.1/examples/jsm/"}}
```

The import map stays (the bare `three` specifier needs it); it no longer references a CDN.

**George Aegean Quest** — six direct `localStorage` calls (three at state initialization) now
go through a guarded `safeStore`; with storage blocked the lab starts as a fresh session.

## Self-hosted vendor files (`public/vendor/manifest.json`)

Fetched with `npm pack` (tarball integrity checked against the registry's `dist.integrity`),
and verified **byte-identical** to the jsDelivr files the labs previously loaded.

| Version | Tarball integrity (npm) | File | SHA-256 |
|---|---|---|---|
| 0.160.0 | `sha512-DLU8lc0zNIPkM7rH5/e1Ks1Z8tWCGRq6g8mPowdDJpw1CFBJMU7UoJjC6PefXW7z//SSl0b2+GCw14LB+uDhng==` | `build/three.module.js` | `76dea8151bc9352aef3528b4262e249b2604f62543828328db978d060d61a495` |
| | | `examples/jsm/controls/OrbitControls.js` | `5a44a9e86a2a0fb11933eed69bc2cd33c76a496854c1aed6ed776efa87d7b064` |
| | | `examples/jsm/renderers/CSS2DRenderer.js` | `a4f0f79184c043f6b9d2654d8ba051e49a7d631d34e8f437c1804798a68c379f` |
| 0.164.1 | `sha512-iC/hUBbl1vzFny7f5GtqzVXYjMJKaTPxiCxXfrvVdBi1Sf+jhd1CAkitiFwC7mIBFCo3MrDLJG97yisoaWig0w==` | `build/three.module.js` | `a97ec6852978949b7941c070b81292b842473a37549222353fa0a70c18d7285a` |
| | | `examples/jsm/controls/OrbitControls.js` | `f260591ef315aa04888152e7f121865214e33fb54727145cf4e4445058db1297` |
| | | `examples/jsm/renderers/CSS2DRenderer.js` | `a4f0f79184c043f6b9d2654d8ba051e49a7d631d34e8f437c1804798a68c379f` |

SRI hashes for the remaining CDN tags were computed from the live files (stable across two
fetches; each CDN returns `Access-Control-Allow-Origin: *`); the cdnjs `three.min.js` r128
hash matches the SRI cdnjs publishes.

## Verification

- Real-browser checks via the Chrome DevTools Protocol against `next start` (the Playwright /
  Chrome DevTools MCP servers were unavailable). Each lab frame was attached directly and
  inspected after 25 s of real time:

| Lab page | Frame `self.origin` | Rendered | Exceptions |
|---|---|---|---|
| `/labs/tax-architecture-2026` | `null` | canvas + model UI | none |
| `/labs/finance-architecture-5d` | `null` | canvas + model UI | none |
| `/labs/troy-time-atlas` (+ dev route) | `null` | canvas; "Loaded 19 POIs from runtime KML" | none |
| `/labs/developmentandtest/kings-highway` | `null` | canvas + map labels | none |
| `/labs/turkiye-atlas` | `null` | 2 canvases + mission-control UI | none |
| `/labs/george-aegean-quest` | `null` | projection board + roster | none |
| `/labs/levara-l28-success-gate-immersive` | `null` | canvas + UI | none |
| `/labs/levara-l28-financial-twin` (EXEMPT) | same-origin | renders (screenshot) | none |
| `/labs/utility-intelligence-bridge/3d-model` (header only) | `null` | UI (0 canvases, same as `main`) | none |
| `/labs/artemis-meander/index.html`, `…-classic-archive/index.html`, `…-botanical-field-v9.html` | `null` | UI | none |
| `/workbench/app` | `null` (runtime frame) | UI | `ReferenceError: ARTEMIS_V6 is not defined` — **pre-existing**: identical on unmodified `main` (`./v6-integrity.js` resolves to `/workbench/runtime/v6-integrity.js`, which 404s) |

- An early run with Chrome's `--virtual-time-budget` showed Troy blank; a side-by-side against
  an unmodified `main` worktree and a DevTools-Protocol run in real time proved it was a
  harness artifact (virtual time stalls on in-flight work), not a regression.
- Real-device QA on the Vercel preview is still recommended (WebGL on real GPUs, downloads,
  print dialogs, popups).

## Residual risks

- **Google Fonts** CSS (rows 3, 4) — no SRI possible (the CSS varies by user agent); style-only,
  accepted by the owner.
- **LEVARA financial twin** remains same-origin until its payload is patched (see Exempt).
- **Owner-cockpit coordinate** remains in git history and old deployments (see Retired).
- **Map runtime fetches** — Mapbox GL / MapLibre load tiles and styles at runtime (data, not
  code); those are not covered by SRI.

## References

#89 (site audit), ADR-014 (sandboxed artifact execution), ADR-015 (immersive layer; recorded
the CDN Three.js risk).
