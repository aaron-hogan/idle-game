# Anti-Capitalist Idle Game Implementation Plan

## Current Project Status

This document outlines the implementation plan for our anti-capitalist idle game, documenting both completed work and future tasks. Recent efforts have focused on core system hardening and debugging infrastructure.

## Key Implementation Principles

The implementation follows these key principles:
- **Incremental Development**: Each step builds on previous work
- **Test-Driven Development**: Tests are written before implementation
- **Component-Based Architecture**: Modular design for maintainability
- **Progressive Enhancement**: Start with core mechanics, then add complexity
- **Regular Integration**: Ensure components work together at each step
- **Defensive Programming**: Prevent issues through robust validation and error handling
- **Singleton Manager Pattern**: Use singleton pattern for system managers
- **Factory Method Pattern**: Create standardized entities through factory methods
- **Type Safety**: Ensure strong TypeScript typing throughout the codebase
- **Self-Healing Systems**: Design systems to recover from inconsistent states

## Recently Completed Tasks

### Game Timer System Improvements
- Enhanced core timing system for consistent tick rates
- Improved handling of browser throttling in background tabs
- Added compensation for missed ticks during slow performance
- Implemented more detailed timing metrics for debugging
- Optimized the main game loop for better CPU usage
- Reduced unnecessary re-renders of game components

### Debug Panel Implementation
- Consolidated all debugging tools into a unified GameDebugger component
- Created a toggleable panel in the bottom-right corner
- Implemented tab-based navigation for different debugging features
- Created tabs for game loop metrics, state inspection, and resource monitoring
- Added real-time metric monitoring
- Implemented resource manipulation controls for testing

## Current Development Phase: Core Gameplay Mechanics

We are currently in the process of implementing the core gameplay mechanics, with foundational systems in place.

### Completed Phases:

#### Foundation Setup
- Project structure and configuration
- State management setup with Redux
- Core resource system
- Game loop and time management
- Basic UI components
- Save/load system

#### Core Gameplay Mechanics (Partial)
- Building system implementation
- Worker assignment system
- Tasks and activities system

### Upcoming Work:

#### Current Phase Completion
- Basic event system
- Game stage and progression system
- Opposition and resistance system 
- Moral decision framework
- Tutorial and help system

#### Next Phases
- Game progression and content
- Visual enhancements and polish
- Balancing and tuning

## Implementation Steps

### Event System Implementation

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

### Game Stage and Progression System

```markdown
# Anti-Capitalist Idle Game: Game Stage and Progression System

Let's implement the game stage system that tracks player progression and unlocks new content, following our defensive programming patterns and singleton architecture. Please create:

1. Create the Progression data models first:
   - GameStage enum with properly typed stages (EARLY, MID, LATE)
   - ProgressionRequirement interface for stage advancement conditions
   - StageData interface with proper typing for stage-specific data
   - Milestone interface for tracking significant achievements
   - ProgressionStatus interface for tracking partial progress toward stages

2. Implement a ProgressionManager service as a singleton that:
   - Tracks current game stage with validation
   - Defines requirements for advancing stages with proper error handling
   - Unlocks content based on stage with validation checks
   - Provides stage-specific modifiers with failsafes
   - Uses factory methods for creating stage-specific content
   - Implements self-healing for inconsistent progression states
   - Coordinates with all other manager singletons for stage transitions
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for progression with:
   - Properly typed state structure
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived progression data

4. Implement progression action creators with proper type safety:
   - Advancing to a new game stage with requirement validation
   - Unlocking features with proper error handling
   - Tracking progression metrics with data validation
   - Setting game milestones with state verification

5. Define progression stages with comprehensive details:
   - Early Game: Organizing and Education - properly typed requirements and rewards
   - Mid Game: Direct Action and Resistance - validated unlock conditions
   - Late Game: Revolutionary Activity - error-checked victory conditions

6. Create UI components for progression with error boundaries:
   - Stage indicator with proper null/undefined handling
   - Progress tracker toward next stage with defensive rendering
   - Unlocked content notifications with state validation
   - Revolutionary timeline visualization with fallback displays

7. Integrate with other systems using defensive patterns:
   - Unlock buildings based on stage with validation
   - Make new tasks available with proper error handling
   - Adjust event probabilities with bounds checking
   - Scale opposition difficulty with progressive verification
   - Handle edge cases like interrupted progression or skipped stages

8. Write comprehensive tests for:
   - Progression singleton initialization
   - Stage advancement requirements including edge cases
   - Content unlocking with validation
   - Stage-based modifications with boundary testing
   - Progression persistence with error recovery
   - Type safety and null handling
```

### Opposition and Resistance System

```markdown
# Anti-Capitalist Idle Game: Opposition and Resistance System

Let's implement the opposition and resistance mechanics that provide challenges to the player, following our defensive programming patterns and singleton architecture. Please create:

1. Create the Opposition and Resistance data models first:
   - OppositionLevel enum with properly typed levels (LOW, MEDIUM, HIGH, CRITICAL)
   - OppositionAction interface with proper typing for antagonist behaviors
   - CountermeasureType enum for resistance classifications
   - Countermeasure interface with proper typing
   - SecurityStatus interface for tracking infiltration levels
   - SecurityLevel enum for security readiness states

2. Implement an OppositionManager service as a singleton that:
   - Tracks opposition level and awareness with validation
   - Generates opposition actions based on player activities with error handling
   - Escalates opposition tactics with game progression using bounded algorithms
   - Manages opposition recovery and memory with data validation
   - Uses factory methods for creating opposition actions
   - Implements self-healing for inconsistent opposition states
   - Coordinates with EventManager for triggering opposition events
   - Registers with GameLoop for timed opposition activities
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for opposition with:
   - Properly typed state structure
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived opposition data

4. Implement opposition action creators with proper type safety:
   - Updating opposition awareness with bounds checking
   - Triggering opposition actions with validation
   - Implementing countermeasures with effectiveness calculation
   - Recording opposition history with data integrity checks

5. Define opposition mechanics with robust error handling:
   - Corporate Media Smears (affects Community Trust) with proper validation
   - Manager Intimidation (targets individual workers) with worker validation
   - Police Harassment (disrupts organization) with proper scaling
   - Infiltration Attempts (compromises security) with detection mechanics

6. Implement resistance mechanics with validation:
   - Security Culture (reduces infiltration) with proper effectiveness calculation
   - Community Defense (counters police) with validation checks
   - Alternative Media (counters corporate propaganda) with proper scaling
   - Legal Support (helps targeted workers) with worker validation

7. Create UI components for opposition with error boundaries:
   - Opposition level indicator with fallback display
   - Recent opposition actions display with proper null/undefined handling
   - Available countermeasures with validation for requirements
   - Security status dashboard with defensive rendering

8. Write comprehensive tests for:
   - Opposition singleton initialization
   - Action generation algorithms with edge cases
   - Countermeasure effectiveness with boundary testing
   - Awareness mechanics with validation
   - Opposition scaling with game progression
   - Type safety and null handling
```

## Additional Implementation Steps

See the detailed todo.md file for the complete list of implementation steps beyond the current focus areas. We are maintaining a phased approach to ensure quality and testability at each stage of development.

## Testing and Documentation Strategy

Each system should include:
- Comprehensive unit tests for core functionality
- Integration tests for system boundaries
- Documentation using JSDoc comments
- Example usage patterns
- Validation and error handling specifications

## Future Enhancements

After completing the core implementation plan, we will focus on:
1. Expanding content
2. Enhancing visual presentation
3. Balancing and tuning the gameplay experience
4. Adding educational content and references
5. Implementing accessibility features