# Timer Implementation Strategy

Based on industry best practices and our specific game requirements, this document outlines our implementation strategy for fixing the timer system.

## Core Architecture

We'll implement a three-tier timer architecture:

1. **GameTimer** - Core time tracking with precise measurement
2. **GameLoop** - Fixed timestep loop to drive updates 
3. **GameManager** - Distribution of time updates to systems

This approach follows industry standards like those in Unity and Unreal Engine, while maintaining clean architectural boundaries.

## Implementation Steps

### Phase 1: Core Timer Component

1. **Update GameTimer Class**
   - Make it the single source of truth for time
   - Use performance.now() exclusively for precision
   - Support time scaling and pausing
   - Add robust error handling and validation

```typescript
// Core timer update method
public update(): void {
  if (!this.running) {
    this.elapsedGameTime = 0;
    this.elapsedRealTime = 0;
    return;
  }
  
  const currentTime = this.getTimestamp();
  this.elapsedRealTime = currentTime - this.lastRealTime;
  
  // Cap maximum frame time
  this.elapsedRealTime = Math.min(this.elapsedRealTime, this.config.maxFrameTime);
  
  // Calculate elapsed game time with scaling
  this.elapsedGameTime = this.elapsedRealTime * this.config.timeScale;
  
  // Update total game time
  this.totalGameTime += this.elapsedGameTime;
  
  // Update last time for next frame
  this.lastRealTime = currentTime;
}
```

2. **Add Tab Visibility Handling**
   - Detect and handle tab focus changes
   - Reset frame timing on tab activation
   - Add optional pause on tab blur

```typescript
// In appropriate initialization location
document.addEventListener('visibilitychange', () => {
  const gameTimer = GameTimer.getInstance();
  
  if (document.hidden) {
    // Optional: automatically pause when tab is hidden
    if (this.config.pauseOnHidden) {
      gameTimer.pause();
    }
  } else {
    // Reset timer to prevent huge time jumps
    gameTimer.resetFrameTiming();
    
    // Resume if configured to auto-pause
    if (this.config.pauseOnHidden && this.wasPausedByVisibility) {
      gameTimer.resume();
      this.wasPausedByVisibility = false;
    }
  }
});
```

### Phase 2: Fixed Timestep Game Loop

1. **Update GameLoop Class**
   - Implement proper fixed timestep pattern
   - Use GameTimer for all time calculations
   - Pass both real and scaled time to handlers

```typescript
// Main game loop function
private gameLoop(): void {
  // Ask GameTimer to update elapsed time
  this.gameTimer.update();
  
  // Get elapsed time values
  const deltaTime = this.gameTimer.getElapsedRealTime();
  const scaledDeltaTime = this.gameTimer.getElapsedGameTime();
  
  // Accumulate time and run fixed updates
  this.accumulatedTime += deltaTime;
  const fixedTimeStep = 1.0 / this.config.tickRate;
  
  let updateCount = 0;
  while (this.accumulatedTime >= fixedTimeStep && 
         updateCount < this.config.maxUpdatesPerFrame) {
    // Process fixed update with consistent time steps
    this.processFixedUpdate(fixedTimeStep, fixedTimeStep * this.gameTimer.getTimeScale());
    this.accumulatedTime -= fixedTimeStep;
    updateCount++;
    this.tickCount++;
  }
  
  // Schedule next frame if still running
  if (this.isRunning) {
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }
}
```

### Phase 3: Game Manager Integration

1. **Update GameManager Class**
   - Use both real and scaled time values
   - Update Redux store with correct time
   - Propagate properly scaled time to systems

```typescript
// Main update function called by game loop
private update(deltaTime: number, scaledDeltaTime: number): void {
  // Update total play time with UNSCALED time (for real time counting)
  this.store.dispatch(addPlayTime(deltaTime));
  
  // Use SCALED time for gameplay progression 
  this.updateResourceSystem(scaledDeltaTime);
  this.updateBuildingSystem(scaledDeltaTime);
  this.updateTaskSystem(scaledDeltaTime);
  
  // Periodically update save time (every 10 seconds of real time)
  const state = this.store.getState();
  if ((state.game.totalPlayTime - state.game.lastSaveTime) >= 10) {
    this.updateLastSaveTime();
  }
}
```

### Phase 4: System Updates

1. **Update ResourceManager**
   - Use scaled time for resource generation
   - Add logging for time-related debugging

```typescript
// Update resources with scaled time
updateResources(scaledDeltaTime: number): void {
  // Validate input
  if (scaledDeltaTime < 0) return;
  
  // Update resources based on scaled time
  const resources = this.getState!().resources;
  
  Object.values(resources).forEach(resource => {
    if (resource.perSecond > 0) {
      // Always use scaled time for gameplay progression
      const amount = resource.perSecond * scaledDeltaTime;
      this.dispatch!(addResourceAmount({
        id: resource.id,
        amount
      }));
    }
  });
}
```

### Phase 5: Disable Legacy Systems

1. **Disable resourceTickFix**
   - Remove or disable any calls to startDirectResourceTick
   - Add warning logs if someone tries to use it

```typescript
// In resourceTickFix.ts
export function startDirectResourceTick() {
  console.warn('DEPRECATED: Direct resource tick is disabled in favor of GameLoop');
  return; // Early return to prevent functionality
}
```

2. **Verify legacy systems are disabled**
   - Add console warnings to legacy system constructors
   - Remove any initialization of these systems

## Testing Strategy

1. **Unit Tests for GameTimer**
   - Test time tracking accuracy
   - Test time scaling functionality
   - Test pause/resume behavior

2. **Integration Tests for Game Systems**
   - Test resource generation with different time scales
   - Test offline progress calculation
   - Test tab visibility handling

3. **Visual Time Debugging Tool**
   - Create a debug panel showing:
     - Real time elapsed
     - Game time elapsed
     - Current time scale
     - Time ratio (should be 1.0x)
     - FPS and tick rate

## Implementation Timeline

1. **Day 1:** Core GameTimer and GameLoop updates
2. **Day 2:** GameManager integration and system updates
3. **Day 3:** Legacy system removal and debug tools
4. **Day 4:** Testing and verification
5. **Day 5:** Documentation and final adjustments