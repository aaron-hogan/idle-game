# Comprehensive Testing Guide

This document consolidates our testing standards, guidelines, and best practices to ensure a robust and maintainable codebase.

## Testing Philosophy

- **Test-Driven Development**: Write tests before implementing features
- **Early and Often**: Create tests throughout the development process
- **Safety Net**: Tests provide confidence when refactoring and adding features
- **Behavior Over Implementation**: Focus on testing what code does, not how it's implemented
- **Simplicity**: Keep tests simple, focused, and easy to understand

## Test Types and Coverage Requirements

Every feature must have comprehensive test coverage across different levels:

### 1. Unit Tests
- Test individual components, functions, and modules in isolation
- Mock dependencies to focus on the unit being tested
- Run quickly and provide immediate feedback
- Aim for high code coverage (>80%)

### 2. Integration Tests
- Test how components interact with each other
- Verify integration points between systems
- Cover critical workflows spanning multiple units
- Focus on connections between components

### 3. End-to-End Tests
- Validate complete user workflows
- Test the application from a user's perspective
- Cover critical paths through the application
- Ensure all systems work together correctly

## Testing Standards

### Test Structure
1. **Arrangement**: Set up the test conditions
2. **Action**: Perform the action being tested
3. **Assertion**: Verify the expected outcomes

### Naming Conventions
- Use descriptive names that explain what's being tested
- Follow the pattern: `should [expected behavior] when [condition]`
- Example: `should add resources when building completes`

### Test Organization
- Group related tests in describe blocks
- Use nested describes for different scenarios
- Keep test files organized alongside code files

## Testing Best Practices

### General Principles
1. **Test Independence**: Each test should be self-contained
2. **Reset State**: Reset singleton instances between tests
3. **Mock Dependencies**: Use proper dependency injection
4. **Realistic Data**: Use realistic test data when possible
5. **Clear Expectations**: Make assertions specific and clear

### Testing Redux
1. Test action creators to ensure they return correct actions
2. Test reducers to ensure they update state correctly
3. Test selectors to ensure they extract the right data
4. Use mock stores for integration testing

### Testing React Components
1. Focus on component behavior, not implementation details
2. Test user interactions using `fireEvent` or `userEvent`
3. Verify rendered output rather than internal state
4. Use snapshot tests judiciously

### Testing Manager Classes
```typescript
describe('SomeManager', () => {
  let manager: SomeManager;
  let mockStore: any;
  let mockDependency: any;

  beforeEach(() => {
    // Reset any singletons
    resetSingleton(SomeManager);
    
    // Create mocks
    mockDependency = {
      someMethod: jest.fn(),
    };
    
    // Create mock store
    mockStore = mockStore({
      // Initial state
    });
    
    // Initialize manager with dependencies
    manager = SomeManager.getInstance();
    manager.initialize({
      store: mockStore,
      dependency: mockDependency,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should perform expected behavior', () => {
    // Arrange
    const input = 'test';
    
    // Act
    manager.someMethod(input);
    
    // Assert
    expect(mockStore.dispatch).toHaveBeenCalledWith({
      type: 'SOME_ACTION',
      payload: input,
    });
    expect(mockDependency.someMethod).toHaveBeenCalledWith(input);
  });
});
```

## Common Testing Issues and Solutions

### Singleton Testing
- Use a helper function to reset singletons between tests:
```typescript
export function resetSingleton<T>(constructor: new () => T): void {
  const singletonPrototype = constructor.prototype as any;
  if (singletonPrototype._instance) {
    singletonPrototype._instance = null;
  }
}
```

### Async Testing
- Use async/await for clarity:
```typescript
it('should handle async operations', async () => {
  // Arrange
  const result = await someAsyncFunction();
  
  // Assert
  expect(result).toBe(expectedValue);
});
```

### Testing Event Handlers
- Simulate user events to test handlers:
```typescript
it('should handle click events', () => {
  // Arrange
  render(<Button onClick={mockHandleClick} />);
  
  // Act
  fireEvent.click(screen.getByRole('button'));
  
  // Assert
  expect(mockHandleClick).toHaveBeenCalled();
});
```

## Feature-Specific Test Plans

For detailed testing approaches to specific features, refer to the feature test plans:

- [Task System Test Plan](/docs/features/task-system/task-system-test-plan.md) - Testing the task and activities system
- [UI Test Plan](/docs/features/ui-improvements/test-plan.md) - Testing UI components and interactions
- [Progression System Tests](/docs/features/progression-system/test-report.md) - Test results for the progression system

## Tools and Resources

### Testing Libraries
- Jest - Test runner and assertion library
- React Testing Library - Component testing
- jest-redux-thunk - Testing Redux thunks
- MSW (Mock Service Worker) - API mocking

### Useful Testing Commands
```bash
# Run all tests
npm test

# Run tests for a specific file
npm test -- path/to/file.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage
```

## Conclusion

Following these testing standards and practices helps ensure that our codebase remains robust, maintainable, and bug-free. Remember that tests are investments in code quality that pay dividends throughout the project lifecycle.