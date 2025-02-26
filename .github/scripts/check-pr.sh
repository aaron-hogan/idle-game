#!/bin/bash
# AI-assistant PR status checker with enhanced CI status

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

# Function to rerun failed checks
rerun_failed_check() {
  local pr_number=$1
  local check_id=$2
  
  echo "Attempting to re-run check ID: $check_id..."
  
  # First try the new way with GitHub CLI
  gh api "repos/:owner/:repo/check-runs/$check_id/rerequest" -X POST >/dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "Check re-run has been triggered!"
  else
    echo "Could not re-run check. This may require admin permissions or the check may not support reruns."
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
    --*)
      # Skip unknown options
      shift
      ;;
    *)
      # First non-option arg is PR number
      PR_NUMBER=$1
      shift
      ;;
  esac
done

# Check if PR number is provided
if [ -z "$PR_NUMBER" ]; then
  # If no PR number, try to get current branch's PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName --jq '.[0]')
  
  if [ -z "$PR_INFO" ]; then
    echo "No open PR found for current branch"
    exit 1
  fi
  
  PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
else
  # Use provided PR number
  PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName,isDraft --jq '.')
fi

# Extract key information
TITLE=$(echo "$PR_INFO" | jq -r '.title')
STATE=$(echo "$PR_INFO" | jq -r '.state')
URL=$(echo "$PR_INFO" | jq -r '.url')
REVIEW_DECISION=$(echo "$PR_INFO" | jq -r '.reviewDecision')
HEAD_BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName')
BASE_BRANCH=$(echo "$PR_INFO" | jq -r '.baseRefName')
IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')

# Handle CI checks specific output
STATUS_CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup')
CHECK_COUNT=$(echo "$STATUS_CHECKS" | jq 'length')

if [ "$CI_ONLY" = true ]; then
  # Output only CI status in JSON format
  echo "$STATUS_CHECKS"
  exit 0
fi

# Format human-readable output
echo "PR #$PR_NUMBER: $TITLE"
echo "URL: $URL"
echo "Status: $STATE"
echo "Branch: $HEAD_BRANCH → $BASE_BRANCH"

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

# CI Status
echo "CI Status: ($CHECK_COUNT checks)"

if [ "$SHOW_DETAILS" = true ]; then
  FAILED_CHECKS=()
  
  echo "$STATUS_CHECKS" | jq -c '.[]' | while IFS= read -r check; do
    CHECK_NAME=$(echo "$check" | jq -r '.name')
    CHECK_STATUS=$(echo "$check" | jq -r '.status')
    CHECK_CONCLUSION=$(echo "$check" | jq -r '.conclusion')
    CHECK_ID=$(echo "$check" | jq -r '.databaseId // "unknown"')
    
    STATUS_FORMATTED=$(format_check_status "$CHECK_STATUS" "$CHECK_CONCLUSION")
    echo "  - $CHECK_NAME: $STATUS_FORMATTED"
    
    if [ "$RERUN_FAILED" = true ] && [ "$CHECK_CONCLUSION" = "FAILURE" ]; then
      FAILED_CHECKS+=("$CHECK_ID")
    fi
  done
  
  # Re-run failed checks if requested
  if [ "$RERUN_FAILED" = true ] && [ ${#FAILED_CHECKS[@]} -gt 0 ]; then
    echo
    echo "Re-running failed checks..."
    for check_id in "${FAILED_CHECKS[@]}"; do
      rerun_failed_check "$PR_NUMBER" "$check_id"
    done
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

# Also output raw JSON data at the end for machine parsing
echo
echo "JSON_DATA:"
echo "$PR_INFO"