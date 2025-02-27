#!/bin/bash
# Script to create a release branch from develop
# Works with GitHub-based versioning on merge
# Supports both interactive and non-interactive modes for automation

set -e

# Default settings
NON_INTERACTIVE=false
VERSION_TYPE="patch"
CHECK_CHANGELOG=true
LABEL_PR=true

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
    --patch-level)
      VERSION_TYPE="patch_level"
      shift
      ;;
    --non-interactive|--auto)
      NON_INTERACTIVE=true
      shift
      ;;
    --no-changelog-check)
      CHECK_CHANGELOG=false
      shift
      ;;
    --no-label)
      LABEL_PR=false
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Create a release branch from develop with GitHub-based versioning"
      echo ""
      echo "Options:"
      echo "  --major                 Create a major version (x.0.0)"
      echo "  --minor                 Create a minor version (0.x.0)"
      echo "  --patch                 Create a patch version (0.0.x) [default]"
      echo "  --patch-level           Create a patch level version (x.y.z-N)"
      echo "  --non-interactive       Run in non-interactive mode"
      echo "  --no-changelog-check    Skip checking for unreleased changes in CHANGELOG.md"
      echo "  --no-label              Skip labeling PR with version type"
      echo "  --help, -h              Display this help message"
      echo ""
      echo "Examples:"
      echo "  $0                      # Interactive mode"
      echo "  $0 --minor              # Create a minor version interactively"
      echo "  $0 --patch --non-interactive  # Create a patch version non-interactively"
      echo ""
      echo "Note: Actual versioning occurs through GitHub Actions on PR merge."
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $1"
      echo "Run '$0 --help' for usage information"
      exit 1
      ;;
  esac
done

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

# Get current version from package.json
echo "ℹ️ Current version in package.json:"
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "$CURRENT_VERSION"

# Handle version selection if not in non-interactive mode
if [ "$NON_INTERACTIVE" = false ]; then
  echo ""
  echo "Please select version type:"
  echo "1) Major (x.0.0)"
  echo "2) Minor (0.x.0)"
  echo "3) Patch (0.0.x)"
  echo "4) Patch Level (x.y.z-N)"
  read -p "Enter choice [1-4]: " VERSION_CHOICE

  case $VERSION_CHOICE in
    1) VERSION_TYPE="major" ;;
    2) VERSION_TYPE="minor" ;;
    3) VERSION_TYPE="patch" ;;
    4) VERSION_TYPE="patch_level" ;;
    *)
      echo "❌ Invalid choice"
      exit 1
      ;;
  esac
fi

# Check for unreleased changes in CHANGELOG.md
if [ "$CHECK_CHANGELOG" = true ]; then
  echo "📝 Checking CHANGELOG.md for unreleased changes..."
  
  # Verify CHANGELOG.md exists
  if [ ! -f "CHANGELOG.md" ]; then
    echo "❌ Error: CHANGELOG.md not found"
    exit 1
  fi
  
  # Check if there are unreleased changes in the changelog
  if ! grep -q "## \[Unreleased\]" CHANGELOG.md; then
    echo "❌ Error: CHANGELOG.md does not have an [Unreleased] section"
    exit 1
  fi
  
  # Get content under Unreleased section
  UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$" | wc -l | tr -d ' ')
  
  if [ "$UNRELEASED_CONTENT" -eq 0 ]; then
    echo "⚠️ Warning: No unreleased changes found in CHANGELOG.md."
    
    if [ "$NON_INTERACTIVE" = true ]; then
      echo "Proceeding anyway in non-interactive mode."
    else
      read -p "Continue anyway? (y/n): " CONTINUE
      if [ "$CONTINUE" != "y" ]; then
        exit 1
      fi
    fi
  else
    echo "✅ Found unreleased changes in CHANGELOG.md"
    echo "Unreleased changes:"
    sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$"
  fi
fi

# Create preliminary name for release branch based on version type
BRANCH_NAME="release/next-$(date +%Y%m%d)"

# Create release branch
echo "🌿 Creating release branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Push branch to remote
echo "⬆️ Pushing release branch to remote..."
git push -u origin $BRANCH_NAME

# Create PR to main with version label
echo "🔄 Creating pull request to main..."

# Prepare PR description
PR_BODY="## Description
This PR prepares a new release from develop to main.

## Version Type
$VERSION_TYPE

## Changes
$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | grep -v "## \[" | grep -v "^$")

## Testing
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Manual testing complete"

# Create the PR
PR_URL=$(gh pr create --base main --title "chore(release): prepare new $VERSION_TYPE release" --body "$PR_BODY")

# Add version label if enabled
if [ "$LABEL_PR" = true ]; then
  PR_NUMBER=$(echo $PR_URL | grep -o '[0-9]*$')
  if [ -n "$PR_NUMBER" ]; then
    echo "🏷️ Adding version:$VERSION_TYPE label to PR #$PR_NUMBER..."
    gh pr edit $PR_NUMBER --add-label "version:$VERSION_TYPE"
  fi
fi

echo "✅ Release preparation complete!"
echo "Pull Request: $PR_URL"
echo ""
echo "Next steps:"
echo "1. Review the PR and ensure all checks pass"
echo "2. When merged to main, GitHub Actions will:"
echo "   - Automatically apply the version bump based on the PR label"
echo "   - Update the CHANGELOG.md with the new version and date"
echo "   - Create a tag for the release"

# Return to develop branch
git checkout develop