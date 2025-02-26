# Code Style Guide

This document defines the coding standards and conventions for our project.

## Language Standards

- **TypeScript**: Use strict typing and interfaces for all data structures
- **Components**: Functional React components with hooks
- **State Management**: Redux with Redux Toolkit for actions/reducers

## Formatting Conventions

### Imports

Group imports in the following order, separated by a blank line:
1. React and React-related imports
2. Third-party libraries
3. Local imports

```typescript
// React imports
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Third-party libraries
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

// Local imports
import { selectResources } from '../state/selectors';
import ResourceDisplay from './ResourceDisplay';
import '../styles/Component.css';
```

### Naming Conventions

- **Variables/Functions**: camelCase
- **Components/Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **File naming**: 
  - Component files: PascalCase (e.g., `ResourceManager.tsx`)
  - Utility/helper files: camelCase (e.g., `timeUtils.ts`)
  - Test files: match source file name + `.test.ts` (e.g., `ResourceManager.test.tsx`)

### Error Handling

- Use error boundaries for React components
- Use try/catch for async operations
- Always log meaningful error messages
- Never silently swallow errors

```typescript
// Good error handling
try {
  await saveGameData(gameState);
} catch (error) {
  console.error('Failed to save game data:', error);
  notifyUser('Failed to save game. Please try again.');
}
```

## Component Structure

- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use consistent prop naming across similar components
- Include prop type definitions for all components

```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  // Component implementation
};
```

## Best Practices

- Prefer immutable data structures
- Use early returns to reduce nesting
- Keep functions small and focused
- Use descriptive variable and function names
- Add comments for complex logic, not for obvious code
- Consider performance implications for expensive operations
- Use TypeScript's type system to prevent bugs

## Code Review Standards

During code reviews, evaluate code based on these criteria:
- Adherence to this style guide
- Correctness and completeness
- Test coverage
- Performance considerations
- Security implications
- Documentation quality

By following these guidelines, we maintain a consistent, high-quality codebase that is easier to understand, extend, and maintain.