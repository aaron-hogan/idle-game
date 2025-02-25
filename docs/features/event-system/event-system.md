# Event System

## Overview

The event system manages in-game events, notifications, and special gameplay occurrences in the anti-capitalist idle game. Events can be triggered based on various game conditions and can have consequences that affect the game state.

## Core Components

### Data Models

- **EventType Enum**: Categorizes events into types (story, resource, achievement, task, notification)
- **IEvent Interface**: Core event structure with properties like title, description, conditions, consequences, and choices
- **EventCondition Interface**: Defines conditions for when events can trigger
- **EventConsequence Interface**: Defines effects that occur when an event is triggered
- **EventChoice Interface**: Represents player choices within events

### State Management

- **eventsSlice**: Redux slice for managing event state:
  - `availableEvents`: All registered events indexed by ID
  - `activeEvents`: Currently triggered events
  - `eventHistory`: Record of past events

### Components

- **EventCard**: Displays a single event with its details and choices
- **EventPanel**: Container for displaying active events as floating notifications
- **EventLog**: Historical view of past events with filtering options

### Services

- **EventManager**: Singleton service that manages the event lifecycle:
  - Registering events
  - Checking conditions
  - Triggering events
  - Resolving events with player choices
  - Managing event history

## Usage Guide

### Creating New Events

```typescript
// Example event definition
const myEvent: IEvent = {
  id: 'unique-event-id',
  title: 'Event Title',
  description: 'Event description text...',
  type: EventType.STORY,
  conditions: [
    {
      type: 'resourceAmount',
      target: 'wood',
      value: 50,
      operator: '>='
    }
  ],
  consequences: [
    {
      type: 'addResource',
      target: 'knowledge',
      value: 10
    }
  ],
  choices: [
    {
      id: 'choice1',
      text: 'Accept the offer',
      consequences: [
        {
          type: 'addResource',
          target: 'happiness',
          value: 5
        }
      ]
    },
    {
      id: 'choice2',
      text: 'Decline the offer'
    }
  ],
  priority: 50,
  seen: false,
  repeatable: false
};
```

### Registering Events

Events can be registered programmatically through the EventManager:

```typescript
// Get the EventManager instance
const eventManager = EventManager.getInstance();

// Register the event
eventManager.registerEvent(myEvent);
```

Or by dispatching actions directly:

```typescript
// Add a single event
store.dispatch(addEvent(myEvent));

// Add multiple events at once
store.dispatch(addEvents([event1, event2, event3]));
```

### Condition Types

The event system supports various condition types:

- `resourceAmount`: Checks if a resource has reached a certain amount
- `structureCount`: Checks if a structure has reached a certain count
- `gameTime`: Checks if the game has been played for a certain time
- `gameStage`: Checks if the game has reached a certain stage

### Consequence Types

The event system supports various consequence types:

- `addResource`: Adds a specified amount to a resource
- `unlockStructure`: Unlocks a specific structure
- `setGameStage`: Changes the game stage

## Integration

The event system integrates with the game loop to periodically check conditions and trigger events. The EventPanel component is integrated into the main layout to display active events to the player.

## Creating Custom Event Types

To extend the event system with new condition or consequence types:

1. Update the `evaluateConditions` method in EventManager to handle the new condition type
2. Update the `applyConsequences` method in EventManager to handle the new consequence type
3. Register events using the new condition/consequence types

## Best Practices

- Use meaningful IDs for events and choices
- Set appropriate priorities (higher numbers = higher priority)
- Use conditions to ensure events trigger at appropriate moments
- Keep descriptions clear and concise
- Set `repeatable: true` with a reasonable `cooldown` for recurring events
- Use `nextEventId` in choices to create event chains