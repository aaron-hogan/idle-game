# CI/CD Pipeline

This document outlines our Continuous Integration and Continuous Deployment (CI/CD) pipeline configuration and best practices.

## Overview

We use automated CI/CD pipelines to ensure code quality and consistency. Our pipeline automatically runs checks on all pull requests and pushes to main branches.

## Pipeline Configuration

### GitHub Actions

Our CI/CD pipeline is implemented using GitHub Actions, with workflows defined in the `.github/workflows` directory.

Our CI/CD pipeline consists of three main workflows:

1. **Main CI Workflow (`ci.yml`)** - Runs on all PRs and pushes to main
   - Build and test the application
   - Run linting and type checking
   - Perform security scanning

2. **PR Validation Workflow (`pr-validation.yml`)** - Runs on all PRs
   - Validate PR title format
   - Check branch naming conventions
   - Verify CHANGELOG.md updates

3. **Dependency Management Workflow (`dependencies.yml`)** - Runs on schedule
   - Check for dependency updates
   - Run security audits
   - Generate dependency reports

### Workflow Triggers

Workflows are triggered by:

- Pull requests to `main` branch
- Direct pushes to `main` branch
- Scheduled runs (weekly) to ensure ongoing health checks
- Manual triggers for certain workflows

## Pipeline Checks

### Linting

- ESLint checks for code style compliance
- Configuration in `eslint.config.js`
- Helps maintain consistent code style across the project
- Run locally with `npm run lint`

### Type Checking

- TypeScript type checking ensures type safety
- Strict mode is enabled in `tsconfig.json`
- Catches potential type-related bugs before they reach production
- Run locally with `npm run typecheck`

### Testing

- Jest runs all unit and integration tests
- Test coverage reports are generated and uploaded as artifacts
- Minimum coverage thresholds are enforced when possible
- Run locally with `npm test`

### Build Validation

- Full production build is created
- Verifies that the code can be built without errors
- Ensures the application will deploy correctly
- Run locally with `npm run build`

### Security Scanning

- npm audit checks for package vulnerabilities
- Gitleaks scans for credential leaks
- Weekly scheduled security audits keep dependencies secure

## Pipeline Standards

### Safety Guidelines

- **NEVER** disable security checks or code quality validations
- **ALWAYS** get explicit permission before modifying CI workflows
- **ALWAYS** test workflow changes in a feature branch first
- **NEVER** merge PRs that fail pipeline checks without proper review and approval

### Workflow Maintenance

- Keep dependencies in CI workflows up-to-date
- Review and optimize workflow performance periodically
- Document any special considerations for CI in relevant feature documentation

## Local Development

Before submitting a PR, ensure your changes will pass CI by running:

```bash
npm run lint        # Check code style
npm run typecheck   # Verify types
npm test            # Run all tests
npm run build       # Verify build
```

## Handling CI Failures

If CI fails on your PR:

1. Check the error logs on GitHub
2. Fix any issues locally and push again
3. Verify the CI passes before requesting review

## Related Documentation

- [Git Workflow](/docs/processes/git/git-workflow.md)
- [PR Workflow](/docs/processes/pr-workflow.md)
- [Testing Standards](/docs/processes/code-quality/testing-standards.md)
- [GitHub Actions Documentation](/docs/features/github-actions/summary.md)
- [Contributing with CI](/docs/features/github-actions/contributing-with-ci.md)
- [Temporary Fixes](/docs/features/github-actions/temporary-fixes.md)

By maintaining a robust CI/CD pipeline, we ensure consistent code quality and reduce the likelihood of issues reaching production.