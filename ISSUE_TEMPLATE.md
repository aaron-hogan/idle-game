# Multiple Test Failures After Repository Cleanup

## Summary
After the repository cleanup PR (#98) was merged, several tests are failing due to inconsistencies between test mocks and the actual application state structure. This issue tracks the specific failures and required fixes.

## Affected Areas
1. Many systems tests are failing due to mock state issues:
   - BuildingManager tests
   - WorkerManager tests
   - ResourceManager tests
   - EventManager tests
   - SaveManager tests

2. Primary types of failures:
   - Type errors with state structure
   - Missing actions in the mock stores
   - Missing structure data in the mocks
   - Incorrect property references (e.g., `completed` vs `completedTutorials`)

## Current Status
We have fixed a few issues:
- Updated `TutorialManager` to use `completedTutorials` property instead of `completed`
- Fixed `selectors.test.ts` to match new state schema for tutorials
- Updated `testUtils.ts` with a more complete mock state structure
- Started fixing `BuildingManager` tests

## Remaining Test Failures
Most test failures fall into these categories:

1. **Missing initial data** - Tests fail because mock state doesn't have expected structure data:
```
TypeError: Cannot read properties of undefined (reading 'test_building')
```

2. **Missing action creators** - Tests fail because mock actions aren't properly provided:
```
TypeError: this.actions.addStructure is not a function
```

3. **Property mismatch** - Tests reference properties that don't exist or have been renamed:
```
TypeError: Cannot read properties of undefined (reading 'byId')
```

## Steps to Resolve
1. Update all mock state objects to match the current state structure
2. Fix all singleton manager tests to properly inject dependencies
3. Update all mocks to provide proper action creators
4. Ensure consistent property names between tests and implementation
5. Consider refactoring tests to use a standardized mock setup function

## Related PRs
- #98 Repository Cleanup PR
- (Current PR) Initial test fixes