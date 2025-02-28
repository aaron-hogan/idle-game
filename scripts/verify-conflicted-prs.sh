#!/bin/bash
# verify-conflicted-prs.sh - Verify changes from PRs that had merge conflict issues
# 
# This script helps validate that the changes from PRs #107-#114 (which were 
# affected by merge conflict markers) are working properly after fixes.

set -e # Exit on any error

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verifying Previously Conflicted PRs${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "This script will validate changes from PRs #107-#114"
echo -e "which had issues with merge conflict markers."
echo

# Check for conflicted files
echo -e "${YELLOW}Step 1: Checking for remaining conflict markers${NC}"
CONFLICT_FILES=$(find ./src -type f -name "*.ts*" -o -name "*.js*" | xargs grep -l "^<<<<<<< \|^=======$\|^>>>>>>> " 2>/dev/null || true)

if [ ! -z "$CONFLICT_FILES" ]; then
  echo -e "${RED}Error: Conflict markers still found in these files:${NC}"
  echo "$CONFLICT_FILES" | sed 's/^/  - /'
  echo -e "${YELLOW}Please resolve these conflicts first.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ No conflict markers found${NC}"
fi

# Run linting
echo -e "\n${YELLOW}Step 2: Running linting${NC}"
npm run lint || {
  echo -e "${RED}Error: Linting failed${NC}"
  echo -e "${YELLOW}This may indicate issues from the previously conflicted PRs${NC}"
  exit 1
}
echo -e "${GREEN}✓ Linting passed${NC}"

# Run type checking
echo -e "\n${YELLOW}Step 3: Running type checking${NC}"
npm run typecheck || {
  echo -e "${RED}Error: Type checking failed${NC}"
  echo -e "${YELLOW}This may indicate issues from the previously conflicted PRs${NC}"
  exit 1
}
echo -e "${GREEN}✓ Type checking passed${NC}"

# Run tests
echo -e "\n${YELLOW}Step 4: Running tests${NC}"
npm test || {
  echo -e "${RED}Error: Tests failed${NC}"
  echo -e "${YELLOW}This may indicate issues from the previously conflicted PRs${NC}"
  exit 1
}
echo -e "${GREEN}✓ Tests passed${NC}"

# Build the project
echo -e "\n${YELLOW}Step 5: Building the project${NC}"
npm run build:dev || {
  echo -e "${RED}Error: Build failed${NC}"
  echo -e "${YELLOW}This may indicate issues from the previously conflicted PRs${NC}"
  exit 1
}
echo -e "${GREEN}✓ Build successful${NC}"

# Verify specific files from PRs #107-#114
echo -e "\n${YELLOW}Step 6: Verifying specific files from PRs #107-#114${NC}"

# List of PR numbers to verify
PR_NUMBERS=(107 108 109 110 111 112 113 114)

# Get commits for each PR
for PR in "${PR_NUMBERS[@]}"; do
  echo -e "${BLUE}Verifying files from PR #$PR${NC}"
  
  # Get PR title from git log
  PR_TITLE=$(git log --grep="#$PR" --pretty=format:"%s" | head -n 1)
  echo -e "PR Title: ${YELLOW}$PR_TITLE${NC}"
  
  # Extract commit hash
  COMMIT_HASH=$(git log --grep="#$PR" --pretty=format:"%H" | head -n 1)
  
  if [ -z "$COMMIT_HASH" ]; then
    echo -e "${YELLOW}  Could not find commit for PR #$PR${NC}"
    continue
  fi
  
  # Get list of files changed in the PR
  PR_FILES=$(git show --name-only "$COMMIT_HASH" | grep -v "^commit\|^Author\|^Date\|^$\|^    " || true)
  
  if [ -z "$PR_FILES" ]; then
    echo -e "${YELLOW}  No files found for PR #$PR${NC}"
    continue
  fi
  
  # Check each file
  for FILE in $PR_FILES; do
    if [ -f "$FILE" ]; then
      # For TypeScript files, check if they compile
      if [[ "$FILE" == *.ts || "$FILE" == *.tsx ]]; then
        echo -e "  Verifying ${BLUE}$FILE${NC}"
        npx tsc --noEmit "$FILE" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
          echo -e "  ${GREEN}✓ File compiles${NC}"
        else
          echo -e "  ${RED}✗ File has type errors${NC}"
          npx tsc --noEmit "$FILE"
          echo
        fi
      else
        echo -e "  ${GREEN}✓ File exists: ${BLUE}$FILE${NC}"
      fi
    else
      echo -e "  ${RED}✗ File missing: ${BLUE}$FILE${NC}"
    fi
  done
  
  echo
done

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}Verification of PRs #107-#114 complete!${NC}"
echo -e "${GREEN}===============================================${NC}"
echo
echo -e "If all checks passed, the previously conflicted PRs have been"
echo -e "successfully fixed and their changes are working correctly."
echo
echo -e "${YELLOW}Note:${NC} It's still recommended to perform manual testing"
echo -e "of the application to ensure proper functionality."
echo

exit 0