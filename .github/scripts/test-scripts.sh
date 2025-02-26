#!/bin/bash
# Automated test runner for GitHub scripts

# Set up test environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_LOG="test-results-$(date +%Y%m%d-%H%M%S).log"
CURRENT_DATE=$(date)
PASSED=0
FAILED=0
SKIPPED=0
ORIGINAL_BRANCH=$(git branch --show-current)
TEST_BRANCH="test-script-automated"
TEST_BRANCH_PREFIX="automated-test"

# Define ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize log file
cat > "$TEST_LOG" << EOF
# GitHub Scripts Automated Test Results
Test execution started on $CURRENT_DATE

Original branch: $ORIGINAL_BRANCH

EOF

# Test utility functions
log() {
  echo -e "$1" | tee -a "$TEST_LOG"
}

header() {
  log "\n## $1"
}

subheader() {
  log "\n### $1"
}

pass() {
  log "${GREEN}✅ PASS: $1${NC}"
  PASSED=$((PASSED + 1))
}

fail() {
  log "${RED}❌ FAIL: $1${NC}"
  FAILED=$((FAILED + 1))
}

skip() {
  log "${YELLOW}⏭️ SKIP: $1${NC}"
  SKIPPED=$((SKIPPED + 1))
}

info() {
  log "${BLUE}ℹ️ INFO: $1${NC}"
}

run_test() {
  local name=$1
  local command=$2
  local expect_success=${3:-true}
  
  subheader "Test: $name"
  log "Command: $command"
  
  # Execute the command and capture output and exit code
  OUTPUT=$(eval "$command" 2>&1)
  EXIT_CODE=$?
  
  log "Output: $OUTPUT"
  log "Exit code: $EXIT_CODE"
  
  # Check if the result matches expectations
  if [ "$expect_success" = true ] && [ $EXIT_CODE -eq 0 ]; then
    pass "$name"
  elif [ "$expect_success" = false ] && [ $EXIT_CODE -ne 0 ]; then
    pass "$name (expected failure)"
  else
    fail "$name (unexpected $([ "$expect_success" = true ] && echo "failure" || echo "success"))"
  fi
}

cleanup() {
  info "Cleaning up test environment"
  
  # Make sure we're back on the original branch
  git checkout "$ORIGINAL_BRANCH" &> /dev/null || true
  
  # Delete test branches if they exist
  git branch | grep "$TEST_BRANCH" | xargs -I {} git branch -D {} &> /dev/null || true
  git branch | grep "$TEST_BRANCH_PREFIX" | xargs -I {} git branch -D {} &> /dev/null || true
  
  # Delete test files
  rm -f test-file-*.txt &> /dev/null || true
  
  # Unstage everything and restore working directory
  git reset --hard HEAD &> /dev/null || true
  git clean -fd &> /dev/null || true
  
  # Show test summary
  log "\n## Test Summary"
  log "Passed: ${GREEN}$PASSED${NC}"
  log "Failed: ${RED}$FAILED${NC}"
  log "Skipped: ${YELLOW}$SKIPPED${NC}"
  log "Total: $((PASSED + FAILED + SKIPPED))"
  
  if [ $FAILED -eq 0 ]; then
    log "\n${GREEN}All tests passed!${NC}"
  else
    log "\n${RED}Some tests failed. Check the log for details.${NC}"
  fi
  
  log "\nResults saved to $TEST_LOG"
}

# Set up exit trap for cleanup
trap cleanup EXIT INT TERM

# Begin testing
header "Starting Tests"

# Test create-branch.sh
header "Testing create-branch.sh"

run_test "CB-1: Basic branch creation" \
  "$SCRIPT_DIR/create-branch.sh feature $TEST_BRANCH_PREFIX-basic" \
  true

run_test "CB-4: Invalid branch type" \
  "$SCRIPT_DIR/create-branch.sh invalid-type test-invalid" \
  false

run_test "CB-5: Missing arguments" \
  "$SCRIPT_DIR/create-branch.sh" \
  false

# First go back to original branch for next test
git checkout "$ORIGINAL_BRANCH" &> /dev/null

# Create uncommitted change
echo "Uncommitted content" > test-file-uncommitted.txt

run_test "CB-6: Uncommitted changes (auto-confirm)" \
  "echo y | $SCRIPT_DIR/create-branch.sh test $TEST_BRANCH_PREFIX-uncommitted" \
  true

# Test create-pr.sh
header "Testing create-pr.sh"

# We need to be careful with PR tests since they would create actual PRs
# Just test the validation parts

git checkout "$ORIGINAL_BRANCH" &> /dev/null
run_test "PR-4: PR from main" \
  "git checkout main && $SCRIPT_DIR/create-pr.sh" \
  false

run_test "PR-8: Skip check flag with validation error" \
  "echo 'Test file' > test-file-skip.txt && ($SCRIPT_DIR/create-pr.sh --skip-check 2>&1 || true) | grep -q 'ERROR: Cannot create PR from main'" \
  true

# Test check-pr.sh (limited)
header "Testing check-pr.sh"

run_test "CP-5: No PR for current branch" \
  "$SCRIPT_DIR/create-branch.sh test $TEST_BRANCH_PREFIX-no-pr && $SCRIPT_DIR/check-pr.sh 2>&1 | grep -q 'No open PR found'" \
  true

run_test "CP-6: Invalid PR number" \
  "$SCRIPT_DIR/check-pr.sh 99999999 2>&1 | grep -q 'Could not resolve to a PullRequest'" \
  true

# Test merge-pr.sh (limited)
header "Testing merge-pr.sh"

# Create a branch with uncommitted changes to test MP-5
git checkout "$ORIGINAL_BRANCH" &> /dev/null
echo "Uncommitted for merge" > test-file-merge.txt
git add test-file-merge.txt  # Add the file so it's tracked

# Check if the merge-pr.sh script has the expected error message
if grep -q "You have unsaved changes" "$SCRIPT_DIR/merge-pr.sh"; then
  run_test "MP-5: Uncommitted changes detection" \
    "$SCRIPT_DIR/merge-pr.sh 25 || echo 'Expected failure due to uncommitted changes'" \
    false
else
  # Skip the test if the error message doesn't match what we're looking for
  skip "MP-5: Uncommitted changes detection (script message changed)"
fi

# Clean up explicitly before exit handler runs
git checkout "$ORIGINAL_BRANCH" &> /dev/null
git reset --hard HEAD &> /dev/null

# Exit with success only if all tests passed
exit $FAILED