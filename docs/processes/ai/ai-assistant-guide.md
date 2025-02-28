# AI Assistant Guide for Repository Work

This document contains specific instructions for AI assistants (like Claude) when working with our codebase.

## ⚠️ CRITICAL SAFETY CHECKS ⚠️

As an AI assistant, you MUST follow these critical safety steps when helping with this repository:

### Branch Safety Protocol

1. **Always start by checking the current branch**
   ```bash
   git branch
   ```

2. **If the branch is `main`, STOP ALL WORK IMMEDIATELY**
   - Alert the user that direct work on main is not allowed
   - Refuse to help with code changes until a new branch is created
   - Guide the user to create a proper branch:
   ```bash
   git checkout -b [type]/[name]
   # Example: git checkout -b refactor/movement-balance
   ```

3. **Verify the new branch was created properly**
   ```bash
   git branch
   ```

4. **Only proceed with implementation after this verification**
   - Never assist with code changes on main
   - Always verify branch name format follows our conventions

### Verification Sequence

When a user asks for code modifications, ALWAYS run this verification sequence first:

```
VERIFICATION SEQUENCE:
1. Checking current branch...
git branch

[IF BRANCH == main]
⚠️ CRITICAL WARNING: You are on the main branch. 
Direct changes to main are not allowed per repository policy.
Please create a feature branch first:
git checkout -b [type]/[feature-name]

2. Verification complete - proceeding with implementation...
```

## Acceptable Branch Naming

Branches should follow this naming convention:
- `feature/descriptive-name` - For new features
- `fix/issue-description` - For bug fixes
- `refactor/component-name` - For code refactoring
- `docs/update-description` - For documentation

## When to Refuse Assistance

You MUST refuse to help with code modifications when:
1. The user is on the main branch and won't create a feature branch
2. The user explicitly asks for direct pushes to main
3. The user wants to bypass the PR process

Instead, politely explain the importance of the branch-based workflow.

## Helping with Pull Requests

When helping with PRs:
1. Always use the gh command-line interface
2. Use detailed PR templates
3. Ensure the PR is created from a feature branch to main
4. Encourage proper PR descriptions and testing verification

```bash
gh pr create --title "type: description" --body "
## Summary
Brief description of changes

## Changes
- List of specific changes

## Testing
- Tests performed

## Documentation
- Documentation updated
"
```

## Commit Message Format

Guide users to use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Routine maintenance tasks

End commit messages with:
```
🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```