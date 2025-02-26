# TypeScript Error Fixes Plan

## Problem Background

We've identified several TypeScript errors in the codebase that need to be fixed. These errors appear during type checking (`npm run typecheck`) but don't affect runtime functionality. Properly addressing these errors will improve code quality and prevent potential bugs.

## Approach

Based on previous experience with breaking changes in our resource system, we're taking a **cautious and non-invasive approach** to fixing TypeScript errors:

1. **Limit scope to type annotations only**
   - Make minimal changes focused solely on TypeScript errors
   - Don't modify actual logic or behavior
   - Use type assertions when appropriate to avoid changing interfaces

2. **Fix errors in separate categories**
   - Fix UI component errors first (easiest and least invasive)
   - Address test file errors next (isolated from main code)
   - Carefully fix core system errors last (most sensitive)

3. **Testing strategy**
   - Run type checking after each set of changes
   - Verify game functionality works properly
   - Never modify resource generation logic

## Types of Errors Being Fixed

1. **Incorrect import paths**
   - Fixing relative paths in debug components
   - No behavior changes, just correct references

2. **Component property errors**
   - Mismatched property names (e.g., gameStage vs currentStage)
   - Void value truthiness checks in ResourceGenerators

3. **Type casting in test files**
   - Using proper type assertions for mocks
   - Adding `as unknown as jest.Mock` where needed
   - Not changing actual test logic

4. **Node.js type errors**
   - Updating interval and timeout types to NodeJS.Timeout
   - Ensuring proper clear interval calls

## Implementation Steps

For each fix:
1. Identify the exact error in TypeScript output
2. Locate the source file and problematic code
3. Make minimal changes to fix the type error
4. Verify with type checking and functional testing
5. Document the fix in this file

## Risk Mitigation

To avoid making the same mistakes as our previous attempt:

1. **No resource system changes**
   - Don't modify the Resource interface
   - Don't change any resource-related logic or imports

2. **Separate concerns**
   - Keep UI fixes separate from system fixes
   - Commit changes in logical groups

3. **Testing between changes**
   - Run TypeScript checks after each set of fixes
   - Verify game functionality after fixes are applied

## Completed Fixes

- Fixed ResourceGenerators.tsx void truthiness check
- Created missing PassiveIncomeDisplay component
- Fixed import paths in debug panel components
- Corrected property references in ProgressionDebugTab
- Added type checking for resource requirements in ResourceDebugTab
- Updated Node.js timer/interval types
- Fixed interval type declaration in GameLoop
- Added proper undefined checks
- Added window object type declaration
- Added type narrowing for Redux actions