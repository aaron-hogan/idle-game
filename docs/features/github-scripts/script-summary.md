# GitHub Scripts Summary

## Script Reference

| Script Name | Purpose | Options | Related Tests |
|-------------|---------|---------|--------------|
| `create-branch.sh` | Creates properly named feature branches | `<type>` `<description>` | CB-1 to CB-9 |
| `create-pr.sh` | Creates standardized PRs | `--draft`, `--base <branch>`, `--skip-check` | PR-1 to PR-10 |
| `check-pr.sh` | Checks PR status | `[PR_NUMBER]`, `--details`, `--rerun-failed`, `--ci-only` | CP-1 to CP-8 |
| `merge-pr.sh` | Safely merges PRs | `[PR_NUMBER]`, `--yes`, `--resolve-conflicts` | MP-1 to MP-10 |

## Workflows

### Basic Workflow

1. Check current branch: `git branch`
2. Create branch: `.github/scripts/create-branch.sh feature my-feature`
3. Make changes and commit them
4. Create PR: `.github/scripts/create-pr.sh`
5. Check PR status: `.github/scripts/check-pr.sh`
6. Merge PR: `.github/scripts/merge-pr.sh`

### Advanced Workflows

**Work-in-Progress Flow:**
1. `.github/scripts/create-branch.sh feature my-feature`
2. Make initial changes and commit
3. `.github/scripts/create-pr.sh --draft`
4. Continue making changes and commits
5. Mark PR ready for review in GitHub UI
6. `.github/scripts/check-pr.sh --details`
7. `.github/scripts/merge-pr.sh`

**Custom Base Branch Flow:**
1. `.github/scripts/create-branch.sh feature my-feature`
2. Make changes and commit
3. `.github/scripts/create-pr.sh --base develop`
4. `.github/scripts/check-pr.sh`
5. `.github/scripts/merge-pr.sh`

**Conflict Resolution Flow:**
1. `.github/scripts/check-pr.sh` (detects conflicts)
2. `.github/scripts/merge-pr.sh --resolve-conflicts`
3. Resolve any remaining conflicts manually
4. Commit conflict resolution
5. `.github/scripts/merge-pr.sh`

## Error Handling

| Error Case | Recommended Action |
|------------|-------------------|
| Uncommitted changes | Commit or stash changes before proceeding |
| Invalid branch name | Follow naming convention: `type/descriptive-name` |
| PR already exists | Use `check-pr.sh` to get status of existing PR |
| PR is behind base | Use `merge-pr.sh` which will offer to update |
| CI checks failing | Use `check-pr.sh --details` to see failures, then `--rerun-failed` |

## Best Practices

1. **Always check your branch** before making changes
2. **Commit regularly** to avoid carrying large uncommitted changes
3. **Create draft PRs** for work-in-progress features
4. **Check PR status** before attempting to merge
5. **Resolve conflicts promptly** when they occur

## Integration with CI

The scripts integrate with your CI system:
- `check-pr.sh --details` shows CI check status with emoji indicators
- `check-pr.sh --rerun-failed` re-runs failed CI checks
- `merge-pr.sh` validates CI check status before merging