# Linting Cleanup Progress

This document tracks the progress of our systematic linting cleanup efforts.

## Categories and Status

| Category | Description | Progress | Files Fixed | Total Files (est.) |
|---------|-------------|----------|------------|-------------------|
| Unused Variables | Fix unused imports, variables, and parameters | 20% | 8 | ~40 |
| Require Imports | Convert require-style imports to ES module imports | 100% | 5 | 5 |
| TS Comments | Update @ts-ignore to @ts-expect-error with explanations | 80% | 4 | 5 |
| Explicit Any | Replace 'any' types with explicit types | 75% | 16 | ~20 |

## Batches Completed

### Batch 11: Fix Explicit Any in ProgressionManager and TasksSlice (2/27/2025)
- **PR**: Not submitted yet
- **Status**: Complete
- **Fixed Files**:
  - `src/managers/progression/ProgressionManager.ts`: Fixed multiple explicit `any` types
    - Added proper Resource type import and typing
    - Added MilestoneReward typing for function parameters
    - Fixed Record<string, any> casts to use proper types
  - `src/state/tasksSlice.ts`: Fixed AnyAction in extraReducers
    - Removed unused AnyAction import
    - Used PayloadAction with proper type casting

### Batch 10: Fix Explicit Any in GameLoop Files (2/27/2025)
- **PR**: Not submitted yet
- **Status**: Complete
- **Fixed Files**:
  - `src/systems/gameLoop.ts`: Replaced `any` type with proper types for resources
  - `src/debug/gameLoopTest.ts`: Fixed multiple `any` types with proper Resource typing
    - Added proper imports for Resource and RootState types
    - Added explicit type casting for Redux state
    - Properly typed Object.values() iterations

### Batch 9: Fix TS-expect-error in resourceUtils.ts (2/27/2025)
- **PR**: Not submitted yet
- **Status**: Complete
- **Fixed Files**:
  - `src/utils/resourceUtils.ts`: Fixed TypeScript errors by properly typing Redux state access
    - Replaced `state.resources.resources` with `state.resources`
    - Added proper type casting with `RootState` type
    - Updated tests to match the new implementation

### Batch 8: Explicit Any in More System Files (2/27/2025)
- **PR**: Not submitted yet
- **Status**: Complete
- **Fixed Files**:
  - `src/systems/eventManager.ts`: Replaced any with explicit types in getInstance and initialize methods
  - `src/systems/saveManager.ts`: Replaced any with explicit types in constructor dependencies
  - `src/systems/workerManager.ts`: Replaced any with explicit types for placeholder functions
  - `src/systems/resourceManager.ts`: Improved resource access type safety with proper casting

### Batch 7: Explicit Any in System Manager Files (2/27/2025)
- **PR**: #113
- **Status**: Complete
- **Fixed Files**:
  - `src/systems/resourceManager.ts`: Replaced any with explicit types in getInstance and initialize methods
  - `src/systems/buildingManager.ts`: Replaced any with explicit types for proper type safety

### Batch 6: Explicit Any in Utility Files (2/27/2025)
- **PR**: #112
- **Status**: Complete
- **Fixed Files**:
  - `src/utils/EventEmitter.ts`: Replaced any[] with unknown[] for event arguments
  - `src/utils/validationUtils.ts`: Replaced any with unknown in safeJsonStringify
  - `src/utils/errorUtils.ts`: Replaced multiple any types with unknown 
  - `src/utils/stateValidation.ts`: Improved validateGameState type safety

### Batch 5: Explicit Any in Core Components (2/27/2025)
- **PR**: #111
- **Status**: Complete
- **Fixed Files**:
  - `src/core/GameLoop.ts`: Replaced store's any type with Store<RootState>
  - `src/core/GameLoop.test.ts`: Added proper MockGameTimer interface for casting

### Batch 4: TS Comment Directives (2/26/2025)
- **PR**: #110
- **Status**: Merged
- **Fixed Files**:
  - `src/tests/gameSystemCoherenceTest.test.ts`: Updated @ts-ignore to @ts-expect-error
  - `src/utils/testUtils.ts`: Updated @ts-ignore to @ts-expect-error with explanations

### Batch 3: Require-style Imports (2/25/2025)
- **PR**: #109
- **Status**: Merged
- **Fixed Files**:
  - `src/contexts/saveContext.tsx`: Converted require imports to ES modules
  - `src/systems/saveManager.ts`: Updated imports
  - `src/systems/workerManager.ts`: Updated imports

### Batch 2: Unused Parameters in System Files (2/24/2025)
- **PR**: #107
- **Status**: Merged
- **Fixed Files**:
  - `src/systems/GameLoop.ts`: Fixed unused parameters
  - `src/systems/GameTimer.ts`: Fixed unused variables
  - `src/systems/saveManager.ts`: Fixed unused imports

### Batch 1: Unused Imports in Core Components (2/23/2025)
- **PR**: #108
- **Status**: Merged
- **Fixed Files**:
  - `src/components/GameTimer.tsx`: Fixed unused imports
  - `src/components/GameTimer.test.tsx`: Fixed unused variables
  - `src/components/TabNavigation.tsx`: Fixed unused imports
  - `src/components/ClickableMilestone.tsx`: Fixed unused variables

## Next Steps

- Continue addressing the "Explicit Any" category in remaining files
- Address the unrelated @ts-expect-error issues in resourceUtils.ts
- Update ESLint configuration to prevent new linting issues