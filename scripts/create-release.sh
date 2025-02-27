#!/bin/bash
# Script to create a new release branch from develop

set -e

# Verify we are on develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "❌ Error: You must be on the develop branch to create a release"
  exit 1
fi

# Make sure develop is up to date
echo "🔄 Fetching latest changes..."
git fetch origin
git pull origin develop

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Get new version
echo "ℹ️ Current version in package.json:"
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "$CURRENT_VERSION"

# Let user choose version type
echo ""
echo "Please select version type:"
echo "1) Major (x.0.0)"
echo "2) Minor (0.x.0)"
echo "3) Patch (0.0.x)"
echo "4) Custom"
read -p "Enter choice [1-4]: " VERSION_CHOICE

case $VERSION_CHOICE in
  1)
    NEW_VERSION=$(npm version major --no-git-tag-version)
    ;;
  2)
    NEW_VERSION=$(npm version minor --no-git-tag-version)
    ;;
  3)
    NEW_VERSION=$(npm version patch --no-git-tag-version)
    ;;
  4)
    read -p "Enter custom version (e.g., 1.2.3): " CUSTOM_VERSION
    NEW_VERSION=$(npm version $CUSTOM_VERSION --no-git-tag-version)
    ;;
  *)
    echo "❌ Invalid choice"
    git checkout -- package.json
    exit 1
    ;;
esac

# Remove v prefix from npm version output
NEW_VERSION=${NEW_VERSION//\"/}
NEW_VERSION=${NEW_VERSION#v}

echo "🔖 Creating release for version $NEW_VERSION"

# Create release branch
BRANCH_NAME="release/$NEW_VERSION"
git checkout -b $BRANCH_NAME

# Update CHANGELOG.md
echo "📝 Updating CHANGELOG.md..."
DATE=$(date +%Y-%m-%d)

# Check if there's content in the Unreleased section
UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$" | wc -l | tr -d ' ')

if [ "$UNRELEASED_CONTENT" -eq 0 ]; then
  echo "⚠️ Warning: No changes found in the Unreleased section of CHANGELOG.md"
  read -p "Continue anyway? (y/n): " CONTINUE
  if [ "$CONTINUE" != "y" ]; then
    git checkout develop
    git branch -D $BRANCH_NAME
    git checkout -- package.json
    exit 1
  fi
fi

# Create backup of CHANGELOG.md
cp CHANGELOG.md CHANGELOG.md.bak

# Insert new version after the Unreleased section
awk -v ver="$NEW_VERSION" -v date="$DATE" '
  /^## \[Unreleased\]/ {
    print $0;
    getline;
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

# Remove backup
rm CHANGELOG.md.bak

# Commit changes
echo "💾 Committing changes..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): prepare release $NEW_VERSION"

# Push branch
echo "⬆️ Pushing release branch to remote..."
git push -u origin $BRANCH_NAME

# Instructions
echo ""
echo "✅ Release branch $BRANCH_NAME created and pushed to remote!"
echo ""
echo "Next steps:"
echo "1. Create a PR from $BRANCH_NAME to develop (for changelog updates)"
echo "2. After the develop PR is approved and merged, create a PR from $BRANCH_NAME to main"
echo "3. When merged to main, semantic-release will automatically:"
echo "   - Create a tag for the release"
echo "   - Generate release notes"
echo "   - Create a GitHub release"
echo ""

# Return to develop
git checkout develop