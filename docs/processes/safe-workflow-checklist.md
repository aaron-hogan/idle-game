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

### 2. Branch Verification

```bash
# List all branches to ensure you know what exists
git branch -a

# Check that you're on the correct branch for the task
# If not, create or checkout the appropriate branch
git checkout -b fix/my-bugfix main   # For fixes
git checkout -b feature/my-feature develop  # For features
```

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