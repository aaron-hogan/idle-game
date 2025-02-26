# Continuous Integration and Deployment Pipeline

This document provides an overview of our CI/CD pipeline implemented with GitHub Actions.

## CI Pipeline Overview

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

## Workflow Details

### Main CI Workflow

The main workflow runs the following jobs:

1. **Build and Test**:
   - Installs dependencies
   - Runs linting with ESLint
   - Performs TypeScript type checking
   - Executes tests with Jest
   - Builds the application
   - Uploads coverage reports

2. **Security Scan**:
   - Runs npm audit for package vulnerabilities
   - Uses Gitleaks to scan for credential leaks

This workflow runs automatically on:
- Pull requests to main
- Pushes to main
- Weekly schedule (Sunday at midnight)

### PR Validation Workflow

This workflow ensures all PRs follow project standards:

1. **Validate PR Format**:
   - Checks PR title follows semantic versioning format
   - Verifies branch naming follows conventions
   - Ensures CHANGELOG.md is updated appropriately

Runs automatically on:
- PR creation
- PR edits
- PR synchronization

### Dependency Management Workflow

This workflow monitors project dependencies:

1. **Dependency Audit**:
   - Checks for outdated dependencies
   - Scans for security vulnerabilities
   - Generates reports for review

Runs automatically on:
- Weekly schedule (Monday at midnight)
- Manual trigger (workflow_dispatch)

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

For more detailed information on working with our CI system, see:
- [GitHub Actions Documentation](/docs/features/github-actions/summary.md)
- [Contributing with CI](/docs/features/github-actions/contributing-with-ci.md)