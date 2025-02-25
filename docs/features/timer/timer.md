# Timer System

## Overview

The timer system is the core timing mechanism for the anti-capitalist idle game. It provides a consistent and reliable timing source for game updates, handles browser throttling, and manages time scaling. The system ensures proper game progression even under varying performance conditions.

## Core Components

### Data Models

- **GameLoopStats Interface**: Tracks performance metrics like FPS, frame time, and update counts
- **TickHandler Type**: Function signature for handlers that receive timing updates
- **TimeData Interface**: Contains both real and game time values for a given update
- **TimeScale Type**: Numerical scaling factor for adjusting game speed

### State Management

- **gameSlice Redux Slice**:
  - `totalPlayTime`: Tracks total game time in seconds
  - `lastSaveTime`: Records real-time timestamp of last save
  - `gameTimeScale`: Controls the speed of game time progression
  - `isPaused`: Tracks whether the game is paused

### Components

- **GameLoop**: Core timing loop that drives the game
- **GameTimer**: Time tracking and management
- **GameManager**: Distributes time updates to game systems

### Services

- **GameTimer Service**: Singleton service that manages game time:
  - Tracking real time using performance.now()
  - Maintaining game time with scaling
  - Providing pause/resume functionality
  - Calculating elapsed time between updates

## Usage Guide

### Basic Usage

```typescript
// Getting the GameTimer instance
const gameTimer = GameTimer.getInstance();

// Getting elapsed time since last update
const realTimeDelta = gameTimer.getElapsedRealTime(); // unscaled, in seconds
const gameTimeDelta = gameTimer.getElapsedGameTime(); // scaled, in seconds

// Controlling game speed
gameTimer.setTimeScale(2.0); // 2x normal speed
const currentScale = gameTimer.getTimeScale();

// Pausing/resuming
gameTimer.pause();
gameTimer.resume();
const isPaused = gameTimer.isPaused();
```

### Using GameLoop

```typescript
// Getting the GameLoop instance
const gameLoop = GameLoop.getInstance();

// Registering a handler to receive updates
const handler = (deltaTime, scaledDeltaTime) => {
  // deltaTime: Unscaled time in seconds
  // scaledDeltaTime: Scaled time in seconds
  console.log(`Update with ${deltaTime}s real, ${scaledDeltaTime}s game time`);
};

// Register and get unregister function
const unregister = gameLoop.registerHandler(handler);

// Later, unregister when no longer needed
unregister();

// Start/stop the game loop
gameLoop.start();
gameLoop.stop();

// Get performance stats
const stats = gameLoop.getStats();
console.log(`Running at ${stats.fps} FPS`);
```

## Integration

The timer system integrates with other game systems in the following ways:

1. **Game Manager Integration**:
   - GameManager receives time updates from GameLoop
   - Distributes time to all game subsystems (resources, buildings, etc.)
   - Updates Redux store with current time

2. **Resource System Integration**:
   - Resource generation rates are applied using scaled game time
   - Resource calculations use seconds as the standard unit

3. **Event System Integration**:
   - Events are triggered and processed based on game time
   - Event cooldowns and durations use scaled time

4. **Save/Load System Integration**:
   - Game saves record total play time
   - Offline progress is calculated based on elapsed real time

## Best Practices

- **Always use seconds** as the time unit in game logic
- **Get time from GameTimer** rather than calculating it yourself
- **Use scaledDeltaTime** for any game progression logic
- **Use deltaTime** for any real-time animation or effects
- **Register handlers with GameLoop** rather than creating your own loops
- **Unregister handlers** when components unmount to prevent memory leaks
- **Avoid direct timing calls** to performance.now() or Date.now()
- **Handle both paused and unpaused states** in your systems
- **Test with different time scales** to ensure proper behavior
- **Watch for time-dependent bugs** when the game is running very fast or slow