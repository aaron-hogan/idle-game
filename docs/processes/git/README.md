# Git Processes

This directory contains documentation for git workflows, standards, and processes.

## Key Documents

- [Git Workflow](git-workflow.md) - Standard workflow for using git in this project
- [Branch Protection](branch-protection.md) - Branch protection rules and policies
- [Commit Standards](commit-standards.md) - Standards for commit messages and organization

## Git Workflow Overview

Our project follows a feature branch workflow:

1. Create feature branches from `main` for all changes
2. Use descriptive branch names following the pattern `type/description`
3. Make small, focused commits with clear messages
4. Create pull requests for review before merging
5. Squash-merge changes to maintain a clean history

## Branch Naming Conventions

Branches should follow this naming convention:
- `feature/feature-name` - For new features
- `fix/bug-name` - For bug fixes
- `refactor/component-name` - For code refactoring
- `docs/documentation-change` - For documentation changes
- `test/test-addition` - For adding tests

## Commit Message Standards

Commit messages should follow the Conventional Commits standard:
- `feat:` - Feature additions
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

For more detailed information, refer to the specific documents in this directory.
