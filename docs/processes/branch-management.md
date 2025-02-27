# Branch and PR Management

This document describes the process for managing branches and pull requests in the idle-game repository.

## Branch Naming Conventions

Our branch naming convention follows this pattern:
- `feature/<name>` - For new features
- `fix/<name>` - For bug fixes
- `docs/<name>` - For documentation updates
- `refactor/<name>` - For code refactoring
- `ci/<name>` - For CI/CD pipeline changes
- `chore/<name>` - For maintenance tasks
- `test/<name>` - For adding or updating tests

## Branch Lifecycle

1. **Creation**: Create a branch for your work from the main branch
   ```bash
   git checkout main
   git pull
   git checkout -b feature/my-new-feature
   ```

2. **Work**: Make your changes, commit regularly with semantic commit messages
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push**: Push your branch to the remote repository
   ```bash
   git push -u origin feature/my-new-feature
   ```

4. **Create PR**: Create a pull request from your branch to main
   ```bash
   gh pr create --title "feat: add new feature" --body "Description of changes"
   ```

5. **Review & Merge**: After review and approval, the PR is merged to main

6. **Cleanup**: Delete the branch after it's merged

## Branch Cleanup Tools

### Cleaning Up Merged Branches

We have a script that helps clean up branches that have been merged into main:

```bash
./scripts/cleanup-branches.sh
```

This script:
1. Lists all branches that have been merged into main
2. Asks for confirmation before deleting local branches
3. Optionally deletes the corresponding remote branches

### Managing Stale PRs

We also have a script to help manage stale pull requests:

```bash
./scripts/cleanup-stale-prs.sh
```

This script:
1. Lists all open PRs
2. Identifies stale PRs (not updated in 30+ days)
3. Provides the option to close stale PRs with a comment

## Best Practices

1. **Keep branches short-lived**: Try to complete your work and merge within a few days
2. **Rebase before merging**: Keep your branch up to date with main
   ```bash
   git checkout main
   git pull
   git checkout feature/my-feature
   git rebase main
   ```
3. **Delete branches after merging**: Keep the repository clean
4. **Regularly run cleanup scripts**: Periodically run the cleanup scripts to maintain repository hygiene

## PR Requirements

1. All PRs must include:
   - A proper title following conventional commit format
   - A description of the changes
   - Reference to any related issues
   - Updates to the CHANGELOG.md file

2. All PRs must pass:
   - Build and tests
   - Linting checks
   - Type checking
   - CHANGELOG.md validation

## Handling Conflicts

If your branch has conflicts with main:

1. Rebase your branch on main
   ```bash
   git checkout main
   git pull
   git checkout your-branch
   git rebase main
   ```

2. Resolve conflicts in each file
3. Continue the rebase process
   ```bash
   git add .
   git rebase --continue
   ```

4. Force push your branch (with caution!)
   ```bash
   git push --force-with-lease
   ```

## Automation

Many of these processes are automated via GitHub Actions:
- PR validation
- CHANGELOG.md checks
- Build and test validation
- Security scanning

Refer to the [CI/CD Pipeline](/docs/processes/ci-cd-pipeline.md) documentation for more details.