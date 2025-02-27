# Professional Release Process

This document outlines our release process, branching strategy, and versioning approach.

## Overview

We use an industry-standard GitFlow-inspired branching strategy with semantic versioning to ensure reliable, predictable releases. The process is automated with GitHub Actions and semantic-release.

## Branching Strategy

Our repository uses the following branches:

- `main` - Production code only, always deployable
- `develop` - Integration branch for features, next release preparation
- `feature/*` - New features and non-urgent bug fixes
- `fix/*` - Bug fixes
- `release/*` - Release preparation branches
- `hotfix/*` - Urgent production fixes

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature (triggers MINOR version bump)
- `fix`: Bug fix (triggers PATCH version bump)
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Changes to the build process or tools
- `BREAKING CHANGE`: In commit body or footer (triggers MAJOR version bump)

## Development Workflow

### Feature Development

1. **Start from develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch**
   ```bash
   # Use the helper script
   .github/scripts/create-branch.sh feature new-capability
   
   # Or manually
   git checkout -b feature/new-capability
   ```

3. **Develop with conventional commits**
   ```bash
   git commit -m "feat: implement new capability"
   git commit -m "fix: correct edge case in feature"
   ```

4. **Update CHANGELOG.md**
   - Add your changes to the "Unreleased" section
   - Include all notable additions, changes, or fixes

5. **Push and create PR to develop**
   ```bash
   # Use the helper script
   .github/scripts/create-pr.sh --base develop
   
   # Or manually
   git push -u origin feature/new-capability
   gh pr create --base develop
   ```

6. **Check PR Status**
   ```bash
   # Use the helper script
   .github/scripts/check-pr.sh --details
   ```

7. **PR merged to develop**
   ```bash
   # Use the helper script
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   ```

### Release Process

Once develop contains all desired features for a release:

1. **Create a release branch**
   ```bash
   # Use the helper script
   npm run release
   
   # Or directly
   ./scripts/create-release.sh
   ```

2. **Verify changelog and final testing**
   - Ensure all changes are properly documented
   - Perform final testing on the release branch
   - Fix any issues found directly on release branch

3. **Create PRs from release branch**
   - PR to develop (to bring fixes back to develop)
   ```bash
   .github/scripts/create-pr.sh --base develop --title "chore: update develop with version changes"
   ```
   
   - PR to main (for actual release)
   ```bash
   .github/scripts/create-pr.sh --base main --title "chore(release): X.Y.Z"
   ```

4. **Merge PRs in order**
   - First, merge the PR to develop
   ```bash
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   ```
   
   - Then, merge the PR to main
   ```bash
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   ```
   
   - If there are conflicts:
   ```bash
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes --resolve-conflicts
   ```

5. **Verify branches are in sync**
   - Ensure main and develop branches are synchronized
   ```bash
   git checkout main
   git pull
   git checkout develop
   git pull
   git log --oneline --left-right main...develop
   ```

### Hotfix Process

For urgent fixes to production code:

1. **Create a hotfix branch from main**
   ```bash
   # Use the helper script
   npm run hotfix
   
   # Or directly
   ./scripts/create-hotfix.sh
   ```

2. **Implement and test fix**
   ```bash
   git commit -m "fix: resolve critical issue"
   ```

3. **Create two PRs**
   - PR to main (for immediate fix)
   ```bash
   .github/scripts/create-pr.sh --base main --title "fix: critical issue fix"
   ```
   
   - PR to develop (to keep branches in sync)
   ```bash
   .github/scripts/create-pr.sh --base develop --title "fix: critical issue fix"
   ```

4. **After merge to main**
   - Automated release is triggered
   - Patch version is incremented
   - Release notes are generated

## Automation Tools

### GitHub Actions Workflows

- **PR Validation** - Checks commits, branch names, and PR titles
- **Semantic Release** - Handles versioning, tagging, and release notes

### Helper Scripts

#### Branch Management
- **create-branch.sh** - Creates properly named branches from main or develop
- **create-pr.sh** - Creates standardized PRs with proper titles and descriptions
- **check-pr.sh** - Validates PR status and CI checks
- **merge-pr.sh** - Safely merges PRs with validation and conflict resolution

#### Release Management
- **create-release.sh** - Creates a release branch with proper version
- **create-hotfix.sh** - Creates a hotfix branch from main
- **npm run release** - Shortcut for create-release.sh
- **npm run hotfix** - Shortcut for create-hotfix.sh

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes
- **PATCH_LEVEL** for small tweaks (format: X.Y.Z-N)

## CHANGELOG Maintenance

The CHANGELOG.md follows [Keep a Changelog](https://keepachangelog.com/) format:

- Unreleased section at the top
- Version sections below with date
- Changes categorized as Added, Changed, Fixed, etc.

## Real-World Example Workflow

Here's an example of a complete release workflow:

1. **Feature Development**
   ```bash
   git checkout develop
   .github/scripts/create-branch.sh feature new-login-system
   # Make changes
   git commit -m "feat: implement new login system"
   .github/scripts/create-pr.sh --base develop
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   ```

2. **Creating a Release**
   ```bash
   npm run release
   # Choose version type (major/minor/patch)
   ```

3. **Merging Release**
   ```bash
   # Create PR to develop
   .github/scripts/create-pr.sh --base develop --title "chore: update develop with version changes"
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   
   # Create PR to main
   .github/scripts/create-pr.sh --base main --title "chore(release): 1.2.0"
   .github/scripts/merge-pr.sh <PR_NUMBER> --yes
   ```

4. **Verifying Sync**
   ```bash
   git checkout main
   git pull
   git checkout develop
   git pull
   git log --oneline --left-right main...develop
   # Should show no differences
   ```

## Benefits of This Approach

1. **Clear Separation of Concerns**
   - Feature development is separate from release management
   - Each branch has a specific purpose

2. **Quality Control**
   - Multiple verification points before production
   - Automated checks ensure consistency

3. **Predictable Releases**
   - Standardized process for all releases
   - Clear understanding of what's in each version

4. **Automated Versioning**
   - No manual version selection errors
   - Version determined by commit history

5. **Complete Audit Trail**
   - All changes documented in conventional commits
   - Automatic release notes generation