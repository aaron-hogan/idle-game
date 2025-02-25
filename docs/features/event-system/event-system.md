# Event System

## Overview
The Event System provides a framework for creating, managing, and displaying in-game events that offer players narrative choices and gameplay consequences. This system is designed to enhance the anti-capitalist idle game with storytelling elements, strategic decisions, and dynamic content delivery.

## Core Components

### Data Models
- **Event Interface**: Defines the structure for game events with properties like id, title, description, choices, and consequences
- **EventCategory Enum**: Classifies events as OPPORTUNITY, CRISIS, RANDOM, or STORY
- **EventStatus Enum**: Tracks event state as PENDING, ACTIVE, RESOLVED, or EXPIRED
- **EventCondition Interface**: Defines triggering requirements like resource thresholds
- **EventConsequence Interface**: Specifies effects on game state when events resolve
- **EventChoice Interface**: Structures player options within events

### State Management
- **eventsSlice**: Redux slice for managing event state with actions for:
  - Adding events
  - Triggering events
  - Resolving events with choices
  - Tracking event history
  - Expiring events
  - Updating event properties

### Components
- **EventManager**: Singleton service that controls all event functionality:
  - Registration of available events
  - Condition evaluation
  - Automatic triggering based on game state
  - Event status management
  - Event consequence application
  - Processing and prioritizing events

### UI Components
- **EventPanel**: Container component for displaying active events
- **EventCard**: Renders individual events with choices
- **EventLog**: Shows history of past events and choices
- **EventDebugTab**: Developer interface for testing and managing events

## Usage Guide

### Creating a New Event

```typescript
// Using the factory method
const eventManager = EventManager.getInstance();
const newEvent = eventManager.createEvent({
  title: 'Community Decision',
  description: 'Your community needs to decide on its next focus.',
  type: EventType.STORY,
  category: EventCategory.OPPORTUNITY,
  choices: [
    {
      id: 'choice1',
      text: 'Focus on mutual aid',
      consequences: [
        {
          type: 'addResource',
          target: 'community-support',
          value: 20
        }
      ]
    },
    {
      id: 'choice2',
      text: 'Focus on organizing',
      consequences: [
        {
          type: 'addResource',
          target: 'organization',
          value: 15
        }
      ]
    }
  ],
  conditions: [
    {
      type: 'resourceAmount',
      target: 'community-support',
      value: 50,
      operator: '>='
    }
  ],
  priority: 80,
  repeatable: false,
  tags: ['decision', 'community']
});

// Register the event
eventManager.registerEvent(newEvent);
```

### Defining Event Conditions

```typescript
// Resource-based condition
const resourceCondition: EventCondition = {
  type: 'resourceAmount',
  target: 'community-support',
  value: 100,
  operator: '>='
};

// Game stage condition
const stageCondition: EventCondition = {
  type: 'gameStage',
  value: 2,
  operator: '='
};

// Time-based condition (seconds of gameplay)
const timeCondition: EventCondition = {
  type: 'gameTime',
  value: 300, // 5 minutes
  operator: '>'
};

// Structure-based condition
const structureCondition: EventCondition = {
  type: 'structureCount',
  target: 'community-center',
  value: 1,
  operator: '>='
};
```

### Defining Event Consequences

```typescript
// Add a resource
const addResourceConsequence: EventConsequence = {
  type: 'addResource',
  target: 'solidarity',
  value: 25
};

// Unlock a structure
const unlockStructureConsequence: EventConsequence = {
  type: 'unlockStructure',
  target: 'mutual-aid-kitchen',
  value: true
};

// Change game stage
const changeStageConsequence: EventConsequence = {
  type: 'setGameStage',
  target: 'gameStage',
  value: 2
};
```

### Manually Triggering an Event

```typescript
const eventManager = EventManager.getInstance();

// Check if event conditions are met
const triggerableEvents = eventManager.checkEventConditions();
console.log(`Events that can be triggered: ${triggerableEvents.join(', ')}`);

// Trigger a specific event
if (eventManager.triggerEvent('community-decision')) {
  console.log('Event triggered successfully');
}
```

## Integration

The Event System integrates with other game systems:

1. **Resource System**:
   - Events can check resource amounts as conditions
   - Event consequences can modify resource quantities
   - Resource milestones can trigger events

2. **Progression System**:
   - Events can be tied to game stages
   - Event choices can affect progression
   - Unlocking content via event consequences

3. **Game Loop**:
   - Regular checking for event conditions
   - Throttled event processing for performance
   - Automatic event expiration
   - Named callback registration for modular system integration

4. **UI System**:
   - Event cards displayed based on priority
   - Type and category-specific styling
   - Modal-like display for player choices

## Best Practices

### Event Design
- **Make choices meaningful**: Each option should have distinct consequences
- **Balance crisis and opportunity events**: Mix positive and challenging scenarios
- **Keep descriptions concise**: 2-3 sentences for descriptions, 1 for choices
- **Use appropriate categories**: Correctly categorize events for proper styling and prioritization
- **Set appropriate priorities**: Critical story events should have higher priority (75-100)

### Event Conditions
- **Layer multiple conditions**: Combine resource, time, and stage conditions for precision
- **Use appropriate operators**: Not just >= but also =, >, <, <= as needed
- **Set reasonable resource thresholds**: Don't require excessive resource accumulation
- **Consider repeatable events**: Use the repeatable flag and cooldown for recurring events

### Consequence Design
- **Balance risk and reward**: Higher risk choices should offer greater rewards
- **Mix resource types**: Affect multiple resource types for interesting decisions
- **Chain events when appropriate**: Use nextEventId for sequential storytelling
- **Avoid extreme penalties**: Don't completely deplete resources with negative consequences

### Code Maintenance
- **Group related events in separate files**: Organize events by theme or game stage
- **Use factory methods**: Create events with the factory method for consistent structure
- **Document event purpose**: Add comments explaining the narrative purpose of each event
- **Use tags consistently**: Develop a tagging system for easier filtering and organization
- **Ensure type safety**: Always check types when accessing resources or properties to prevent runtime errors
- **Use proper validation**: Validate action types and properties before accessing them
- **Register callbacks properly**: Use the named callback registration pattern for better clarity

## Related Documentation
- [Event System Implementation Summary](./summary.md)
- [Anti-Capitalist Events Reference](./event-reference.md)

## Navigation
- [Back to Features](../Features.md)
- [Back to Home](../Home.md)