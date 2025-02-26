# GitHub Scripts Test Plan

## Overview

This document outlines a comprehensive test plan for the AI assistant GitHub automation scripts. It covers test cases for each script, edge cases, and integration testing.

## 1. `create-branch.sh` Tests

### Functionality Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| CB-1 | Basic branch creation | New branch created with correct naming | Clean working directory |
| CB-2 | Create branch from main | Branch created from main | On main branch |
| CB-3 | Create branch from non-main | Warning shown, branch created from current branch | On non-main branch |
| CB-4 | Invalid branch type | Error shown, exit with code 1 | - |
| CB-5 | Missing arguments | Usage instructions shown, exit with code 1 | - |

### Edge Cases & Safety Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| CB-6 | Uncommitted changes (confirm) | Warning shown, branch created with changes | Have uncommitted changes |
| CB-7 | Uncommitted changes (cancel) | Warning shown, operation canceled | Have uncommitted changes |
| CB-8 | Branch already exists | Git error, exit with appropriate code | Branch already exists |
| CB-9 | Special characters in description | Special chars converted to hyphens in branch name | - |

## 2. `create-pr.sh` Tests

### Functionality Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| PR-1 | Basic PR creation | PR created with standardized format | On feature branch with commits |
| PR-2 | Draft PR creation | Draft PR created | On feature branch with commits |
| PR-3 | Custom base branch | PR targeting specified base branch | On feature branch with commits |
| PR-4 | PR from main branch | Error shown, exit with code 1 | On main branch |
| PR-5 | Invalid branch name | Error shown, exit with code 1 | On branch with invalid name format |

### Edge Cases & Safety Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| PR-6 | Uncommitted changes (confirm) | Warning shown, PR created without changes | Have uncommitted changes |
| PR-7 | Uncommitted changes (cancel) | Warning shown, operation canceled | Have uncommitted changes |
| PR-8 | Skip check flag | No warning for uncommitted changes | Have uncommitted changes |
| PR-9 | PR already exists | GitHub CLI error shown | PR already exists for branch |
| PR-10 | No commits on branch | GitHub CLI error shown | No commits on branch |

## 3. `check-pr.sh` Tests

### Functionality Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| CP-1 | Check current branch PR | PR details shown | On branch with open PR |
| CP-2 | Check specific PR | PR details shown | PR number exists |
| CP-3 | Check with --details | Detailed CI status shown | PR with CI checks |
| CP-4 | Check with --ci-only | Only CI JSON data shown | PR with CI checks |

### Edge Cases & Safety Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| CP-5 | No PR for current branch | Error shown, exit with code 1 | On branch without PR |
| CP-6 | Invalid PR number | GitHub CLI error shown | - |
| CP-7 | PR with no CI checks | Empty CI status shown | PR without CI checks |
| CP-8 | --rerun-failed without failures | Message that no failed checks found | PR with all passing checks |

## 4. `merge-pr.sh` Tests

### Functionality Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| MP-1 | Merge clean PR | PR merged successfully | Clean, open PR |
| MP-2 | Merge with --yes | PR merged without confirmation prompts | Clean, open PR |
| MP-3 | Merge PR by number | PR merged successfully | PR number exists |
| MP-4 | Merge PR from current branch | PR merged successfully | On branch with open PR |

### Edge Cases & Safety Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| MP-5 | Uncommitted changes | Error shown, exit with code 1 | Have uncommitted changes |
| MP-6 | PR is behind base | Offer to update branch | PR behind base |
| MP-7 | PR has merge conflicts | Offer conflict resolution with --resolve-conflicts | PR with conflicts |
| MP-8 | PR not open | Error shown, exit with code 1 | Closed/merged PR |
| MP-9 | PR checks failing | Warning shown, confirm to proceed | PR with failing checks |
| MP-10 | Stay on current branch | Does not switch to base branch after merge | Answer "n" to switch prompt |

## Integration Tests

| ID | Test Case | Expected Outcome | Prerequisites |
|----|-----------|------------------|---------------|
| INT-1 | Full workflow: create branch → create PR → check PR → merge PR | All operations complete successfully | Clean start |
| INT-2 | Create branch → add commits → create PR → merge PR | All operations complete successfully | Clean start |
| INT-3 | Multiple branches and PRs | All scripts handle multiple branches/PRs correctly | Multiple branches |

## Test Execution Guidelines

1. **Setup**: Start from a clean repository state when possible
2. **Isolation**: Test each script in isolation first, then in combination
3. **Edge Cases**: Pay special attention to error handling and unexpected inputs
4. **Documentation**: Document any unexpected behavior for future improvements

## Automated Testing

Run the automated test script to validate the core functionality:

```bash
.github/scripts/test-scripts.sh
```

The script will:
- Run a subset of tests that can be safely automated
- Generate a detailed test report with pass/fail status
- Clean up after itself, leaving the repository in its original state
- Exit with a non-zero code if any tests fail

Some tests requiring interactive user input or that would create actual PRs are limited in the automated script. Manual testing is still recommended for these specific scenarios.

## Continuous Testing

As scripts are enhanced, this test plan should be updated and all tests re-executed to ensure backward compatibility and overall stability.