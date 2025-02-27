#!/bin/bash
# Script to check for empty versions in CHANGELOG.md
# Usage: ./scripts/check-empty-versions.sh [--fix]

set -e

# Check if CHANGELOG.md exists
if [ ! -f "CHANGELOG.md" ]; then
  echo "Error: CHANGELOG.md not found in current directory"
  exit 1
fi

# Check if we should fix empty versions
FIX_EMPTY=false
if [ "$1" == "--fix" ]; then
  FIX_EMPTY=true
  echo "Running in fix mode - will add placeholder content to empty versions"
fi

# Create a temporary file
TEMP_FILE=$(mktemp)

# Parse CHANGELOG.md to find version headers
grep -n "^## \[" CHANGELOG.md | sort -n > "$TEMP_FILE"

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
    CONTENT_LINES=$(sed -n "${START_LINE},${END_LINE}p" CHANGELOG.md | grep -v "^$" | grep -c ".")
    
    if [ "$CONTENT_LINES" -eq 0 ]; then
      EMPTY_VERSIONS+=("$PREV_VERSION")
      echo "⚠️ Empty version detected: [$PREV_VERSION]"
      
      # Fix empty version if requested
      if [ "$FIX_EMPTY" = true ]; then
        echo "  🔧 Adding placeholder content to version [$PREV_VERSION]"
        
        # Create a backup of the file
        cp CHANGELOG.md CHANGELOG.md.bak
        
        # Insert placeholder content after the version header
        sed -i.tmp "s/## \[$PREV_VERSION\].*$/&\n\n### Changed\n- Automated version bump\n- This version was created during workflow testing/" CHANGELOG.md
        
        # Remove temporary file
        rm -f CHANGELOG.md.tmp
      fi
    fi
  fi
  
  PREV_LINE=$LINE_NUM
  PREV_VERSION=$VERSION
done < "$TEMP_FILE"

# Check the last version (which doesn't have a next version header)
if [ -n "$PREV_VERSION" ] && [ "$PREV_VERSION" != "Unreleased" ]; then
  TOTAL_LINES=$(wc -l < CHANGELOG.md)
  START_LINE=$((PREV_LINE + 1))
  END_LINE=$TOTAL_LINES
  
  CONTENT_LINES=$(sed -n "${START_LINE},${END_LINE}p" CHANGELOG.md | grep -v "^$" | grep -c ".")
  
  if [ "$CONTENT_LINES" -eq 0 ]; then
    EMPTY_VERSIONS+=("$PREV_VERSION")
    echo "⚠️ Empty version detected: [$PREV_VERSION]"
    
    # Fix empty version if requested
    if [ "$FIX_EMPTY" = true ]; then
      echo "  🔧 Adding placeholder content to version [$PREV_VERSION]"
      
      # Create a backup of the file
      cp CHANGELOG.md CHANGELOG.md.bak
      
      # Insert placeholder content after the version header
      sed -i.tmp "s/## \[$PREV_VERSION\].*$/&\n\n### Changed\n- Automated version bump\n- This version was created during workflow testing/" CHANGELOG.md
      
      # Remove temporary file
      rm -f CHANGELOG.md.tmp
    fi
  fi
fi

# Clean up
rm "$TEMP_FILE"

# Report results
if [ ${#EMPTY_VERSIONS[@]} -eq 0 ]; then
  echo "✅ No empty versions found in CHANGELOG.md"
  exit 0
else
  echo ""
  echo "Found ${#EMPTY_VERSIONS[@]} empty version(s) in CHANGELOG.md"
  
  if [ "$FIX_EMPTY" = true ]; then
    echo "✅ Added placeholder content to all empty versions"
    exit 0
  else
    echo "Run with --fix to automatically add placeholder content to empty versions:"
    echo "./scripts/check-empty-versions.sh --fix"
    exit 1
  fi
fi