# Architecture Guidelines

This document outlines the architectural principles and patterns used in our application to ensure a consistent, maintainable, and scalable codebase.

## Core Architectural Principles

- **Component-based architecture** with clear separation of concerns
- **Data-driven design** for game entities and events
- **Modular codebase** to allow easy addition of new content
- **Observer pattern** for event handling and UI updates

## Application Structure

```
src/
├── components/       # React UI components
├── state/            # Redux state management
│   ├── slices/       # Redux Toolkit slices
│   └── selectors/    # State selectors
├── core/             # Core game mechanics
├── systems/          # Game systems (resources, progression, etc.)
├── managers/         # Feature managers
├── utils/            # Utility functions
└── types/            # TypeScript type definitions
```

## Component Architecture

### Component Hierarchy

- **Page Components**: Top-level components that represent entire screens
- **Container Components**: Connect to Redux state and handle logic
- **Presentational Components**: Focus on rendering UI based on props
- **Common Components**: Reusable UI elements used across the application

### Component Responsibilities

- Components should have a single responsibility
- Keep components small and focused
- Extract complex logic to custom hooks
- Separate UI rendering from business logic

## State Management

### Redux Architecture

- Use Redux Toolkit for state management
- Organize state by feature in separate slices
- Use selectors to access state
- Dispatch actions to modify state
- Keep Redux store normalized

### State Organization

```typescript
// State structure
interface RootState {
  resources: ResourcesState;
  structures: StructuresState; 
  game: GameState;
  tasks: TasksState;
  events: EventsState;
  progression: ProgressionState;
}
```

### State Access Patterns

- Use selectors to access state: `useSelector(selectResources)`
- Use memoized selectors for derived data
- Keep components decoupled from state structure

## Data Flow

### One-way Data Flow

1. User interacts with UI components
2. UI components dispatch actions
3. Reducers update state based on actions
4. Components re-render with new state

### Event System

- Use observer pattern for game events
- Decouple event publishers from subscribers
- Enable cross-component communication

## Game Systems Architecture

### Resource System

- Resources have types, amounts, and production rates
- Resource production is handled by a central manager
- Resources can be consumed by structures and actions

### Progression System

- Track player progress through stages and milestones
- Unlockable content based on progression
- Achievement system for recognizing player accomplishments

## Code Organization Principles

### Feature Folders

Group code by feature, with each feature folder containing:
- Components
- Hooks
- State management
- Utilities
- Tests

### Module Boundaries

- Clear interfaces between modules
- Dependencies flow from high-level modules to low-level modules
- Avoid circular dependencies

## Performance Considerations

- Use memoization for expensive calculations
- Implement virtualization for long lists
- Optimize renders using React.memo and useCallback
- Control side effects with useEffect dependencies

## Testing Strategy

- Unit test pure functions extensively
- Test components with React Testing Library
- Use integration tests for feature interactions
- Mock external services and complex dependencies

## Related Documentation

- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md)
- [Testing Standards](/docs/processes/code-quality/testing-standards.md)
- [Component Development Guide](/docs/processes/code-quality/component-development.md)

By following these architecture guidelines, we ensure a consistent approach to building and maintaining our application, making it easier to extend, modify, and understand.