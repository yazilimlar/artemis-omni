# sandbox/

This is the **only** executable artifact directory in Artemis (ADR-014). Each registered
artifact lives in `sandbox/<id>/`, has an entry in `data/artifact-registry.json`, and is
served only by `/api/sandbox/[id]`. That response carries a strict Content-Security-Policy
whose `sandbox allow-scripts` directive gives the artifact an opaque origin, and `/labs/run/[id]`
embeds it in an `<iframe sandbox="allow-scripts">` without `allow-same-origin`. Files are
deliberately kept outside `public/`, because Next.js serves `public/` directly without
these headers; anything placed outside `sandbox/<id>/` is never executable. v1 artifacts
are single-file: inline scripts, styles and `data:` assets only, no network unless an
owner-only `allow_outbound` allowlist is registered.
