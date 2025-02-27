#!/bin/bash
# Version bumping script for the Anti-Capitalist Idle Game
# Usage: ./scripts/bump-version.sh <version>
# Example: ./scripts/bump-version.sh 1.2.0

set -e

# Validate arguments
if [ "$#" -ne 1 ]; then
  echo "Usage: ./scripts/bump-version.sh <version>"
  echo "Example: ./scripts/bump-version.sh 1.2.0"
  exit 1
fi

NEW_VERSION=$1
DATE=$(date +%Y-%m-%d)

# Validate version format (X.Y.Z)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must be in the format X.Y.Z (e.g., 1.2.3)"
  exit 1
fi

# Check if CHANGELOG.md exists
if [ ! -f "CHANGELOG.md" ]; then
  echo "Error: CHANGELOG.md not found in current directory"
  exit 1
fi

# Check if there's content under Unreleased section
UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$" | wc -l | tr -d ' ')

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

# Insert new version after the Unreleased section
awk -v ver="$NEW_VERSION" -v date="$DATE" '
  /^## \[Unreleased\]/ {
    print $0;
    print "";
    print "## [" ver "] - " date;
    in_unreleased = 1;
    next;
  }
  
  /^## \[/ && in_unreleased {
    in_unreleased = 0;
    print "";
    print $0;
    next;
  }
  
  { print $0 }
' CHANGELOG.md.bak > CHANGELOG.md

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