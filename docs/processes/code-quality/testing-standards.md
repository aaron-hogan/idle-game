# Testing Standards

This document outlines our testing philosophy, approaches, and best practices to ensure a robust and maintainable codebase.

## Testing Philosophy

- Write tests **early and often** during feature development
- Tests are a safety net, not a burden
- Prioritize test quality over quantity
- Test behavior, not implementation details when possible
- Keep tests simple, focused, and easy to understand

## Test Coverage Requirements

Every feature must have comprehensive test coverage across different levels:

1. **Unit Tests**: Verify isolated functionality of components, functions, and modules
2. **Integration Tests**: Ensure features work correctly with their dependencies
3. **End-to-End Tests**: Validate critical user workflows

## Testing Approaches

### Test-Driven Development (TDD)

When possible, follow the TDD approach:
1. Write a failing test that defines the expected behavior
2. Implement the minimum code to pass the test
3. Refactor the code while maintaining passing tests

### Behavior-Driven Testing

Focus on testing behavior rather than implementation details:
- Test what the code does, not how it does it
- Write test descriptions that reflect user requirements
- Use descriptive test names that explain the expected behavior

### Test Categories

#### Unit Tests
- Test individual functions and components in isolation
- Mock dependencies to focus on the unit under test
- Keep tests small and focused on one behavior
- Include edge cases and error conditions

#### Integration Tests
- Test interactions between multiple components or systems
- Verify that integrated parts work together correctly
- Use fewer mocks, test real interactions

#### Component Tests
- Test React components with rendering and interaction
- Verify component behavior with different props
- Test user interactions and state changes

## Test Structure and Naming

### File Organization
- Place test files next to the code they test
- Use `.test.ts` or `.test.tsx` extension for test files
- Group related tests in describe blocks

### Test Naming Conventions
- Use descriptive names that explain the behavior being tested
- Follow a pattern of "it should [expected behavior] when [condition]"
- Group related tests with descriptive describe blocks

Example:
```typescript
describe('ResourceManager', () => {
  describe('calculateResourceGeneration', () => {
    it('should generate resources based on owned structures', () => {
      // Test implementation
    });
    
    it('should apply efficiency multipliers correctly', () => {
      // Test implementation
    });
    
    it('should handle zero structures gracefully', () => {
      // Test implementation
    });
  });
});
```

## Test Best Practices

### General Practices
- Test both happy paths and edge cases
- Test error conditions and error handling
- Keep tests independent of each other
- Avoid test interdependencies
- Maintain a fast test suite

### React Component Testing
- Test rendering with different props
- Test user interactions
- Verify state changes and side effects
- Use data-testid attributes for test selectors
- Mock complex child components when appropriate

### Redux Testing
- Test reducers as pure functions
- Test action creators separately
- Test selectors with different state inputs
- Use a mock store for integration tests

### Asynchronous Code Testing
- Test promise resolutions and rejections
- Verify loading states are handled correctly
- Test error handling for async operations
- Use appropriate async test helpers

## Mocking

### When to Mock
- External services and APIs
- Complex dependencies not under test
- Side effects (network, timers, etc.)
- When testing specific code paths

### Mocking Best Practices
- Keep mocks simple and focused
- Verify mock interactions when relevant
- Reset mocks between tests
- Mock at the appropriate level (function, module, etc.)

Example of good mocking:
```typescript
// Mock external service
jest.mock('../api/gameService');
const mockSaveGame = gameService.saveGame as jest.Mock;

test('should save game state successfully', async () => {
  // Setup
  mockSaveGame.mockResolvedValueOnce({ success: true });
  
  // Execute
  await saveGameState(testState);
  
  // Verify
  expect(mockSaveGame).toHaveBeenCalledWith(testState);
  expect(notificationService.show).toHaveBeenCalledWith('Game saved successfully');
});
```

## Test Maintenance

- Update tests when requirements change
- Refactor tests as code evolves
- Don't leave broken tests unaddressed
- Review test quality during code reviews
- Run tests frequently during development

## Continuous Integration

- Run all tests before submitting PRs
- Maintain a healthy CI pipeline
- Address test failures immediately
- Avoid disabling or skipping tests

By following these testing standards, we build a robust safety net that allows us to make changes confidently while maintaining code quality.