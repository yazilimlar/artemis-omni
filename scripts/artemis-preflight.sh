#!/usr/bin/env bash
set -euo pipefail

# Artemis preflight check — run this before any significant work.
# Verifies branch hygiene, lint, typecheck, and build.

echo "=== Artemis Preflight ==="
echo ""

# 1. Branch check
CURRENT=$(git branch --show-current)
echo "Current branch: $CURRENT"
if [ "$CURRENT" = "main" ] || [[ "$CURRENT" == ops/* ]]; then
  echo "  ✓ Canonical or ops branch"
else
  echo "  ⚠ Non-canonical branch — verify this is intentional"
fi

# 2. Uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "  ⚠ Uncommitted changes present — consider stashing or committing first"
fi

echo ""

# 3. TypeScript
echo "--- Typecheck ---"
npm run typecheck
echo "  ✓ Passed"
echo ""

# 4. Lint
echo "--- Lint ---"
npm run lint
echo "  ✓ Passed"
echo ""

# 5. Build
echo "--- Build ---"
npm run build
echo "  ✓ Passed"
echo ""

echo "=== Preflight complete ==="
