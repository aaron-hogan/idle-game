# Resource Upgrade Fix

## Issue Description

After implementing the upgrade tracking system, the application was failing with the following runtime error:

```
ERROR
Can't find variable: updateBaseResourcePerSecond
@
forEach@[native code]
calculateResourceGeneration@
initializeResourceManager@
initialize@
```

The error occurred during application startup, preventing any resource generation and essentially breaking the core game loop functionality.

Steps to reproduce:
1. Launch the application after implementing the upgrade tracking system
2. Observe console errors in browser developer tools
3. Note that no resources are being generated

## Root Cause Analysis

The error was caused by multiple issues:

1. Missing exports in the ResourceManager.ts file:
   - `updateBaseResourcePerSecond` was not imported from resourcesSlice
   - `updateUpgradeLevel` was not imported from resourcesSlice
   - `UpgradeType` enum was not imported from resource.ts

2. Conflicting Resource type definitions:
   - We were importing the older Resource interface from models/types.ts 
   - Instead, we needed the newer Resource interface from models/resource.ts that includes upgrade tracking

This occurred because:
- When we implemented the upgrade tracking system, we created a new Resource interface in `models/resource.ts`
- We added new Redux actions in `resourcesSlice.ts` but didn't update all imports in `resourceManager.ts`
- The `ResourceManager.calculateResourceGeneration()` method tried to use the undefined `updateBaseResourcePerSecond` function

## Fix Implementation

The fix involved updating the imports in `resourceManager.ts`:

1. Added missing imports:
   ```typescript
   import { 
     // ...existing imports
     updateUpgradeLevel,
     updateBaseResourcePerSecond,
   } from '../state/resourcesSlice';
   import { UpgradeType } from '../models/resource';
   ```

2. Fixed Resource type conflict:
   ```typescript
   // Changed from
   import { Resource, Structure, NULL_RESOURCE } from '../models/types';
   
   // To
   import { Structure, NULL_RESOURCE } from '../models/types';
   import { Resource } from '../models/resource';
   ```

We chose this approach because:
- It maintains the new Resource model with upgrade tracking
- It properly imports all the required functions from the slice
- It resolves the type conflict by using the newer Resource interface

We considered:
- Reverting the upgrade tracking system, but this would lose valuable functionality
- Creating a backwards-compatible Resource interface, but this would add complexity

## Testing Verification

After implementing the fix, we verified that:
1. The application now starts without runtime errors
2. Resource generation properly tracks upgrade levels
3. Passive generation upgrades persist between game ticks
4. Click upgrades function correctly
5. The resource display properly shows the correct resource amounts

We performed the following regression tests:
1. Verified all resources generate correctly over time
2. Confirmed that upgrading passive generation increases resource production rate
3. Checked that base generation rates are properly applied
4. Confirmed that the upgrade UI displays correct costs and levels

## Lessons Learned

1. When refactoring types across multiple files, ensure all imports are updated
2. Check for type conflicts when duplicating or modifying interfaces
3. Regularly run type checking during development to catch these errors sooner
4. Add TypeScript strict mode to catch these issues at compile time
5. Consider implementing a pre-commit hook that runs type checking
6. When creating new interfaces to replace existing ones, consider:
   - Adding deprecation warnings to old interfaces
   - Creating migration guides for transitioning to new interfaces
   - Using more descriptive naming to avoid confusion (e.g., ResourceWithUpgrades)

## Related Documentation

This fix completes the upgrade tracking system implementation documented in:
- `/docs/features/ui-improvements/recovery-process.md` - Overall recovery process
- `/docs/features/resource-management/upgrade-tracking.md` - Upgrade system implementation

Related files:
- `/src/systems/resourceManager.ts` - Main file that was modified
- `/src/state/resourcesSlice.ts` - Contains the Redux actions
- `/src/models/resource.ts` - Contains the updated Resource interface
- `/src/models/types.ts` - Contains the original Resource interface