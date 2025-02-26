#!/bin/bash
# Check if changelog has been versioned properly
# This script validates that PRs to main don't contain unversioned changes
# and that all versions have content

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

# Now check for empty version sections

# Create a temporary file
TEMP_FILE=$(mktemp)

# Parse CHANGELOG.md to find version headers
grep -n "^## \[" $CHANGELOG_FILE | sort -n > "$TEMP_FILE"

EMPTY_VERSIONS=()
PREV_LINE=0
PREV_VERSION=""

# Check each version section for content
while IFS=: read -r LINE_NUM LINE_CONTENT; do
  VERSION=$(echo "$LINE_CONTENT" | sed -E 's/^## \[(.*)\].*/\1/')
  
  # Skip if this is the Unreleased section
  if [ "$VERSION" == "Unreleased" ]; then
    PREV_LINE=$LINE_NUM
    PREV_VERSION=$VERSION
    continue
  fi
  
  # If we have a previous version to check
  if [ -n "$PREV_VERSION" ] && [ "$PREV_VERSION" != "Unreleased" ]; then
    # Calculate lines between this version and previous version
    START_LINE=$((PREV_LINE + 1))
    END_LINE=$((LINE_NUM - 1))
    
    # Check if there's any content (look for section headers or content)
    CONTENT_LINES=$(sed -n "${START_LINE},${END_LINE}p" $CHANGELOG_FILE | grep -v "^$" | grep -c ".")
    
    if [ "$CONTENT_LINES" -eq 0 ]; then
      EMPTY_VERSIONS+=("$PREV_VERSION")
      echo "⚠️ Empty version detected: [$PREV_VERSION]"
    fi
  fi
  
  PREV_LINE=$LINE_NUM
  PREV_VERSION=$VERSION
done < "$TEMP_FILE"

# Check the last version (which doesn't have a next version header)
if [ -n "$PREV_VERSION" ] && [ "$PREV_VERSION" != "Unreleased" ]; then
  TOTAL_LINES=$(wc -l < $CHANGELOG_FILE)
  START_LINE=$((PREV_LINE + 1))
  END_LINE=$TOTAL_LINES
  
  CONTENT_LINES=$(sed -n "${START_LINE},${END_LINE}p" $CHANGELOG_FILE | grep -v "^$" | grep -c ".")
  
  if [ "$CONTENT_LINES" -eq 0 ]; then
    EMPTY_VERSIONS+=("$PREV_VERSION")
    echo "⚠️ Empty version detected: [$PREV_VERSION]"
  fi
fi

# Clean up
rm "$TEMP_FILE"

# Report results
if [ ${#EMPTY_VERSIONS[@]} -eq 0 ]; then
  echo "✅ No empty versions found in CHANGELOG.md"
else
  echo "❌ ERROR: Found ${#EMPTY_VERSIONS[@]} empty version(s) in CHANGELOG.md."
  echo "Every version section must have content."
  echo ""
  echo "Please add content to these versions using:"
  echo "  ./scripts/check-empty-versions.sh --fix"
  echo ""
  echo "See docs/processes/versioning-and-releases.md for more information."
  exit 1
fi