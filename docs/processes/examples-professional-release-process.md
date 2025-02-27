# Professional Release Process

This document outlines a professional branching and release strategy that follows industry best practices for continuous delivery.

## Branching Strategy

We use a modified GitFlow strategy with the following branches:

- `main` - Production code only. Always deployable.
- `develop` - Integration branch for completed features. Next release candidates come from here.
- `feature/*` - Feature branches for active development.
- `fix/*` - Bugfix branches.
- `release/*` - Release candidate branches, where version bumps and final release preparations happen.
- `hotfix/*` - Emergency fixes for production issues, branched from `main`.

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat: add user authentication flow

Implements JWT-based authentication with refresh tokens.
Includes login, registration, and password reset flows.

BREAKING CHANGE: The auth endpoints now use JWT instead of session cookies.
```

## Pull Request Workflow

1. Create a feature branch from `develop`
2. Implement your changes with conventional commits
3. Create a PR to merge back to `develop`
4. Ensure CI passes (tests, linting, type checks)
5. Get code review and approval
6. Merge to `develop`

## Release Process

### Starting a Release

1. When `develop` contains all features for the next release, create a release branch:
   ```bash
   ./scripts/create-release.sh
   ```
   This prompts for the new version number and creates a `release/X.Y.Z` branch from `develop`.

2. On the release branch:
   - Update the version in package.json
   - Move items from "Unreleased" to a new version section in CHANGELOG.md
   - Perform final testing and bug fixes
   
3. Create a PR from `release/X.Y.Z` to `develop` to bring any release fixes back

### Finalizing a Release

1. Create a PR from `release/X.Y.Z` to `main`
2. This PR must have the label `ready-for-production`
3. When merged to `main`:
   - The semantic-release workflow is triggered
   - Version numbers are validated
   - Release notes are generated from commit messages
   - A git tag is created
   - A GitHub release is published
   
4. After release, production is deployed from the tagged version on `main`

## Handling Hotfixes

For urgent production fixes:

1. Create a `hotfix/brief-description` branch from `main`
2. Fix the issue with proper commit messages
3. Create PRs to both `main` and `develop`
4. When merged to `main`, a patch version is automatically released

## Automation

This process is supported by several automation tools:

1. **Branch protection rules** that:
   - Require PR reviews before merging
   - Require status checks to pass
   - Prevent direct pushes to `main` and `develop`

2. **GitHub Actions workflows** that:
   - Validate branch naming and commit messages
   - Run tests, linting, and type checking
   - Automate the release process
   - Generate changelogs from commit history

3. **semantic-release** to:
   - Determine the next version number based on commit messages
   - Generate release notes
   - Create tags and GitHub releases
   - Update package.json and CHANGELOG.md

## Benefits of This Approach

- **Predictable Releases**: Clear path from feature to production
- **Quality Control**: Multiple verification points
- **Separation of Concerns**: 
  - Developers focus on features
  - Release managers focus on releases
  - Operations focus on deployments
- **Automated Versioning**: No human error in version selection
- **Good Audit Trail**: Complete history of changes in commit messages
- **Better Release Notes**: Automatically generated from structured commits

## Sample Developer Workflow

```bash
# Start a new feature
git checkout develop
git pull
git checkout -b feature/user-profile

# Make changes and commit with conventional commits
git commit -m "feat: add user profile page"
git commit -m "feat: implement profile editing"

# Push feature branch
git push -u origin feature/user-profile

# Create a PR to develop through GitHub UI

# After PR is merged, start a new feature
git checkout develop
git pull
```