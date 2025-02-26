# Git Workflow

This document outlines our Git workflow, branch strategy, and best practices to ensure a consistent and safe approach to version control across the project.

## Safety Guidelines

### Critical Safety Rules

- **NEVER** force push to `main` or `develop` branches
- **ALWAYS** get explicit permission before:
  - Merging to `develop` or `main`
  - Rebasing shared branches
  - Deleting any branch
  - Creating a release tag
  - Modifying CI/CD configurations
- **ALWAYS** create a backup branch before destructive operations
- **ALWAYS** double-check branch names before destructive operations
- **NEVER** manually edit commit history of shared branches
- When in doubt, **ASK** before proceeding with any git operation that might affect others

### Preventative Measures

- Always pull before pushing to avoid conflicts
- Regularly sync feature branches with their base branch
- Use the safe workflow checklist before making changes
- Test thoroughly before committing and pushing
- Create focused branches with clear purposes

## Branch Strategy

Our project uses a modified GitFlow approach with the following branches:

### Core Branches

- **`main`**: Production-ready code, protected branch
  - Always deployable
  - Tagged with release versions
  - Direct commits prohibited

- **`develop`**: Integration branch for features, protected branch
  - Latest delivered development changes
  - Used as the base for feature branches
  - Contains all completed features awaiting release

### Supporting Branches

- **`feature/*`**: Feature branches
  - Created from: `develop`
  - Merge back to: `develop`
  - Naming convention: `feature/descriptive-feature-name`
  - Example: `feature/event-system`

- **`bugfix/*`**: Bug fix branches
  - Created from: `develop`
  - Merge back to: `develop`
  - Naming convention: `bugfix/issue-description`
  - Example: `bugfix/resource-generation-error`

- **`hotfix/*`**: Critical fixes for production
  - Created from: `main`
  - Merge back to: `main` AND `develop`
  - Naming convention: `hotfix/critical-issue-name`
  - Example: `hotfix/login-failure`

- **`docs/*`**: Documentation updates
  - Created from: `develop` or `main`
  - Merge back to: originating branch
  - Naming convention: `docs/documentation-description`
  - Example: `docs/api-reference-update`

## Development Workflow

### 1. Branch Creation

Start by creating a branch with an appropriate name based on the branch strategy:

```bash
# For features (from develop)
git checkout develop
git pull
git checkout -b feature/resource-system

# For bug fixes
git checkout -b bugfix/resource-generation-error

# For documentation updates
git checkout -b docs/update-api-docs

# For hotfixes (from main)
git checkout main
git pull
git checkout -b hotfix/critical-login-issue
```

### 2. Commit Guidelines

Follow these commit message conventions to maintain a clear and informative history:

- Use descriptive commit messages with prefix:
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `docs:` - Documentation changes
  - `test:` - Adding or modifying tests
  - `refactor:` - Code changes that neither fix bugs nor add features
  - `perf:` - Performance improvements
  - `chore:` - Maintenance tasks, dependencies

Examples:
```
feat: implement resource accumulation algorithm
fix: correct overflow error in resource display
docs: update API documentation for resource system
test: add unit tests for resource manager
refactor: simplify resource calculation logic
```

Guidelines for commits:
- Keep commits atomic and focused on single changes
- Write commit messages in imperative, present tense
- Include a brief description of the change
- Reference issue numbers when applicable
- Separate subject from body with a blank line for detailed explanations

### 3. Pull Requests

When your feature or fix is complete:

1. Create a PR against the appropriate target branch:
   - Features and bugfixes -> `develop`
   - Hotfixes -> `main`

2. Format PR title following commit message style:
   ```
   feat: implement resource management system
   ```

3. Include a detailed PR description with:
   - What changes were made (summary of functionality)
   - Why changes were made (purpose/motivation)
   - How they were implemented (approach)
   - Testing verification
   - Screenshots if UI changes present
   - Links to relevant issues or documentation

4. Request review from at least one team member
5. Ensure all CI checks pass before merging
6. **ALWAYS** get explicit approval before merging

### 4. Code Review Process

Reviewers should check for:
- Code quality and standards adherence
- Test coverage and correctness
- Documentation completeness
- Performance considerations
- Security implications

As the PR author:
- Address all review comments promptly
- Explain your approach when requested
- Make requested changes in new commits
- Resolve conversations when addressed
- Request re-review after making changes

### 5. Merging Strategy

When merging PRs:
- Prefer squash and merge for feature/bugfix branches to keep history clean
- Use merge commit for hotfixes to preserve context
- Ensure the PR has been approved
- Verify all CI checks are passing
- Write a clear, descriptive merge commit message

### 6. Release Process

To create a new release:
1. **ALWAYS** get explicit permission before releasing
2. Create a release branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b release/vX.Y.Z
   ```
3. Make only version bump and minor fixes on this branch
4. Verify all tests pass on the release branch
5. Create a PR from release branch to `main`
6. After approval, merge to `main`
7. Tag the release with semantic versioning:
   ```bash
   git checkout main
   git pull
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```
8. Create release notes using GitHub releases
9. Merge `main` back to `develop` to sync version changes:
   ```bash
   git checkout develop
   git pull
   git merge main
   git push
   ```

## Handling Common Scenarios

### Keeping Feature Branches Updated

To keep your feature branch in sync with the base branch:

```bash
# While on your feature branch
git fetch origin
git merge origin/develop
# Resolve any conflicts
git push
```

### Handling Merge Conflicts

When conflicts occur:

1. Create a backup branch before resolving:
   ```bash
   git checkout feature/my-feature
   git checkout -b feature/my-feature-conflict-resolution
   ```

2. Merge in the base branch:
   ```bash
   git merge develop
   ```

3. Resolve conflicts carefully:
   - Understand both changes before resolving
   - Keep the intended behavior
   - Test thoroughly after resolution

4. Complete the merge and push:
   ```bash
   git add .
   git commit -m "merge: resolve conflicts with develop"
   git push
   ```

### Fixing Mistakes

If you commit to the wrong branch:
```bash
# Create a new branch with your changes
git checkout -b correct-branch-name
# Reset the original branch
git checkout original-branch
git reset --hard origin/original-branch
```

If you need to undo a pushed commit:
```bash
# NEVER do this on main or develop
git revert <commit-hash>
git push
```

## Git Best Practices

1. **Regular Commits**: Commit early and often to save your work
2. **Focused Changes**: Keep commits and branches focused on specific tasks
3. **Clear History**: Write descriptive commit messages for future reference
4. **Test Before Commit**: Ensure your changes work before committing
5. **Sync Frequently**: Pull changes regularly to reduce merge conflicts
6. **Branch Hygiene**: Delete branches after they're merged
7. **Avoid Binary Files**: Don't commit large binary files or generated content
8. **Protect Credentials**: Never commit secrets, keys, or credentials

## Related Documentation

- [PR Workflow](/docs/processes/pr-workflow.md)
- [Safe Workflow Checklist](/docs/processes/safe-workflow-checklist.md)
- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md)

By following these git guidelines, we maintain a clean, organized repository history that enhances collaboration and project maintainability.