# Timer API Guide

This document describes how game systems should interact with the timer system to ensure consistent time behavior across the game.

## Core Concepts

### Time Types
- **Real Time**: Actual elapsed wall-clock time (unscaled)
- **Game Time**: Time as perceived in the game world (may be scaled)
- **Delta Time**: Time elapsed since last update (in seconds)
- **Total Time**: Accumulated time since game start (in seconds)

### Time Units
- All time values are expressed in **seconds** throughout the codebase
- Redux store may store timestamps in milliseconds for compatibility

### Time Scale
- Default scale is 1.0 (real time = game time)
- Values > 1.0 make game time pass faster than real time
- Values < 1.0 make game time pass slower than real time

## Using Time in Game Systems

### 1. Accessing Time via GameManager

Game systems should receive time updates through the GameManager, which provides both scaled and unscaled time:

```typescript
// In your system update method
update(deltaTime: number, scaledDeltaTime: number): void {
  // Use scaledDeltaTime for game progression
  // Use deltaTime only for real-time operations
}
```

### 2. Resource System Updates

Resources should always use scaled time for production:

```typescript
// In ResourceManager
updateResources(deltaTime: number, scaledDeltaTime: number): void {
  // Always use scaledDeltaTime for resource generation
  const generatedAmount = resourcePerSecond * scaledDeltaTime;
}
```

### 3. Task and Timer System

Use absolute timestamps for start/end times, but scaled time for progress:

```typescript
// Calculate progress
const elapsedRealTime = currentTime - startTime;
const elapsedGameTime = elapsedRealTime * gameTimeScale;
const progress = elapsedGameTime / duration;
```

### 4. UI Updates

UI should reflect game time, not real time:

```typescript
// In GameTimer component
const formattedTime = formatTime(totalGameTime);
```

## Timer Registration

Systems that need time updates should register with the GameLoop:

```typescript
// Register for updates
const unregister = gameLoop.registerHandler(this.update.bind(this));

// Remember to unregister when done
unregister();
```

## Common Patterns

### Safe Time Handling

Always handle edge cases in time calculations:

```typescript
// Cap maximum delta time
const cappedDelta = Math.min(deltaTime, MAX_DELTA_TIME);

// Ensure positive time values
const safeDelta = Math.max(0, cappedDelta);
```

### Offline Progress

When calculating offline progress:

```typescript
// Calculate offline time with efficiency factor
const offlineSeconds = calculateOfflineTime(currentTime, lastSaveTime, {
  applyEfficiency: true,
  maxOfflineTime: MAX_OFFLINE_TIME
});

// Apply updates with offline time
updateResources(0, offlineSeconds); // 0 real time, only game time
```

## Debugging

For debugging time-related issues:

```typescript
// GameTimer exposes debugging methods
const timeInfo = GameTimer.getInstance().getDebugInfo();
console.log(`Real time: ${timeInfo.realTime}, Game time: ${timeInfo.gameTime}`);
```

## Avoiding Common Mistakes

1. **DON'T** mix time units (always use seconds)
2. **DON'T** maintain separate time trackers
3. **DON'T** apply time scale multiple times
4. **DON'T** use Date.now() directly for game timing
5. **DO** use scaledDeltaTime for gameplay progression
6. **DO** centralize all time control through GameManager
7. **DO** handle edge cases (paused game, tab inactive)