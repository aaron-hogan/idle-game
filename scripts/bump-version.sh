#!/bin/bash
# Version bumping script for the Anti-Capitalist Idle Game
# Usage: ./scripts/bump-version.sh <version>
# Example: ./scripts/bump-version.sh 1.2.0
# For patch level: ./scripts/bump-version.sh 1.2.0-1

set -e

# Validate arguments
if [ "$#" -ne 1 ]; then
  echo "Usage: ./scripts/bump-version.sh <version>"
  echo "Example: ./scripts/bump-version.sh 1.2.0"
  echo "For patch level: ./scripts/bump-version.sh 1.2.0-1"
  exit 1
fi

NEW_VERSION=$1
DATE=$(date +%Y-%m-%d)

# Validate version format (X.Y.Z or X.Y.Z-N)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9]+)?$ ]]; then
  echo "Error: Version must be in the format X.Y.Z or X.Y.Z-N (e.g., 1.2.3 or 1.2.3-1)"
  exit 1
fi

# Check if CHANGELOG.md exists
if [ ! -f "CHANGELOG.md" ]; then
  echo "Error: CHANGELOG.md not found in current directory"
  exit 1
fi

# Check if there's content under Unreleased section (exclude placeholder text)
UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$" | grep -v "\*No unreleased changes" | grep -v "No unreleased changes" | wc -l | tr -d ' ')

if [ "$UNRELEASED_CONTENT" -eq 0 ]; then
  echo "Warning: No content found in the Unreleased section of CHANGELOG.md."
  read -p "Continue anyway? (y/N) " CONTINUE
  if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
  fi
fi

# Create backup
cp CHANGELOG.md CHANGELOG.md.bak

# Create a temporary file for unreleased changes
TEMP_CHANGES=$(mktemp)
sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^\*No unreleased changes" | grep -v "No unreleased changes" | sed '/^$/d' > "$TEMP_CHANGES"

# Capture the content between [Unreleased] and next version header
BEGIN_MARKER="## \[Unreleased\]"
END_MARKER="## \["
UNRELEASED_START=$(grep -n "$BEGIN_MARKER" CHANGELOG.md | cut -d ":" -f 1)
NEXT_VERSION_START=$(tail -n +$((UNRELEASED_START+1)) CHANGELOG.md | grep -n "$END_MARKER" | head -1 | cut -d ":" -f 1)
NEXT_VERSION_START=$((UNRELEASED_START + NEXT_VERSION_START))

# Generate the new changelog content
{
  # Keep everything up to and including [Unreleased]
  head -n "$UNRELEASED_START" CHANGELOG.md
  echo ""
  echo "*No unreleased changes at this time.*"
  echo ""
  
  # Add the new version section with the captured changes
  echo "## [$NEW_VERSION] - $DATE"
  echo ""
  cat "$TEMP_CHANGES"
  
  # Skip the unreleased section in the original file and keep the rest
  tail -n +$NEXT_VERSION_START CHANGELOG.md
} > CHANGELOG.md.new

# Replace the original with our new version
mv CHANGELOG.md.new CHANGELOG.md
rm "$TEMP_CHANGES"

# Update package.json if it exists
if [ -f "package.json" ]; then
  echo "Updating version in package.json..."
  # Use node to update package.json to preserve formatting
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.version = '$NEW_VERSION';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
fi

# Remove backup
rm CHANGELOG.md.bak

echo "✅ Version $NEW_VERSION created in CHANGELOG.md"
echo "📆 Release date set to $DATE"

if [ -f "package.json" ]; then
  echo "📦 package.json version updated to $NEW_VERSION"
fi

echo "🚀 Next steps:"
echo "1. Review the changes: git diff CHANGELOG.md package.json"
echo "2. Commit the changes: git commit -m \"chore: bump version to $NEW_VERSION\""
echo "3. Create a tag: git tag v$NEW_VERSION"
echo "4. Push changes: git push && git push --tags"