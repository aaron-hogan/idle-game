# Contributing with CI/CD

This guide explains how to work effectively with our GitHub Actions CI workflows as a contributor to this project.

## Understanding CI Checks

When you create a pull request or push to the main branch, several automated checks will run:

1. **Code Quality Checks**:
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Test execution (Jest)
   - Build verification

2. **PR Validation**:
   - PR title format checking
   - Branch naming convention validation
   - CHANGELOG update verification

3. **Security Scans**:
   - Dependency vulnerability scanning
   - Credential leak detection

## Workflow for Contributors

### Before Creating a PR

1. **Check Your Work Locally**:
   ```bash
   npm run lint        # Run linting
   npm run typecheck   # Check types
   npm test            # Run tests
   npm run build       # Verify build
   ```

2. **Follow Branch Naming Conventions**:
   - `feature/name-of-feature`
   - `fix/issue-description`
   - `docs/documentation-update`
   - `refactor/component-name`
   - `chore/task-description`
   - `test/test-improvement`

3. **Update the CHANGELOG**:
   - Add an entry under the appropriate section in CHANGELOG.md
   - Use the format: `- [Type] Brief description of change (#PR-number)`

### Creating a PR

1. **Use Semantic PR Titles**:
   - Format: `type: subject`
   - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   - Example: `feat: add user preferences component`

2. **Include Required Information**:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Testing approach

### Responding to CI Failures

If CI checks fail, follow these steps:

1. **Read the Error Logs**:
   - Click on the failed check in the PR for detailed logs
   - Identify the specific failure reason

2. **Common Issues and Solutions**:

   - **Linting Errors**:
     ```bash
     npm run lint -- --fix  # Auto-fix linting issues
     ```

   - **Type Errors**:
     ```bash
     npm run typecheck  # Run locally to see all errors
     ```

   - **Test Failures**:
     ```bash
     npm test -- -t "failing test name"  # Run specific failing test
     ```

   - **Build Failures**:
     ```bash
     npm run build  # Run locally for detailed errors
     ```

   - **PR Validation Issues**:
     - Rename your branch to follow conventions
     - Update PR title to follow semantic format
     - Ensure CHANGELOG.md is updated

3. **Fix and Push**:
   - Make the necessary changes locally
   - Push to your branch
   - CI checks will automatically re-run

## Tips for Success

- **Run CI Locally**: Use pre-commit hooks to run checks before pushing
- **Small PRs**: Keep changes focused and minimal to reduce CI issues
- **Watch CI Progress**: Monitor your PR for CI status updates
- **Ask for Help**: If you're stuck with CI issues, ask for help in PR comments

## Modifying CI Workflows

If you need to modify the CI workflows themselves:

1. Create a branch with the prefix `ci/`
2. Make changes to the workflow files in `.github/workflows/`
3. Test thoroughly with small changes
4. Include detailed documentation of changes
5. Create a PR with the prefix `ci:`