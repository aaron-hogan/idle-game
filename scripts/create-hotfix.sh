#!/bin/bash
# Script to create a new hotfix branch from main
# Works with GitHub-based versioning on merge
# Supports both interactive and non-interactive modes for automation

set -e

# Default settings
NON_INTERACTIVE=false
HOTFIX_DESC=""
LABEL_PR=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --description|-d)
      HOTFIX_DESC="$2"
      shift 2
      ;;
    --non-interactive|--auto)
      NON_INTERACTIVE=true
      shift
      ;;
    --no-label)
      LABEL_PR=false
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Create a hotfix branch from main for urgent fixes"
      echo ""
      echo "Options:"
      echo "  --description, -d DESC   Brief description of the hotfix (required for non-interactive mode)"
      echo "  --non-interactive        Run in non-interactive mode (requires --description)"
      echo "  --no-label               Skip labeling PR with version:patch"
      echo "  --help, -h               Display this help message"
      echo ""
      echo "Examples:"
      echo "  $0                       # Interactive mode"
      echo "  $0 --description login-timeout  # Create hotfix branch with description"
      echo "  $0 -d auth-fix --non-interactive  # Fully automated"
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

# Validate non-interactive mode requirements
if [ "$NON_INTERACTIVE" = true ] && [ -z "$HOTFIX_DESC" ]; then
  echo "❌ Error: Non-interactive mode requires specifying a description"
  echo "Run '$0 --help' for usage information"
  exit 1
fi

# Verify we are on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ Error: You must be on the main branch to create a hotfix"
  exit 1
fi

# Make sure main is up to date
echo "🔄 Fetching latest changes..."
git fetch origin
git pull origin main

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Get issue description if not provided
if [ -z "$HOTFIX_DESC" ]; then
  read -p "Enter brief hotfix description (e.g., fix-login-timeout): " HOTFIX_DESC
  
  # Validate description
  if [ -z "$HOTFIX_DESC" ]; then
    echo "❌ Error: Hotfix description is required"
    exit 1
  fi
fi

# Create properly formatted description
HOTFIX_DESC=$(echo $HOTFIX_DESC | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Create hotfix branch
BRANCH_NAME="hotfix/$HOTFIX_DESC"
git checkout -b $BRANCH_NAME

echo "🔧 Hotfix branch $BRANCH_NAME created"
echo "⬆️ Pushing hotfix branch to remote..."
git push -u origin $BRANCH_NAME

# Create PR to main with version label
echo "ℹ️ You'll need to implement your hotfix and then create PRs."
echo ""
echo "Once your fix is implemented and committed, create PRs with:"
echo ""
echo "# PR to main (with version:patch label)"
echo "gh pr create --base main --title \"fix: $HOTFIX_DESC\" \\"
echo "  --body \"## Description\\nThis PR fixes an urgent issue: $HOTFIX_DESC\\n\\n## Testing\\n- Tested fix in isolation\\n- Verified issue resolution\""
echo ""
echo "# PR to develop (to keep branches in sync)"
echo "gh pr create --base develop --title \"fix: $HOTFIX_DESC (sync from hotfix)\" \\"
echo "  --body \"## Description\\nThis PR syncs the hotfix for $HOTFIX_DESC from main to develop.\\n\\n## Testing\\n- Already tested in the main branch PR\""
echo ""
echo "When merged to main, GitHub Actions will:"
echo "- Automatically apply a patch version bump"
echo "- Update the CHANGELOG.md with the new version and date"
echo "- Create a tag for the release"
echo ""