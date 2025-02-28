# Test Guidelines

This document provides guidelines for writing effective tests in the Anti-Capitalist Idle Game project.

## General Principles

1. **Test Independence**: Each test should be independent and not rely on the state created by other tests.
2. **Reset State**: Always reset singleton instances between tests using the `resetSingleton` utility.
3. **Mock Dependencies**: Use proper dependency injection and mock dependencies to isolate the unit being tested.
4. **Comprehensive Coverage**: Aim for high test coverage, but focus on testing behaviors, not implementation details.
5. **Clear Naming**: Use descriptive test names that explain what is being tested and the expected outcome.

## Testing Managers

When testing manager classes, follow these principles:

```typescript
describe('SomeManager', () => {
  let manager: SomeManager;
  let store: any;
  
  beforeEach(() => {
    // Reset singleton instance
    resetSingleton(SomeManager);
    
    // Create a fresh store
    store = createTestStore();
    
    // Get the singleton instance
    manager = SomeManager.getInstance();
    
    // Initialize with our test store
    manager.initialize(store);
  });
  
  afterEach(() => {
    // Clean up if needed
  });
  
  it('should perform expected action', () => {
    // Arrange
    
    // Act
    
    // Assert
  });
});
```

## Testing Redux Components

1. **Use Mock Store**: Create a mock store with the necessary initial state.
2. **Test Action Creators**: Test that action creators generate the correct actions.
3. **Test Reducers**: Test that reducers correctly transform state given an action.
4. **Test Selectors**: Test that selectors extract the correct data from state.

## Testing React Components

1. **Render Testing**: Test that components render correctly with given props.
2. **User Interaction**: Test that components respond correctly to user interaction using events.
3. **State Updates**: Test that component state updates correctly.
4. **Mock Context/Redux**: Always mock context or Redux providers to isolate component tests.

## Example: Mocking Event State

When testing components that depend on event state:

```typescript
// Create a test store with mock events state
const store = configureStore({
  reducer: {
    events: eventsReducer,
    // other reducers...
  },
  preloadedState: {
    events: {
      activeEvents: [],
      eventHistory: [],
      availableEvents: {}
    }
  }
});
```

## Test Cleanup

Remember to clean up any allocated resources or global state changes after tests:

1. Reset singleton instances
2. Restore mocks
3. Clear timers
4. Unmount components

Following these guidelines will help maintain a robust and reliable test suite.
