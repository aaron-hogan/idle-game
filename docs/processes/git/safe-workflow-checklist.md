# Safe Workflow Checklist

This document provides a set of verification steps that should be performed at the start of every development session to ensure a safe, consistent workflow.

## Pre-Development Safety Check

Before starting any work, complete the following checks:

### 1. Repository Status Check

```bash
# Check current branch and status
git status

# Verify recent commits to understand context
git log -n 5 --oneline

# Check if there are any stashed changes
git stash list
```

### 2. Branch Verification (CRITICAL)

❗ **NEVER WORK DIRECTLY ON THE MAIN BRANCH** ❗

```bash
# First, check your current branch
git branch

# If you're on main, STOP and create a new branch immediately
# List all branches to ensure you know what exists
git branch -a

# Create a new branch with proper naming:
git checkout -b fix/my-bugfix       # For fixes
git checkout -b feature/my-feature  # For features
git checkout -b refactor/component  # For refactoring
git checkout -b docs/update-readme  # For documentation

# VERIFY you are no longer on main
git branch
```

BRANCH NAMING RULES:
- features: `feature/descriptive-name`
- fixes: `fix/issue-description`
- docs: `docs/what-changed`
- refactor: `refactor/component-name`

### 3. Pull Latest Changes

```bash
# Get latest changes from remote
git pull origin main
git pull origin develop  # If working against develop

# Check for upstream changes that might affect your work
git fetch --all
```

### 4. Build and Test Verification

```bash
# Verify the application builds properly
npm run build

# Run tests to ensure everything is working
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Safe Development Process

Follow these steps during development:

1. **Define Task Scope**
   - What specific issue are you addressing?
   - What files need to be modified?
   - What should NOT be changed?

2. **Search and Understand**
   - Search the codebase to understand the relevant systems
   - Read related files and documentation
   - Check recent changes to affected components

3. **Make Focused Changes**
   - Work on one logical change at a time
   - Check git diff often to verify changes are as intended
   - Commit frequently with clear messages

4. **Verify Each Change**
   - Run relevant tests after each significant change
   - Manually verify functionality
   - Run typecheck and lint to catch potential issues

## Pre-Commit Checklist

Before committing, verify:

- [ ] Changes are only in files relevant to the task
- [ ] No debugging code or console logs were accidentally added
- [ ] All tests pass
- [ ] Typechecking passes
- [ ] Linting passes
- [ ] The application still builds and runs correctly
- [ ] Documentation is updated if necessary
- [ ] CHANGELOG.md is updated for user-facing changes
- [ ] Commit message follows our commit message conventions

## Pre-Push Checklist

Before pushing to the remote, verify:

- [ ] You're on the correct branch
- [ ] All changes are committed
- [ ] The commit history is clean and logical
- [ ] You've pulled the latest changes from the upstream branch
- [ ] All tests pass in the final state

## ⚠️ Pre-PR Validation Checklist (REQUIRED) ⚠️

> **CRITICAL**: Following our dependency injection implementation lessons, do NOT consider work complete until thorough runtime validation is performed. TypeScript compilation alone is insufficient.

See [Process Failure Analysis](/docs/processes/lessons/process-failure-analysis.md) for full details.

### 1. Build-Time Validation
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Application builds successfully (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)

### 2. Runtime Validation (Critical)
- [ ] Application launches without errors
- [ ] **Console is clear of errors during:**
  - [ ] Initial load
  - [ ] Component mount/unmount
  - [ ] User interactions 
  - [ ] State transitions
- [ ] Every core user flow functions as expected
- [ ] Existing features continue to work properly

### 3. Edge Case Testing
- [ ] Application recovers from invalid states
- [ ] Error handling functions correctly

### 4. Release Preparation
- [ ] If this PR includes user-facing changes, check CHANGELOG.md is updated
- [ ] For PRs to main, create a proper version section in CHANGELOG.md for any unreleased changes
- [ ] Select the appropriate version level:
  - [ ] Major (X.0.0): Breaking changes
  - [ ] Minor (0.X.0): New features, no breaking changes
  - [ ] Patch (0.0.X): Bug fixes, no breaking changes
  - [ ] Patch Level (0.0.X-N): Small fixes and tweaks
- [ ] Use `./scripts/bump-version.sh X.Y.Z` or `./scripts/bump-version.sh X.Y.Z-N` to version changes
- [ ] Use `./scripts/prepare-for-main.sh` for guided version bumping
- [ ] Verify package.json version matches CHANGELOG.md version

See [Versioning and Release Process](/docs/processes/versioning-and-releases.md) for details.
- [ ] Initialization order issues are tested 
- [ ] Race conditions are addressed

### 4. Documentation Validation
- [ ] Implementation details are documented
- [ ] Any remaining issues are explicitly noted
- [ ] Changelog is updated appropriately

> **Remember**: Work is not "complete" until it functions correctly in the actual runtime environment with no console errors.

## Special Situation Handling

### 1. Hot Fixes for Production

- Always create a dedicated branch from main: `git checkout -b hotfix/issue-description main`
- Test thoroughly, as changes will go directly to production
- Create PR directly to main AND develop branches
- Document the emergency fix in detail

### 2. Handling Merge Conflicts

- Create a backup branch before resolving complex conflicts
- Resolve conflicts in your feature branch, never in main/develop
- Carefully verify functionality after conflict resolution
- Consider consulting team members if conflicts are complex

### 3. Work Interruptions

- Commit or stash changes before switching context
- Document your progress in commit messages or comments
- Consider creating WIP (Work In Progress) commits that will be amended/squashed later

## Workflow Example

```bash
# Starting a new session for fixing a bug
git checkout main
git pull
git checkout -b fix/resource-calculation-error

# Understanding the codebase
# Search for relevant files
# Read the documentation

# Making changes
# Edit files
# Run tests
npm test

# Verify changes
npm run typecheck
npm run lint
npm start  # Manual testing

# Commit changes
git add file1.ts file2.ts
git commit -m "fix: correct resource calculation formula"

# Final verification
npm run build
npm test

# Push changes
git push -u origin fix/resource-calculation-error

# Create pull request
# Through GitHub UI or gh cli
```

Remember: Safety is more important than speed. When in doubt, ask for guidance rather than proceeding with uncertainty.