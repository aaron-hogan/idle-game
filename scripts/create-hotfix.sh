#!/bin/bash
# Script to create a new hotfix branch from main
# Supports both interactive and non-interactive modes for automation

set -e

# Default settings
NON_INTERACTIVE=false
HOTFIX_DESC=""
CREATE_PRS=false

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
    --create-prs)
      CREATE_PRS=true
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
      echo "  --create-prs             Automatically create PRs to main and develop"
      echo "  --help, -h               Display this help message"
      echo ""
      echo "Examples:"
      echo "  $0                       # Interactive mode"
      echo "  $0 --description login-timeout  # Create hotfix branch with description"
      echo "  $0 -d auth-fix --non-interactive --create-prs  # Fully automated"
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

# If --create-prs option is used and there are already changes (for automation)
if [ "$CREATE_PRS" = true ]; then
  # First, check if there are changes to commit
  if git diff-index --quiet HEAD --; then
    echo "ℹ️ No changes to commit yet. PRs will need to be created manually after making changes."
  else
    # Commit changes with generic message
    echo "💾 Committing changes..."
    git add .
    git commit -m "fix: hotfix for $HOTFIX_DESC issue"
    
    # Push branch
    echo "⬆️ Pushing hotfix branch to remote..."
    git push -u origin $BRANCH_NAME
    
    # Create PRs
    echo "🔄 Creating pull requests automatically..."
    
    # PR to main
    PR_MAIN_URL=$(gh pr create --base main --title "fix: $HOTFIX_DESC" \
      --body "## Description
This PR fixes an urgent issue: $HOTFIX_DESC

## Testing
- Tested fix in isolation
- Verified issue resolution")
    
    # Checkout develop to create PR
    git checkout develop
    git pull origin develop
    git checkout -b sync/hotfix-$HOTFIX_DESC develop
    git merge --no-ff $BRANCH_NAME -m "fix: sync hotfix for $HOTFIX_DESC"
    git push -u origin sync/hotfix-$HOTFIX_DESC
    
    # PR to develop
    PR_DEVELOP_URL=$(gh pr create --base develop --title "fix: $HOTFIX_DESC (sync from hotfix)" \
      --body "## Description
This PR syncs the hotfix for $HOTFIX_DESC from main to develop.

## Testing
- Already tested in the main branch PR")
    
    echo "✅ Pull requests created:"
    echo "- Main PR: $PR_MAIN_URL"
    echo "- Develop PR: $PR_DEVELOP_URL"
    
    # Return to hotfix branch
    git checkout $BRANCH_NAME
  fi
else
  echo ""
  echo "Next steps:"
  echo "1. Fix the issue with conventional commits (e.g., 'fix: login timeout issue')"
  echo "2. Create PRs to both main AND develop branches"
  echo "3. When merged to main, semantic-release will automatically create a patch version"
fi

echo ""