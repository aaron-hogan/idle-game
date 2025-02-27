#!/bin/bash
# AI-friendly PR creation script
# Simplified version with minimal output and no interactive prompts

set -e

# Default values
DRAFT=false
BASE_BRANCH="develop"
TITLE=""
BODY=""
LABELS=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --draft)
      DRAFT=true
      shift
      ;;
    --base)
      BASE_BRANCH="$2"
      shift 2
      ;;
    --title)
      TITLE="$2"
      shift 2
      ;;
    --body)
      BODY="$2"
      shift 2
      ;;
    --labels)
      LABELS="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --draft               Create PR as draft"
      echo "  --base BRANCH         Target branch (default: develop)"
      echo "  --title \"TITLE\"       PR title"
      echo "  --body \"BODY\"         PR description"
      echo "  --labels \"l1,l2\"      Comma-separated list of labels"
      echo "  --help, -h            Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if gh is installed
if ! command -v gh &> /dev/null; then
  echo '{"success":false,"error":"GitHub CLI not installed"}'
  exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Push branch to remote
git push -u origin "$CURRENT_BRANCH" --quiet 2>/dev/null || {
  echo '{"success":false,"error":"Failed to push branch to remote"}'
  exit 1
}

# Derive title from branch name if not provided
if [ -z "$TITLE" ]; then
  # Extract type and description from branch
  BRANCH_TYPE=$(echo "$CURRENT_BRANCH" | cut -d/ -f1)
  BRANCH_DESC=$(echo "$CURRENT_BRANCH" | cut -d/ -f2- | tr '-' ' ')
  
  # Format conventional commit prefix
  case "$BRANCH_TYPE" in
    feature) TYPE_PREFIX="feat" ;;
    fix) TYPE_PREFIX="fix" ;;
    *) TYPE_PREFIX="$BRANCH_TYPE" ;;
  esac
  
  # Convert first letter of each word to uppercase
  FORMATTED_DESC=$(echo "$BRANCH_DESC" | sed 's/\b\(.\)/\u\1/g')
  TITLE="$TYPE_PREFIX: $FORMATTED_DESC"
fi

# Create temporary body file if body provided
if [ -n "$BODY" ]; then
  BODY_FILE=$(mktemp)
  echo "$BODY" > "$BODY_FILE"
else
  # Generate standard PR body
  BODY_FILE=$(mktemp)
  cat > "$BODY_FILE" << EOF
## Changes
$(git log --pretty=format:'* %s' origin/$BASE_BRANCH..$CURRENT_BRANCH | grep -v 'Merge' || echo "* Initial implementation")

## Description
<!-- Describe the changes in this PR -->

## Testing
<!-- Describe how you tested these changes -->

🤖 Generated with Claude
EOF
fi

# Create PR
PR_ARGS=("--base" "$BASE_BRANCH" "--title" "$TITLE" "--body-file" "$BODY_FILE" "--json" "url,number")
if [ "$DRAFT" = true ]; then
  PR_ARGS+=("--draft")
fi

# Execute PR creation
PR_RESULT=$(gh pr create "${PR_ARGS[@]}" 2>&1)
PR_EXIT=$?

# Clean up temporary file
rm -f "$BODY_FILE"

if [ $PR_EXIT -ne 0 ]; then
  # Failed to create PR
  echo "{\"success\":false,\"error\":\"$PR_RESULT\"}"
  exit 1
fi

# Extract PR number and URL
PR_URL=$(echo "$PR_RESULT" | jq -r '.url')
PR_NUMBER=$(echo "$PR_RESULT" | jq -r '.number')

# Add labels if provided
if [ -n "$LABELS" ]; then
  IFS=',' read -ra LABEL_ARRAY <<< "$LABELS"
  for LABEL in "${LABEL_ARRAY[@]}"; do
    gh pr edit "$PR_NUMBER" --add-label "$LABEL" &>/dev/null
  done
fi

# Return success result
echo "{\"success\":true,\"number\":$PR_NUMBER,\"url\":\"$PR_URL\",\"title\":\"$TITLE\"}"