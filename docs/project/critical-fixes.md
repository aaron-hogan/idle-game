# Critical Fixes Log

This document tracks critical fixes applied to the codebase, providing a central reference for all important bug fixes and their documentation.

## 2025-02-27

### Dependency Injection Implementation

- **Issue**: Tight coupling between managers and Redux store caused testing difficulties and maintainability issues
- **Fix PR**: [#34 - Implement dependency injection for manager classes](https://github.com/aaron-hogan/idle-game/pull/34)
- **Documentation**: [Dependency Injection Documentation](/docs/features/dependency-injection/dependency-injection.md)
- **Affected Components**:
  - `TaskManager.ts`: Refactored to accept Redux store as dependency
  - `ProgressionManager.ts`: Refactored to accept Redux store as dependency
  - `App.tsx`: Updated to properly initialize managers with store
- **Root Cause**: Previous implementation directly imported Redux store, creating tight coupling and making testing difficult

### PR Workflow Documentation Improvements

- **Issue**: Inconsistent communication about PR status leading to confusion
- **Fix PR**: [#35 - Improve PR workflow documentation for better communication](https://github.com/aaron-hogan/idle-game/pull/35)
- **Documentation**: [PR Workflow Documentation](/docs/processes/pr-workflow.md)
- **Affected Components**:
  - `CLAUDE.md`: Updated with explicit PR status communication requirements
  - `/docs/processes/pr-workflow.md`: Enhanced with communication guidelines
- **Root Cause**: Previous workflow documentation lacked explicit requirements for status communication

## 2025-02-26

### Test Suite Fixes

- **Issue**: Failing tests in timeUtils and GameTimer preventing test suite from passing
- **Fix PR**: [#6 - Fix failing timeUtils and GameTimer tests](https://github.com/aaron-hogan/idle-game/pull/6)
- **Documentation**: [Test Suite Fix](/docs/features/testing/test-suite-fix.md)
- **Affected Components**:
  - `timeUtils.test.ts`: Updated tests to handle default safe limit option
  - `GameTimer.test.tsx`: Rewrote to match new Counter-based implementation
- **Root Cause**: Tests were not updated when the components were refactored

### Console Spam and Offline Progress Fix

- **Issue**: Excessive console logging causing performance issues and React infinite update loops
- **Fix PR**: [#5 - Fix console spam and offline progress errors](https://github.com/aaron-hogan/idle-game/pull/5)
- **Documentation**: [Console Spam Fix](/docs/features/ui-improvements/console-spam-fix.md)
- **Affected Components**:
  - `ResourceManager.ts`: Reduced excessive logging
  - `GameManager.ts`: Fixed offline progress handling
  - `App.tsx`: Fixed React infinite update loop

### Missing Debug CSS Fix

- **Issue**: Missing CSS file for EventDebugTab component causing build failures
- **Fix Commit**: [5e9672b - fix: add missing DebugTab.css and documentation](https://github.com/aaron-hogan/idle-game/commit/5e9672b)
- **Documentation**: [Missing CSS Fix](/docs/features/ui-improvements/missing-css-fix.md)
- **Affected Components**:
  - Added `src/debug/tabs/DebugTab.css`

## 2025-02-25

### Resource Generation Fix

- **Issue**: UI improvements broke passive resource generation
- **Documentation**: [Resource Upgrade Fix](/docs/features/ui-improvements/resource-upgrade-fix.md)
- **Affected Components**:
  - Resource generation system
  - Offline progress calculation

## Lessons Learned From Critical Fixes

1. Keep UI changes separate from system changes
2. Make small, focused commits with proper testing
3. Be cautious when modifying core game loop or resource systems
4. Document changes thoroughly with dedicated files for each fix
5. When updating type definitions, ensure all imports are updated across files
6. Always verify referenced files (CSS, assets) exist when modifying/creating components
7. Reduce excessive logging in production code
8. Validate timestamps and other critical data before processing
9. Implement proper dependency injection to decouple components
10. Clearly communicate PR status and merge results
11. Avoid singleton patterns when possible for better testability