#!/bin/bash
# AI-assistant PR status checker

# Check if PR number is provided
if [ -z "$1" ]; then
  # If no PR number, try to get current branch's PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,url,reviewDecision,statusCheckRollup --jq '.[0]')
  
  if [ -z "$PR_INFO" ]; then
    echo "No open PR found for current branch"
    exit 1
  fi
else
  # Use provided PR number
  PR_INFO=$(gh pr view "$1" --json number,title,state,url,reviewDecision,statusCheckRollup --jq '.')
fi

# Output PR status in JSON format for easy parsing by Claude
echo "$PR_INFO"