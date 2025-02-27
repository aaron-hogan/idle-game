# AI-Optimized Git Scripts

These scripts are optimized for AI assistants to efficiently manage Git workflows with minimal token usage.

## Key Features

- **Machine-readable output**: JSON format for easy parsing
- **Minimal verbosity**: Reduced output size to save tokens
- **Non-interactive**: No prompts that would block automation
- **Standardized error handling**: Consistent error reporting
- **Token-efficient**: Optimized for minimal context window usage

## Available Scripts

### 1. Branch Creation (`branch.sh`)

Create a new branch from develop or main:

```bash
.github/scripts/ai/branch.sh <type> <description> [base-branch]

# Example
.github/scripts/ai/branch.sh feature login-system
```

### 2. PR Creation (`pr.sh`)

Create a pull request from the current branch:

```bash
.github/scripts/ai/pr.sh [options]

# Options
--title "Title"           # PR title (derived from branch name if not provided)
--body "Description"      # PR description
--base branch             # Target branch (default: develop)
--draft                   # Create as draft PR
--labels "label1,label2"  # Add labels to PR

# Example
.github/scripts/ai/pr.sh --base main --title "feat: Add login system"
```

### 3. PR Status Check (`check.sh`)

Check the status of a PR:

```bash
.github/scripts/ai/check.sh [PR_NUMBER]

# With options
.github/scripts/ai/check.sh 123 --rerun  # Rerun failed checks
```

### 4. PR Merge (`merge.sh`)

Merge a pull request:

```bash
.github/scripts/ai/merge.sh [options] PR_NUMBER

# Options
--squash                 # Squash commits
--rebase                 # Rebase commits
--keep-branch            # Don't delete branch after merge
--no-sync                # Don't sync develop from main
--force                  # Bypass checks and merge anyway

# Example
.github/scripts/ai/merge.sh 123
```

## Usage for AI Assistants

These scripts are designed to be used in sequence for a complete workflow:

```bash
# 1. Create a branch for a new feature
BRANCH_RESULT=$(.github/scripts/ai/branch.sh feature user-authentication)
echo "Branch created: $(echo $BRANCH_RESULT | jq -r '.branch')"

# 2. After changes are committed, create a PR
PR_RESULT=$(.github/scripts/ai/pr.sh --base develop)
PR_NUMBER=$(echo $PR_RESULT | jq -r '.number')
echo "PR created: $PR_NUMBER"

# 3. Check PR status
CHECK_RESULT=$(.github/scripts/ai/check.sh $PR_NUMBER)
IS_READY=$(echo $CHECK_RESULT | jq -r '.ready')

# 4. If ready, merge the PR
if [ "$IS_READY" = "true" ]; then
  MERGE_RESULT=$(.github/scripts/ai/merge.sh $PR_NUMBER)
  echo "PR merged: $(echo $MERGE_RESULT | jq -r '.success')"
fi
```

## Error Handling

All scripts return JSON with a `success` field:

```json
{"success": true, ...}  // Operation succeeded
{"success": false, "error": "Error message"}  // Operation failed
```