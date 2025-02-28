# Versioning Processes

This directory contains documentation for our versioning and release processes.

## Key Documents

- [Streamlined Versioning](streamlined-versioning.md) - Our automated versioning process based on PR titles
- [Versioning Learnings](streamlined-versioning-learnings.md) - Lessons learned from implementing the automated versioning process
- [Versioning and Releases](versioning-and-releases.md) - General versioning guidelines and release processes

## Versioning Workflow Overview

Our project follows semantic versioning (SemVer) with an automated approach:

1. PR titles must follow the conventional commit format: `type: description`
2. Version bumps are triggered automatically based on PR title:
   - `feat:` - Minor version bump (x.Y.z)
   - `fix:` - Patch version bump (x.y.Z)
   - `feat!:` or with `BREAKING CHANGE:` - Major version bump (X.y.z)
3. Changelog entries are included in the PR description under "## Changelog Entry"
4. Version bumping happens automatically when PRs are merged to main

## Related Processes

- [Git Workflow](/docs/processes/git/git-workflow.md)
- [PR Workflow](/docs/processes/git/pr-workflow.md)
- [Branch Management](/docs/processes/git/branch-management.md)