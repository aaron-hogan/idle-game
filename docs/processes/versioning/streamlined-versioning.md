# Streamlined Versioning Process

This document explains our streamlined versioning process that eliminates manual steps and automates the version management process.

## Overview

Our versioning system works on these principles:
1. **Conventional PR Titles**: Use standardized prefixes to determine the version bump type
2. **Multiple Changelog Sources**: Three reliable ways to provide changelog entries
3. **Fully Automated**: No manual versioning steps or labels required

> **Important**: For lessons learned during implementation and best practices, see [Streamlined Versioning Learnings](streamlined-versioning-learnings.md)

## How It Works

### 1. PR Creation

1. Create a PR with a conventional title format:
   - `feat: add new feature` - Minor version bump (X.Y.Z → X.Y+1.0)
   - `fix: resolve bug` - Patch version bump (X.Y.Z → X.Y.Z+1)
   - `feat!: breaking change` - Major version bump (X.Y.Z → X+1.0.0)
   - `docs:`, `style:`, `refactor:`, etc. - No version bump

2. Include changelog entries using one of these three methods (in order of reliability):

   **A. Dedicated Changelog File (Most Reliable)**
   
   Create a file in the `.changelog` directory:
   ```
   .changelog/pr-NUMBER.md  # Replace NUMBER with your PR number
   ```
   
   With content like:
   ```markdown
   ### Added
   - New feature that does X

   ### Fixed
   - Bug that caused Y
   ```
   
   **B. PR Description (Standard Method)**
   
   Include a section in your PR description:
   ```markdown
   ## Changelog Entry

   ### Added
   - New feature that does X

   ### Fixed
   - Bug that caused Y
   ```
   
   **C. Automatic Fallback (Least Reliable)**
   
   If neither of the above is found, the system will automatically generate a basic changelog entry from your PR title.

### 2. PR Validation

Our system automatically validates:
- PR title follows the conventional format
- Changelog entry is included (via one of the three methods)
- The PR description or changelog file is properly formatted

The PR Changelog Helper workflow will automatically:
- Detect if a changelog entry is missing
- Create a fallback changelog file if needed
- Add a helpful comment to guide PR authors

### 3. Automated Versioning

When a PR is merged:
1. The system detects the type of change from the PR title
2. Extracts the changelog entry using this priority:
   - First checks for a dedicated file in `.changelog/pr-NUMBER.md`
   - Then looks for changelog sections in the PR description
   - Finally falls back to generating an entry from the PR title
3. Bumps the version automatically based on the PR title prefix
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

Regardless of which method you use (dedicated file or PR description), your changelog entries should have appropriate subsections:

```markdown
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

For the PR description method, make sure to include the `## Changelog Entry` header before your subsections.

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
   
   - **Option A: Create a dedicated changelog file**:
     ```bash
     # Assuming PR number is 123
     mkdir -p .changelog
     cat > .changelog/pr-123.md << 'EOF'
     ### Added
     - New login feature with OAuth support
     - Remember me functionality
     - Password reset workflow
     EOF
     
     git add .changelog/pr-123.md
     git commit -m "chore: add changelog entry"
     git push
     ```
     
   - **Option B: Include in PR description**:
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
   - It extracts the changelog entries from the dedicated file or PR description
   - It automatically updates version and changelog
   - It creates a git tag for the new version

## Benefits

1. **Reduced Manual Work**: No need to manually update CHANGELOG.md
2. **Consistency**: All changelog entries follow the same format
3. **Automation**: Version bumping happens automatically
4. **Better Reviews**: Changelog entries are visible during code review
5. **Industry Standard**: Uses widely-adopted conventional commit format
6. **Multiple Entry Methods**: Three ways to provide changelog entries
7. **Fail-Safe System**: Automatic fallback prevents missing entries
8. **Robust Pattern Matching**: Multiple patterns recognized for compatibility

## Troubleshooting

### My PR was merged but no version was created

Check if your PR title followed the conventional format:
- `feat:` for features (minor version)
- `fix:` for bug fixes (patch version)
- `feat!:` for breaking changes (major version)

Other prefixes like `docs:`, `chore:`, etc. do not trigger version bumps.

### My changelog entries weren't included

Check the following:

1. **Dedicated Changelog File**: Verify if you created a file in `.changelog/pr-NUMBER.md` with proper formatting.
2. **PR Description**: Check if your PR description included a section titled "## Changelog Entry" with appropriate subsections.
3. **Fallback File**: The system should have created a fallback file automatically; check commit history to see if it was added.
4. **Pattern Recognition**: Make sure your section header exactly matches one of the recognized patterns (e.g., "## Changelog Entry").

### The PR validation is failing

Common issues include:
1. **Missing Changelog Entry**: Create a file in `.changelog/pr-NUMBER.md` or ensure your PR description has a "## Changelog Entry" section.
2. **Missing Subsections**: Add at least one subsection (### Added, ### Changed, ### Fixed, or ### Removed).
3. **Empty Subsections**: Each subsection should have at least one item (usually as a bulleted list).
4. **Formatting Issues**: Follow markdown formatting with proper spacing and indentation.
5. **PR Helper Issues**: Check if the PR Changelog Helper workflow is failing; it should create a fallback file automatically.

### Workflow failures in GitHub Actions

If you're seeing workflow failures related to the streamlined versioning:
1. Check for YAML syntax errors in workflow files
2. Ensure the PR title follows the conventional format
3. Verify one of these exists:
   - A properly formatted `.changelog/pr-NUMBER.md` file
   - A PR description with properly formatted changelog entries
   - The PR Changelog Helper workflow has run successfully
4. Check if the PR Helper workflow has permission to create files
5. Make sure your branch is up to date with main

## Migration from Previous System

This system replaces our previous approach that relied on version labels. The key differences are:

1. No more version labels on PRs
2. PR titles must follow conventional format
3. Changelog entries can go in:
   - A dedicated file in `.changelog/pr-NUMBER.md`
   - The PR description under the "## Changelog Entry" section
   - Automatically generated from PR title as a fallback
4. Version bumping is determined by PR title prefix, not by a label
5. Multiple fallback mechanisms ensure changelog entries are never missed

## Further Reading

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)