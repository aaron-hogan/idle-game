#!/bin/bash
# AI-friendly PR merging script
# Simplified version with minimal output and no interactive prompts

set -e

# Default values
PR_NUMBER=""
MERGE_METHOD="merge"
DELETE_BRANCH=true
SYNC_DEVELOP=true
BYPASS_CHECKS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --squash)
      MERGE_METHOD="squash"
      shift
      ;;
    --rebase)
      MERGE_METHOD="rebase"
      shift
      ;;
    --keep-branch)
      DELETE_BRANCH=false
      shift
      ;;
    --no-sync)
      SYNC_DEVELOP=false
      shift
      ;;
    --force)
      BYPASS_CHECKS=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [options] PR_NUMBER"
      echo ""
      echo "Options:"
      echo "  --squash             Squash commits when merging"
      echo "  --rebase             Rebase commits when merging"
      echo "  --keep-branch        Don't delete branch after merging"
      echo "  --no-sync            Don't sync develop from main"
      echo "  --force              Bypass checks and merge anyway"
      echo "  --help, -h           Show this help"
      exit 0
      ;;
    *)
      if [[ $1 =~ ^[0-9]+$ ]]; then
        PR_NUMBER=$1
      fi
      shift
      ;;
  esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo '{"success":false,"error":"GitHub CLI not installed"}'
  exit 1
fi

# Validate PR number
if [ -z "$PR_NUMBER" ]; then
  # Try to get current branch PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number --jq '.[0].number' 2>/dev/null)
  
  if [ -z "$PR_INFO" ] || [ "$PR_INFO" = "null" ]; then
    echo '{"success":false,"error":"No PR number provided and no PR found for current branch"}'
    exit 1
  fi
  
  PR_NUMBER=$PR_INFO
fi

# Get PR information
PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,state,url,baseRefName,headRefName,mergeable,mergeStateStatus,reviewDecision,isDraft 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "{\"success\":false,\"error\":\"PR #$PR_NUMBER not found\"}"
  exit 1
fi

# Extract key PR information
PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
PR_BASE=$(echo "$PR_INFO" | jq -r '.baseRefName')
PR_HEAD=$(echo "$PR_INFO" | jq -r '.headRefName')
PR_MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
PR_MERGE_STATE=$(echo "$PR_INFO" | jq -r '.mergeStateStatus')
PR_REVIEW=$(echo "$PR_INFO" | jq -r '.reviewDecision')
PR_IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')

# Check if PR is open
if [ "$PR_STATE" != "OPEN" ]; then
  echo "{\"success\":false,\"error\":\"PR is not open. Current state: $PR_STATE\"}"
  exit 1
fi

# Check if PR is a draft
if [ "$PR_IS_DRAFT" = "true" ] && [ "$BYPASS_CHECKS" = false ]; then
  echo "{\"success\":false,\"error\":\"PR is in draft state\"}"
  exit 1
fi

# Check review status
if [ "$PR_REVIEW" = "CHANGES_REQUESTED" ] && [ "$BYPASS_CHECKS" = false ]; then
  echo "{\"success\":false,\"error\":\"Changes have been requested on this PR\"}"
  exit 1
fi

# Check for conflicts
if [ "$PR_MERGEABLE" = "CONFLICTING" ]; then
  echo "{\"success\":false,\"error\":\"PR has merge conflicts\"}"
  exit 1
fi

# Update branch if behind
if [ "$PR_MERGE_STATE" = "BEHIND" ]; then
  gh pr merge "$PR_NUMBER" --update-only >/dev/null 2>&1
fi

# Prepare merge command
MERGE_CMD="gh pr merge $PR_NUMBER --$MERGE_METHOD --admin"
if [ "$DELETE_BRANCH" = true ]; then
  MERGE_CMD="$MERGE_CMD --delete-branch"
fi

# Execute merge
if ! MERGE_OUTPUT=$(eval "$MERGE_CMD" 2>&1); then
  echo "{\"success\":false,\"error\":\"$MERGE_OUTPUT\"}"
  exit 1
fi

# Verify merge succeeded
MERGED_PR=$(gh pr view "$PR_NUMBER" --json state -q .state 2>/dev/null)
if [ "$MERGED_PR" != "MERGED" ]; then
  echo "{\"success\":false,\"error\":\"Failed to merge PR. Current state: $MERGED_PR\"}"
  exit 1
fi

# Update develop from main if requested
SYNC_RESULT="null"
if [ "$SYNC_DEVELOP" = true ] && [ "$PR_BASE" = "main" ] && [ "$PR_HEAD" != "develop" ]; then
  # Check if develop branch exists
  if git show-ref --verify --quiet refs/heads/develop || git show-ref --verify --quiet refs/remotes/origin/develop; then
    git fetch origin main develop >/dev/null 2>&1
    git checkout develop >/dev/null 2>&1
    git merge origin/main >/dev/null 2>&1
    git push origin develop >/dev/null 2>&1
    SYNC_RESULT="{\"synced\":true,\"message\":\"develop branch updated from main\"}"
  else
    SYNC_RESULT="{\"synced\":false,\"message\":\"develop branch not found\"}"
  fi
fi

# Return success result
echo "{\"success\":true,\"pr\":$PR_NUMBER,\"method\":\"$MERGE_METHOD\",\"deleted\":$DELETE_BRANCH,\"sync\":$SYNC_RESULT}"