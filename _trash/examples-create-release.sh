#!/bin/bash
# Example script to create a new release branch from develop

set -e

# Make sure we're on develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "Error: You must be on the develop branch to create a release"
  exit 1
fi

# Make sure develop branch is up to date
echo "Fetching latest changes..."
git fetch origin
git pull origin develop

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Ask for version
read -p "Enter the version for this release (e.g., 1.2.0): " VERSION

# Validate version format (basic validation - could be more robust)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9a-zA-Z.]+)?$ ]]; then
  echo "Error: Version must be in format X.Y.Z or X.Y.Z-suffix"
  exit 1
fi

# Check if a release branch for this version already exists
if git show-ref --verify --quiet refs/heads/release/$VERSION || git show-ref --verify --quiet refs/remotes/origin/release/$VERSION; then
  echo "Error: A release branch for version $VERSION already exists"
  exit 1
fi

# Create the release branch
echo "Creating release branch release/$VERSION..."
git checkout -b release/$VERSION

# Read the unreleased section from CHANGELOG.md
UNRELEASED=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[")

# Check if there are changes in the unreleased section
if [ -z "$UNRELEASED" ]; then
  echo "Warning: No changes found in the Unreleased section of CHANGELOG.md"
  read -p "Do you want to continue anyway? (y/n): " CONTINUE
  if [ "$CONTINUE" != "y" ]; then
    git checkout develop
    git branch -D release/$VERSION
    exit 1
  fi
fi

# Update version in package.json
echo "Updating version in package.json..."
npm version $VERSION --no-git-tag-version
npm i # Update package-lock.json

# Update CHANGELOG.md
echo "Updating CHANGELOG.md..."
DATE=$(date +%Y-%m-%d)
sed -i.bak "s/## \[Unreleased\]/## \[Unreleased\]\n\n## \[$VERSION\] - $DATE/" CHANGELOG.md
rm CHANGELOG.md.bak

# Commit changes
echo "Committing changes..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: prepare release $VERSION"

# Push to remote
echo "Pushing release branch to remote..."
git push -u origin release/$VERSION

# Provide next steps
echo ""
echo "✅ Release branch release/$VERSION created and pushed to remote"
echo ""
echo "Next steps:"
echo "1. Create a pull request from release/$VERSION to develop for review"
echo "2. After PR is approved and merged, create a PR from release/$VERSION to main"
echo "3. The semantic-release workflow will trigger when merged to main"
echo ""
echo "You can now run your tests and make any final adjustments to the release branch."

# Return to develop branch
git checkout develop