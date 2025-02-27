# Versioning and Release Process

This document outlines our process for versioning the application and creating releases. Following this process helps maintain a clear release history and ensures changes are properly documented.

## Semantic Versioning

We follow [Semantic Versioning](https://semver.org/) principles:

```
MAJOR.MINOR.PATCH (e.g., 1.2.3)
```

- **MAJOR**: Breaking changes
- **MINOR**: New features without breaking changes
- **PATCH**: Bug fixes without breaking changes

## Changelog Process

### Adding Changes

During development:

1. Add all changes to the `[Unreleased]` section in `CHANGELOG.md`
2. Categorize changes under:
   - **Added**: New features
   - **Changed**: Changes to existing functionality
   - **Deprecated**: Features that will be removed
   - **Removed**: Features that were removed
   - **Fixed**: Bug fixes
   - **Security**: Security-related changes

Example:
```markdown
## [Unreleased]

### Added
- New feature description

### Fixed
- Bug fix description
```

### Creating a Release

Before merging to main:

1. Determine the appropriate version number based on semantic versioning
2. Run the version bumping script:
   ```bash
   ./scripts/bump-version.sh X.Y.Z
   ```
3. This script will:
   - Create a new version section in `CHANGELOG.md`
   - Set today's date as the release date
   - Update version in `package.json`
4. Review the changes
5. Commit the changes with message: `chore: bump version to X.Y.Z`

## PR Requirements

PRs to main must meet these requirements:

1. **No Unreleased Changes**: All changes must be versioned with a proper version number
2. **Version Match**: `CHANGELOG.md` version must match `package.json` version
3. **Complete Documentation**: All changes must be documented in the changelog

## CI/CD Integration

Our CI/CD pipeline includes:

1. **Changelog Check**: Validates that no unversioned changes are merged to main
2. **Version Consistency**: Ensures version numbers are consistent across the codebase
3. **Release Automation**: Creates GitHub releases based on tags

## Release Workflow

### Standard Release Process

1. Create a release branch: `release/vX.Y.Z`
2. Update the version using `./scripts/bump-version.sh X.Y.Z`
3. Commit and push changes
4. Create a PR to main
5. After PR is approved and merged, tag the release:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
6. The CI/CD pipeline will create a GitHub release automatically

### Hotfix Process

For urgent fixes to production:

1. Create a hotfix branch from main: `hotfix/description`
2. Make the fixes and update `CHANGELOG.md`
3. Version using `./scripts/bump-version.sh X.Y.Z+1`
4. Follow the standard PR and tagging process

## Post-Release Tasks

After a release:

1. Verify the GitHub release was created properly
2. Update the demo environment with the new version
3. Update the project roadmap as needed
4. Communicate the release to stakeholders

## Tools and Commands

### Version Bumping Script

```bash
./scripts/bump-version.sh X.Y.Z
```

### Checking for Unreleased Changes

```bash
.github/workflows/scripts/check-changelog.sh
```

### Manual Tag Creation

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

## Common Issues and Solutions

### Resolving Merge Conflicts in CHANGELOG.md

If multiple branches modify the changelog:

1. Keep both sets of changes in the `[Unreleased]` section
2. Organize changes into appropriate categories
3. Remove duplicates

### When to Create a New Major Version

Create a new major version when:

- Making breaking API changes
- Significantly changing the user experience
- Dropping support for major platforms
- Making architectural changes that affect how extensions work

## Resources

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)