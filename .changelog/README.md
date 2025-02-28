# Changelog Entries Directory

This directory contains changelog entries that will be automatically included in the CHANGELOG.md file when a PR is merged.

## Usage

There are three ways to add changelog entries:

### 1. Dedicated Changelog File (Most Reliable)

Create a file in this directory named `pr-NUMBER.md` (replacing NUMBER with your PR number):

```bash
# Example for PR #123
.changelog/pr-123.md
```

Include properly formatted changelog entries:

```markdown
### Added
- New login feature with support for OAuth

### Fixed
- Authentication token expiration issue
```

This approach is the most reliable and will be prioritized over other methods.

### 2. PR Description (Standard Method)

Include a changelog section in your PR description with any of these headers:
- `## Changelog Entry` (standard)
- `## Changelog`
- `## CHANGELOG`
- `### Changelog`

Make sure to include proper subsections:

```markdown
## Changelog Entry

### Added
- New feature description

### Fixed
- Bug fix description
```

### 3. PR Title (Fallback)

If no changelog is found using methods 1 or 2, the system will generate a basic changelog entry based on your PR title.

PR titles must follow conventional format:
- `feat: Adding new login` → `### Added` section
- `fix: Resolving auth issue` → `### Fixed` section
- `chore: Updating dependencies` → `### Changed` section

## Best Practices

1. Always use method 1 or 2 for complete control over your changelog entry
2. Make sure entries are clear and describe the impact to users
3. Use appropriate subsections (Added, Changed, Fixed, Removed)
4. Keep entries concise but descriptive