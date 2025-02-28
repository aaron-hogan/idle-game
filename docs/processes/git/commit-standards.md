# Git Commit Standards

This document outlines the commit message standards and practices for our project.

## Conventional Commit Format

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Changes that don't affect code functionality (formatting, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates, etc.
- `perf:` - Performance improvements
- `build:` - Changes to build system or dependencies
- `ci:` - Changes to CI configuration

### Breaking Changes

For breaking changes, add an exclamation mark after the type/scope:

```
feat!: add feature that breaks backward compatibility
```

Or include a BREAKING CHANGE footer:

```
feat: add new feature

BREAKING CHANGE: this breaks the API
```

## Commit Message Guidelines

1. Use imperative mood in the description ("add" not "added" or "adds")
2. Don't capitalize the first letter of the description
3. No period at the end of the description
4. Keep the description under 72 characters
5. Use the body to explain the what and why, not the how
6. Separate subject from body with a blank line
7. Reference issues and pull requests in the footer

## Examples

```
feat: add user authentication system

Implement JWT-based authentication with refresh tokens
to improve security and user experience.

Closes #123
```

```
fix: resolve calculation error in tax component

The tax calculation was using the wrong rate for international
orders. This fix applies the correct rate based on location.

Fixes #456
```

```
docs: update README with setup instructions

Added clear steps for environment setup, development workflow,
and troubleshooting common issues.
```

## Integration with Versioning

Our commit standards directly integrate with our versioning system:

- `feat:` commits trigger a MINOR version bump
- `fix:` commits trigger a PATCH version bump
- `feat!:` or commits with BREAKING CHANGE trigger a MAJOR version bump

For more information on our versioning approach, see [Streamlined Versioning](/docs/processes/streamlined-versioning.md).

## Co-authored Commits

For commits with multiple authors, add "Co-authored-by" trailers:

```
feat: implement real-time chat feature

Co-authored-by: Jane Smith <jane.smith@example.com>
Co-authored-by: John Doe <john.doe@example.com>
```

## AI-assisted Commits

When commits are generated with AI assistance, include appropriate attribution:

```
fix: resolve race condition in event system

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```