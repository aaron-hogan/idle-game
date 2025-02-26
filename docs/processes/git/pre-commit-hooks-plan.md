# Pre-commit Hooks Implementation Plan

## Overview

This document outlines the implementation plan for adding pre-commit hooks to our workflow to automate validation and enforce quality standards before code enters the repository.

## Goals

- Prevent non-compliant code from being committed
- Automate formatting, linting, and testing
- Reduce manual validation time
- Ensure consistent commit quality
- Reinforce our Git workflow rules

## Implementation Plan

### 1. Setup Husky and lint-staged

```bash
# Install dependencies
npm install --save-dev husky lint-staged

# Setup husky
npx husky install
npm set-script prepare "husky install"

# Add lint-staged configuration to package.json
```

Add to package.json:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 2. Create Pre-commit Hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check branch naming convention
BRANCH=$(git symbolic-ref --short HEAD)

if [[ ! $BRANCH =~ ^(feature|fix|docs|refactor)/[a-z0-9-]+$ && $BRANCH != "main" ]]; then
  echo "ERROR: Branch name '$BRANCH' doesn't follow the convention: (feature|fix|docs|refactor)/name-with-hyphens"
  exit 1
fi

# Run lint-staged
npx lint-staged

# Run type checking
npm run typecheck

# Run tests related to changed files
npm run test:related
```

Add a new npm script in package.json:
```json
{
  "scripts": {
    "test:related": "jest --findRelatedTests $(git diff --staged --name-only | grep -E '\\.tsx?$')"
  }
}
```

### 3. Create Commit Message Template

Create `.gitmessage`:

```
# <type>: <subject>
# |<----  Using a Maximum Of 50 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# --- COMMIT END ---
# Type can be 
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semi colons, etc; no code change)
#    docs     (changes to documentation)
#    test     (adding or modifying tests; no production code change)
#    chore    (updating build tasks, package manager configs, etc; no production code change)
# --------------------
# Remember to
#   - Use the imperative mood in the subject line
#   - Do not end the subject line with a period
#   - Separate subject from body with a blank line
#   - Use the body to explain what and why vs. how
# --------------------
```

Configure Git to use the template:
```bash
git config --local commit.template .gitmessage
```

### 4. Create Branch Naming Verification Script

Create `scripts/verify-branch-name.js`:

```javascript
const branchName = require('child_process')
  .execSync('git symbolic-ref --short HEAD')
  .toString()
  .trim();

const pattern = /^(feature|fix|docs|refactor)\/[a-z0-9-]+$/;

if (!pattern.test(branchName) && branchName !== 'main') {
  console.error(`\x1b[31mERROR: Branch name "${branchName}" doesn't follow the convention:\x1b[0m`);
  console.error('\x1b[33m(feature|fix|docs|refactor)/name-with-hyphens\x1b[0m');
  process.exit(1);
}

console.log(`\x1b[32mBranch name "${branchName}" follows the convention ✓\x1b[0m`);
```

Add npm script:
```json
{
  "scripts": {
    "verify-branch": "node scripts/verify-branch-name.js"
  }
}
```

### 5. Optional: Add commit-msg Hook for Message Validation

Create `.husky/commit-msg`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat $COMMIT_MSG_FILE)

PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"

if ! [[ $COMMIT_MSG =~ $PATTERN ]]; then
  echo "ERROR: Invalid commit message format."
  echo "Must start with type(scope): subject"
  echo "Types: feat, fix, docs, style, refactor, test, or chore"
  echo "Subject should be no more than 50 characters"
  exit 1
fi
```

## Testing Plan

1. Create a test branch with an invalid name
2. Attempt to commit changes to verify branch name validation
3. Attempt to commit code with linting issues
4. Attempt to commit code with type errors
5. Attempt to commit with an invalid commit message format
6. Verify that valid commits pass all checks

## Roll-out Plan

1. Document the new process in CLAUDE.md
2. Create a brief developer guide for the new workflow
3. Update PR checklist to note that many checks are now automated
4. Set up the hooks on a test repository first
5. Roll out to the main repository after testing
6. Schedule a brief team demo session

## Maintenance

- Update the hooks as code quality standards evolve
- Monitor for false positives or performance issues
- Adjust the validation rules based on team feedback
- Keep dependencies updated

## Expected Benefits

- 90% reduction in basic style/format issues in PRs
- Shorter code review cycles focusing on logic rather than style
- Consistent branch naming and commit message format
- Early detection of type errors and failing tests
- Reinforcement of the team's Git workflow