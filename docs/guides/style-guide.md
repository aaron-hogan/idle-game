# Style Guide

This document outlines the coding style and best practices for the Anti-Capitalist Idle Game project.

## TypeScript

### Types and Interfaces

- Always use proper TypeScript typing
- Prefer interfaces for data structures
- Use type aliases for complex types or unions
- Export all types and interfaces that are used outside the file

```typescript
// Good
interface Resource {
  id: string;
  name: string;
  amount: number;
  max: number;
  rate: number;
}

// Good
type ResourceID = string;
type ResourceMap = Record<ResourceID, Resource>;

// Bad - missing types
interface Building {
  id;
  name;
  cost;
  production;
}
```

### Enums

- Use enums for fixed sets of values
- Use PascalCase for enum names
- Use UPPER_CASE for enum values

```typescript
// Good
enum ResourceType {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  SPECIAL = 'SPECIAL'
}

// Bad - inconsistent case
enum resourceType {
  basic = 'basic',
  Advanced = 'Advanced',
  SPECIAL = 'SPECIAL'
}
```

### Functions

- Use explicit return types for functions
- Use arrow functions for inline functions
- Use function declarations for top-level functions
- Use proper parameter typing

```typescript
// Good
function calculateResourceProduction(
  building: Building,
  efficiency: number
): ResourceMap {
  // Implementation
  return resources;
}

// Good for inline functions
const getResourceRate = (resource: Resource): number => resource.rate;

// Bad - missing return type
function updateResources(resources, production) {
  // Implementation
}
```

## React Components

### Component Structure

- Use functional components with hooks
- Use PascalCase for component names
- Place each component in its own file

```typescript
// Good
import React from 'react';
import { useSelector } from 'react-redux';
import { selectResources } from '../store/resourcesSlice';

interface ResourceDisplayProps {
  resourceId: string;
}

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resourceId }) => {
  const resources = useSelector(selectResources);
  const resource = resources[resourceId];

  return (
    <div className="resource-display">
      <h3>{resource.name}</h3>
      <p>{resource.amount} / {resource.max}</p>
    </div>
  );
};

// Bad - class component, no props interface
class ResourceDisplay extends React.Component {
  render() {
    const { resourceId } = this.props;
    // Implementation
  }
}
```

### Hooks

- Follow the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- Use the appropriate hook for the task
- Use custom hooks to encapsulate complex logic

```typescript
// Good
const useResourceRate = (resourceId: string): number => {
  const resources = useSelector(selectResources);
  const buildings = useSelector(selectBuildings);
  
  return useMemo(() => {
    // Calculate resource rate
    return rate;
  }, [resources, buildings, resourceId]);
};

// Bad - doesn't follow rules of hooks
function calculateResourceRate(resourceId) {
  const resources = useSelector(selectResources);
  if (resources[resourceId]) {
    // Conditional hook usage - this is not allowed
    const buildings = useSelector(selectBuildings);
  }
  return resources[resourceId]?.rate || 0;
}
```

## Redux

### State Structure

- Use proper typing for state
- Use normalized state where appropriate
- Keep state as flat as possible

```typescript
// Good
interface ResourcesState {
  byId: Record<string, Resource>;
  allIds: string[];
  loading: boolean;
  error: string | null;
}

// Bad - nested state
interface StateWithNesting {
  resources: {
    byType: {
      BASIC: {
        items: Resource[]
      },
      ADVANCED: {
        items: Resource[]
      }
    }
  }
}
```

### Actions and Reducers

- Use Redux Toolkit for creating slices
- Use proper typing for actions
- Use descriptive action names

```typescript
// Good
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action: PayloadAction<Resource>) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
    },
    updateResourceAmount: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      if (state.byId[id]) {
        state.byId[id].amount = amount;
      }
    }
  }
});

// Bad - no typing, inconsistent naming
const resourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NEW_RESOURCE':
      // Implementation
    case 'RESOURCE_AMOUNT_UPDATE':
      // Implementation
    default:
      return state;
  }
};
```

### Selectors

- Use memoized selectors with `createSelector`
- Use proper typing for selectors
- Use descriptive selector names

```typescript
// Good
import { createSelector } from '@reduxjs/toolkit';

export const selectResources = (state: RootState) => state.resources.byId;

export const selectResourceIds = (state: RootState) => state.resources.allIds;

export const selectResourcesByType = createSelector(
  [selectResources, selectResourceIds, (_, type: ResourceType) => type],
  (resources, ids, type) => ids
    .map(id => resources[id])
    .filter(resource => resource.type === type)
);

// Bad - no memoization, inconsistent naming
const getResources = (state) => state.resources.byId;
const getAllResourceIds = (state) => state.resources.allIds;
```

## File Organization

### Directory Structure

- Group related files together
- Use lowercase for directory names
- Use kebab-case for multi-word directory names

```
src/
  components/
    resource-display/
      ResourceDisplay.tsx
      ResourceDisplay.test.tsx
      styles.css
    building-list/
      BuildingList.tsx
      BuildingItem.tsx
      BuildingList.test.tsx
      styles.css
  managers/
    ResourceManager.ts
    BuildingManager.ts
    GameManager.ts
  models/
    resources.ts
    buildings.ts
    events.ts
  store/
    resourcesSlice.ts
    buildingsSlice.ts
    eventsSlice.ts
    index.ts
  utils/
    calculations.ts
    formatting.ts
    time.ts
```

### Import Order

- Group imports in the following order:
  1. React and React-related imports
  2. Third-party libraries
  3. Local modules
  4. CSS/SCSS imports
- Separate each group with a blank line

```typescript
// Good
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { format } from 'date-fns';
import classNames from 'classnames';

import { Resource } from '../models/resources';
import { selectResources } from '../store/resourcesSlice';
import { formatNumber } from '../utils/formatting';

import './styles.css';

// Bad - mixed order, no separation
import { formatNumber } from '../utils/formatting';
import React, { useState } from 'react';
import './styles.css';
import { Resource } from '../models/resources';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
```

## Comments and Documentation

### Code Comments

- Use JSDoc comments for functions and classes
- Use inline comments for complex logic
- Avoid commented-out code

```typescript
/**
 * Calculates the production rate for a resource based on buildings
 * @param resource The resource to calculate production for
 * @param buildings The list of buildings that produce the resource
 * @param efficiency The global efficiency modifier
 * @returns The production rate in units per second
 */
function calculateProductionRate(
  resource: Resource,
  buildings: Building[],
  efficiency: number
): number {
  // Implementation
  return rate;
}

// Bad - minimal or no documentation
function calcRate(r, b, e) {
  // Calculate rate
  return rate;
}
```

### TODO Comments

- Use TODO comments for future work
- Include a brief description of what needs to be done
- Include GitHub issue number if applicable

```typescript
// TODO: Implement resource decay over time (#123)

// TODO: Optimize building production calculation for large numbers of buildings
```

## Error Handling

### Defensive Programming

- Always validate inputs
- Use try/catch blocks for error-prone operations
- Provide meaningful error messages

```typescript
// Good
function getResourceById(id: string): Resource {
  if (!id) {
    throw new Error('Resource ID is required');
  }
  
  const resource = resources[id];
  if (!resource) {
    throw new Error(`Resource with ID ${id} not found`);
  }
  
  return resource;
}

// Bad - no validation
function getResource(id) {
  return resources[id];
}
```

### Error Boundaries

- Use React error boundaries to catch component errors
- Provide fallback UIs for error states

```typescript
// Good
import React, { ErrorInfo } from 'react';

class GameErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, {
  hasError: boolean;
  error?: Error;
}> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-display">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance

### Memoization

- Use React.memo for expensive components
- Use useMemo for expensive calculations
- Use useCallback for functions passed to child components

```typescript
// Good
const MemoizedResourceList = React.memo(({ resources }) => {
  return (
    <div className="resource-list">
      {resources.map(resource => (
        <ResourceDisplay key={resource.id} resource={resource} />
      ))}
    </div>
  );
});

// Good
const ResourceRateDisplay = ({ resourceId }) => {
  const resource = useSelector(state => state.resources.byId[resourceId]);
  const buildings = useSelector(state => state.buildings.byId);
  
  const rate = useMemo(() => {
    return calculateResourceRate(resource, buildings);
  }, [resource, buildings]);
  
  return <div>{rate} per second</div>;
};

// Good
const BuildingList = ({ buildings }) => {
  const dispatch = useDispatch();
  
  const handleBuildingClick = useCallback((buildingId) => {
    dispatch(selectBuilding(buildingId));
  }, [dispatch]);
  
  return (
    <div>
      {buildings.map(building => (
        <BuildingItem
          key={building.id}
          building={building}
          onClick={handleBuildingClick}
        />
      ))}
    </div>
  );
};
```

### Rendering Optimization

- Avoid unnecessary re-renders
- Use React DevTools to identify performance issues
- Be mindful of render-blocking operations

```typescript
// Good - uses shouldComponentUpdate or React.memo
const ResourceCounter = React.memo(({ value }) => {
  return <div>{value}</div>;
});

// Bad - causes unnecessary re-renders
const ResourceCounter = ({ value, ...otherProps }) => {
  return <div>{value}</div>;
};
```

## Testing

### Unit Tests

- Write tests for all public functions
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

```typescript
// Good
describe('calculateResourceProduction', () => {
  it('should return correct production for a basic resource', () => {
    // Arrange
    const resource = { id: 'food', rate: 1 };
    const efficiency = 1.5;
    
    // Act
    const result = calculateResourceProduction(resource, efficiency);
    
    // Assert
    expect(result).toBe(1.5);
  });
  
  it('should return zero for a resource with negative efficiency', () => {
    // Arrange
    const resource = { id: 'food', rate: 1 };
    const efficiency = -0.5;
    
    // Act
    const result = calculateResourceProduction(resource, efficiency);
    
    // Assert
    expect(result).toBe(0);
  });
});

// Bad - unclear test, no structure
test('production calculation', () => {
  expect(calculateResourceProduction({ id: 'food', rate: 1 }, 1.5)).toBe(1.5);
  expect(calculateResourceProduction({ id: 'food', rate: 1 }, -0.5)).toBe(0);
});
```

### Component Tests

- Test component rendering and interactions
- Use React Testing Library
- Focus on user behavior, not implementation details

```typescript
// Good
import { render, screen, fireEvent } from '@testing-library/react';

describe('ResourceDisplay', () => {
  it('should render resource name and amount', () => {
    const resource = { id: 'food', name: 'Food', amount: 100, max: 200 };
    
    render(<ResourceDisplay resource={resource} />);
    
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('100 / 200')).toBeInTheDocument();
  });
  
  it('should show progress bar with correct percentage', () => {
    const resource = { id: 'food', name: 'Food', amount: 50, max: 100 };
    
    render(<ResourceDisplay resource={resource} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });
});

// Bad - testing implementation details
test('ResourceDisplay', () => {
  const wrapper = shallow(<ResourceDisplay resource={{ id: 'food', name: 'Food' }} />);
  expect(wrapper.find('.resource-name').text()).toBe('Food');
});
```

## Additional Best Practices

### Immutability

- Treat state as immutable
- Use spread operators or libraries like Immer for state updates
- Avoid direct mutations of objects or arrays

```typescript
// Good
const updateResource = (resource, amount) => {
  return {
    ...resource,
    amount: resource.amount + amount
  };
};

// Good (with Immer via Redux Toolkit)
const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    updateResourceAmount: (state, action) => {
      const { id, amount } = action.payload;
      state.byId[id].amount += amount; // This is OK because Immer is used
    }
  }
});

// Bad - mutating directly
const updateResource = (resource, amount) => {
  resource.amount += amount; // Mutation!
  return resource;
};
```

### Naming Conventions

- Use descriptive, meaningful names
- Be consistent with naming patterns
- Avoid abbreviations unless they are widely understood

```typescript
// Good
const calculateTotalResourceProduction = (buildings, efficiency) => {
  // Implementation
};

// Bad - unclear abbreviations, inconsistent casing
const calcTotResProd = (bldgs, eff) => {
  // Implementation
};
```