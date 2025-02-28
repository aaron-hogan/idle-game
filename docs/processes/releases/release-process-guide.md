# Release Process Guide

This document provides a comprehensive guide to our release and versioning process. It consolidates our current streamlined versioning approach with professional release management practices.

## Version Numbering

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes that require users to update their code
- **MINOR**: New features that maintain backward compatibility
- **PATCH**: Bug fixes and small changes that maintain backward compatibility

## Streamlined Versioning Process

Our versioning system works on these principles:
1. **Conventional PR Titles**: Use standardized prefixes to determine the version bump type
2. **Changelog in PR Description**: Include changelog entries directly in the PR
3. **Fully Automated**: No manual versioning steps required

### PR Title Conventions

PR titles must follow this format:
```
type[(scope)][!]: description

Examples:
feat: add user login
fix(auth): resolve token expiration
feat!: change API response format
```

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

You can optionally add a scope in parentheses to indicate what area the change affects:
- `feat(auth): add login feature`
- `fix(api): resolve data loading issue`

### Changelog Entry in PR Description

The PR description must include a "Changelog Entry" section with appropriate subsections:

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

### Automated Versioning Process

When a PR is merged:
1. The system detects the type of change from the PR title
2. Extracts the changelog entry from the PR description
3. Bumps the version automatically based on the PR title
4. Updates CHANGELOG.md with the extracted entries
5. Commits and tags the new version

## Branching Strategy

We use a modified GitFlow strategy with the following branches:

- `main` - Production code only. Always deployable.
- `develop` - Integration branch for completed features. Next release candidates come from here.
- `feature/*` - Feature branches for active development.
- `fix/*` - Bugfix branches.
- `release/*` - Release candidate branches, where final release preparations happen.
- `hotfix/*` - Emergency fixes for production issues, branched from `main`.

## Regular Development Workflow

1. **Start with develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature-name
   ```

3. **Make changes using conventional commits**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve edge case"
   ```

4. **Push your branch and create a PR**
   ```bash
   git push -u origin feature/my-feature-name
   # Create PR through GitHub UI
   ```
   - Use a conventional title (e.g., `feat: add login feature`)
   - Include changelog entry in the PR description

5. **After approval and tests passing, merge to develop**

## Release Process

When ready to create a release:

1. **Create a release branch**
   ```bash
   # From develop branch
   ./scripts/create-release.sh
   ```
   This will prompt for version type and create a properly named branch.

2. **Create two Pull Requests**:
   - First, from `release/x.y.z` to `develop` (to bring updates back)
   - Second, from `release/x.y.z` to `main` (for the actual release)

3. **When the PR to main is merged**:
   - The GitHub Actions workflow is triggered
   - Version numbers are validated
   - Release notes are generated
   - A git tag is created
   - A GitHub release is published

## Hotfix Process

For urgent production fixes:

1. **Create a hotfix branch from main**
   ```bash
   # From main branch
   ./scripts/create-hotfix.sh
   ```

2. **Fix the issue with proper commit messages**
   ```bash
   git commit -m "fix: critical production issue"
   ```

3. **Create a PR to main with conventional title**:
   - Example: `fix: resolve critical login issue`
   - Include changelog entry in the PR description

4. **After merge to main**:
   - A patch version is automatically released
   - Create another PR to merge the fix back to develop

## Troubleshooting

### PR merged but no version created

Check if your PR title followed the conventional format:
- `feat:` for features (minor version)
- `fix:` for bug fixes (patch version)
- `feat!:` for breaking changes (major version)

Other prefixes like `docs:`, `chore:`, etc. do not trigger version bumps.

### Changelog entries not included

Make sure your PR description included a section titled "## Changelog Entry" with appropriate subsections (Added, Changed, Fixed, Removed).

### PR validation failing

Common issues include:
1. **Missing Changelog Entry**: Ensure your PR description has a "## Changelog Entry" section.
2. **Missing Subsections**: Add at least one subsection (### Added, ### Changed, ### Fixed, or ### Removed).
3. **Empty Subsections**: Each subsection should have at least one item (usually as a bulleted list).
4. **Formatting Issues**: Follow markdown formatting with proper spacing and indentation.

## Tools and Scripts

### Create Release Branch
```bash
./scripts/create-release.sh
```

### Create Hotfix Branch
```bash
./scripts/create-hotfix.sh
```

### Manual Version Bumping (if needed)
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

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Keep a Changelog](https://keepachangelog.com/)