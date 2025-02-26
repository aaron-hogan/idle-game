# Critical Fixes Log

This document tracks critical fixes applied to the codebase, providing a central reference for all important bug fixes and their documentation.

## 2025-02-26

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