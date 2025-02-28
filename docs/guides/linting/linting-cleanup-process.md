# Linting Cleanup Process

This document outlines the systematic approach to cleaning up linting issues in the codebase. By following a consistent approach, we ensure uniformity and avoid scattered implementations.

## Issue Categories

We've identified the following categories of linting issues to be addressed:

1. **Unused Imports and Variables** - `@typescript-eslint/no-unused-vars`
   - Imports that are declared but never used
   - Variables that are declared but never referenced
   
2. **Explicit `any` Type Usage** - `@typescript-eslint/no-explicit-any`
   - Use of `any` type where more specific types should be used
   
3. **Required-Style Imports** - `@typescript-eslint/no-require-imports`
   - Using `require()` instead of ES Module imports

4. **TypeScript Comments** - `@typescript-eslint/ban-ts-comment`
   - Replacing `@ts-ignore` with `@ts-expect-error`
   
5. **Function Types** - `@typescript-eslint/no-unsafe-function-type`
   - Using `Function` type instead of more specific function types

## Cleanup Strategy

Each PR should focus on a single category of issues, following these steps:

1. **Branch naming convention**: `fix/lint-{category-name}`
   - Example: `fix/lint-unused-vars`, `fix/lint-explicit-any`

2. **Identify files with issues**: Use ESLint to find files with specific issue types:
   ```bash
   npm run lint -- --quiet --rule '@typescript-eslint/no-unused-vars: error' --rule '@typescript-eslint/{other-rules}: off'
   ```

3. **Fix issues in manageable batches**: 
   - Choose 5-10 files per PR to keep changes reviewable
   - Focus on one category per PR

4. **Update CHANGELOG.md**:
   - Add entries under "Fixed" section with consistent formatting
   - Provide clear descriptions of what was fixed

5. **Create a focused PR**:
   - Clear title: `fix: resolve {issue-type} linting errors in {components/area}`
   - Detailed description of changes made
   - Reference to the linting rule being fixed

## Example Workflow

For fixing unused imports/variables:

1. Create a branch:
   ```bash
   git checkout -b fix/lint-unused-vars
   ```

2. Find files with issues:
   ```bash
   npm run lint -- --quiet --rule '@typescript-eslint/no-unused-vars: error' --rule '@typescript-eslint/no-explicit-any: off' --rule '@typescript-eslint/no-require-imports: off'
   ```

3. Edit files to fix issues
   - Remove unused imports
   - Remove unused variables or mark with `_` prefix if needed

4. Update CHANGELOG.md

5. Create PR with appropriate title and description

## Tracking Progress

As we work through linting issues, we'll track progress by:

1. Updating this document with completed PRs
2. Maintaining a list of remaining files to be addressed for each category
3. Recording any patterns or best practices discovered during cleanup

## Completed Linting PRs

| PR Number | Category | Files Addressed | Notes |
|-----------|----------|-----------------|-------|
| #105 | Mixed (initial approach) | App.tsx, App.test.tsx, Icon.test.tsx, resourceUtils.ts | Initial cleanup with mixed category approach |

## Next Steps

- [x] PR for unused variables in core components (GameTimer.tsx, GameTimer.test.tsx, TabNavigation.tsx, ClickableMilestone.tsx)
- [ ] PR for unused variables in system files (GameLoop.ts, GameTimer.ts, saveManager.ts)
- [ ] PR for require-style imports in system files (saveContext.tsx, saveManager.ts, workerManager.ts)
- [ ] PR for @ts-ignore comments in test files (gameSystemCoherenceTest.test.ts, testUtils.ts)
- [ ] PR for explicit any in GameLoop classes (GameLoop.ts, GameLoop.test.ts)