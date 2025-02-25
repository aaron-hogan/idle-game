# Timer System Cleanup Plan

This document outlines the plan for removing redundant time-related implementations and ensuring a single time propagation path.

## Identify Active Time Paths

### Current Active Components
1. ✅ **core/GameLoop.ts** - Primary game loop implementation
2. ✅ **core/GameTimer.ts** - Time tracking implementation
3. ✅ **core/GameManager.ts** - Distributes time updates to systems

### Components to Disable/Remove
1. ❌ **src/patches/resourceTickFix.ts** - Direct timer bypass using setInterval
2. ❌ **src/managers/GameLoopManager.ts** - Already disabled but double-check
3. ❌ **src/systems/gameLoop.ts** - Already disabled but double-check
4. ❌ Any direct setInterval/setTimeout logic updating game state

## Cleanup Steps

### 1. Disable Direct Resource Tick
- Ensure this isn't being called during game initialization
- Look for calls to `startDirectResourceTick()` in the codebase
- Add debug logs to confirm this isn't active
- Consider removing the implementation entirely

### 2. Remove Direct Time Updates in Components
- Look for components using their own timing logic
- Check App.tsx for initialization of redundant timers
- Remove any direct time manipulation

### 3. Fix Time Source Consistency
- Ensure all time calculations use performance.now()
- Replace any remaining uses of Date.now() for timing
- Standardize on seconds as the unit for all time values

### 4. Audit External Intervals
- Check for any remaining setInterval calls
- Verify no other components are updating resources directly
- Move any needed interval functionality to the main game loop

## Implementation Plan

### 1. Direct Resource Tick
```typescript
// In App.tsx or other initialization code, look for and remove:
import { startDirectResourceTick } from '../patches/resourceTickFix';
startDirectResourceTick();

// Consider completely disabling by modifying resourceTickFix.ts:
export function startDirectResourceTick() {
  console.warn('DEPRECATED: Direct resource tick is disabled in favor of GameLoop');
  return; // Early return to prevent functionality
}
```

### 2. Verify GameLoopManager Disabled
```typescript
// Add debug check in GameLoopManager.ts
constructor() {
  console.warn('DEPRECATED: GameLoopManager instantiated but should not be used');
}

// Add similar checks to key methods
start() {
  console.warn('DEPRECATED: GameLoopManager.start() called but should not be used');
  return; // Early return
}
```

### 3. Time Utility Cleanup
```typescript
// In timeUtils.ts, standardize on high precision timing:
export function getCurrentTime(): number {
  // Convert to milliseconds for backwards compatibility
  return performance.now();
}
```

## Testing Approach

After implementing the cleanup:

1. **Verify Single Update Path**
   - Add debug logs to each potential time source
   - Confirm only the main game loop is updating time

2. **Check for Timing Bugs**
   - Monitor the game for at least 5 minutes
   - Verify time ratio stays close to 1.0x
   - Check resource generation matches expected rates

3. **Confirm Redux Updates**
   - Monitor Redux actions for time updates
   - Verify only a single source is dispatching time actions