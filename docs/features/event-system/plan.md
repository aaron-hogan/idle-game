# Anti-Capitalist Idle Game: Event System Plan

## Overview
This document outlines the plan for implementing an event system in our anti-capitalist idle game. The event system will handle in-game events, notifications, and special gameplay occurrences, adding storytelling and decision-making elements to the game.

## Goals
- Create a flexible event system that can trigger based on game conditions
- Support different event types (story events, resource events, achievement events)
- Allow events to have consequences that affect game state
- Provide a UI for displaying events and player choices
- Integrate with existing game systems

## Approach
We'll implement a singleton EventManager service that manages events, their conditions, and consequences. Events will be stored in Redux and presented through React components. The system will hook into the game loop for periodic condition checking.

## Timeline
- Data Models & Event Manager: 2 days
- Redux Integration: 1 day
- UI Components: 2 days
- Integration & Testing: 1 day
- Documentation: 1 day

## Future Enhancements
- Event chains (sequential events)
- Conditional event branches
- Event probability weighting
- Timed events
- Achievements system integration

## Implementation Prompt

```markdown
# Anti-Capitalist Idle Game: Basic Event System

Let's implement a basic event system that creates random situations requiring player decisions, following our defensive programming patterns and singleton architecture. Please create:

1. Create the Event data models first:
   - Event interface with proper typing (id, title, description, options, consequences) 
   - EventCategory enum for different types of events (OPPORTUNITY, CRISIS, RANDOM, STORY)
   - EventType enum for specific event functionality
   - EventStatus enum to track event state (PENDING, ACTIVE, RESOLVED, EXPIRED)
   - EventOption interface with proper typing for player choices
   - EventRequirement interface for triggering conditions
   - EventTrigger interface for specific activation logic

2. Implement an EventManager service as a singleton that:
   - Tracks potential events with proper validation
   - Triggers events based on conditions or random chance with error handling
   - Manages active events with state validation
   - Handles event resolution with proper error recovery
   - Uses factory methods for creating event instances
   - Implements self-healing for inconsistent event states
   - Registers with GameLoop singleton for periodic checks
   - Coordinates with OppositionManager for crisis events
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for events with:
   - Properly typed state structure
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived data

4. Implement event action creators with proper type safety:
   - Initializing the event system with validation
   - Triggering an event with requirement checks
   - Resolving an event with a player choice and validation
   - Clearing resolved events with proper cleanup

5. Define initial events with proper categorization:
   - Corporate Media Smear (CRISIS category, reduces Community Trust)
   - Spontaneous Strike (OPPORTUNITY category, chance for Bargaining Power)
   - Community Support Rally (OPPORTUNITY category, increases Solidarity)
   - Police Harassment (CRISIS category, threat to organization)

6. Create UI components for events with error boundaries:
   - Event notification system with proper null/undefined handling
   - Event modal with defensive rendering showing:
     - Event title and description
     - Options for player response with availability validation
     - Potential consequences of each option
   - Event history log with proper state handling

7. Integrate with game systems using defensive patterns:
   - Check for potential events on game ticks with error handling
   - Pause event triggers during other critical actions
   - Apply event consequences to game state with validation
   - Handle edge cases like interrupted events or conflicting events

8. Write comprehensive tests for:
   - Event singleton initialization
   - Event triggering conditions including edge cases
   - Option validation with boundary testing
   - Consequence application with validation
   - Event queue management with error scenarios
   - Type safety and null handling
```