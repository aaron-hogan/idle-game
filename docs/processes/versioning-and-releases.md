# Versioning and Release Process

This document outlines our process for versioning the application and creating releases. Following this process helps maintain a clear release history and ensures changes are properly documented.

## Semantic Versioning with Patch Levels

We follow [Semantic Versioning](https://semver.org/) principles with an extension for patch levels:

```
MAJOR.MINOR.PATCH[-PATCH_LEVEL] (e.g., 1.2.3 or 1.2.3-1)
```

- **MAJOR**: Breaking changes
- **MINOR**: New features without breaking changes
- **PATCH**: Bug fixes without breaking changes
- **PATCH_LEVEL**: Small fixes and tweaks within a patch version

This patch level extension allows us to make smaller incremental updates without bumping the full patch version.

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

## Automated Versioning Process

We use automated versioning through GitHub Actions:

### Step 1: During PR Development

1. Document all your changes in the `[Unreleased]` section of `CHANGELOG.md`
2. Make sure changes are properly categorized (Added, Changed, Fixed, etc.)
3. Do NOT version the changes yourself - this happens automatically when merging

### Step 2: During PR Review and Merge

1. Apply the appropriate version label to your PR:
   - `version:major` - For breaking changes (X.Y.Z → X+1.0.0)
   - `version:minor` - For new features (X.Y.Z → X.Y+1.0)
   - `version:patch` - For bug fixes (X.Y.Z → X.Y.Z+1)
   - `version:patch_level` - For small tweaks (X.Y.Z → X.Y.Z-1 or X.Y.Z-N → X.Y.Z-N+1)

2. When the PR is merged, GitHub Actions will automatically:
   - Move changes from `[Unreleased]` to a new version section
   - Set today's date as the release date
   - Update version in `package.json`
   - Commit the version changes
   - Create a git tag for the release

This automated approach ensures:
- Changes stay in `[Unreleased]` during review
- Version numbers are consistent
- Versioning happens at the right time (when merging)
- No merge conflicts in `CHANGELOG.md`

### Manual Versioning (if needed)

For special cases where you need to manually version:

```bash
# For standard versions
./scripts/bump-version.sh X.Y.Z

# For patch level versions
./scripts/bump-version.sh X.Y.Z-N
```

## PR Requirements

PRs to main must meet these requirements:

1. **Documented Changes**: All changes must be documented in the `[Unreleased]` section of `CHANGELOG.md`
2. **Complete Documentation**: All changes must be properly categorized and described
3. **Version Label**: PR must have one of the version labels applied
4. **Appropriate Version Level**: Version increments should match the significance of changes:
   - Major version for breaking changes
   - Minor version for new features
   - Patch version for significant bug fixes
   - Patch level for small fixes and tweaks

## CI/CD Integration

Our CI/CD pipeline includes:

1. **Changelog Check**: Validates that all PRs to main have changes documented in the changelog
2. **Auto-Version**: Automatically versions changes when merging to main
3. **Release Automation**: Creates GitHub releases based on tags

## Common Issues and Solutions

### Resolving Merge Conflicts in CHANGELOG.md

If multiple branches modify the changelog:

1. Keep both sets of changes in the `[Unreleased]` section
2. Organize changes into appropriate categories
3. Remove duplicates

### When to Use Patch Level Versioning

Use patch level versioning (X.Y.Z-N) when:

1. Making very small changes that don't warrant a full patch version increment
2. Fixing typos or making cosmetic changes
3. Making minor documentation updates
4. Adding small enhancements to existing features
5. Making changes that don't affect core functionality

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