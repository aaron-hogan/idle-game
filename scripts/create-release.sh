#!/bin/bash
# Script to create a new release branch from develop
# Supports both interactive and non-interactive modes for automation

set -e

# Default settings
NON_INTERACTIVE=false
VERSION_TYPE=""
CUSTOM_VERSION=""
FORCE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --major)
      VERSION_TYPE="major"
      shift
      ;;
    --minor)
      VERSION_TYPE="minor"
      shift
      ;;
    --patch)
      VERSION_TYPE="patch"
      shift
      ;;
    --version)
      VERSION_TYPE="custom"
      CUSTOM_VERSION="$2"
      shift 2
      ;;
    --non-interactive|--auto)
      NON_INTERACTIVE=true
      shift
      ;;
    --force|-f)
      FORCE=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Create a release branch from develop with automated versioning"
      echo ""
      echo "Options:"
      echo "  --major                 Create a major version (x.0.0)"
      echo "  --minor                 Create a minor version (0.x.0)"
      echo "  --patch                 Create a patch version (0.0.x)"
      echo "  --version VERSION       Create a specific version"
      echo "  --non-interactive       Run in non-interactive mode (requires --major, --minor, --patch or --version)"
      echo "  --force, -f             Force continue even if no unreleased changes detected"
      echo "  --help, -h              Display this help message"
      echo ""
      echo "Examples:"
      echo "  $0                      # Interactive mode"
      echo "  $0 --minor              # Create a minor version interactively"
      echo "  $0 --patch --non-interactive  # Create a patch version non-interactively"
      echo "  $0 --version 1.2.3 --non-interactive  # Create specific version non-interactively"
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $1"
      echo "Run '$0 --help' for usage information"
      exit 1
      ;;
  esac
done

# Validate non-interactive mode requirements
if [ "$NON_INTERACTIVE" = true ] && [ -z "$VERSION_TYPE" ]; then
  echo "❌ Error: Non-interactive mode requires specifying a version type"
  echo "Run '$0 --help' for usage information"
  exit 1
fi

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

# Handle version selection
if [ -z "$VERSION_TYPE" ]; then
  # Interactive version selection
  echo ""
  echo "Please select version type:"
  echo "1) Major (x.0.0)"
  echo "2) Minor (0.x.0)"
  echo "3) Patch (0.0.x)"
  echo "4) Custom"
  read -p "Enter choice [1-4]: " VERSION_CHOICE

  case $VERSION_CHOICE in
    1) VERSION_TYPE="major" ;;
    2) VERSION_TYPE="minor" ;;
    3) VERSION_TYPE="patch" ;;
    4)
      VERSION_TYPE="custom"
      read -p "Enter custom version (e.g., 1.2.3): " CUSTOM_VERSION
      ;;
    *)
      echo "❌ Invalid choice"
      git checkout -- package.json
      exit 1
      ;;
  esac
fi

# Apply version change
case $VERSION_TYPE in
  "major"|"minor"|"patch")
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    ;;
  "custom")
    if [ -z "$CUSTOM_VERSION" ]; then
      echo "❌ Error: Custom version not provided"
      git checkout -- package.json
      exit 1
    fi
    NEW_VERSION=$(npm version $CUSTOM_VERSION --no-git-tag-version)
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

if [ "$UNRELEASED_CONTENT" -eq 0 ] && [ "$FORCE" != true ]; then
  echo "⚠️ Warning: No changes found in the Unreleased section of CHANGELOG.md"
  
  if [ "$NON_INTERACTIVE" = true ]; then
    echo "❌ Error: Aborting due to empty Unreleased section (use --force to override)"
    git checkout develop
    git branch -D $BRANCH_NAME
    git checkout -- package.json
    exit 1
  else
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
      git checkout develop
      git branch -D $BRANCH_NAME
      git checkout -- package.json
      exit 1
    fi
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

# Create PRs automatically in non-interactive mode
if [ "$NON_INTERACTIVE" = true ]; then
  echo "🔄 Creating pull requests automatically..."
  
  # PR to develop
  PR_DEVELOP_URL=$(gh pr create --base develop --title "chore: update develop with version changes" \
    --body "## Description
This PR updates the develop branch with version changes from the release/$NEW_VERSION branch.

## Changes
- Updated version in package.json to $NEW_VERSION
- Updated CHANGELOG.md with $NEW_VERSION release notes

## Testing
- No functional changes require testing")
  
  # PR to main
  PR_MAIN_URL=$(gh pr create --base main --title "chore(release): $NEW_VERSION" \
    --body "## Description
This PR releases version $NEW_VERSION to main.

## Changes
- Updated version in package.json to $NEW_VERSION
- Updated CHANGELOG.md with $NEW_VERSION release notes

## Testing
- No functional changes require testing")
  
  echo "✅ Pull requests created:"
  echo "- Develop PR: $PR_DEVELOP_URL"
  echo "- Main PR: $PR_MAIN_URL"
else
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
fi

echo ""

# Return to develop
git checkout develop