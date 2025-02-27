# Testing Documentation

This directory contains documentation related to testing strategies, results, and guidelines for the codebase.

## Directories

- [Results](results/) - Test result reports and summaries

## Testing Framework

Our project uses Jest for unit and integration testing, with React Testing Library for component tests. The testing setup includes:

- Unit tests for utility functions and core logic
- Component tests for React components
- Integration tests for feature workflows
- End-to-end tests for critical user journeys

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run specific tests
npm test -- -t "component name"
```

## Test Organization

- Unit tests are located alongside the implementation files they test
- Integration tests are in `src/integration/` or `*.integration.test.tsx` files
- Test utilities are in `src/utils/test-utils.tsx` and similar files

## Best Practices

1. Write tests before implementing features (TDD)
2. Ensure adequate coverage of critical paths
3. Use descriptive test names
4. Mock external dependencies
5. Test both happy paths and edge cases
6. Verify that tests actually fail when they should

For detailed testing standards, see the [Testing Standards](/docs/processes/code-quality/testing-standards.md) document.
