# Dependency Injection Implementation

## Overview

This document outlines the implementation of dependency injection in the game's manager classes. The goal is to reduce tight coupling between components and improve testability by explicitly injecting dependencies instead of using direct imports of global singletons.

## Why Dependency Injection?

1. **Testability**: Makes unit testing easier as dependencies can be mocked
2. **Decoupling**: Reduces direct imports of singletons and global state
3. **Flexibility**: Allows for different implementations to be swapped out
4. **Visibility**: Makes dependencies explicit rather than hidden in implementation details

## Implemented Classes

We've implemented dependency injection in the following manager classes:

1. `TaskManager`
2. `ProgressionManager`
3. `ResourceManager`
4. `BuildingManager`
5. `EventManager`
6. `SaveManager`
7. `WorkerManager`

## Implementation Approach

We chose a hybrid approach that maintains backward compatibility while introducing proper dependency injection:

1. **Singleton Pattern with Injection**: Classes still use the singleton pattern for global access, but their initialization requires explicit injection of dependencies.

2. **Store as Primary Dependency**: Redux store is the primary dependency that gets injected, providing access to state and dispatch.

3. **Lazy Initialization**: Managers only register with game systems after receiving their dependencies.

## TaskManager Changes

```typescript
// Before
class TaskManager {
  private static instance: TaskManager | null = null;
  
  private constructor() {
    // Initialize and register with GameLoop
  }
  
  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }
  
  public initialize(): boolean {
    // Initialize using direct store import
    store.dispatch(initializeTasks());
    return true;
  }
}

// After
class TaskManager {
  private static instance: TaskManager | null = null;
  private store: Store<RootState> | null = null;
  private dispatch: Dispatch<AnyAction> | null = null;
  private getState: (() => RootState) | null = null;
  
  private constructor() {
    // Defer GameLoop registration until init() is called with store
  }
  
  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }
  
  public initialize(store: Store<RootState>): boolean {
    // Store references to store and its methods
    this.store = store;
    this.dispatch = store.dispatch;
    this.getState = store.getState;
    
    // Register with GameLoop now that we have store access
    this.registerWithGameLoop();
    
    // Initialize using injected store
    this.dispatch(initializeTasks());
    return true;
  }
}
```

## ProgressionManager Changes

Similar changes were made to the ProgressionManager class, following the same pattern.

## Usage in App.tsx

```typescript
// Before
const taskManager = TaskManager.getInstance();
taskManager.initialize();

// After
const taskManager = TaskManager.getInstance();
taskManager.initialize(store);

// Also initializing ProgressionManager with store
const progressionManager = ProgressionManager.getInstance();
progressionManager.initialize(store);
```

## Usage in GameManager.ts

```typescript
// Before
const progressionManager = ProgressionManager.getInstance();
progressionManager.checkAllProgressionItems();

// After
const progressionManager = ProgressionManager.getInstance();
// Ensure progression manager is initialized with store
progressionManager.initialize(this.store);
progressionManager.checkAllProgressionItems();
```

## Future Improvements

1. **Context Provider**: Create a React context to provide manager instances to components
2. **Pure Dependency Injection**: Move away from singleton pattern completely
3. **Factory Functions**: Create factory functions for managers instead of using static getInstance methods
4. **Interface-Based Design**: Define interfaces for managers to allow for easier testing with mock implementations
5. **Dependency Injection Container**: Implement a proper DI container for managing dependencies

## Testing

Managers can now be tested more easily by injecting a mock store:

```typescript
// Example test
const mockStore = createMockStore();
const taskManager = TaskManager.getInstance();
taskManager.initialize(mockStore);

// Now we can verify actions dispatched to the store or test behavior
// with controlled state responses
```

### Testing Considerations

1. **Store Initialization**: Always initialize managers with a mock store in tests
2. **Mock State**: Configure the mock store's getState to return appropriate test data
3. **Action Verification**: Use jest.fn() to mock dispatch and verify actions are correctly dispatched
4. **Reset Between Tests**: Clear manager instances between tests to avoid state leakage
5. **Type Safety**: Ensure mocks implement the same interfaces as production code

Example test setup:

```typescript
// Reset instance before test
// @ts-ignore - accessing private static for testing
TaskManager.instance = null;
const taskManager = TaskManager.getInstance();

// Create mock store
const mockDispatch = jest.fn();
const mockGetState = jest.fn().mockReturnValue({
  // Test state here
});
const mockStore = {
  dispatch: mockDispatch,
  getState: mockGetState
};

// Initialize with mock store
taskManager.initialize(mockStore as any);

// Now run your test
```

### Build Verification

After implementing dependency injection, always verify:

1. Type compatibility with `npm run typecheck`
2. Application builds successfully with `npm run build`
3. Tests pass with correct store initialization

Ensure any errors are addressed, especially type errors in the components you modified. It's acceptable to have type errors in unrelated deprecated files, but your code should be type-safe.