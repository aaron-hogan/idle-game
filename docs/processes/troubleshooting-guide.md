# Release Process Troubleshooting Guide

This document provides solutions for common issues with our professional release process.

## GitHub Actions Issues

### Permission Errors

**Symptom:** GitHub Actions fails with `Permission to repository denied to github-actions[bot]`

**Solutions:**
1. Check repository settings:
   - Go to Settings > Actions > General > Workflow permissions
   - Set to "Read and write permissions"

2. If using protected branches:
   - Go to Settings > Branches > Branch protection rules
   - Add exception for GitHub Actions or use a Personal Access Token (PAT)

3. For specific workflows:
   ```yaml
   permissions:
     contents: write
     pull-requests: write
   ```

### Node Version Mismatch

**Symptom:** npm warns about unsupported engines, packages fail to install

**Solution:**
- Update Node.js version in workflow:
  ```yaml
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'  # Ensure compatible version
  ```

### Workflow Syntax Errors

**Symptom:** GitHub Actions failing with syntax errors

**Solutions:**
1. For conditionals:
   ```yaml
   # Instead of this:
   if: |
     condition1 &&
     condition2
   
   # Use this:
   if: >
     condition1 &&
     condition2
   ```

2. For output variables:
   ```yaml
   # Deprecated:
   echo "::set-output name=variable::value"
   
   # Current syntax:
   echo "variable=value" >> $GITHUB_OUTPUT
   ```

## Branching Issues

### Cannot Create Branch

**Symptom:** Error when creating branches with scripts

**Solutions:**
1. Check script permissions:
   ```bash
   chmod +x scripts/create-release.sh scripts/create-hotfix.sh
   ```

2. Verify current branch:
   ```bash
   git branch  # Should show current branch
   # For release: must be on develop
   # For hotfix: must be on main
   ```

3. Check for uncommitted changes:
   ```bash
   git status  # Should be clean
   # If not: git stash or git commit
   ```

### Merge Conflicts

**Symptom:** Merge conflicts when creating PRs

**Solutions:**
1. For release branch conflicts with develop:
   ```bash
   git checkout release/x.y.z
   git pull origin develop
   # Resolve conflicts
   git add .
   git commit -m "chore: resolve merge conflicts with develop"
   ```

2. For hotfix branch conflicts:
   ```bash
   git checkout hotfix/description
   git pull origin main
   # Resolve conflicts
   git add .
   git commit -m "chore: resolve merge conflicts with main"
   ```

## Semantic Release Issues

### Version Not Incrementing

**Symptom:** semantic-release doesn't create a new version

**Solutions:**
1. Check commit messages:
   - Must follow conventional format (`feat:`, `fix:`, etc.)
   - At least one commit must trigger a version bump

2. Verify .releaserc.json configuration:
   ```json
   {
     "branches": ["main", {"name": "release/*", "prerelease": true}],
     "plugins": [...]
   }
   ```

3. Debug semantic-release:
   ```bash
   npx semantic-release --dry-run --debug
   ```

### CHANGELOG Not Updating

**Symptom:** CHANGELOG.md isn't updated automatically

**Solutions:**
1. Check @semantic-release/changelog plugin:
   ```json
   ["@semantic-release/changelog", {
     "changelogFile": "CHANGELOG.md"
   }]
   ```

2. Verify CHANGELOG.md format:
   - Must have proper structure with ## [Unreleased] section
   - Must follow Keep a Changelog format

3. Manual fix if needed:
   ```bash
   # In release branch
   # Edit CHANGELOG.md to add version section
   git add CHANGELOG.md
   git commit -m "docs: update changelog for release"
   ```

## Script Errors

### Release Script Fails

**Symptom:** `create-release.sh` exits with error

**Solutions:**
1. Check current branch:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Verify Unreleased section in CHANGELOG.md:
   ```bash
   # CHANGELOG.md should have:
   ## [Unreleased]
   
   ### Added
   - Some changes...
   ```

3. Debug script execution:
   ```bash
   bash -x scripts/create-release.sh
   ```

### Hotfix Script Fails

**Symptom:** `create-hotfix.sh` exits with error

**Solutions:**
1. Check current branch:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Provide valid hotfix description:
   ```bash
   # Use lowercase, hyphens instead of spaces
   ./scripts/create-hotfix.sh
   # Enter: critical-auth-fix
   ```

## Process Issues

### PR Validation Fails

**Symptom:** PR checks fail for branch name or commit validation

**Solutions:**
1. Fix branch naming:
   ```bash
   # Rename local branch
   git branch -m old-name feature/new-name
   # Update remote
   git push origin :old-name feature/new-name
   git push --set-upstream origin feature/new-name
   ```

2. Fix commit messages with interactive rebase:
   ```bash
   git rebase -i HEAD~3  # For last 3 commits
   # Change 'pick' to 'reword' for commits to fix
   # Save and provide proper conventional commit messages
   ```

### Develop/Main Out of Sync

**Symptom:** develop branch is missing changes from main

**Solution:**
```bash
git checkout develop
git pull origin develop
git merge origin/main
# Resolve conflicts if needed
git push origin develop
```

## Reference

### Common Commands

```bash
# Create feature branch
git checkout -b feature/name develop

# Create bugfix branch
git checkout -b fix/description develop

# Create release
git checkout develop
./scripts/create-release.sh

# Create hotfix
git checkout main
./scripts/create-hotfix.sh

# View branch structure
git log --graph --oneline --all --decorate
```

### Useful Environment Variables

For GitHub Actions debugging:

```yaml
env:
  ACTIONS_RUNNER_DEBUG: true
  ACTIONS_STEP_DEBUG: true
```

### Support Resources

If issues persist after trying these solutions:

1. Check GitHub Actions workflow logs
2. Review semantic-release documentation
3. Contact the repository administrator