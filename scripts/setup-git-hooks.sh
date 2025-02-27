#!/bin/bash
# setup-git-hooks.sh - Safely install git hooks with user confirmation
# 
# This script installs git hooks to automate validation tasks
# Each hook is carefully designed with safety checks and escape hatches

set -e # Exit on any error

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

# Ensure we're in the repo
if [ ! -d "$HOOKS_DIR" ]; then
  echo -e "${RED}Error: Not in a git repository or .git/hooks directory not found${NC}"
  exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Git Hooks Installation Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "This script will install the following git hooks:"
echo -e "  ${YELLOW}pre-commit${NC}: Runs linting and todo sync checks"
echo -e "  ${YELLOW}pre-push${NC}: Runs tests and validation"
echo -e "  ${YELLOW}prepare-commit-msg${NC}: Checks changelog if on main"
echo
echo -e "${YELLOW}Note:${NC} All hooks include bypass options for special cases"
echo -e "${YELLOW}Note:${NC} You can uninstall hooks with --uninstall flag"
echo

# Check for uninstall flag
if [ "$1" == "--uninstall" ]; then
  read -p "Are you sure you want to remove all installed git hooks? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Hooks removal cancelled.${NC}"
    exit 0
  fi
  
  # Remove all hooks we might have installed
  for hook in pre-commit pre-push prepare-commit-msg; do
    if [ -f "$HOOKS_DIR/$hook" ]; then
      if grep -q "MANAGED BY SETUP-GIT-HOOKS.SH" "$HOOKS_DIR/$hook"; then
        rm "$HOOKS_DIR/$hook"
        echo -e "${GREEN}Removed hook: ${YELLOW}$hook${NC}"
      else
        echo -e "${YELLOW}Skipping non-managed hook: ${NC}$hook"
      fi
    fi
  done
  
  echo -e "${GREEN}Git hooks successfully removed.${NC}"
  exit 0
fi

# User confirmation
read -p "Install git hooks to automate validation? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Installation cancelled.${NC}"
  exit 0
fi

# Function to install a hook safely
install_hook() {
  local hook_name=$1
  local hook_content=$2
  local hook_path="$HOOKS_DIR/$hook_name"
  
  # Check if hook already exists and isn't managed by us
  if [ -f "$hook_path" ] && ! grep -q "MANAGED BY SETUP-GIT-HOOKS.SH" "$hook_path"; then
    echo -e "${YELLOW}Warning: $hook_name hook already exists and is not managed by this script.${NC}"
    echo -e "Existing hook content:"
    echo -e "${BLUE}$(cat "$hook_path")${NC}"
    echo
    read -p "Override existing hook? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Skipping $hook_name hook installation.${NC}"
      return
    fi
  fi
  
  # Create the hook
  cat > "$hook_path" << EOF
#!/bin/bash
# MANAGED BY SETUP-GIT-HOOKS.SH - DO NOT EDIT DIRECTLY
# Created on $(date)
# To bypass, use: git commit/push --no-verify

$hook_content
EOF
  
  # Make it executable
  chmod +x "$hook_path"
  echo -e "${GREEN}Installed hook: ${YELLOW}$hook_name${NC}"
}

# Pre-commit hook
PRE_COMMIT_CONTENT='
# Safety checks
if [ "$BYPASS_HOOKS" = "1" ]; then
  echo "🔄 Bypassing pre-commit hook (BYPASS_HOOKS=1)"
  exit 0
fi

if [ "$GIT_REFLOG_ACTION" = "rebase" ]; then
  echo "🔄 Bypassing pre-commit hook during rebase"
  exit 0
fi

# Check for --no-verify flag
for arg in "$@"; do
  if [ "$arg" = "--no-verify" ]; then
    echo "🔄 Bypassing pre-commit hook (--no-verify)"
    exit 0
  fi
done

echo "🔍 Running pre-commit checks..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.tsx?$|\.jsx?$|\.md$" || true)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No relevant files to check"
  exit 0
fi

# Run linting on staged files only
if [[ "$STAGED_FILES" == *".ts"* || "$STAGED_FILES" == *".tsx"* || "$STAGED_FILES" == *".js"* || "$STAGED_FILES" == *".jsx"* ]]; then
  echo "🔍 Running linting on staged files..."
  npx eslint $(echo "$STAGED_FILES" | grep -E "\.tsx?$|\.jsx?$" | tr "\n" " ") --quiet
  if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues before committing."
    echo "   (Use git commit --no-verify to bypass if needed)"
    exit 1
  fi
  echo "✅ Linting passed"
fi

# Check if any todo files were changed
if [[ "$STAGED_FILES" == *".md"* ]]; then
  TODO_FILES=$(echo "$STAGED_FILES" | grep -E "todo\.md$|implementation-plan\.md$" || true)
  if [ ! -z "$TODO_FILES" ]; then
    echo "🔍 Todo files changed, checking synchronization..."
    if [ -f "./scripts/sync-todos.sh" ]; then
      ./scripts/sync-todos.sh --quick
      if [ $? -ne 0 ]; then
        echo "⚠️  Todo synchronization issues detected"
        echo "   Consider running ./scripts/sync-todos.sh to fix"
        echo "   (Use git commit --no-verify to bypass)"
        # Warning only, not blocking
      fi
    fi
  fi
fi

echo "✅ Pre-commit checks passed!"
exit 0
'

# Pre-push hook
PRE_PUSH_CONTENT='
# Safety checks
if [ "$BYPASS_HOOKS" = "1" ]; then
  echo "🔄 Bypassing pre-push hook (BYPASS_HOOKS=1)"
  exit 0
fi

# Check for --no-verify flag
for arg in "$@"; do
  if [ "$arg" = "--no-verify" ]; then
    echo "🔄 Bypassing pre-push hook (--no-verify)"
    exit 0
  fi
done

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🔍 Running pre-push checks for branch: $CURRENT_BRANCH..."

# If pushing to main, run complete validation
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "⚠️  Pushing to main branch detected!"
  echo "🔍 Running full validation..."
  
  # Check for unreleased changelog entries
  if [ -f "./.github/workflows/scripts/check-changelog.sh" ]; then
    echo "🔍 Checking changelog..."
    ./.github/workflows/scripts/check-changelog.sh
    if [ $? -ne 0 ]; then
      echo "❌ Changelog validation failed. Please version your changes before pushing to main."
      echo "   Run ./scripts/bump-version.sh X.Y.Z to version your changes."
      echo "   (Use git push --no-verify to bypass if needed)"
      exit 1
    fi
  fi
  
  # Run typechecking
  echo "🔍 Running type checking..."
  npm run typecheck
  if [ $? -ne 0 ]; then
    echo "❌ Type checking failed. Please fix type errors before pushing to main."
    echo "   (Use git push --no-verify to bypass if needed)"
    exit 1
  fi
  
  # Run tests
  echo "🔍 Running tests..."
  npm test
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix failing tests before pushing to main."
    echo "   (Use git push --no-verify to bypass if needed)"
    exit 1
  fi
else
  # For non-main branches, run basic checks
  echo "🔍 Running basic validation..."
  
  # Run typechecking but don't fail the push
  echo "🔍 Running type checking..."
  npm run typecheck
  if [ $? -ne 0 ]; then
    echo "⚠️  Type checking found issues, but continuing with push"
    echo "   Please fix type errors before creating a PR"
  else
    echo "✅ Type checking passed"
  fi
fi

echo "✅ Pre-push checks passed!"
exit 0
'

# Prepare-commit-msg hook
PREPARE_COMMIT_MSG_CONTENT='
# This hook runs when preparing the commit message
# It only does validations, never modifies the message

# Get the commit message file
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Safety checks - we never want to interfere with certain Git operations
if [ "$COMMIT_SOURCE" = "merge" ] || [ "$COMMIT_SOURCE" = "squash" ] || [ "$COMMIT_SOURCE" = "rebase" ]; then
  exit 0
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Check if committing to main branch directly
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "⚠️  WARNING: You are committing directly to the main branch!"
  echo "   This is generally discouraged. Consider using a feature branch instead."
  echo "   Continuing in 3 seconds..."
  sleep 3
  
  # If on main branch, check CHANGELOG.md for unreleased entries
  if [ -f "CHANGELOG.md" ] && [ -f "./.github/workflows/scripts/check-changelog.sh" ]; then
    ./.github/workflows/scripts/check-changelog.sh
    if [ $? -ne 0 ]; then
      echo "❌ Changelog validation failed. Please version your changes before committing to main."
      echo "   Run ./scripts/bump-version.sh X.Y.Z to version your changes."
      exit 1
    fi
  fi
fi

exit 0
'

# Install hooks
install_hook "pre-commit" "$PRE_COMMIT_CONTENT"
install_hook "pre-push" "$PRE_PUSH_CONTENT"
install_hook "prepare-commit-msg" "$PREPARE_COMMIT_MSG_CONTENT"

echo -e "${GREEN}All git hooks successfully installed!${NC}"
echo
echo -e "${YELLOW}Notes:${NC}"
echo -e "- To bypass hooks temporarily: ${BLUE}git commit/push --no-verify${NC}"
echo -e "- To bypass all hooks in a session: ${BLUE}export BYPASS_HOOKS=1${NC}"
echo -e "- To uninstall hooks: ${BLUE}./scripts/setup-git-hooks.sh --uninstall${NC}"
echo
echo -e "${GREEN}Done!${NC}"