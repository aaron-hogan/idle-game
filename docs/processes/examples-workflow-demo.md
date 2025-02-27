# Professional Release Workflow Demo

This document demonstrates a step-by-step example of how our release process works from feature development to production deployment.

## Feature Development Phase

### Step 1: Create a feature branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication
```

### Step 2: Develop with conventional commits

```bash
# After implementing login functionality
git add src/auth/login.ts src/auth/login.test.ts
git commit -m "feat: implement user login functionality"

# After implementing registration
git add src/auth/register.ts src/auth/register.test.ts
git commit -m "feat: add user registration form and validation"

# After fixing a bug found during development
git add src/auth/validation.ts
git commit -m "fix: ensure password validation handles special characters"
```

### Step 3: Update CHANGELOG.md with your changes

Edit CHANGELOG.md to add your changes under the Unreleased section:

```markdown
## [Unreleased]

### Added
- User authentication system with login and registration
- Password validation with special character support
```

### Step 4: Create a Pull Request

```bash
git push -u origin feature/user-authentication
```

Then create a PR to the `develop` branch through GitHub.

### Step 5: Code Review and Merge

After tests pass and code is approved, the PR is merged to `develop`.

## Release Preparation Phase

### Step 6: Create a Release Branch

Once enough features are in `develop` for a release:

```bash
./scripts/create-release.sh
# When prompted, enter version: 1.5.0
```

This creates a `release/1.5.0` branch with:
- Version update in package.json
- CHANGELOG.md properly formatted with the new version section
- Changes committed automatically

### Step 7: Final Testing and Fixes

If any issues are found during release testing:

```bash
git checkout release/1.5.0
# Fix the issue
git add src/auth/login.ts
git commit -m "fix: correct error message for failed login attempts"
git push origin release/1.5.0
```

### Step 8: Create a Release PR

Create a PR from `release/1.5.0` to `main`, adding the label `ready-for-production`.

## Production Release Phase

### Step 9: Merge to Main

When the release PR is approved and merged to `main`, the semantic-release workflow automatically:

1. Determines the version number from commit history
2. Creates a Git tag (v1.5.0)
3. Generates release notes from commit messages
4. Creates a GitHub release
5. Updates CHANGELOG.md in the repository

### Step 10: Deploy to Production

Deployment to production is triggered by the new tag on `main`.

## Hotfix Process (if needed)

### Step 11: Create a Hotfix

If a critical issue is found in production:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/auth-security-fix
```

### Step 12: Fix the Issue

```bash
# Make changes to fix the issue
git add src/auth/security.ts
git commit -m "fix: resolve authentication bypass vulnerability"
```

### Step 13: Create Hotfix PRs

Create PRs to both `main` and `develop` to ensure the fix is in all branches.

### Step 14: Release Hotfix

When merged to `main`, a new patch version (1.5.1) is automatically released.

## Automated Parts of This Process

- ✅ Branch naming validation
- ✅ Commit message validation
- ✅ CI/CD automation (tests, build, etc.)
- ✅ Version determination
- ✅ Changelog generation
- ✅ Git tag creation
- ✅ GitHub release publication
- ✅ Deployment triggers