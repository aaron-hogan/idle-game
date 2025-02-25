# Timer Isolation Strategy

This document outlines how we'll isolate the timer system from game systems to ensure clear boundaries, single responsibility, and eliminate time-related bugs.

## Isolation Principles

1. **Single Source of Truth**: GameTimer is the only authoritative time source
2. **Clear Boundaries**: Well-defined interfaces between timer and game systems
3. **Dependency Inversion**: Systems depend on time interfaces, not implementations
4. **Centralized Distribution**: GameManager controls all time propagation
5. **Time Immutability**: Systems receive time values but cannot modify them

## Component Isolation

### GameTimer Isolation
- Internal state completely encapsulated
- Public API exposes only necessary time information
- No direct exposure of internal timestamps
- No direct dependencies on game systems

### GameLoop Isolation
- Depends only on GameTimer for time calculations
- Handlers receive time but cannot affect time tracking
- No direct knowledge of game systems
- No Redux or state dependencies

### GameManager Timer Isolation
- Only component that directly interacts with both GameTimer and game systems
- Acts as adapter/facade between timer and game systems
- Ensures all systems receive consistent time values
- Centralizes time scale application

## Interface-Based Design

```typescript
// Time provider interface
interface ITimeProvider {
  getElapsedTime(): number;       // Get scaled time since last update
  getRealElapsedTime(): number;   // Get unscaled time since last update
  getTotalTime(): number;         // Get total game time
  getTimeScale(): number;         // Get current time scale
}

// Time consumer interface
interface ITimeConsumer {
  update(deltaTime: number, scaledDeltaTime: number): void;
}
```

## Time Propagation Control

### 1. Time Update Flow
```
GameLoop
  → GameTimer.update()
  → GameManager.update(delta, scaledDelta)
    → dispatch Redux time update
    → update resource system
    → update building system
    → update other systems
```

### 2. Offline Progress Flow
```
GameManager.processOfflineProgress()
  → calculate offline time
  → update systems with offline time
  → update Redux store
```

## Debugging Isolation

Create dedicated time debugging components that:

1. Only observe time values but cannot modify them
2. Provide visibility into time flow without affecting it
3. Allow runtime inspection of time-related values
4. Support detailed time profiling when needed

```typescript
// Time debug interface
interface ITimeDebug {
  getDebugInfo(): {
    realTimeElapsed: number;
    gameTimeElapsed: number;
    timeScale: number;
    totalGameTime: number;
    timeRatio: number;
    frameCount: number;
    tickCount: number;
  };
}
```

## Implementation Strategy

1. Refactor GameTimer to implement ITimeProvider
2. Update GameLoop to use ITimeProvider interface
3. Make GameManager implement both ITimeProvider and ITimeConsumer
4. Update all systems to implement ITimeConsumer
5. Add optional ITimeDebug interface to timer components
6. Create debug panel that connects to ITimeDebug