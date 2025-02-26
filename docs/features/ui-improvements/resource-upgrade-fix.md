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

## Root Cause

The error was caused by multiple issues:

1. Missing exports in the ResourceManager.ts file:
   - `updateBaseResourcePerSecond` was not imported from resourcesSlice
   - `updateUpgradeLevel` was not imported from resourcesSlice
   - `UpgradeType` enum was not imported from resource.ts

2. Conflicting Resource type definitions:
   - We were importing the older Resource interface from models/types.ts 
   - Instead, we needed the newer Resource interface from models/resource.ts that includes upgrade tracking

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

## Testing

After implementing the fix:
1. The application now starts without errors
2. Resource generation properly tracks upgrade levels
3. Passive generation upgrades persist between game ticks

## Lessons Learned

1. When refactoring types across multiple files, ensure all imports are updated
2. Check for type conflicts when duplicating or modifying interfaces
3. Regularly run type checking during development to catch these errors sooner

## Related Documentation

This fix completes the upgrade tracking system implementation documented in:
- `/docs/features/resource-management/upgrade-tracking.md`