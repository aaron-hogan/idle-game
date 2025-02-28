# Resolving Merge Conflicts: Guidelines and Best Practices

This document provides guidelines for preventing and resolving merge conflicts in our project, with specific lessons learned from actual conflicts.

## Recent Issues

We recently encountered build failures across multiple PRs (#110-#114) due to merge conflict markers (`>>>>>`) that were accidentally committed to the main branch. This problem occurred in `src/components/GameTimer.tsx` and caused several PR workflows to fail at the build step.

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

4. **Incomplete conflict resolution**
   - Accidentally committing files still containing conflict markers
   - Not checking files thoroughly after conflict resolution

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

### 5. Automated Safeguards

- **Use pre-commit hooks** to detect conflict markers (we've added this to our setup-git-hooks.sh)
- **Run build checks locally** before pushing changes
- **Configure your editor** to highlight conflict markers

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
   - Remove ALL conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Save the files

4. **Mark conflicts as resolved**
   ```bash
   git add <resolved-files>
   ```

5. **Verify all conflict markers are removed**
   ```bash
   git diff --cached | grep -E "^[+](<{7}|={7}|>{7})"
   # This should return no results
   ```

6. **Continue the rebase**
   ```bash
   git rebase --continue
   ```

7. **Push the changes with force** (only if your branch isn't shared with others)
   ```bash
   git push -f origin <your-branch>
   ```

8. **Verify that the build passes** by running it locally
   ```bash
   npm run build:dev
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

## Case Study: GameTimer Component Conflict

### Problem

In PRs #110-#114, we encountered build failures due to:
1. A merge conflict marker (`>>>>>>> 913f8f829de658714bbc42cde32fd3bbb51a7e28`) was accidentally committed in `src/components/GameTimer.tsx`
2. The conflict marker was located at line 4, before an import statement
3. Multiple PRs were merged without noticing this issue

### What Went Wrong

1. **Incomplete conflict resolution** - The conflict marker was not completely removed
2. **Missing validation** - The code was not built locally before committing
3. **Multiple PRs affected** - The issue persisted across 5 consecutive PRs

### Resolution Steps

1. **Identify the issue**:
   - Examined build logs to find the specific error
   - Located the file containing the conflict marker

2. **Fix the issue**:
   - Removed the conflict marker from the file
   - Created a commit with a descriptive message

3. **Prevent recurrence**:
   - Added a pre-commit hook to detect conflict markers
   - Updated documentation with lessons learned

### Lessons Learned

1. **Always verify conflict resolution** is complete
2. **Run local builds** before pushing changes
3. **Add automated checks** to prevent these issues
4. **Review build logs** thoroughly when builds fail

## Implementing These Lessons

To implement these lessons in your workflow:

1. **Before creating a PR**:
   ```bash
   ./scripts/prepare-for-main.sh
   ```

2. **When resolving conflicts**:
   - Remove ALL conflict markers
   - Verify with `git diff --cached | grep -E "^[+](<{7}|={7}|>{7})"`
   - Run build locally with `npm run build:dev`

3. **Regular rebasing**:
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

4. **Setup Git Hooks**:
   ```bash
   ./scripts/setup-git-hooks.sh
   ```

By following these guidelines, we can significantly reduce merge conflicts and make them easier to resolve when they do occur.