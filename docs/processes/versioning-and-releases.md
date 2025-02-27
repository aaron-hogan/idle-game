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

### Critical Requirements

1. **Every version MUST have content** - Empty versions are not allowed and will cause failures
2. **The Unreleased section MUST have content** before creating a new version
3. **All changes MUST be categorized** under appropriate headings
4. **Changes are for humans, not machines** - Write clear, understandable entries
5. **Group similar types of changes together** - For better readability

### Adding Changes

During development:

1. Add all changes to the `[Unreleased]` section in `CHANGELOG.md`
2. Categorize changes under:
   - **Added**: New features
   - **Changed**: Changes in existing functionality
   - **Deprecated**: Soon-to-be removed features
   - **Removed**: Now removed features
   - **Fixed**: Any bug fixes
   - **Security**: In case of vulnerabilities

Example:
```markdown
## [Unreleased]

### Added
- New feature description

### Fixed
- Bug fix description
```

The versioning scripts enforce these requirements and will fail if:
- You try to create a version with no changes
- The Unreleased section is empty when versioning

### Creating a Release

We now use a two-step process with automated versioning:

#### Step 1: During PR Development

1. Document all your changes in the `[Unreleased]` section of `CHANGELOG.md`
2. Make sure changes are properly categorized (Added, Changed, Fixed, etc.)
3. Do NOT version the changes yourself - this happens automatically when merging

#### Step 2: During PR Review and Merge

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

#### Manual Versioning (if needed)

For special cases where you need to manually version:

```bash
# For standard versions
./scripts/bump-version.sh X.Y.Z

# For patch level versions
./scripts/bump-version.sh X.Y.Z-N
```

You can also use the interactive preparation script:
```bash
./scripts/prepare-for-main.sh
```

## PR Requirements

PRs to main must meet these requirements:

1. **No Unreleased Changes**: All changes must be versioned with a proper version number
2. **Version Match**: `CHANGELOG.md` version must match `package.json` version
3. **Complete Documentation**: All changes must be documented in the changelog
4. **No Empty Versions**: Every version MUST contain at least one change entry
5. **Appropriate Version Level**: Version increments should match the significance of changes:
   - Major version for breaking changes
   - Minor version for new features
   - Patch version for significant bug fixes
   - Patch level for small fixes and tweaks
6. **Clean Version History**: Changes should be organized chronologically and labeled correctly

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
# For standard versions
./scripts/bump-version.sh X.Y.Z

# For patch level versions
./scripts/bump-version.sh X.Y.Z-N
```

### Changelog Validation

```bash
# Check for empty versions in CHANGELOG.md
./scripts/check-empty-versions.sh

# Fix empty versions by adding placeholder content
./scripts/check-empty-versions.sh --fix
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
4. Ensure all entries follow a consistent style and format

### Changelog Anti-patterns to Avoid

1. **Commit log dumps**: Never just paste git commit logs; changelogs are curated, meaningful notes
2. **Inconsistent changes**: Missing important changes makes the changelog unreliable
3. **Technical jargon**: Remember that changelogs are for humans
4. **Empty versions**: Every version must have meaningful content
5. **Confusing dates**: Always use ISO 8601 format (YYYY-MM-DD)
6. **Unclear descriptions**: Changes should clearly explain what was modified and why

### When to Use Patch Level Versioning

Use patch level versioning (X.Y.Z-N) when:

1. Making very small changes that don't warrant a full patch version increment
2. Fixing typos or making cosmetic changes
3. Making minor documentation updates
4. Adding small enhancements to existing features
5. Making changes that don't affect core functionality

This approach helps maintain a cleaner version history while still tracking all changes.

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