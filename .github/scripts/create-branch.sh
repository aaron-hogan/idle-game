#!/bin/bash
# AI-assistant branch creation with validation

set -e

# Require branch type and description
if [ $# -lt 2 ]; then
  echo "❌ Error: Missing required parameters"
  echo "Usage: $0 <type> <description>"
  echo "Example: $0 feature new-login-system"
  echo ""
  echo "Available types:"
  echo "  - feature (new functionality)"
  echo "  - fix (bug fixes)"
  echo "  - refactor (code improvements)"
  echo "  - docs (documentation updates)"
  echo "  - chore (maintenance tasks)"
  echo "  - ci (CI/CD changes)"
  echo "  - test (test improvements)"
  exit 1
fi

BRANCH_TYPE=$1
BRANCH_DESC=$2

# Validate branch type
if [[ ! "$BRANCH_TYPE" =~ ^(feature|fix|docs|refactor|ci|chore|test)$ ]]; then
  echo "❌ Error: Invalid branch type. Must be: feature, fix, docs, refactor, ci, chore, test"
  exit 1
fi

# Create kebab-case branch name
BRANCH_NAME="$BRANCH_TYPE/$(echo "$BRANCH_DESC" | tr '[:upper:] ' '[:lower:]-')"

# Check if we're on main or develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" == "main" ]; then
  # Checkout from main
  git pull origin main
  git checkout -b "$BRANCH_NAME"
  echo "✅ Created branch $BRANCH_NAME from main"
elif [ "$CURRENT_BRANCH" == "develop" ]; then
  # Checkout from develop
  git pull origin develop
  git checkout -b "$BRANCH_NAME"
  echo "✅ Created branch $BRANCH_NAME from develop"
else
  # Ask if they want to continue
  echo "⚠️  Warning: You are not on main or develop branch"
  echo "Current branch: $CURRENT_BRANCH"
  read -p "Create branch from current branch? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout -b "$BRANCH_NAME"
    echo "✅ Created branch $BRANCH_NAME from $CURRENT_BRANCH"
  else
    echo "Operation cancelled. No branch was created."
    exit 1
  fi
fi

# Provide next steps
echo ""
echo "Next steps:"
echo "1. Make your changes with conventional commits (feat:, fix:, docs:, etc.)"
echo "2. Update CHANGELOG.md in the [Unreleased] section"
echo "3. Push your branch with: git push -u origin $BRANCH_NAME"
echo "4. Create a PR to develop branch when ready"