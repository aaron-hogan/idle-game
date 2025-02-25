# Testing Strategies

This document outlines the testing strategies for different aspects of the Anti-Capitalist Idle Game.

## Component Testing

### React Components

1. **Isolated Component Tests**
   - Test components in isolation using mocks for dependencies
   - Focus on rendering, user interaction, and state changes
   - Use React Testing Library's user-event for simulating user interactions

2. **Component Integration Tests**
   - Test components with their child components
   - Use providers for context and state management
   - Verify component interactions work correctly

### Example: Testing a UI Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import EventPanel from './EventPanel';

describe('EventPanel', () => {
  it('should display event details', () => {
    render(
      <Provider store={store}>
        <EventPanel eventId="test-event-1" />
      </Provider>
    );
    
    expect(screen.getByText('Event Title')).toBeInTheDocument();
    expect(screen.getByText('Event Description')).toBeInTheDocument();
  });

  it('should handle user choices', () => {
    render(
      <Provider store={store}>
        <EventPanel eventId="test-event-1" />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Accept'));
    expect(screen.getByText('Event Accepted')).toBeInTheDocument();
  });
});
```

## Service/Manager Testing

### Singleton Services

1. **Instance Management Tests**
   - Verify getInstance() creates and returns singleton instance
   - Test initialization with different configurations

2. **Core Functionality Tests**
   - Test each public method with various inputs
   - Verify error handling and edge cases

### Example: Testing a Manager Service

```typescript
import EventManager from './EventManager';

describe('EventManager', () => {
  beforeEach(() => {
    // Reset the singleton between tests
    EventManager.resetInstance();
  });

  it('should create singleton instance', () => {
    const instance1 = EventManager.getInstance();
    const instance2 = EventManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should trigger events based on conditions', () => {
    const manager = EventManager.getInstance();
    manager.initialize([testEvent1, testEvent2]);
    
    const result = manager.checkAndTriggerEvents();
    expect(result.triggeredEvents).toHaveLength(1);
    expect(result.triggeredEvents[0].id).toBe('test-event-1');
  });
});
```

## State Management Testing

### Redux Testing

1. **Action Creator Tests**
   - Test action creators return the correct action objects
   - Verify payload transformation and validation

2. **Reducer Tests**
   - Test state transitions for each action type
   - Verify initial state is correct
   - Test error handling and edge cases

3. **Selector Tests**
   - Test selectors return the correct derived data
   - Verify memoization works correctly

### Example: Testing Redux State

```typescript
import eventsReducer, { 
  triggerEvent, 
  resolveEvent,
  selectActiveEvents
} from './eventsSlice';

describe('Events Slice', () => {
  it('should handle triggerEvent', () => {
    const initialState = { events: [], activeEvents: [] };
    const newState = eventsReducer(
      initialState, 
      triggerEvent({ id: 'event-1', title: 'Test Event' })
    );
    
    expect(newState.activeEvents).toHaveLength(1);
    expect(newState.activeEvents[0].id).toBe('event-1');
  });
  
  it('should select active events', () => {
    const state = {
      events: {
        events: [],
        activeEvents: [{ id: 'event-1', title: 'Test Event' }]
      }
    };
    
    const result = selectActiveEvents(state);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('event-1');
  });
});
```

## Integration Testing

### Game Systems Integration

1. **Cross-System Tests**
   - Test interactions between multiple systems
   - Verify events properly propagate through the system
   - Test resource production and consumption across systems

2. **Game Loop Tests**
   - Test game loop properly updates all systems
   - Verify time-based calculations are correct
   - Test offline progress calculations

### Example: Integration Test

```typescript
import { initializeGame, advanceGameTime } from 'gameManager';
import { getResourceAmount } from 'resourceManager';
import { getEventByID } from 'eventManager';

describe('Game Systems Integration', () => {
  beforeEach(() => {
    initializeGame();
  });
  
  it('should produce resources over time', () => {
    // Advance game time by 60 seconds
    advanceGameTime(60);
    
    // Check if resources were produced
    const foodAmount = getResourceAmount('food');
    expect(foodAmount).toBeGreaterThan(0);
  });
  
  it('should trigger events based on resource thresholds', () => {
    // Set up conditions for resource threshold event
    setResourceAmount('food', 100);
    
    // Advance game time to allow event checks
    advanceGameTime(5);
    
    // Verify the event was triggered
    const event = getEventByID('resource-milestone-1');
    expect(event.status).toBe('ACTIVE');
  });
});
```

## Performance Testing

### Load Testing

1. **Large State Tests**
   - Test with large amounts of game data
   - Verify performance remains acceptable
   - Test memory usage

2. **Animation Frame Budget Tests**
   - Verify game stays within frame budget (16ms for 60fps)
   - Test optimization strategies for heavy operations

### Example: Performance Test

```typescript
import { initializeGame, advanceGameTime } from 'gameManager';
import { generateLargeGameState } from 'testUtils';

describe('Performance Tests', () => {
  it('should handle large game state efficiently', () => {
    // Generate a large game state with many resources and buildings
    const largeState = generateLargeGameState(100, 50);
    initializeGame(largeState);
    
    // Measure time taken to process a game tick
    const startTime = performance.now();
    advanceGameTime(1);
    const endTime = performance.now();
    
    // Verify processing time is acceptable
    expect(endTime - startTime).toBeLessThan(16); // 16ms frame budget
  });
});
```

## User Experience Testing

### Accessibility Testing

1. **Keyboard Navigation Tests**
   - Verify all interactions can be done with keyboard
   - Test tab order is logical

2. **Screen Reader Tests**
   - Verify proper ARIA attributes are set
   - Test announcements of game changes

### Example: Accessibility Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameInterface from './GameInterface';

describe('Accessibility Tests', () => {
  it('should navigate with keyboard', async () => {
    render(<GameInterface />);
    
    // Start with focus on the document body
    document.body.focus();
    
    // Press Tab to move focus to first interactive element
    await userEvent.tab();
    expect(screen.getByText('Start Game')).toHaveFocus();
    
    // Press Tab again to move to next element
    await userEvent.tab();
    expect(screen.getByText('Options')).toHaveFocus();
    
    // Test interaction with Enter key
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Game Options')).toBeInTheDocument();
  });
});
```

## Test Data Management

### Test Fixtures

1. **Component Fixtures**
   - Create reusable test data for components
   - Customize fixtures for specific test cases

2. **Game State Fixtures**
   - Create fixtures for different game states
   - Fixtures for different game progression points

### Example: Test Fixture

```typescript
// fixtures/eventFixtures.ts
export const testEvent1 = {
  id: 'test-event-1',
  title: 'Test Event 1',
  description: 'This is a test event',
  options: [
    {
      id: 'option-1',
      text: 'Accept',
      consequences: {
        resources: { food: 10 }
      }
    },
    {
      id: 'option-2',
      text: 'Decline',
      consequences: {
        resources: { morale: -5 }
      }
    }
  ]
};

// In tests
import { testEvent1 } from '../fixtures/eventFixtures';

describe('EventComponent', () => {
  it('should render event', () => {
    render(<EventComponent event={testEvent1} />);
    // Test assertions
  });
});
```