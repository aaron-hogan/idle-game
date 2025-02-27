#!/bin/bash
# AI-friendly PR status checker
# Outputs minimal machine-readable JSON

set -e

# Parse command line arguments
PR_NUMBER=""
RERUN_FAILED=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --rerun)
      RERUN_FAILED=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [options] [PR_NUMBER]"
      echo "Options:"
      echo "  --rerun              Rerun failed checks"
      echo "  --help, -h           Show this help"
      exit 0
      ;;
    *)
      if [[ $1 =~ ^[0-9]+$ ]]; then
        PR_NUMBER=$1
      fi
      shift
      ;;
  esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo '{"success":false,"error":"GitHub CLI not installed"}'
  exit 1
fi

# Get PR info
if [ -z "$PR_NUMBER" ]; then
  # Try to get current branch PR
  CURRENT_BRANCH=$(git branch --show-current)
  PR_INFO=$(gh pr list --head "$CURRENT_BRANCH" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName,mergeable,isDraft 2>/dev/null)
  
  if [ -z "$PR_INFO" ] || [ "$PR_INFO" = "[]" ]; then
    echo '{"success":false,"error":"No open PR found for current branch"}'
    exit 1
  fi
  
  PR_INFO=$(echo "$PR_INFO" | jq '.[0]')
  PR_NUMBER=$(echo "$PR_INFO" | jq -r '.number')
else
  # Use provided PR number
  PR_INFO=$(gh pr view "$PR_NUMBER" --json number,title,state,url,reviewDecision,statusCheckRollup,headRefName,baseRefName,mergeable,isDraft 2>/dev/null)
  
  if [ -z "$PR_INFO" ]; then
    echo "{\"success\":false,\"error\":\"PR #$PR_NUMBER not found\"}"
    exit 1
  fi
fi

# Handle failed checks
if [ "$RERUN_FAILED" = true ]; then
  gh pr checks "$PR_NUMBER" --rerun-failed >/dev/null 2>&1 || true
fi

# Process CI checks
CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup // []')
TOTAL_CHECKS=$(echo "$CHECKS" | jq 'length')
SUCCESSFUL_CHECKS=$(echo "$CHECKS" | jq '[.[] | select(.conclusion == "SUCCESS")] | length')
FAILED_CHECKS=$(echo "$CHECKS" | jq '[.[] | select(.conclusion == "FAILURE")] | length')
PENDING_CHECKS=$(echo "$CHECKS" | jq '[.[] | select(.status != "COMPLETED")] | length')

# Create status summary object
STATUS=$(cat << EOF
{
  "total": $TOTAL_CHECKS,
  "success": $SUCCESSFUL_CHECKS,
  "failed": $FAILED_CHECKS,
  "pending": $PENDING_CHECKS,
  "mergeable": "$(echo "$PR_INFO" | jq -r '.mergeable')",
  "review": "$(echo "$PR_INFO" | jq -r '.reviewDecision // "NONE"')"
}
EOF
)

# Build final result object
RESULT=$(cat << EOF
{
  "success": true,
  "number": $(echo "$PR_INFO" | jq '.number'),
  "title": $(echo "$PR_INFO" | jq '.title'),
  "state": $(echo "$PR_INFO" | jq '.state'),
  "url": $(echo "$PR_INFO" | jq '.url'),
  "head": $(echo "$PR_INFO" | jq '.headRefName'),
  "base": $(echo "$PR_INFO" | jq '.baseRefName'),
  "isDraft": $(echo "$PR_INFO" | jq '.isDraft'),
  "status": $STATUS,
  "ready": $([ "$(echo "$PR_INFO" | jq -r '.state')" = "OPEN" ] && 
            [ "$(echo "$PR_INFO" | jq -r '.isDraft')" = "false" ] && 
            [ "$(echo "$PR_INFO" | jq -r '.mergeable')" = "MERGEABLE" ] && 
            [ "$FAILED_CHECKS" -eq 0 ] && 
            [ "$PENDING_CHECKS" -eq 0 ] && 
            ([ "$(echo "$PR_INFO" | jq -r '.reviewDecision')" = "APPROVED" ] || 
             [ "$(echo "$PR_INFO" | jq -r '.reviewDecision')" = "null" ]) && 
            echo "true" || echo "false")
}
EOF
)

echo "$RESULT" | jq .