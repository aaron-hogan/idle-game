#!/bin/bash
# AI-friendly branch creation script
# Simplified version with minimal output and no interactive prompts

set -e

# Usage function
usage() {
  echo "Usage: $0 <type> <description>"
  echo "Example: $0 feature login-system"
  echo ""
  echo "Types: feature, fix, docs, refactor, ci, chore, test"
  exit 1
}

# Validate arguments
if [ $# -lt 2 ]; then
  usage
fi

BRANCH_TYPE=$1
BRANCH_DESC=$2
BASE_BRANCH=${3:-"develop"} # Default to develop if not specified

# Validate branch type
if [[ ! "$BRANCH_TYPE" =~ ^(feature|fix|docs|refactor|ci|chore|test)$ ]]; then
  echo "Error: Invalid type '$BRANCH_TYPE'"
  usage
fi

# Create kebab-case branch name
BRANCH_NAME="$BRANCH_TYPE/$(echo "$BRANCH_DESC" | tr '[:upper:] ' '[:lower:]-')"

# Fetch latest from remote
git fetch origin "$BASE_BRANCH" --quiet

# Checkout base branch and update
git checkout "$BASE_BRANCH" --quiet
git pull origin "$BASE_BRANCH" --quiet

# Create and checkout new branch
git checkout -b "$BRANCH_NAME" --quiet

# Output JSON result
cat << EOF
{
  "success": true,
  "branch": "$BRANCH_NAME",
  "base": "$BASE_BRANCH",
  "message": "Branch $BRANCH_NAME created from $BASE_BRANCH"
}
EOF