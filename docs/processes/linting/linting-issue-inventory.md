# Linting Issue Inventory

This document inventories files with linting issues by category to track progress and prioritize fixes.

## 1. Unused Variables and Imports (`@typescript-eslint/no-unused-vars`)

The following files contain unused variables or imports:

### Priority 1: Core Components
- `src/components/GameTimer.tsx` - 'formatTimeAsDays', 'dayProgress'
- `src/components/GameTimer.test.tsx` - 'formatTimeAsDays', 'getDayProgress'
- `src/components/progression/ClickableMilestone.tsx` - 'useSelector', 'dispatch'
- `src/components/navigation/TabNavigation.tsx` - 'location'

### Priority 2: System Files
- `src/core/GameLoop.ts` - 'timestamp'
- `src/core/GameTimer.ts` - 'event', 'e'
- `src/systems/saveManager.ts` - 'lastSaveTime', 'e'

### Priority 3: Test Files
- Various test files with unused imports and variables

## 2. Explicit Any Usage (`@typescript-eslint/no-explicit-any`)

The following files use `any` type where more specific types should be used:

### Priority 1: Core Components and Systems
- `src/core/GameLoop.ts` - Multiple instances
- `src/core/GameLoop.test.ts` - Multiple instances
- `src/core/GameManager.test.ts` - Multiple instances

### Priority 2: Utility Functions
- `src/utils/errorUtils.ts` - Multiple instances
- `src/utils/EventEmitter.ts`

### Priority 3: Debug and Test Files
- `src/debug/index.ts`
- `src/debug/gameLoopTest.ts`

## 3. Require-Style Imports (`@typescript-eslint/no-require-imports`)

The following files use `require()` instead of ES Module imports:

### Priority 1: System Files
- `src/systems/saveContext.tsx`
- `src/systems/saveManager.ts`
- `src/systems/workerManager.ts`

### Priority 2: Integration Tests
- `src/gameCore.integration.test.tsx`
- `src/workers.integration.test.tsx`

## 4. TypeScript Comments (`@typescript-eslint/ban-ts-comment`)

The following files use `@ts-ignore` instead of `@ts-expect-error`:

### Priority 1: Test Files
- `src/tests/gameSystemCoherenceTest.test.ts` - Multiple instances
- `src/utils/testUtils.ts` - Multiple instances

### Priority 2: Utility Files
- `src/utils/resourceUtils.test.ts`

## 5. Function Types (`@typescript-eslint/no-unsafe-function-type`)

The following files use `Function` type instead of more specific function types:

### Priority 1: Utility Files
- `src/utils/EventEmitter.ts` - Multiple instances

## Progress Tracking

| Category | Total Files | Fixed Files | Progress |
|----------|-------------|-------------|----------|
| Unused Variables | ~40 | 5 | 12.5% |
| Explicit Any | ~30 | 0 | 0% |
| Require Imports | ~5 | 1 | 20% |
| TS Comments | ~5 | 1 | 20% |
| Function Types | 1 | 0 | 0% |

## Batch Planning

### Batch 1: Unused Variables in Core Components
- `src/components/GameTimer.tsx`
- `src/components/GameTimer.test.tsx`
- `src/components/progression/ClickableMilestone.tsx`
- `src/components/navigation/TabNavigation.tsx`
- `src/components/progression/ProgressBar.tsx`

### Batch 2: Require Imports in System Files
- `src/systems/saveContext.tsx`
- `src/systems/saveManager.ts`
- `src/systems/workerManager.ts`

### Batch 3: TypeScript Comments in Test Files
- `src/tests/gameSystemCoherenceTest.test.ts`
- `src/utils/testUtils.ts`

### Batch 4: Explicit Any in Core Components
- `src/core/GameLoop.ts`
- `src/core/GameLoop.test.ts`