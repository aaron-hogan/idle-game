#!/bin/bash
# AI-assistant PR merge script with enhanced conflict detection and resolution

# Default values
AUTO_YES=false
RESOLVE_CONFLICTS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --yes)
      AUTO_YES=true
      shift
      ;;
    --resolve-conflicts)
      RESOLVE_CONFLICTS=true
      shift
      ;;
    --*)
      # Skip unknown options
      shift
      ;;
    *)
      # First non-option is PR number
      PR_NUMBER_ARG=$1
      shift
      ;;
  esac
done

# Check if PR number is provided
if [ -z "$PR_NUMBER_ARG" ]; then
  # If no PR number, try to get current branch's PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,mergeable,mergeStateStatus,headRefName,baseRefName --jq '.[0]')
  
  if [ -z "$PR_INFO" ]; then
    echo "No open PR found for current branch"
    exit 1
  fi
  
  PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
else
  # Use provided PR number
  PR_NUMBER=$PR_NUMBER_ARG
  PR_INFO=$(gh pr view $PR_NUMBER --json number,title,state,mergeable,mergeStateStatus,headRefName,baseRefName --jq '.')
fi

# Extract PR information
MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
MERGE_STATE=$(echo "$PR_INFO" | jq -r '.mergeStateStatus')
PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
PR_TITLE=$(echo "$PR_INFO" | jq -r '.title')
HEAD_BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName')
BASE_BRANCH=$(echo "$PR_INFO" | jq -r '.baseRefName')

echo "PR #$PR_NUMBER: $PR_TITLE"
echo "Branches: $HEAD_BRANCH → $BASE_BRANCH"
echo "Status: $PR_STATE, Mergeable: $MERGEABLE, Merge state: $MERGE_STATE"

# Validate PR can be merged
if [ "$PR_STATE" != "OPEN" ]; then
  echo "ERROR: PR is not open (current state: $PR_STATE)"
  exit 1
fi

if [ "$MERGEABLE" != "MERGEABLE" ]; then
  echo "ERROR: PR is not mergeable (current status: $MERGEABLE)"
  
  if [ "$RESOLVE_CONFLICTS" = true ]; then
    echo "Attempting to resolve conflicts locally..."
    
    # Get current branch to return to later
    ORIGINAL_BRANCH=$(git branch --show-current)
    
    # Checkout PR branch
    git fetch origin "$HEAD_BRANCH":"$HEAD_BRANCH" || { echo "Failed to fetch PR branch"; exit 1; }
    git checkout "$HEAD_BRANCH" || { echo "Failed to checkout PR branch"; exit 1; }
    
    # Try to merge base branch into PR branch
    echo "Attempting to merge $BASE_BRANCH into $HEAD_BRANCH..."
    if git merge "origin/$BASE_BRANCH"; then
      echo "Auto-merge successful! Pushing changes..."
      git push origin "$HEAD_BRANCH"
      echo "Conflicts resolved. Please run this script again to verify mergeable status."
      
      # Return to original branch
      git checkout "$ORIGINAL_BRANCH"
      exit 0
    else
      echo "Automatic merge failed. Manual conflict resolution needed."
      echo "Resolve conflicts in your editor, then:"
      echo "  1. git add <resolved_files>"
      echo "  2. git commit -m \"Resolve merge conflicts\""
      echo "  3. git push origin $HEAD_BRANCH"
      echo "  4. Run this script again"
      
      # Stay in PR branch for manual resolution
      echo "Left you on branch $HEAD_BRANCH for conflict resolution."
      exit 1
    fi
  else
    echo "Use --resolve-conflicts to attempt automatic conflict resolution"
    exit 1
  fi
fi

# Handle various merge states
if [ "$MERGE_STATE" != "CLEAN" ]; then
  echo "WARNING: PR merge state is not clean (current state: $MERGE_STATE)"
  
  # Check specific blocking conditions
  if [ "$MERGE_STATE" == "BEHIND" ]; then
    echo "PR is behind the base branch. Would you like to update the branch? (y/n)"
    if [ "$AUTO_YES" = true ]; then
      UPDATE_BRANCH="y"
    else
      read -r UPDATE_BRANCH
    fi
    
    if [[ "$UPDATE_BRANCH" =~ ^[Yy]$ ]]; then
      echo "Updating branch..."
      gh pr merge $PR_NUMBER --update-only
      echo "Branch updated. Please run this script again to check status."
      exit 0
    else
      exit 1
    fi
  elif [ "$MERGE_STATE" == "BLOCKED" ]; then
    echo "PR is blocked. Checking for failed checks..."
    gh pr checks $PR_NUMBER
    exit 1
  elif [ "$MERGE_STATE" == "UNSTABLE" ]; then
    echo "PR is unstable. Checking for pending or failed checks..."
    gh pr checks $PR_NUMBER
    
    if [ "$AUTO_YES" = true ]; then
      echo "Force merging unstable PR due to --yes flag..."
    else
      echo "Do you want to proceed with merging despite unstable status? (y/n)"
      read -r FORCE_MERGE
      if [[ ! "$FORCE_MERGE" =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
  else
    echo "Unknown merge state. Proceed with caution."
    if [ "$AUTO_YES" != true ]; then
      echo "Do you want to continue anyway? (y/n)"
      read -r CONTINUE
      if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
  fi
fi

# Prompt for merge confirmation (unless --yes flag is used)
echo "Ready to merge PR #$PR_NUMBER"
if [ "$AUTO_YES" = true ]; then
  CONFIRM="y"
else
  echo "Would you like to proceed with the merge? (y/n)"
  read -r CONFIRM
fi

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  # Perform the merge
  echo "Merging PR..."
  gh pr merge $PR_NUMBER --merge --delete-branch
  
  if [ $? -eq 0 ]; then
    echo "✅ PR #$PR_NUMBER successfully merged and branch deleted"
    
    # Optional: checkout main and pull latest changes
    git checkout $BASE_BRANCH
    git pull
  else
    echo "❌ ERROR: Failed to merge PR #$PR_NUMBER"
    exit 1
  fi
else
  echo "Merge canceled"
  exit 0
fi