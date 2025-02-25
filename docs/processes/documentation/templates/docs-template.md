# Feature Documentation Template

This template provides a standardized structure for documenting new features in our anti-capitalist idle game. Use this template when starting work on a new feature to ensure consistent documentation.

## Documentation Validation

**IMPORTANT**: After creating or updating any documentation, always validate it using our documentation validation script:

```bash
cd docs
./project/validation/validate-docs.sh
```

The script will check that your documentation:
- Is in the correct location
- Follows proper naming conventions
- Contains all required files
- Includes necessary sections in each file

See `/docs/project/validation/README.md` for more details on documentation validation.

## Feature Plan Structure

The plan document should include two key sections:
1. A general plan outlining the feature's goals and approach
2. The specific implementation prompt that will be used to create the feature

### Plan Section

First, outline the general plan:

```markdown
# Anti-Capitalist Idle Game: [Feature Name] Plan

## Overview
[2-3 sentence description of the feature and its purpose]

## Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Approach
[Brief description of implementation approach]

## Timeline
- [Major task 1]: [estimated time]
- [Major task 2]: [estimated time]
- [Major task 3]: [estimated time]

## Future Enhancements
- [Potential enhancement 1]
- [Potential enhancement 2]
```

### Implementation Prompt

Then, include the specific prompt to generate the implementation:

```markdown
## Implementation Prompt

```markdown
# Anti-Capitalist Idle Game: [Feature Name] Implementation

Let's implement a [brief feature description] for our anti-capitalist idle game, following our defensive programming patterns and singleton architecture.

1. Create the [Feature] data models first:
   - [Interface/Class 1] with proper typing [describe properties]
   - [Interface/Class 2] with proper typing [describe properties]
   - [Enum] for different types of [feature elements]
   - [Additional interfaces/types needed]

2. Implement a [Feature]Manager service as a singleton that:
   - [Core responsibility 1] with proper validation
   - [Core responsibility 2] with error handling
   - [Core responsibility 3] with defensive programming
   - Uses factory methods for creating [feature] instances
   - Implements self-healing for inconsistent states
   - Coordinates with [related managers] for integration
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for [feature] with:
   - Properly typed state structure
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived data

4. Implement [feature] action creators with proper type safety:
   - [Action 1] with validation
   - [Action 2] with error handling
   - [Action 3] with state verification

5. Define initial [feature elements] with proper structure:
   - [Element 1] with [properties]
   - [Element 2] with [properties]
   - [Element 3] with [properties]

6. Create UI components for [feature] with error boundaries:
   - [Component 1] with proper null/undefined handling
   - [Component 2] with defensive rendering
   - [Component 3] with state validation

7. Integrate with game systems using defensive patterns:
   - Connection to [System 1] with error handling
   - Connection to [System 2] with validation
   - Handle edge cases like [specific edge case 1] or [specific edge case 2]

8. Write comprehensive tests for:
   - [Feature] singleton initialization
   - Core functionality including edge cases
   - Component rendering with validation
   - Integration with other systems
   - Type safety and null handling
```
```

## Standard Documentation Structure

For the main feature documentation file (`feature-name.md`), use this structure:

```markdown
# [Feature Name]

## Overview
[Brief description of what this feature does and its purpose in the game]

## Core Components

### Data Models
[Description of key interfaces, types, and enums]

### State Management
[Description of Redux state structure and key actions]

### Components
[Description of UI components and their responsibilities]

### Services
[Description of any manager services and their responsibilities]

## Usage Guide

### [Main Usage Example]
```typescript
// Include code example of typical usage
```

### [Additional Usage Example]
```typescript
// Include code example of another common use case
```

## Integration
[Description of how this feature integrates with other game systems]

## Best Practices
[List of recommendations for working with this feature]
```

## Summary Structure

For the summary file (`summary.md`), use this structure:

```markdown
# [Feature Name] Summary

## What We've Implemented
1. **[Component Category 1]**
   - [Implementation detail 1]
   - [Implementation detail 2]

2. **[Component Category 2]**
   - [Implementation detail 1]
   - [Implementation detail 2]

## Benefits Added
1. **[Benefit Category 1]**
   - [Specific benefit 1]
   - [Specific benefit 2]

2. **[Benefit Category 2]**
   - [Specific benefit 1]
   - [Specific benefit 2]

## Challenges Overcome
- [Challenge 1 and solution]
- [Challenge 2 and solution]

## Next Steps and Future Enhancements
1. **[Enhancement Category 1]**
   - [Specific enhancement 1]
   - [Specific enhancement 2]

2. **[Enhancement Category 2]**
   - [Specific enhancement 1]
   - [Specific enhancement 2]
```

## Todo List Structure

For the todo file (`todo.md`), use this structure:

```markdown
# [Feature Name] Todo List

## Core Implementation
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

## Testing and Fixes
- [ ] [Testing task 1]
- [ ] [Testing task 2]
- [ ] [Fix 1]

## Refinements
- [ ] [Refinement 1]
- [ ] [Refinement 2]

## Content
- [ ] [Content item 1]
- [ ] [Content item 2]

## System Extensions
- [ ] [Extension 1]
- [ ] [Extension 2]
```