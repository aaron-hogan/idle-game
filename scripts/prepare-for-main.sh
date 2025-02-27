#!/bin/bash
# prepare-for-main.sh - Safely prepare a branch for merging to main
# 
# This script helps automate the process of preparing a branch for merging to main:
# 1. Updates from latest main
# 2. Checks for changelog entries
# 3. Versions changes if needed
# 4. Runs validation checks

set -e # Exit on any error

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"

# Display help
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo -e "Usage: ./scripts/prepare-for-main.sh [--force | --dry-run]"
  echo
  echo -e "Options:"
  echo -e "  --force      Skip confirmation prompts"
  echo -e "  --dry-run    Show what would be done without making changes"
  echo -e "  --help       Show this help message"
  echo
  echo -e "This script helps prepare your branch for merging to main by:"
  echo -e "  1. Updating from latest main"
  echo -e "  2. Checking for unreleased changelog entries"
  echo -e "  3. Automating version bumping if needed"
  echo -e "  4. Running validation checks"
  exit 0
fi

# Parse options
FORCE=false
DRY_RUN=false

for arg in "$@"; do
  case $arg in
    --force)
      FORCE=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
  esac
done

# Ensure we're in a git repository
if [ -z "$REPO_ROOT" ]; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Check if the script is run from the correct location
if [ ! -f "$REPO_ROOT/CHANGELOG.md" ]; then
  echo -e "${RED}Error: CHANGELOG.md not found. Make sure you're in the project root.${NC}"
  exit 1
fi

# Check if we have the version bumping script
if [ ! -f "$REPO_ROOT/scripts/bump-version.sh" ]; then
  echo -e "${RED}Error: bump-version.sh not found. Make sure you have the required scripts.${NC}"
  exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Don't run on main branch
if [ "$CURRENT_BRANCH" == "main" ]; then
  echo -e "${RED}Error: This script should not be run on the main branch.${NC}"
  echo -e "Please checkout a feature branch first."
  exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Branch Preparation for Merging to Main${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"
echo

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN MODE: No changes will be made${NC}"
  echo
fi

# Function to safely execute commands in dry run mode
safe_execute() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Would execute: ${BLUE}$@${NC}"
  else
    echo -e "${BLUE}Executing: $@${NC}"
    "$@"
  fi
}

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}Warning: You have uncommitted changes:${NC}"
  git status --short
  echo
  
  if [ "$FORCE" != true ]; then
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Operation cancelled. Please commit or stash your changes.${NC}"
      exit 0
    fi
  fi
fi

# Step 1: Update from latest main
echo -e "${BLUE}Step 1: Updating from latest main${NC}"
safe_execute git fetch origin main
if [ "$DRY_RUN" != true ]; then
  BEHIND_COUNT=$(git rev-list --count HEAD..origin/main)
  
  if [ "$BEHIND_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Your branch is $BEHIND_COUNT commit(s) behind main.${NC}"
    
    if [ "$FORCE" != true ]; then
      read -p "Rebase on latest main? (y/N) " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Skipping rebase. You should consider updating before merging.${NC}"
      else
        safe_execute git rebase origin/main
        echo -e "${GREEN}Successfully rebased on latest main.${NC}"
      fi
    else
      safe_execute git rebase origin/main
      echo -e "${GREEN}Successfully rebased on latest main.${NC}"
    fi
  else
    echo -e "${GREEN}Your branch is up to date with main.${NC}"
  fi
fi
echo

# Step 2: Check for unreleased changelog entries
echo -e "${BLUE}Step 2: Checking for unreleased changelog entries${NC}"

CHANGELOG_HAS_UNRELEASED=false
if [ "$DRY_RUN" != true ]; then
  if grep -A 10 "## \[Unreleased\]" CHANGELOG.md | grep -q "^### "; then
    CHANGELOG_HAS_UNRELEASED=true
    echo -e "${YELLOW}Unreleased changes found in CHANGELOG.md:${NC}"
    grep -A 20 "## \[Unreleased\]" CHANGELOG.md | sed -n '/^###/,/^## \[/p' | grep -v "^## \["
    echo
  else
    echo -e "${GREEN}No unreleased entries found in CHANGELOG.md.${NC}"
    
    # Check if there were any code changes at all
    CODE_FILES_CHANGED=$(git diff --name-only origin/main...$CURRENT_BRANCH | grep -E '\.(js|jsx|ts|tsx)$' || true)
    if [ -n "$CODE_FILES_CHANGED" ]; then
      echo -e "${YELLOW}Warning: Your branch has code changes but no changelog entries.${NC}"
      
      if [ "$FORCE" != true ]; then
        read -p "Add entries to CHANGELOG.md now? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          echo -e "${YELLOW}Please manually update CHANGELOG.md, then run this script again.${NC}"
          exit 0
        fi
      fi
    fi
  fi
fi
echo

# Step 3: Version changes if needed
if [ "$CHANGELOG_HAS_UNRELEASED" = true ]; then
  echo -e "${BLUE}Step 3: Versioning changes${NC}"
  
  # Get current version from package.json
  CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
  echo -e "Current version: ${YELLOW}$CURRENT_VERSION${NC}"
  
  # Ask for version type if not forced
  if [ "$FORCE" != true ]; then
    echo -e "What type of version bump is needed?"
    echo -e "  ${BLUE}1) Patch${NC} - Bug fixes (x.y.Z)"
    echo -e "  ${BLUE}2) Minor${NC} - New features, no breaking changes (x.Y.z)"
    echo -e "  ${BLUE}3) Major${NC} - Breaking changes (X.y.z)"
    read -p "Select option (1-3): " VERSION_OPTION
    
    case $VERSION_OPTION in
      1) VERSION_TYPE="patch" ;;
      2) VERSION_TYPE="minor" ;;
      3) VERSION_TYPE="major" ;;
      *) 
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
    esac
  else
    # Default to patch for forced mode
    VERSION_TYPE="patch"
  fi
  
  # Calculate new version
  NEW_VERSION=$(node -e "
    const [major, minor, patch] = '$CURRENT_VERSION'.split('.').map(Number);
    if ('$VERSION_TYPE' === 'major') console.log(\`\${major+1}.0.0\`);
    else if ('$VERSION_TYPE' === 'minor') console.log(\`\${major}.\${minor+1}.0\`);
    else console.log(\`\${major}.\${minor}.\${patch+1}\`);
  ")
  
  echo -e "Bumping version from ${YELLOW}$CURRENT_VERSION${NC} to ${GREEN}$NEW_VERSION${NC}"
  
  # Execute the version bump
  safe_execute $REPO_ROOT/scripts/bump-version.sh $NEW_VERSION
  
  # Commit the changes
  if [ "$DRY_RUN" != true ]; then
    safe_execute git add CHANGELOG.md package.json
    safe_execute git commit -m "chore: bump version to $NEW_VERSION"
    echo -e "${GREEN}Version bumped and changes committed.${NC}"
  fi
else
  echo -e "${BLUE}Step 3: Versioning changes${NC}"
  echo -e "${GREEN}No versioning needed.${NC}"
fi
echo

# Step 4: Run validation checks
echo -e "${BLUE}Step 4: Running validation checks${NC}"

if [ "$DRY_RUN" != true ]; then
  echo -e "Running type checking..."
  safe_execute npm run typecheck
  
  echo -e "Running linting..."
  safe_execute npm run lint
  
  echo -e "Running tests..."
  safe_execute npm test
  
  if [ -f "$REPO_ROOT/scripts/sync-todos.sh" ]; then
    echo -e "Checking todo synchronization..."
    safe_execute $REPO_ROOT/scripts/sync-todos.sh
  fi
  
  echo -e "${GREEN}All validation checks passed!${NC}"
else
  echo -e "${YELLOW}Would run: npm run typecheck && npm run lint && npm test${NC}"
  if [ -f "$REPO_ROOT/scripts/sync-todos.sh" ]; then
    echo -e "${YELLOW}Would run: $REPO_ROOT/scripts/sync-todos.sh${NC}"
  fi
fi
echo

# Final summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Branch preparation complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "Your branch ${YELLOW}$CURRENT_BRANCH${NC} is now ready for merging to main."
echo
echo -e "Next steps:"
echo -e "1. Push your changes: ${BLUE}git push origin $CURRENT_BRANCH${NC}"
echo -e "2. Create a pull request: ${BLUE}gh pr create${NC} or use GitHub web interface"
echo

exit 0