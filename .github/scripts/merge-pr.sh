#!/bin/bash
# PR merge script with enhanced conflict detection and resolution

set -e

# Default values
PR_NUMBER=""
AUTO_MERGE=false
RESOLVE_CONFLICTS=false
DELETE_BRANCH=true
SQUASH=false
REBASE=false
MERGE_METHOD="merge"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --yes)
      AUTO_MERGE=true
      shift
      ;;
    --resolve-conflicts)
      RESOLVE_CONFLICTS=true
      shift
      ;;
    --no-delete-branch)
      DELETE_BRANCH=false
      shift
      ;;
    --squash)
      SQUASH=true
      MERGE_METHOD="squash"
      shift
      ;;
    --rebase)
      REBASE=true
      MERGE_METHOD="rebase"
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [options] PR_NUMBER"
      echo "Options:"
      echo "  --yes                 Auto-confirm merge"
      echo "  --resolve-conflicts   Attempt to resolve simple conflicts"
      echo "  --no-delete-branch    Keep branch after merge"
      echo "  --squash              Squash commits when merging"
      echo "  --rebase              Rebase commits when merging"
      echo "  -h, --help            Show this help message"
      exit 0
      ;;
    *)
      if [[ $1 =~ ^[0-9]+$ ]]; then
        PR_NUMBER="$1"
      fi
      shift
      ;;
  esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed. Please install it first:"
  echo "  https://cli.github.com/manual/installation"
  exit 1
fi

# Get current PR if not specified
if [ -z "$PR_NUMBER" ]; then
  # Try to get PR for current branch
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,url,baseRefName,headRefName,mergeable,reviewDecision,statusCheckRollup,isDraft --jq '.[0]')
  
  if [ -n "$PR_INFO" ] && [ "$PR_INFO" != "null" ]; then
    PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
    echo "ℹ️ Using current branch PR #$PR_NUMBER"
  else
    # Try to get the current PR view
    CURRENT_PR=$(gh pr view --json number 2>/dev/null | jq -r .number 2>/dev/null)
    if [ -n "$CURRENT_PR" ] && [ "$CURRENT_PR" != "null" ]; then
      PR_NUMBER="$CURRENT_PR"
      echo "ℹ️ Using current PR #$PR_NUMBER"
    else
      echo "❌ Error: No PR number specified and no current PR found"
      echo "Usage: $0 [options] PR_NUMBER"
      exit 1
    fi
  fi
fi

# Get PR information
echo "🔍 Checking PR #$PR_NUMBER..."
PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,state,url,baseRefName,headRefName,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,isDraft)

if [ $? -ne 0 ]; then
  echo "❌ Error: PR #$PR_NUMBER not found"
  exit 1
fi

# Extract information
PR_TITLE=$(echo "$PR_INFO" | jq -r '.title')
PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
PR_URL=$(echo "$PR_INFO" | jq -r '.url')
PR_BASE=$(echo "$PR_INFO" | jq -r '.baseRefName')
PR_HEAD=$(echo "$PR_INFO" | jq -r '.headRefName')
PR_MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
PR_MERGE_STATE=$(echo "$PR_INFO" | jq -r '.mergeStateStatus')
PR_REVIEW_DECISION=$(echo "$PR_INFO" | jq -r '.reviewDecision')
PR_CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup')
PR_IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')

echo "--------------------------------------"
echo "PR #$PR_NUMBER: $PR_TITLE"
echo "--------------------------------------"
echo "Status: $PR_STATE"
echo "Branch: $PR_HEAD → $PR_BASE"
echo "URL: $PR_URL"

# Check if PR is open
if [ "$PR_STATE" != "OPEN" ]; then
  echo "❌ Error: PR is not open. Current state: $PR_STATE"
  exit 1
fi

# Check if PR is a draft
if [ "$PR_IS_DRAFT" = "true" ]; then
  echo "❌ Error: PR is still in draft state"
  echo "To mark as ready for review, run: gh pr ready $PR_NUMBER"
  exit 1
fi

# Check for CI failures
FAILED_CHECKS=$(echo "$PR_CHECKS" | jq -r '[.[] | select(.conclusion == "FAILURE")] | length')
if [ "$FAILED_CHECKS" -gt 0 ]; then
  echo "⚠️ Warning: PR has $FAILED_CHECKS failed checks"
  if [ "$AUTO_MERGE" = false ]; then
    read -p "Continue with merge anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Merge aborted."
      exit 1
    fi
  else
    echo "Continuing with merge due to --yes flag..."
  fi
fi

# Check review status
if [ "$PR_REVIEW_DECISION" = "CHANGES_REQUESTED" ]; then
  echo "⚠️ Warning: Changes have been requested on this PR"
  if [ "$AUTO_MERGE" = false ]; then
    read -p "Continue with merge anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Merge aborted."
      exit 1
    fi
  else
    echo "Continuing with merge due to --yes flag..."
  fi
elif [ "$PR_REVIEW_DECISION" = "REVIEW_REQUIRED" ]; then
  echo "⚠️ Warning: Required reviews are not complete"
  if [ "$AUTO_MERGE" = false ]; then
    read -p "Continue with merge anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Merge aborted."
      exit 1
    fi
  else
    echo "Continuing with merge due to --yes flag..."
  fi
fi

# Check for merge state issues
if [ "$PR_MERGE_STATE" = "BEHIND" ]; then
  echo "⚠️ Warning: PR is behind the base branch"
  echo "Updating branch..."
  gh pr merge "$PR_NUMBER" --update-only
  echo "✅ Branch updated"
fi

# Check for merge conflicts
if [ "$PR_MERGEABLE" = "CONFLICTING" ]; then
  echo "⚠️ Warning: PR has merge conflicts"
  
  if [ "$RESOLVE_CONFLICTS" = true ]; then
    echo "Attempting to resolve conflicts..."
    
    # Get current branch to return to later
    ORIGINAL_BRANCH=$(git branch --show-current)
    
    # Check for unsaved changes before proceeding
    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "❌ Error: You have unsaved changes in your working directory"
      echo "Please commit or stash your changes before proceeding"
      exit 1
    fi
    
    # Checkout PR branch
    git fetch origin "$PR_HEAD":"$PR_HEAD" || { echo "Failed to fetch PR branch"; exit 1; }
    git checkout "$PR_HEAD" || { echo "Failed to checkout PR branch"; exit 1; }
    
    # Try to merge base branch into PR branch
    echo "Attempting to merge $PR_BASE into $PR_HEAD..."
    if git merge "origin/$PR_BASE"; then
      echo "✅ Auto-merge successful! Pushing changes..."
      git push origin "$PR_HEAD"
      echo "Conflicts resolved. Continuing with merge..."
      
      # Return to original branch
      git checkout "$ORIGINAL_BRANCH"
      
      # Refresh PR info
      PR_INFO=$(gh pr view "$PR_NUMBER" --json mergeable,mergeStateStatus)
      PR_MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
      PR_MERGE_STATE=$(echo "$PR_INFO" | jq -r '.mergeStateStatus')
      
      if [ "$PR_MERGEABLE" != "MERGEABLE" ]; then
        echo "❌ Error: PR still has conflicts after attempted resolution"
        exit 1
      fi
    else
      echo "❌ Automatic merge failed. Manual conflict resolution needed"
      git merge --abort
      git checkout "$ORIGINAL_BRANCH"
      exit 1
    fi
  else
    echo "❌ Error: Cannot merge due to conflicts"
    echo "Use --resolve-conflicts to attempt automatic conflict resolution"
    exit 1
  fi
fi

# Final confirmation
if [ "$AUTO_MERGE" = false ]; then
  echo "--------------------------------------"
  echo "Ready to merge PR #$PR_NUMBER:"
  echo "From: $PR_HEAD"
  echo "To: $PR_BASE"
  echo "Method: $MERGE_METHOD"
  echo "Delete branch: $([ "$DELETE_BRANCH" = true ] && echo "Yes" || echo "No")"
  read -p "Proceed with merge? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Merge aborted."
    exit 1
  fi
fi

# Prepare merge command
MERGE_CMD="gh pr merge $PR_NUMBER --$MERGE_METHOD"

# Add delete branch flag if needed
if [ "$DELETE_BRANCH" = true ]; then
  MERGE_CMD="$MERGE_CMD --delete-branch"
fi

# Execute merge
echo "🔄 Merging PR #$PR_NUMBER..."
eval "$MERGE_CMD"

# Verify merge succeeded
MERGED_PR=$(gh pr view "$PR_NUMBER" --json state -q .state)
if [ "$MERGED_PR" = "MERGED" ]; then
  echo "✅ PR #$PR_NUMBER has been successfully merged into $PR_BASE"
  
  # Check if we should update develop from main
  if [ "$PR_BASE" = "main" ] && [ "$PR_HEAD" != "develop" ]; then
    # Check if develop branch exists
    if git show-ref --verify --quiet refs/heads/develop || git show-ref --verify --quiet refs/remotes/origin/develop; then
      echo ""
      echo "Would you like to update develop branch with these changes from main?"
      if [ "$AUTO_MERGE" = true ]; then
        SYNC_DEVELOP="y"
      else
        read -p "Update develop from main? (y/n) " -n 1 -r SYNC_DEVELOP
        echo
      fi
      
      if [[ $SYNC_DEVELOP =~ ^[Yy]$ ]]; then
        echo "🔄 Updating develop from main..."
        git fetch origin main develop
        git checkout develop
        git merge origin/main
        git push origin develop
        echo "✅ develop branch updated from main"
      fi
    fi
  fi
else
  echo "❌ Error: Failed to merge PR #$PR_NUMBER"
  echo "Current state: $MERGED_PR"
  exit 1
fi