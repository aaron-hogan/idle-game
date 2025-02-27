# Project Structure Reorganization Plan

## Current Issues

Based on analysis of the current codebase structure, we've identified several key issues:

1. **Redundant State Management**
   - Duplicate functionality in `/src/redux` and `/src/state`
   - Inconsistent selector patterns and usage across components
   - Overlapping responsibilities without clear boundaries

2. **Inconsistent Component Organization**
   - Common UI components spread across multiple directories
   - No clear distinction between feature components and UI components
   - Duplicate implementations of common patterns

3. **Game Engine Fragmentation**
   - Multiple game loop implementations across different directories
   - Unclear boundaries between `systems/`, `managers/`, and `core/`
   - Legacy implementations not properly deprecated

4. **Inconsistent Type Management**
   - Types spread across `/interfaces`, `/types`, and `/models`
   - Inconsistent naming patterns (e.g., `IResource` vs `Resource` vs `ResourceType`)
   - Circular dependencies causing compilation issues

5. **Scattered Testing Approach**
   - Tests located in root `tests/`, component-specific `__tests__/`, and alongside implementation
   - Integration tests mixed with unit tests
   - No clear pattern for mocking dependencies

## Proposed New Structure

### State Management

```
/src/state/
  - store.ts (main Redux store configuration)
  - slices/  (all Redux slices)
    - resourceSlice.ts
    - gameSlice.ts
    - etc.
  - selectors/ (memoized selectors)
    - resourceSelectors.ts
    - gameSelectors.ts
    - etc.
  - actions/ (action creators)
  - middleware/ (Redux middleware)
  - hooks/ (custom hooks for state access)
    - useResources.ts
    - useGameState.ts
    - etc.
```

### Component Organization

```
/src/components/
  - ui/ (reusable UI components)
    - Button/
    - Card/
    - Modal/
    - etc.
  - features/ (domain-specific components)
    - resources/
    - buildings/
    - tasks/
    - etc.
  - layout/ (structural components)
    - Header/
    - Footer/
    - Sidebar/
    - etc.
  - pages/ (page-level components)
    - MainGame/
    - Settings/
    - etc.
```

### Game Engine

```
/src/core/
  - engine/ (core game loop and timing)
    - GameLoop.ts
    - Timer.ts
    - etc.
  - systems/ (game systems)
    - ResourceSystem.ts
    - ProgressionSystem.ts
    - etc.
  - managers/ (high-level coordinators)
    - GameManager.ts
    - EventManager.ts
    - etc.
```

### Type Definitions

```
/src/types/
  - resources.ts
  - buildings.ts
  - events.ts
  - etc.
```

### Testing Structure

```
/src/
  - components/Component.tsx
  - components/Component.test.tsx (unit tests alongside implementation)
  - __tests__/
    - integration/ (integration tests)
    - e2e/ (end-to-end tests)
    - mocks/ (shared test mocks)
```

## Migration Plan

To implement this structure, we'll take a phased approach:

### Phase 1: Documentation and Planning
- Create detailed architecture documentation
- Map current files to their new locations
- Identify critical dependencies and potential conflicts

### Phase 2: State Management Consolidation
- Move all Redux slices to `/src/state/slices`
- Implement consistent selector pattern
- Create type-safe hooks for component use

### Phase 3: Core Engine Reorganization
- Consolidate game loop implementations
- Define clear boundaries between systems and managers
- Remove legacy implementations

### Phase 4: Component Restructuring
- Organize components by domain and responsibility
- Extract common UI components to dedicated directory
- Ensure proper testing for all component moves

### Phase 5: Type Consolidation
- Move types to a consolidated structure
- Resolve circular dependencies
- Implement consistent naming patterns

### Phase 6: Update Import Paths
- Update all import paths to match new structure
- Fix any broken dependencies
- Run extensive tests to ensure functionality

## Best Practices Moving Forward

1. **File Organization**
   - Place tests alongside implementation
   - Group related files in folders
   - Use index.ts files for clean exports

2. **Component Structure**
   - Separate container and presentational components
   - Compose complex components from simpler ones
   - Use hooks for state and effects management

3. **State Management**
   - Use selector hooks for accessing state
   - Implement proper memoization for all selectors
   - Keep Redux actions small and focused

4. **Type Safety**
   - Define clear interfaces for all major concepts
   - Use TypeScript's utility types to reduce duplication
   - Avoid using `any` or excessive type assertions

5. **Testing**
   - Write unit tests for individual components and functions
   - Use integration tests for feature verification
   - Mock dependencies appropriately for isolation

## Expected Benefits

1. **Improved Developer Experience**
   - Easier to find related code
   - More intuitive structure for new team members
   - Better code completion and navigation

2. **Better Performance**
   - Reduced bundle size through better code organization
   - Improved state access patterns
   - More efficient component rendering

3. **Enhanced Maintainability**
   - Clear boundaries between systems
   - More consistent patterns across the codebase
   - Easier to understand component relationships

4. **Easier Extensions**
   - Well-defined extension points for new features
   - Clear patterns to follow for new code
   - Better isolation of concerns