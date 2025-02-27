#!/bin/bash
# Check if changelog has been versioned properly
# This script validates that PRs to main don't contain unversioned changes

set -e

CHANGELOG_FILE="CHANGELOG.md"

if [ ! -f "$CHANGELOG_FILE" ]; then
  echo "Error: $CHANGELOG_FILE not found"
  exit 1
fi

# Check if there are entries under [Unreleased] that should be versioned
# First check if there's anything between [Unreleased] and the next version heading
if awk '/^## \[Unreleased\]/,/^## \[[0-9]/' "$CHANGELOG_FILE" | grep -q "^### "; then
  echo "❌ ERROR: Entries exist under [Unreleased] heading."
  echo ""
  echo "Before merging to main, please create a proper version section using:"
  echo "  ./scripts/bump-version.sh X.Y.Z"
  echo ""
  echo "Unreleased changes found:"
  echo "------------------------"
  awk '/^## \[Unreleased\]/,/^## \[[0-9]/' "$CHANGELOG_FILE" | grep -E "^###|^- "
  echo "------------------------"
  echo ""
  echo "See docs/processes/versioning-and-releases.md for more information."
  exit 1
else 
  echo "✅ CHANGELOG.md properly versioned. No unreleased changes found."
fi