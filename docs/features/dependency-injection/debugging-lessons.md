# Debugging Lessons from Dependency Injection Implementation

## Overview

This document captures key lessons learned while implementing and debugging dependency injection in our game architecture. These insights should help prevent similar issues in future dependency injection implementations and refactoring efforts.

## Key Issues Encountered

### 1. Runtime State Accessibility Issues

**Problem:** Many runtime errors occurred because manager classes attempted to access Redux state properties that didn't exist yet or weren't properly initialized.

**Solution:** Added safety checks before accessing state properties:

```typescript
// Before: Prone to runtime errors
const events = state.events.availableEvents;

// After: Safe access with nullish checks
if (!state.events || !state.events.availableEvents) {
  return [];
}
const events = state.events.availableEvents;
```

**Lesson:** When refactoring code that interacts with external state, always add robust null/undefined checks to prevent runtime errors, especially during initialization phases.

### 2. Inconsistent Variable Naming

**Problem:** Variable naming inconsistencies (`structuresActions` vs `structureActions`) led to reference errors at runtime despite code compiling successfully.

**Solution:** Standardized naming across the codebase and fixed all references.

**Lesson:** Maintain consistent naming conventions across the codebase, especially for dependencies that are used across multiple files.

### 3. Initialization Order Dependency

**Problem:** Some managers relied on other managers or state structures being initialized first, which wasn't guaranteed after refactoring.

**Solution:** Added explicit initialization steps and state structure initialization:

```typescript
// Ensure state structure exists before operations
store.dispatch({ type: 'events/init' });
```

**Lesson:** When systems depend on each other, make the initialization order explicit and add checks to ensure prerequisites are met before proceeding.

### 4. Backward Compatibility Challenges

**Problem:** Maintaining backward compatibility while introducing dependency injection created complex initialization paths that were difficult to debug.

**Solution:** Created hybrid approaches that could detect and adapt to different initialization methods:

```typescript
if (!dependenciesOrStore) {
  // Create empty instance
} else if ('dispatch' in dependenciesOrStore && 'getState' in dependenciesOrStore) {
  // New DI pattern
} else {
  // Legacy initialization with store
}
```

**Lesson:** When maintaining backward compatibility, create explicit type guards and conditional logic to clearly handle different initialization scenarios.

### 5. Missing Type Safety in Tests

**Problem:** Tests were initially broken by the refactoring because they expected direct store access and weren't properly type-checked.

**Solution:** Created a separate branch for updating tests to use proper dependency injection.

**Lesson:** Tests should check both functionality and proper dependency usage. When refactoring, update tests alongside the implementation rather than after.

## Best Practices for Future Dependency Injection

1. **Add Robust State Checks**: Always verify state properties exist before accessing them.

2. **Initialize State Structures Early**: Ensure required state structures are initialized before any manager attempts to use them.

3. **Use Type Guards**: Create explicit type guards for checking dependency shapes and types.

4. **Standardize Naming**: Use consistent naming patterns for dependencies across all files.

5. **Create Interface-First Dependencies**: Define dependency interfaces before implementation to enforce consistent contracts.

6. **Test Both Happy and Error Paths**: Create tests that verify both successful operations and proper error handling.

7. **Explicit Initialization Order**: Document and enforce any required initialization order between managers.

8. **Incremental Migration**: When refactoring, migrate one manager at a time and verify each step before proceeding.

## Implementation Checklist

When implementing dependency injection for new managers or refactoring existing ones:

- [ ] Define explicit dependency interface with required methods and properties
- [ ] Add null/undefined checks for all state and dependency access
- [ ] Verify state structures exist before first access
- [ ] Test both direct initialization and backward compatibility paths
- [ ] Update tests to use the new dependency pattern
- [ ] Use type imports rather than value imports where possible
- [ ] Verify operation in the complete application context, not just in isolation

## Conclusion

Dependency injection provides significant benefits for testability, maintainability, and code clarity, but requires careful implementation to avoid runtime errors. By following these lessons and best practices, we can minimize debugging time and create more robust systems.