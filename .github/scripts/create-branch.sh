#!/bin/bash
# AI-assistant branch creation with validation

# Require branch type and description
if [ $# -lt 2 ]; then
  echo "Usage: $0 <type> <description>"
  echo "Types: feature, fix, docs, refactor, ci, chore, test"
  exit 1
fi

BRANCH_TYPE=$1
BRANCH_DESC=$2

# Validate branch type
if [[ ! "$BRANCH_TYPE" =~ ^(feature|fix|docs|refactor|ci|chore|test)$ ]]; then
  echo "ERROR: Invalid branch type. Must be: feature, fix, docs, refactor, ci, chore, test"
  exit 1
fi

# Create kebab-case branch name
BRANCH_NAME="$BRANCH_TYPE/$(echo "$BRANCH_DESC" | tr '[:upper:] ' '[:lower:]-')"

# Check if on main branch before creating new branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "WARNING: Not on main branch. Creating branch from $CURRENT_BRANCH instead of main."
fi

# Check for unsaved changes before proceeding
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "WARNING: You have unsaved changes in your working directory."
  echo "Do you want to continue anyway? Changes will be carried to the new branch. (y/n)"
  read -r CONTINUE
  
  if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo "Branch creation canceled. Please commit or stash your changes first."
    exit 1
  fi
  
  echo "Proceeding with uncommitted changes..."
fi

# Create and checkout branch
git checkout -b "$BRANCH_NAME"
echo "Created and switched to branch: $BRANCH_NAME"