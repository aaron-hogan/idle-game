#!/bin/bash
# Automatic version bumping script for PRs
# This script is called by the auto-version GitHub Action
# It versions changes based on PR labels

set -e

# Required environment variables:
# PR_LABEL - The version label (major, minor, patch, patch_level)
# GITHUB_ACTOR - The GitHub username of the PR author
# PR_TITLE - The title of the PR
# PR_NUMBER - The PR number

echo "🔄 Starting automatic versioning process..."

# Validate environment variables
if [ -z "$PR_LABEL" ]; then
  echo "❌ Error: PR_LABEL environment variable is not set"
  exit 1
fi

if [ -z "$GITHUB_ACTOR" ]; then
  echo "❌ Error: GITHUB_ACTOR environment variable is not set"
  exit 1
fi

if [ -z "$PR_TITLE" ]; then
  echo "❌ Error: PR_TITLE environment variable is not set"
  exit 1
fi

if [ -z "$PR_NUMBER" ]; then
  echo "❌ Error: PR_NUMBER environment variable is not set"
  exit 1
fi

echo "📋 Processing PR #$PR_NUMBER: $PR_TITLE"
echo "🏷️ Version label: $PR_LABEL"

# Set Git user
git config --global user.name "GitHub Actions"
git config --global user.email "actions@github.com"

# Get current version from package.json
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "📦 Current version: $CURRENT_VERSION"

# Determine new version based on PR_LABEL
if [ "$PR_LABEL" = "major" ]; then
  NEW_VERSION=$(node -e "
    const [major] = '$CURRENT_VERSION'.split('.').map(Number);
    console.log(\`\${major+1}.0.0\`);
  ")
elif [ "$PR_LABEL" = "minor" ]; then
  NEW_VERSION=$(node -e "
    const version = '$CURRENT_VERSION';
    const versionParts = version.split('-')[0].split('.').map(Number);
    const [major, minor] = versionParts;
    console.log(\`\${major}.\${minor+1}.0\`);
  ")
elif [ "$PR_LABEL" = "patch" ]; then
  NEW_VERSION=$(node -e "
    const version = '$CURRENT_VERSION';
    const versionParts = version.split('-')[0].split('.').map(Number);
    const [major, minor, patch] = versionParts;
    console.log(\`\${major}.\${minor}.\${patch+1}\`);
  ")
elif [ "$PR_LABEL" = "patch_level" ]; then
  NEW_VERSION=$(node -e "
    const version = '$CURRENT_VERSION';
    const versionParts = version.split('-');
    const baseParts = versionParts[0].split('.').map(Number);
    
    // If we already have a patch level version like X.Y.Z-N
    if (versionParts.length > 1) {
      const patchLevel = parseInt(versionParts[1], 10);
      console.log(\`\${versionParts[0]}-\${patchLevel+1}\`);
    } else {
      // New patch level for version that doesn't have one yet
      console.log(\`\${version}-1\`);
    }
  ")
else
  echo "❌ Error: Unrecognized PR_LABEL: $PR_LABEL"
  echo "Valid labels are: major, minor, patch, patch_level"
  exit 1
fi

echo "🔖 Creating new version: $NEW_VERSION"

# Check if there's content under Unreleased section
UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$" | grep -v "\*No unreleased changes" | wc -l | tr -d ' ')

if [ "$UNRELEASED_CONTENT" -eq 0 ]; then
  echo "⚠️ Warning: No content found in the Unreleased section of CHANGELOG.md."
  echo "Creating empty version section anyway."
fi

# Create backup
cp CHANGELOG.md CHANGELOG.md.bak

# Create a temporary file for unreleased changes
TEMP_CHANGES=$(mktemp)
sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^\*No unreleased changes" | sed '/^$/d' > "$TEMP_CHANGES"

# Set the release date
DATE=$(date +%Y-%m-%d)
echo "📅 Setting release date to $DATE"

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

# Update package.json
echo "📦 Updating package.json version to $NEW_VERSION"
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Remove backup
rm CHANGELOG.md.bak

# Commit the changes
echo "💾 Committing version bump"
git add CHANGELOG.md package.json
git commit -m "chore: bump version to $NEW_VERSION

Automatically versioned for PR #$PR_NUMBER: $PR_TITLE
Version type: $PR_LABEL"

echo "✅ Version bump successful"
echo "new_version=$NEW_VERSION" >> $GITHUB_OUTPUT