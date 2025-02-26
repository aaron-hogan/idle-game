# GitHub Scripts Quick Reference

## Script Commands

### Create Branch
```bash
# Basic usage
.github/scripts/create-branch.sh feature my-feature-name

# Available branch types
# feature, fix, docs, refactor, ci, chore, test
.github/scripts/create-branch.sh docs update-readme
```

### Create PR
```bash
# Basic usage - creates PR from current branch to main
.github/scripts/create-pr.sh

# Create draft PR
.github/scripts/create-pr.sh --draft

# Create PR to different base
.github/scripts/create-pr.sh --base develop

# Skip uncommitted changes check
.github/scripts/create-pr.sh --skip-check
```

### Check PR Status
```bash
# Check current branch's PR
.github/scripts/check-pr.sh

# Check specific PR by number
.github/scripts/check-pr.sh 42

# Show detailed CI status
.github/scripts/check-pr.sh --details

# Re-run failed checks
.github/scripts/check-pr.sh --rerun-failed

# Get only CI data in JSON format
.github/scripts/check-pr.sh --ci-only
```

### Merge PR
```bash
# Merge current branch's PR
.github/scripts/merge-pr.sh

# Merge specific PR by number
.github/scripts/merge-pr.sh 42

# Auto-confirm all prompts
.github/scripts/merge-pr.sh --yes

# Try to resolve conflicts automatically
.github/scripts/merge-pr.sh --resolve-conflicts

# Both options can be combined
.github/scripts/merge-pr.sh 42 --yes --resolve-conflicts
```

## Common Workflows

### New Feature Development
```bash
.github/scripts/create-branch.sh feature my-feature
# Make changes and commit
.github/scripts/create-pr.sh --draft
# Continue work, make more commits
# When ready, mark as ready for review in GitHub UI
.github/scripts/check-pr.sh --details
# After approval
.github/scripts/merge-pr.sh
```

### Quick Fix
```bash
.github/scripts/create-branch.sh fix important-bug
# Make changes and commit
.github/scripts/create-pr.sh
.github/scripts/check-pr.sh --details
# After approval
.github/scripts/merge-pr.sh --yes
```

## Error Reference

| Error | Solution |
|-------|----------|
| `Cannot create PR from main branch` | Switch to or create a feature branch first |
| `No open PR found for current branch` | Create a PR first or specify PR number |
| `Branch name doesn't follow required pattern` | Use proper naming pattern: `type/name` |
| `You have unsaved changes` | Commit, stash, or use appropriate flag to bypass |
| `PR is not open` | Make sure PR is still open and not already merged |
| `PR is behind base branch` | Use merge-pr.sh which will offer to update |
| `PR is not mergeable` | Fix conflicts or use --resolve-conflicts |

## Exit Codes Reference

All scripts use consistent exit codes:
- `0`: Success
- `1`: General error (validation, usage)
- `>1`: Underlying command error