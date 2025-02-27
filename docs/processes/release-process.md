# Professional Release Process

This document outlines our branching and release strategy that follows industry best practices for continuous delivery.

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

## Regular Development Workflow

1. **Start with develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature-name
   ```

3. **Make changes using conventional commits**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve edge case"
   ```

4. **Update CHANGELOG.md** under the Unreleased section with your changes

5. **Push your branch and create a PR to develop**
   ```bash
   git push -u origin feature/my-feature-name
   # Create PR through GitHub UI
   ```

6. **After approval and tests passing, merge to develop**

## Release Process

Once enough features are accumulated in `develop` for a release:

1. **Create a release branch**
   ```bash
   # From develop branch
   ./scripts/create-release.sh
   ```
   - This will prompt for version type
   - Creates a release branch with proper versioning
   - Updates CHANGELOG.md

2. **Create two Pull Requests**:
   - First, from `release/x.y.z` to `develop` (to bring updates back)
   - Second, from `release/x.y.z` to `main` (for the actual release)

3. **When the PR to main is merged**:
   - The semantic-release workflow is triggered
   - Version numbers are validated
   - Release notes are generated
   - A git tag is created
   - A GitHub release is published

## Hotfix Process

For urgent production fixes:

1. **Create a hotfix branch from main**
   ```bash
   # From main branch
   ./scripts/create-hotfix.sh
   ```

2. **Fix the issue with proper commit messages**
   ```bash
   git commit -m "fix: critical production issue"
   ```

3. **Create PRs to both main and develop**

4. **When merged to main**: A patch version is automatically released

## Version Numbering

We use semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR: Breaking changes
- MINOR: New features, backward compatible
- PATCH: Bug fixes, backward compatible

## Benefits of This Approach

- **Predictable Releases**: Clear path from feature to production
- **Quality Control**: Multiple verification points
- **Automated Versioning**: No manual version selection errors
- **Complete History**: Proper audit trail through structured commits
- **Better Release Notes**: Automatically generated from conventional commits
- **Project Clarity**: Anyone can understand the project's state and history

## Common Commands

| Phase | Command | Description |
|-------|---------|-------------|
| Feature Start | `git checkout -b feature/name develop` | Create feature branch |
| Feature End | Create PR to develop | Via GitHub UI |
| Release Start | `./scripts/create-release.sh` | Create release branch |
| Release End | Create PRs to develop and main | Via GitHub UI |
| Hotfix Start | `./scripts/create-hotfix.sh` | Create hotfix from main |
| Hotfix End | Create PRs to main and develop | Via GitHub UI |