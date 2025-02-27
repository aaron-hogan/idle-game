#!/bin/bash
# PR status checker with enhanced CI status

set -e

# Function to format check status
format_check_status() {
  local check_status=$1
  local check_conclusion=$2
  
  if [ "$check_status" = "COMPLETED" ]; then
    if [ "$check_conclusion" = "SUCCESS" ]; then
      echo "✅ PASSED"
    elif [ "$check_conclusion" = "FAILURE" ]; then
      echo "❌ FAILED"
    else
      echo "⚠️ $check_conclusion"
    fi
  else
    echo "🔄 $check_status"
  fi
}

# Parse command line options
SHOW_DETAILS=false
RERUN_FAILED=false
CI_ONLY=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --details)
      SHOW_DETAILS=true
      shift
      ;;
    --rerun-failed)
      RERUN_FAILED=true
      shift
      ;;
    --ci-only)
      CI_ONLY=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [options] [PR_NUMBER]"
      echo "Options:"
      echo "  --details         Show detailed information about the PR"
      echo "  --rerun-failed    Rerun failed CI checks"
      echo "  --ci-only         Only show CI status"
      echo "  -h, --help        Show this help message"
      exit 0
      ;;
    *)
      # First non-option arg is PR number
      if [[ $1 =~ ^[0-9]+$ ]]; then
        PR_NUMBER=$1
      fi
      shift
      ;;
  esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed. Please install it first:"
  echo "  https://cli.github.com/manual/installation"
  exit 1
fi

# Check if PR number is provided
if [ -z "$PR_NUMBER" ]; then
  # If no PR number, try to get current branch's PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName,mergeable,isDraft --jq '.[0]')
  
  if [ -z "$PR_INFO" ] || [ "$PR_INFO" = "null" ]; then
    echo "❌ Error: No open PR found for current branch"
    exit 1
  fi
  
  PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
  echo "ℹ️ Using current PR #$PR_NUMBER"
else
  # Use provided PR number
  PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName,mergeable,isDraft --jq '.')
  
  if [ -z "$PR_INFO" ] || [ "$PR_INFO" = "null" ]; then
    echo "❌ Error: PR #$PR_NUMBER not found"
    exit 1
  fi
fi

# Extract key information
TITLE=$(echo "$PR_INFO" | jq -r '.title')
STATE=$(echo "$PR_INFO" | jq -r '.state')
URL=$(echo "$PR_INFO" | jq -r '.url')
REVIEW_DECISION=$(echo "$PR_INFO" | jq -r '.reviewDecision')
HEAD_BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName')
BASE_BRANCH=$(echo "$PR_INFO" | jq -r '.baseRefName')
IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')
MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')

# Handle CI checks specific output
STATUS_CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup // []')
CHECK_COUNT=$(echo "$STATUS_CHECKS" | jq 'length')

if [ "$CI_ONLY" = true ]; then
  # Output only CI status in JSON format
  echo "$STATUS_CHECKS"
  exit 0
fi

# Format human-readable output
echo "--------------------------------------"
echo "PR #$PR_NUMBER: $TITLE"
echo "--------------------------------------"
echo "Status: $STATE"
echo "Branch: $HEAD_BRANCH → $BASE_BRANCH"
echo "URL: $URL"

if [ "$IS_DRAFT" = "true" ]; then
  echo "Draft: Yes (not ready for review)"
fi

# Review status
if [ "$REVIEW_DECISION" = "APPROVED" ]; then
  echo "Review Status: ✅ Approved"
elif [ "$REVIEW_DECISION" = "CHANGES_REQUESTED" ]; then
  echo "Review Status: ❌ Changes requested"
elif [ "$REVIEW_DECISION" = "REVIEW_REQUIRED" ]; then
  echo "Review Status: ⏳ Review required"
else
  echo "Review Status: ⏳ No reviews yet"
fi

# Mergeable status
if [ "$MERGEABLE" = "MERGEABLE" ]; then
  echo "Mergeable: ✅ Ready to merge"
elif [ "$MERGEABLE" = "CONFLICTING" ]; then
  echo "Mergeable: ❌ Has conflicts"
else
  echo "Mergeable: ⚠️ Unknown"
fi

# CI Status
echo "--------------------------------------"
echo "CI Status: ($CHECK_COUNT checks)"

if [ "$SHOW_DETAILS" = true ]; then
  FAILED_CHECKS=()
  
  echo "$STATUS_CHECKS" | jq -c '.[]' | while IFS= read -r check; do
    CHECK_NAME=$(echo "$check" | jq -r '.name')
    CHECK_STATUS=$(echo "$check" | jq -r '.status')
    CHECK_CONCLUSION=$(echo "$check" | jq -r '.conclusion')
    
    STATUS_FORMATTED=$(format_check_status "$CHECK_STATUS" "$CHECK_CONCLUSION")
    echo "  - $CHECK_NAME: $STATUS_FORMATTED"
    
    if [ "$CHECK_CONCLUSION" = "FAILURE" ]; then
      FAILED_CHECKS+=("$CHECK_NAME")
    fi
  done
  
  # Re-run failed checks if requested
  if [ "$RERUN_FAILED" = true ] && [ ${#FAILED_CHECKS[@]} -gt 0 ]; then
    echo "--------------------------------------"
    echo "🔄 Re-running failed checks..."
    gh pr checks "$PR_NUMBER" --rerun-failed
    echo "✅ Rerun triggered - check back later for results"
  fi
else
  # Count statuses
  TOTAL=$(echo "$STATUS_CHECKS" | jq 'length')
  SUCCESS=$(echo "$STATUS_CHECKS" | jq '[.[] | select(.conclusion == "SUCCESS")] | length')
  FAILURE=$(echo "$STATUS_CHECKS" | jq '[.[] | select(.conclusion == "FAILURE")] | length')
  PENDING=$(echo "$STATUS_CHECKS" | jq '[.[] | select(.status != "COMPLETED")] | length')
  
  echo "  ✅ Passed: $SUCCESS  ❌ Failed: $FAILURE  🔄 Pending: $PENDING  📊 Total: $TOTAL"
  
  if [ "$FAILURE" -gt 0 ]; then
    echo "  Use --details to see all checks or --rerun-failed to re-run failed checks"
  fi
fi

echo "--------------------------------------"

# Provide next steps based on PR state
if [ "$STATE" = "OPEN" ]; then
  if [ "$IS_DRAFT" = "true" ]; then
    echo "Next steps:"
    echo "  1. Complete your changes and mark as ready for review:"
    echo "     gh pr ready $PR_NUMBER"
  elif [ "$FAILURE" -gt 0 ]; then
    echo "Next steps:"
    echo "  1. Fix failed checks"
    echo "  2. Push changes to update the PR"
  elif [ "$REVIEW_DECISION" = "CHANGES_REQUESTED" ]; then
    echo "Next steps:"
    echo "  1. Address review comments"
    echo "  2. Push changes to update the PR"
  elif [ "$REVIEW_DECISION" = "REVIEW_REQUIRED" ] || [ "$REVIEW_DECISION" = "null" ]; then
    echo "Next steps:"
    echo "  1. Request reviews from team members:"
    echo "     gh pr edit $PR_NUMBER --add-reviewer USERNAME"
  elif [ "$REVIEW_DECISION" = "APPROVED" ] && [ "$MERGEABLE" = "MERGEABLE" ] && [ "$FAILURE" -eq 0 ] && [ "$PENDING" -eq 0 ]; then
    echo "Next steps:"
    echo "  1. This PR is ready to merge! 🎉"
    echo "     gh pr merge $PR_NUMBER"
  fi
fi