# Linting Guidelines & Cleanup Process

This document provides a comprehensive guide to the linting standards and the systematic approach for cleaning up linting issues in the codebase.

## Overview

The project follows ESLint rules with TypeScript-specific configurations. We aim to maintain high code quality by enforcing linting standards and systematically addressing linting issues in a structured way.

## Key Linting Principles

1. **Focus on categories** - Address linting issues by category rather than by file
2. **Batch processing** - Fix issues in manageable batches to keep PRs focused and reviewable
3. **Documented progress** - Track progress and document completed fixes
4. **Consistency** - Follow a consistent approach to fixing similar issues

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

## Running Linting Checks

To run linting checks on the project:

```bash
# Run all linting checks
npm run lint

# Run linting with auto-fix for formatting issues
npm run lint -- --fix

# Focus on specific rule
npm run lint -- --quiet --rule '@typescript-eslint/no-unused-vars: error'
```

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

## Issue Inventory

The following sections inventory files with linting issues by category to track progress and prioritize fixes.

### 1. Unused Variables and Imports

#### Priority 1: Core Components ✓
- `src/components/GameTimer.tsx` - 'formatTimeAsDays', 'dayProgress' ✓
- `src/components/GameTimer.test.tsx` - 'formatTimeAsDays', 'getDayProgress' ✓
- `src/components/progression/ClickableMilestone.tsx` - 'useSelector', 'dispatch' ✓
- `src/components/navigation/TabNavigation.tsx` - 'location' ✓

#### Priority 2: System Files
- `src/core/GameLoop.ts` - 'timestamp'
- `src/core/GameTimer.ts` - 'event', 'e'
- `src/systems/saveManager.ts` - 'lastSaveTime', 'e'

#### Priority 3: Test Files
- Various test files with unused imports and variables

### 2. Explicit Any Usage

#### Priority 1: Core Components and Systems
- `src/core/GameLoop.ts` - Multiple instances
- `src/core/GameLoop.test.ts` - Multiple instances
- `src/core/GameManager.test.ts` - Multiple instances

#### Priority 2: Utility Functions
- `src/utils/errorUtils.ts` - Multiple instances
- `src/utils/EventEmitter.ts`

#### Priority 3: Debug and Test Files
- `src/debug/index.ts`
- `src/debug/gameLoopTest.ts`

### 3. Require-Style Imports

#### Priority 1: System Files ✓
- `src/systems/saveContext.tsx` ✓
- `src/systems/saveManager.ts` ✓
- `src/systems/workerManager.ts` ✓

#### Priority 2: Integration Tests
- `src/gameCore.integration.test.tsx`
- `src/workers.integration.test.tsx`

### 4. TypeScript Comments

#### Priority 1: Test Files
- `src/tests/gameSystemCoherenceTest.test.ts` - Multiple instances
- `src/utils/testUtils.ts` - Multiple instances

#### Priority 2: Utility Files
- `src/utils/resourceUtils.test.ts`

### 5. Function Types

#### Priority 1: Utility Files
- `src/utils/EventEmitter.ts` - Multiple instances

## Progress Tracking

| Category | Total Files | Fixed Files | Progress |
|----------|-------------|-------------|----------|
| Unused Variables | ~40 | 8 | 20% |
| Explicit Any | ~30 | 0 | 0% |
| Require Imports | ~5 | 5 | 100% |
| TS Comments | ~5 | 1 | 20% |
| Function Types | 1 | 0 | 0% |

## Batch Planning

### Batch 1: Unused Variables in Core Components ✓
- `src/components/GameTimer.tsx` ✓
- `src/components/GameTimer.test.tsx` ✓
- `src/components/progression/ClickableMilestone.tsx` ✓
- `src/components/navigation/TabNavigation.tsx` ✓

### Batch 2: Unused Variables in System Files
- `src/core/GameLoop.ts`
- `src/core/GameTimer.ts`
- `src/systems/saveManager.ts`

### Batch 3: Require Imports in System Files ✓
- `src/systems/saveContext.tsx` ✓
- `src/systems/saveManager.ts` ✓
- `src/systems/workerManager.ts` ✓

### Batch 4: TypeScript Comments in Test Files
- `src/tests/gameSystemCoherenceTest.test.ts`
- `src/utils/testUtils.ts`

### Batch 5: Explicit Any in Core Components
- `src/core/GameLoop.ts`
- `src/core/GameLoop.test.ts`

## Completed Linting PRs

| PR Number | Category | Files Addressed | Notes |
|-----------|----------|-----------------|-------|
| #105 | Mixed (initial approach) | App.tsx, App.test.tsx, Icon.test.tsx, resourceUtils.ts | Initial cleanup with mixed category approach |
| #108 | Unused Variables (Batch 1) | GameTimer.tsx, GameTimer.test.tsx, TabNavigation.tsx, ClickableMilestone.tsx | Fixed unused imports and variables in core components |
| #107 | Unused Variables (Batch 2) | GameLoop.ts, GameTimer.ts, saveManager.ts | Fixed unused parameters and variables in system files |
| - | Require Imports (Batch 3) | saveContext.tsx, saveManager.ts, workerManager.ts | Replaced require-style imports with ES module imports |

## Next Steps

- [x] PR for unused variables in core components (GameTimer.tsx, GameTimer.test.tsx, TabNavigation.tsx, ClickableMilestone.tsx)
- [x] PR for unused variables in system files (GameLoop.ts, GameTimer.ts, saveManager.ts)
- [x] PR for require-style imports in system files (saveContext.tsx, saveManager.ts, workerManager.ts)
- [ ] PR for @ts-ignore comments in test files (gameSystemCoherenceTest.test.ts, testUtils.ts)
- [ ] PR for explicit any in GameLoop classes (GameLoop.ts, GameLoop.test.ts)