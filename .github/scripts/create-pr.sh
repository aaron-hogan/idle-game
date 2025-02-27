#!/bin/bash
# AI-assistant PR creation script with validation

set -e

# Default values
DRAFT=false
BASE_BRANCH="develop"
SKIP_STASH_CHECK=false
TITLE=""
BODY_FILE=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --draft)
      DRAFT=true
      shift
      ;;
    --base)
      BASE_BRANCH="$2"
      shift 2
      ;;
    --skip-check)
      SKIP_STASH_CHECK=true
      shift
      ;;
    --title)
      TITLE="$2"
      shift 2
      ;;
    --body-file)
      BODY_FILE="$2"
      shift 2
      ;;
    *)
      echo "❌ Error: Unknown option: $1"
      echo "Usage: $0 [--draft] [--base BRANCH] [--title \"PR title\"] [--body-file FILE] [--skip-check]"
      exit 1
      ;;
  esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed. Please install it first:"
  echo "  https://cli.github.com/manual/installation"
  exit 1
fi

# Validate branch exists and isn't main or develop
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "❌ Error: Cannot create PR from main branch"
  exit 1
fi

if [ "$CURRENT_BRANCH" = "develop" ] && [ "$BASE_BRANCH" = "develop" ]; then
  echo "❌ Error: Cannot create PR from develop to develop"
  exit 1
fi

# Verify branch name pattern for feature branches
if [[ ! "$CURRENT_BRANCH" =~ ^(feature|fix|docs|refactor|ci|chore|test|release|hotfix)/[a-z0-9-]+$ ]]; then
  echo "⚠️ Warning: Branch name doesn't follow required pattern"
  echo "Expected format: feature/name, fix/name, docs/name, etc."
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
  fi
fi

# Check for uncommitted changes
if [ "$SKIP_STASH_CHECK" = false ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️ Warning: You have uncommitted changes"
    read -p "Commit these changes before PR? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      read -p "Enter commit message: " COMMIT_MSG
      git add .
      git commit -m "$COMMIT_MSG"
    else
      echo "Continuing with uncommitted changes..."
    fi
  fi
fi

# Push latest changes to the branch
echo "⬆️ Pushing latest changes to remote..."
git push -u origin "$CURRENT_BRANCH"

# Derive PR title from branch name if not provided
if [ -z "$TITLE" ]; then
  # Extract the type and description from branch name
  BRANCH_TYPE=$(echo "$CURRENT_BRANCH" | cut -d/ -f1)
  BRANCH_DESC=$(echo "$CURRENT_BRANCH" | cut -d/ -f2- | tr '-' ' ')
  
  # Format as conventional commit
  case "$BRANCH_TYPE" in
    feature)
      TYPE_PREFIX="feat"
      ;;
    fix)
      TYPE_PREFIX="fix"
      ;;
    *)
      TYPE_PREFIX="$BRANCH_TYPE"
      ;;
  esac
  
  # Convert to title case
  FORMATTED_DESC=$(echo "$BRANCH_DESC" | sed 's/\b\(.\)/\u\1/g')
  TITLE="$TYPE_PREFIX: $FORMATTED_DESC"
fi

# Create temporary PR body file if not provided
if [ -z "$BODY_FILE" ]; then
  TEMP_BODY=$(mktemp)
  
  # Generate standardized PR body with recent commits
  cat > "$TEMP_BODY" << EOF
## Changes
$(git log --pretty=format:'* %s' origin/$BASE_BRANCH..$CURRENT_BRANCH | grep -v 'Merge' || echo "* Initial implementation")

## Description
<!-- Describe the changes in this PR -->

## Testing
<!-- Describe how you tested these changes -->

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG.md updated in [Unreleased] section
- [ ] Code builds and passes all tests

🤖 Generated with Claude
EOF
  
  BODY_FILE="$TEMP_BODY"
fi

# Create PR command arguments
PR_ARGS=("--base" "$BASE_BRANCH" "--title" "$TITLE" "--body-file" "$BODY_FILE")
if [ "$DRAFT" = true ]; then
  PR_ARGS+=("--draft")
fi

# Create the PR
echo "🔄 Creating pull request to $BASE_BRANCH..."
PR_URL=$(gh pr create "${PR_ARGS[@]}" --json url --jq '.url')
PR_NUMBER=$(gh pr view --json number --jq '.number')

echo "✅ PR #$PR_NUMBER created successfully with title: $TITLE"
echo "URL: $PR_URL"

if [ "$DRAFT" = true ]; then
  echo "📝 PR created as draft - mark as ready for review when finished"
fi

# If we created a temp file, clean it up
if [ -n "$TEMP_BODY" ]; then
  rm "$TEMP_BODY"
fi