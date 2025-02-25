# Testing Standards

This document defines the standards for all testing in the Anti-Capitalist Idle Game project.

## Testing Levels

- **Unit Tests**: Testing individual functions and methods
- **Component Tests**: Testing React components
- **Integration Tests**: Testing interactions between systems
- **End-to-End Tests**: Testing complete user workflows

## Test File Organization

- **Unit Tests**: Located alongside source files with `.test.ts` suffix
- **Component Tests**: Located alongside components with `.test.tsx` suffix
- **Integration Tests**: Located in dedicated integration test files with `.integration.test.ts` suffix
- **End-to-End Tests**: Located in `/e2e` directory

## Test Naming

- **Test Files**: Should be named after the file being tested with `.test.ts` suffix
- **Test Suites**: Describe the component/function being tested (e.g., `describe('EventManager')`)
- **Test Cases**: Should clearly describe the expected behavior (e.g., `it('should trigger an event when conditions are met')`)

## Test Structure

- **Arrange-Act-Assert Pattern**:
  - Arrange: Set up the test conditions
  - Act: Perform the action being tested
  - Assert: Verify the results

## Test Coverage

- Aim for at least 80% code coverage for critical systems
- All new features should include comprehensive tests
- Edge cases should be explicitly tested

## Testing Tools

- **Jest**: Primary testing framework
- **React Testing Library**: For component testing
- **Mock Service Worker**: For API mocking

## Best Practices

1. **Independence**: Tests should be independent of each other
2. **Deterministic**: Tests should produce the same results every time
3. **Focused**: Each test should test one specific behavior
4. **Fast**: Tests should run quickly to enable rapid feedback
5. **Readable**: Tests should be easy to understand
6. **Maintainable**: Tests should be easy to update when code changes

## Test Plan Template

See [Test Plan Template](templates/test-plan-template.md) for the standard test plan format.

## Test Validation

Regular test audits should be conducted to ensure:
- Tests follow the standards in this document
- Test coverage meets or exceeds targets
- Tests are maintainable and reliable

## Continuous Integration

All tests must pass in the CI pipeline before merging code changes.