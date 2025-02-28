# CI/CD Processes

This directory contains documentation for our Continuous Integration and Continuous Deployment processes.

## Key Documents

- [CI/CD Pipeline](ci-cd-pipeline.md) - Overview of our CI/CD workflow and GitHub Actions setup
- [PR Validation Improvements](pr-validation-improvements.md) - Enhancements to PR validation processes

## CI/CD Workflow Overview

Our project uses GitHub Actions for automated workflows:

1. **Continuous Integration**
   - Automated builds on all branches
   - Unit and integration test runs
   - TypeScript type checking
   - ESLint code quality checks
   - Code coverage reporting

2. **Pull Request Validation**
   - Branch naming convention enforcement
   - PR title formatting requirements
   - Changelog entry validation
   - Comprehensive status checks

3. **Dependency Management**
   - Automated dependency updates
   - Security vulnerability scanning
   - Compatibility checks

## Related Processes

- [Git Workflow](/docs/processes/git/git-workflow.md)
- [PR Workflow](/docs/processes/git/pr-workflow.md)
- [Streamlined Versioning](/docs/processes/versioning/streamlined-versioning.md)