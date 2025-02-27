# Resolving Merge Conflicts: Guidelines and Best Practices

This document provides guidelines for preventing and resolving merge conflicts in our project, with specific lessons learned from actual conflicts.

## Common Causes of Merge Conflicts

1. **Simultaneous edits to documentation files**
   - Multiple PRs editing the same documentation files (e.g., README.md files)
   - Adding new sections to lists or tables that other PRs are also modifying

2. **Structural file changes**
   - Reorganizing directories while others are adding files to those directories
   - Renaming files that others are editing

3. **Dependency changes**
   - Multiple PRs updating package.json dependencies 
   - Multiple PRs modifying build configuration files

## Prevention Strategies

### 1. Communication

- **Announce major structural changes** in team chat before starting
- **Check open PRs** that might touch the same files you're planning to edit
- For documentation updates, **coordinate with team members** working on related documentation

### 2. Keep PRs Focused and Small

- **Limit scope** of PRs to minimize the chance of conflicts
- **Split large changes** into several smaller, targeted PRs
- **Organize commits** logically to make conflict resolution easier

### 3. Update Branches Frequently

- **Rebase on main** regularly (at least daily during active development)
- **Pull latest changes** before starting new work
- Use `git pull --rebase origin main` to maintain a cleaner history

### 4. Documentation-Specific Guidelines

- **Append to lists** rather than inserting in the middle when possible
- **Use separate files** for new documentation instead of editing shared files
- **Add clear section markers** in documentation files to help with merging

## Resolving Conflicts

### Local Resolution Process

1. **Pull latest changes** from the main branch
   ```bash
   git fetch origin main
   ```

2. **Rebase your branch** on the main branch
   ```bash
   git rebase origin/main
   ```

3. **If conflicts arise**, Git will pause the rebase:
   - Edit the conflicted files to resolve conflicts
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Save the files

4. **Mark conflicts as resolved**
   ```bash
   git add <resolved-files>
   ```

5. **Continue the rebase**
   ```bash
   git rebase --continue
   ```

6. **Push the changes with force** (only if your branch isn't shared with others)
   ```bash
   git push -f origin <your-branch>
   ```

### Using Our Automation Scripts

Our `prepare-for-main.sh` script can help prevent conflicts:

```bash
./scripts/prepare-for-main.sh
```

This script automates:
- Fetching latest changes from main
- Rebasing your branch if needed
- Running validation checks

## Case Study: Documentation README Conflicts

### Problem

In PR #50, we encountered a conflict in `scripts/README.md` because:
1. PR #50 added sections about new automation scripts 
2. Another PR had added documentation about git management tools
3. Both PRs modified the same part of the file

### What Went Wrong

1. **Lack of branch update** - The automation PR was not rebased on main before pushing
2. **Web UI limitations** - Attempting to resolve in GitHub's web UI failed due to complexity
3. **Section proximity** - Both PRs added sections at the same location in the README

### Resolution Steps

1. **Local clone and rebase**:
   ```bash
   git pull origin main --rebase
   ```

2. **Manual conflict resolution**:
   - Properly formatted the merged file
   - Kept both sections in logical order
   - Removed conflict markers

3. **Force push the resolved branch**:
   ```bash
   git push -f origin feature/git-automation
   ```

### Lessons Learned

1. **Always rebase before creating PRs** to minimize conflicts
2. **Resolve complex conflicts locally**, not in GitHub's web UI
3. **Organize documentation updates** to minimize chances of conflict
4. **Use automation tools** to standardize branch updates
5. **Use section spacing** in documentation files to reduce conflict likelihood

## Implementing These Lessons

To implement these lessons in your workflow:

1. **Before creating a PR**:
   ```bash
   ./scripts/prepare-for-main.sh
   ```

2. **When adding documentation**:
   - Add new sections at the end of related sections when possible
   - Use clear section markers with empty lines between sections
   - Check for open PRs that might modify the same files

3. **Regular rebasing**:
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

By following these guidelines, we can significantly reduce merge conflicts and make them easier to resolve when they do occur.