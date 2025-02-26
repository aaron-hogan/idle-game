# Pull Request Workflow

This document outlines our comprehensive process for creating, validating, and merging pull requests. Following this process helps ensure code quality, proper documentation, and a stable codebase.

## PR Creation Process

### 1. Pre-Development Setup

```bash
# Start by verifying the current state
git status
git log -n 5 --oneline

# Make sure you're on the main branch and up-to-date
git checkout main
git pull origin main

# Create a new branch for your task
git checkout -b fix/descriptive-branch-name
```

### 2. Development Phase

```bash
# Make focused changes to address one specific issue
# Run tests frequently to verify changes
npm test -- --watch

# Commit changes with clear, descriptive messages
git add <relevant-files>
git commit -m "fix: clear description of the change"

# Verify all tests pass before proceeding
npm test
npm run typecheck
npm run lint
```

### 3. Documentation

```bash
# Always create documentation for significant changes
mkdir -p docs/features/<feature-area>
touch docs/features/<feature-area>/<change-description>.md

# Update critical-fixes.log for bug fixes
nano docs/project/critical-fixes.md

# Commit documentation separately
git add docs/
git commit -m "docs: add documentation for changes"
```

### 4. Push Changes and Create PR

```bash
# Push your branch to remote
git push -u origin fix/descriptive-branch-name

# Create a PR using GitHub CLI with detailed description
gh pr create --title "fix: descriptive title" --body "
## Summary
Brief description of the changes

## Changes
- Detailed list of changes made
- Include files modified and why

## Testing
- How changes were tested
- Tests that were added or modified

## Documentation
- Link to documentation created/updated
"
```

## PR Validation Process

### 1. Self-Review Checklist

Before requesting reviews, verify:

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] PR description clearly explains the changes
- [ ] Documentation is complete and follows standards
- [ ] Commits are focused and have clear messages
- [ ] No unintended files are included in the PR

### 2. Check for Conflicts

```bash
# Check if your branch can be cleanly merged
gh pr view <pr-number> --json mergeStateStatus

# If there are conflicts, resolve them in your branch
git pull origin main
# Resolve conflicts, then:
git add <resolved-files>
git commit -m "merge: resolve conflicts with main"
git push
```

### 3. Automated Checks

- Wait for all CI/CD checks to complete
- Address any failures in the checks by adding new commits

### 4. Request Reviews

- Request reviews from relevant team members
- Respond to any feedback promptly
- Make requested changes in new commits

## PR Merge Process

### 1. Pre-Merge Verification

```bash
# Check current merge status
gh pr checks <pr-number>
gh pr view <pr-number> --json mergeStateStatus

# Make sure your branch is up to date with main
git checkout fix/descriptive-branch-name
git pull origin main
git push
```

### 2. Final Testing

```bash
# Run tests again to ensure everything still works
npm test
npm run typecheck
npm run lint
```

### 3. Merge PR

```bash
# Merge the PR with appropriate options
gh pr merge <pr-number> --merge --delete-branch

# Or with squash option if appropriate
gh pr merge <pr-number> --squash --delete-branch
```

### 4. Post-Merge Verification

```bash
# Update local main branch
git checkout main
git pull origin main

# Verify tests still pass on main
npm test

# Run the application to verify it works
npm start
```

### 5. Update Documentation (if needed)

```bash
# Update any project-level documentation
git checkout -b docs/update-project-docs
# Make documentation updates
git add docs/
git commit -m "docs: update project documentation after PR merge"
git push -u origin docs/update-project-docs
# Create a documentation PR
```

## Special Cases

### Hotfixes

For urgent fixes to production:

```bash
# Create branch directly from main
git checkout main
git pull
git checkout -b hotfix/critical-issue

# Make minimal focused changes to fix the issue
# Follow same testing and documentation process
# Create PR directly to main
gh pr create --title "hotfix: fix critical issue" --base main
```

### Large Feature Merges

For complex features with multiple PRs:

1. Create a feature integration branch
2. Merge individual PRs into the integration branch
3. Test thoroughly on the integration branch
4. Create a final PR from integration to main

### Merge Conflicts

When resolving complex conflicts:

```bash
# Create a backup branch before resolving
git checkout fix/my-feature
git checkout -b fix/my-feature-conflict-resolution

# Pull main and resolve conflicts
git pull origin main
# Resolve conflicts carefully
git add <resolved-files>
git commit -m "merge: resolve conflicts with main"

# Test thoroughly after conflict resolution
npm test

# Push the conflict resolution
git push -u origin fix/my-feature-conflict-resolution

# Update the original PR to use this branch instead
```

## Example Workflow

Here's a complete example of our PR workflow in action:

```bash
# Start with a clean state
git checkout main
git pull

# Create a branch for the fix
git checkout -b fix/console-spam-reduction

# Make focused changes
# Edit files to reduce console spam
npm test

# Commit changes
git add src/components/App.tsx src/systems/resourceManager.ts
git commit -m "fix: reduce excessive console logging"

# Create documentation
touch docs/features/performance/console-spam-fix.md
# Add detailed documentation
git add docs/features/performance/console-spam-fix.md
git commit -m "docs: add documentation for console spam fix"

# Push branch and create PR
git push -u origin fix/console-spam-reduction
gh pr create --title "fix: reduce excessive console logging" --body "..."

# Check for conflicts
gh pr view --json mergeStateStatus

# Wait for reviews and address feedback
# Make any requested changes

# Merge the PR when approved
gh pr merge --merge --delete-branch

# Verify main is stable after merge
git checkout main
git pull
npm test
npm start
```

## Best Practices

1. **One Issue, One PR**: Each PR should address a single issue or feature
2. **Small PRs**: Keep PRs small and focused for easier review and testing
3. **Clear Commit Messages**: Use conventional commits (fix:, feat:, docs:, etc.)
4. **Documentation First**: Document your changes as you make them
5. **Test Early, Test Often**: Write tests before or alongside code changes
6. **Self-Review**: Always review your own PR before requesting reviews
7. **Keep CI Green**: Don't merge PRs that break the build or tests
8. **Communicate**: Use PR comments to explain complex changes or decisions
9. **Update Tests**: Always update tests when refactoring or changing behavior
10. **Verify After Merge**: Always verify the main branch is stable after merging

By following this workflow, we maintain a high-quality codebase with clear history and thorough documentation.