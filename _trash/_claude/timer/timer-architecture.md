# Simplified Timer Architecture

## Core Principles

1. **Single Source of Truth**: One timer system to rule them all
2. **Consistent Units**: Always use seconds for game logic
3. **Clear Ownership**: GameTimer owns time tracking, GameManager distributes updates
4. **Precise Measurement**: Use performance.now() exclusively for all timing
5. **Explicit Scaling**: Time scale applied at a single point

## Architecture Components

### 1. GameTimer Class (core/GameTimer.ts)
- Single authoritative source of game time
- Tracks real time using performance.now()
- Maintains game time with scaling
- Provides pause/resume functionality
- Encapsulates all time calculations

### 2. GameLoop Class (core/GameLoop.ts)
- Animation frame driver
- Fixed timestep loop implementation
- Calls GameTimer.update() on each frame
- Dispatches time updates to handlers
- No direct time calculations

### 3. GameManager Class (core/GameManager.ts)
- Coordinates all game systems
- Gets time from GameTimer
- Distributes time updates to systems
- Updates Redux store with game time
- Centralizes offline time handling

### 4. Time Redux Store (state/gameSlice.ts)
- Stores totalPlayTime (game time in seconds)
- Stores lastSaveTime (real time in milliseconds)
- Maintains gameTimeScale setting
- No time calculations, just storage

## Time Flow

1. requestAnimationFrame → GameLoop.gameLoop()
2. GameLoop.gameLoop() → GameTimer.update()
3. GameTimer.update() → calculates elapsed time and scaled time
4. GameLoop.processFixedUpdate() → GameManager.update(deltaTime, scaledDeltaTime)
5. GameManager.update() → updates Redux and systems with appropriate time

## API Design

### GameTimer API

```typescript
class GameTimer {
  // Core time tracking
  update(): void
  reset(): void
  
  // Time accessors
  getElapsedRealTime(): number    // seconds since last update (unscaled)
  getElapsedGameTime(): number    // seconds since last update (scaled)
  getTotalGameTime(): number      // total game time in seconds
  
  // Time control
  setTimeScale(scale: number): void
  getTimeScale(): number
  pause(): void
  resume(): void
  isPaused(): boolean
}
```

### GameLoop API

```typescript
class GameLoop {
  // Core loop control
  start(): void
  stop(): void
  isRunning(): boolean
  
  // Handler registration
  registerHandler(handler: TickHandler): () => void
  unregisterHandler(handler: TickHandler): void
  
  // Configuration
  setTickRate(tickRate: number): void
  getStats(): GameLoopStats
}

// Handler receives both unscaled and scaled time
type TickHandler = (
  deltaTime: number,       // Unscaled time in seconds
  scaledDeltaTime: number  // Scaled time in seconds
) => void;
```

### GameManager API

```typescript
class GameManager {
  // Core game control
  initialize(): void
  start(): void
  stop(skipSaveTimeUpdate?: boolean): void
  
  // Time-related methods
  updateLastSaveTime(): void
  processOfflineProgress(): void
}
```

## Implementation Strategy

1. Update GameTimer to be the single source of time
2. Modify GameLoop to use GameTimer for all time calculations
3. Update GameManager to receive and distribute scaled time
4. Ensure ResourceManager and other systems use correct time values
5. Disable all alternative time update paths
6. Update debug components to measure time correctly