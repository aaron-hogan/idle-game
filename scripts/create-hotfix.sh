#!/bin/bash
# Script to create a new hotfix branch from main

set -e

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

# Get issue description
read -p "Enter brief hotfix description (e.g., fix-login-timeout): " HOTFIX_DESC

# Validate description
if [ -z "$HOTFIX_DESC" ]; then
  echo "❌ Error: Hotfix description is required"
  exit 1
fi

# Create properly formatted description
HOTFIX_DESC=$(echo $HOTFIX_DESC | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Create hotfix branch
BRANCH_NAME="hotfix/$HOTFIX_DESC"
git checkout -b $BRANCH_NAME

echo "🔧 Hotfix branch $BRANCH_NAME created"
echo ""
echo "Next steps:"
echo "1. Fix the issue with conventional commits (e.g., 'fix: login timeout issue')"
echo "2. Create PRs to both main AND develop branches"
echo "3. When merged to main, semantic-release will automatically create a patch version"
echo ""