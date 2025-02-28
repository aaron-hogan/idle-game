# Critical Fixes Log

This document tracks critical fixes applied to the codebase, providing a central reference for all important bug fixes and their documentation.

## 2025-02-28

### Merge Conflict Marker Fix

- **Issue**: Merge conflict marker left in GameTimer.tsx causing build failures across multiple PRs (#110-#114)
- **Fix Commit**: [c8fcfda - fix: resolve merge conflict in GameTimer.tsx](https://github.com/aaron-hogan/idle-game/commit/c8fcfda83ee977c5f294e46ad069c6683fda1abe)
- **Documentation**: [Resolving Merge Conflicts](/docs/processes/resolving-merge-conflicts.md)
- **Affected Components**:
  - `src/components/GameTimer.tsx`: Removed merge conflict marker
- **Prevention Commit**: [494989a - docs: update merge conflict resolution guide and add conflict detection](https://github.com/aaron-hogan/idle-game/commit/494989a)
- **Root Cause**: Incomplete merge conflict resolution in PR #107 that propagated to PRs #110-#114

### Recovery Plan for PRs #107-#114

1. **Fixed**: Removed the merge conflict marker from GameTimer.tsx
2. **Prevention**: Added a pre-commit hook to detect conflict markers
3. **Documentation**: Updated merge conflict resolution guide with lessons learned
4. **Verification Needed**:
   - All changes from PRs #107-#114 should be manually verified
   - Additional testing of affected components recommended

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
12. Thoroughly verify merge conflict resolution is complete before committing
13. Run builds locally after resolving merge conflicts
14. Use pre-commit hooks to catch common issues automatically
15. Review build logs carefully when CI/CD pipelines fail