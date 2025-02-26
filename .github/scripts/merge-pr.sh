#!/bin/bash
# AI-assistant PR merge script with validation

# Check if PR number is provided
if [ -z "$1" ]; then
  # If no PR number, try to get current branch's PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,mergeable,mergeStateStatus --jq '.[0]')
  
  if [ -z "$PR_INFO" ]; then
    echo "No open PR found for current branch"
    exit 1
  fi
  
  PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
else
  # Use provided PR number
  PR_NUMBER=$1
  PR_INFO=$(gh pr view $PR_NUMBER --json number,title,state,mergeable,mergeStateStatus --jq '.')
fi

# Check PR status
MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
MERGE_STATE=$(echo "$PR_INFO" | jq -r '.mergeStateStatus')
PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
PR_TITLE=$(echo "$PR_INFO" | jq -r '.title')

echo "PR #$PR_NUMBER: $PR_TITLE"
echo "Status: $PR_STATE, Mergeable: $MERGEABLE, Merge state: $MERGE_STATE"

# Validate PR can be merged
if [ "$PR_STATE" != "OPEN" ]; then
  echo "ERROR: PR is not open (current state: $PR_STATE)"
  exit 1
fi

if [ "$MERGEABLE" != "MERGEABLE" ]; then
  echo "ERROR: PR is not mergeable (current status: $MERGEABLE)"
  exit 1
fi

if [ "$MERGE_STATE" != "CLEAN" ]; then
  echo "ERROR: PR merge state is not clean (current state: $MERGE_STATE)"
  
  # Check specific blocking conditions
  if [ "$MERGE_STATE" == "BEHIND" ]; then
    echo "PR is behind the base branch. Would you like to update the branch? (y/n)"
    read -r UPDATE_BRANCH
    if [[ "$UPDATE_BRANCH" =~ ^[Yy]$ ]]; then
      gh pr merge $PR_NUMBER --update-only
      echo "Branch updated. Please run this script again to check status."
      exit 0
    else
      exit 1
    fi
  else
    exit 1
  fi
fi

# Prompt for merge confirmation
echo "Ready to merge PR #$PR_NUMBER"
echo "Would you like to proceed with the merge? (y/n)"
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  # Perform the merge
  gh pr merge $PR_NUMBER --merge --delete-branch
  
  if [ $? -eq 0 ]; then
    echo "PR #$PR_NUMBER successfully merged and branch deleted"
    
    # Optional: checkout main and pull latest changes
    git checkout main
    git pull
  else
    echo "ERROR: Failed to merge PR #$PR_NUMBER"
    exit 1
  fi
else
  echo "Merge canceled"
  exit 0
fi