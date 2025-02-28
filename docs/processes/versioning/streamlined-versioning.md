# Streamlined Versioning Process

This document explains our streamlined versioning process that eliminates manual steps and automates the version management process.

## Overview

Our versioning system now works on these principles:
1. **Conventional PR Titles**: Use standardized prefixes to determine the version bump type
2. **Changelog in PR Description**: Include changelog entries directly in the PR
3. **Fully Automated**: No manual versioning steps or labels required

> **Important**: For lessons learned during implementation and best practices, see [Streamlined Versioning Learnings](streamlined-versioning-learnings.md)

## How It Works

### 1. PR Creation

1. Create a PR with a conventional title format:
   - `feat: add new feature` - Minor version bump (X.Y.Z → X.Y+1.0)
   - `fix: resolve bug` - Patch version bump (X.Y.Z → X.Y.Z+1)
   - `feat!: breaking change` - Major version bump (X.Y.Z → X+1.0.0)
   - `docs:`, `style:`, `refactor:`, etc. - No version bump

2. Include changelog entries in the PR description under the "Changelog Entry" section:
   ```markdown
   ## Changelog Entry

   ### Added
   - New feature that does X

   ### Fixed
   - Bug that caused Y
   ```

### 2. PR Validation

Our system automatically validates:
- PR title follows the conventional format
- Changelog entry is included (when needed)
- The PR description is properly formatted

### 3. Automated Versioning

When a PR is merged:
1. The system detects the type of change from the PR title
2. Extracts the changelog entry from the PR description
3. Bumps the version automatically based on the PR title
4. Updates CHANGELOG.md with the extracted entries
5. Commits and tags the new version

## Conventional PR Title Format

```
type[(scope)][!]: description

Examples:
feat: add user login
fix(auth): resolve token expiration
feat!: change API response format
```

### Types and Their Effects

| Type       | Description          | Version Impact | Example                          |
|------------|----------------------|----------------|----------------------------------|
| `feat`     | New features         | Minor          | `feat: add login feature`        |
| `feat!`    | Breaking changes     | Major          | `feat!: change API response`     |
| `fix`      | Bug fixes            | Patch          | `fix: resolve authentication bug`|
| `docs`     | Documentation        | None           | `docs: update README`            |
| `style`    | Formatting changes   | None           | `style: format code`             |
| `refactor` | Code restructuring   | None           | `refactor: simplify function`    |
| `perf`     | Performance changes  | None           | `perf: optimize rendering`       |
| `test`     | Adding/fixing tests  | None           | `test: add unit tests`           |
| `build`    | Build process changes| None           | `build: update webpack config`   |
| `ci`       | CI configuration     | None           | `ci: add new GitHub Action`      |
| `chore`    | Maintenance tasks    | None           | `chore: update dependencies`     |

### Optional Scope

You can add a scope in parentheses to indicate what area the change affects:
- `feat(auth): add login feature`
- `fix(api): resolve data loading issue`
- `refactor(components): simplify button component`

## Changelog Entry Format

The PR description should include a "Changelog Entry" section with appropriate subsections:

```markdown
## Changelog Entry

### Added
- New features added

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Removed
- Features removed
```

Only include the subsections that are relevant to your changes.

## Example Workflow

1. Create a branch for your feature:
   ```bash
   git checkout -b feat/login-feature
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add login feature"
   ```

3. Push the branch and create a PR with:
   - Title: `feat: add login feature`
   - Description that includes:
     ```markdown
     ## Description
     This PR adds a new login feature with support for OAuth.

     ## Changelog Entry
     
     ### Added
     - New login feature with OAuth support
     - Remember me functionality
     - Password reset workflow
     ```

4. When the PR is merged:
   - The system detects this is a feature (minor version bump)
   - It extracts the changelog entries from the PR description
   - It automatically updates version and changelog
   - It creates a git tag for the new version

## Benefits

1. **Reduced Manual Work**: No need to manually update CHANGELOG.md
2. **Consistency**: All changelog entries follow the same format
3. **Automation**: Version bumping happens automatically
4. **Better Reviews**: Changelog entries are visible during code review
5. **Industry Standard**: Uses widely-adopted conventional commit format

## Troubleshooting

### My PR was merged but no version was created

Check if your PR title followed the conventional format:
- `feat:` for features (minor version)
- `fix:` for bug fixes (patch version)
- `feat!:` for breaking changes (major version)

Other prefixes like `docs:`, `chore:`, etc. do not trigger version bumps.

### My changelog entries weren't included

Make sure your PR description included a section titled "## Changelog Entry" with appropriate subsections (Added, Changed, Fixed, Removed).

### The PR validation is failing

Common issues include:
1. **Missing Changelog Entry**: Ensure your PR description has a "## Changelog Entry" section.
2. **Missing Subsections**: Add at least one subsection (### Added, ### Changed, ### Fixed, or ### Removed).
3. **Empty Subsections**: Each subsection should have at least one item (usually as a bulleted list).
4. **Formatting Issues**: Follow markdown formatting with proper spacing and indentation.

### Workflow failures in GitHub Actions

If you're seeing workflow failures related to the streamlined versioning:
1. Check for YAML syntax errors in workflow files
2. Ensure the PR title follows the conventional format
3. Verify the PR description has properly formatted changelog entries
4. Make sure your branch is up to date with main

## Migration from Previous System

This new system replaces our previous approach that relied on version labels. The key differences are:

1. No more version labels on PRs
2. PR titles must follow conventional format
3. Changelog entries go in the PR description, not directly in CHANGELOG.md
4. Version bumping is determined by PR title prefix, not by a label

## Further Reading

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)