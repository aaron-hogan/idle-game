# Anti-Capitalist Idle Game Implementation Plan

## Project Overview

This plan outlines the implementation of a browser-based semi-idle game with anti-capitalist themes. The game allows players to build collective power and eventually overthrow capitalism through an anarcho-syndicalist approach. The core gameplay revolves around resource generation, building development, organizing activities, and managing opposition.

## Implementation Approach

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

## Phase 1: Foundation Setup

### Step 1: Project Setup and Basic Infrastructure

```markdown
# Anti-Capitalist Idle Game: Project Setup

Please help me set up the initial project structure for an anti-capitalist idle game using React and TypeScript. I need:

1. A proper React project with TypeScript configuration
2. Essential dependencies setup (React, Redux, Jest for testing)
3. Basic folder structure following best practices
4. Basic webpack configuration
5. ESLint and Prettier setup for code quality
6. Initial test configuration

For the folder structure, please include:
- src/
  - components/
  - state/
  - models/
  - systems/
  - utils/
  - constants/
  - assets/
  - styles/

Please provide the necessary configuration files and a basic App component that renders a simple "Anti-Capitalist Idle Game" heading to verify the setup works.

Include a simple test for the App component to demonstrate the testing setup.
```

### Step 2: Game State Management Foundation

```markdown
# Anti-Capitalist Idle Game: State Management Setup

Building on our initial project setup, I now need to implement the basic state management structure using Redux and TypeScript. Please help me with:

1. Setting up Redux store configuration
2. Creating basic types and interfaces for the game state
3. Implementing initial reducers for core game state
4. Setting up dev tools for Redux debugging
5. Creating selectors for accessing state

The initial game state should include:
- resources: Record<string, Resource> (empty initially)
- structures: Record<string, Structure> (empty initially)
- gameStage: number (starting at 0)
- lastSaveTime: number (current timestamp)
- totalPlayTime: number (starting at 0)

Resource interface should have:
- id: string
- name: string
- amount: number
- maxAmount: number
- perSecond: number
- description: string
- unlocked: boolean
- category: ResourceCategory (enumeration of resource types)

Structure interface should have:
- id: string
- name: string
- description: string
- level: number
- maxLevel: number
- cost: Record<string, number>
- production: Record<string, number>
- unlocked: boolean
- workers: number
- maxWorkers: number

Include tests for the reducers and selectors to ensure they work correctly.
```

### Step 3: Core Resource System

```markdown
# Anti-Capitalist Idle Game: Core Resource System

Now that we have our state management setup, let's implement the core resource system following our singleton pattern and defensive programming approach. Please create:

1. Create proper resource data models first:
   - ResourceCategory enum (PRIMARY, SOCIAL, MATERIAL, IDEOLOGICAL)
   - ResourceType enum for specific resource types
   - Create a robust Resource interface with all required properties including category

2. Implement a ResourceManager service as a singleton that handles:
   - Resource initialization with validation
   - Resource updates (adding/subtracting) with bounds checking
   - Calculating resource generation per tick with error handling
   - Checking if a resource purchase is possible with validation
   - Self-healing for invalid resource states
   - Factory methods for creating resource instances

3. Action creators with proper validation:
   - Initializing resources with type safety
   - Updating resource amounts with bounds checking
   - Unlocking new resources with prerequisite validation

4. Resource definitions for our initial resources with proper categorization:
   - Collective Bargaining Power (PRIMARY category)
   - Solidarity (SOCIAL category)
   - Community Trust (SOCIAL category)

5. Implement Redux slice for resources:
   - Properly typed state structure with categories
   - Reducers with comprehensive error handling
   - Memoized selectors for efficient access
   - State validation middleware

6. Write comprehensive tests for:
   - Resource singleton initialization
   - Resource update calculations including edge cases
   - Purchase validation logic with boundary testing
   - Category filtering and organization
   - Type safety and null handling

7. Create UI components with error boundaries:
   - ResourceDisplay component that shows name, amount, and generation rate
   - ResourceList component for grouping by category
   - Proper null/undefined handling for all resource displays
   - Fallback displays for missing resources

The resource system should work with our existing Redux setup with proper type safety throughout. Make sure to implement defensive programming patterns with comprehensive validation and error handling for all operations involving resources.
```

### Step 4: Game Loop and Time Management

```markdown
# Anti-Capitalist Idle Game: Game Loop and Time Management

Building on our resource system, let's implement the core game loop and time management functionality following our singleton pattern and defensive programming approach. Please create:

1. Create time management data models:
   - GameTimeState interface for tracking timing information
   - OfflineProgress interface for offline calculation results
   - TimeSettings interface for configurable time parameters

2. Implement a GameLoop service as a singleton that:
   - Updates resources at regular intervals with error handling
   - Tracks elapsed time with validation
   - Updates resource generation with bounds checking
   - Recovers from timing anomalies
   - Provides self-healing for interrupted loops
   - Handles performance degradation gracefully

3. Implement an offline progress calculator with validation:
   - Calculates resources generated while away with safety bounds
   - Has adjustable efficiency for idle time (e.g., 70% efficiency) with validation
   - Caps maximum offline time (e.g., 24 hours) with proper enforcement
   - Detects and handles clock manipulation attempts
   - Provides fallback calculations for extreme time jumps

4. Implement Redux actions with proper validation:
   - Starting/stopping the game loop with state verification
   - Processing offline progress with bounds checking
   - Updating the last save time with timestamp validation
   - Error handling for all time-related operations

5. Create a TimeUtils service to handle time-related utilities:
   - Formatting time displays with fallback formats
   - Calculating time differences with validation
   - Converting between real time and game time with error handling
   - Detecting invalid time operations

6. Write comprehensive tests for:
   - Game loop singleton initialization
   - Game tick resource updates with edge cases
   - Offline progress calculations with boundary testing
   - Time tracking accuracy with various scenarios
   - Clock manipulation detection
   - Type safety and error handling

7. Implement defensive integration with existing systems:
   - Proper connection to Redux state with validation
   - Safe resource system integration with error handling
   - Window focus/blur event handling with graceful fallbacks
   - Recovery mechanisms for browser tab suspension

Make sure to integrate this with our existing Redux state and resource system using proper validation throughout. The game loop should be designed to handle unexpected interruptions, browser quirks, and unusual timing scenarios while maintaining game state integrity. Implement comprehensive error handling for all time-related operations.
```

### Step 5: Basic UI Components

```markdown
# Anti-Capitalist Idle Game: Basic UI Components

Let's create the foundational UI components for our game. Please implement:

1. A responsive layout system with:
   - Header component
   - Main content area with flexible layout
   - Footer with game information
   - Sidebar for navigation (collapsible on small screens)

2. Resource display components:
   - Individual resource display (showing name, amount, rate)
   - Resource list component for showing multiple resources
   - Resource gain animation for visual feedback

3. Basic interaction components:
   - Button component with different variants (primary, secondary, etc.)
   - Tooltip component for showing additional information
   - Tab system for organizing different game sections

4. UI utility components:
   - Number formatter for large numbers (e.g., 1.5K, 2.4M)
   - Progress bar for showing completion or capacity
   - Icon system using SVG icons

5. Tests for all components ensuring:
   - Correct rendering
   - Proper interaction behavior
   - Responsive layout adjustments

Use CSS modules or styled-components for styling. Ensure components are accessible with proper ARIA attributes and keyboard navigation. Make all components reusable and configurable with props.

Connect the ResourceDisplay components to our Redux store to show the current resource values.
```

### Step 6: Save/Load System

```markdown
# Anti-Capitalist Idle Game: Save/Load System

Now let's implement a save/load system to persist game progress, following our singleton pattern and defensive programming approach. Please create:

1. Create save/load data models first:
   - SaveData interface with proper typing for all persistent state
   - SaveMetadata interface for tracking save information
   - MigrationStrategy interface for version handling
   - SaveOptions interface for customizing save behavior

2. Implement a SaveManager service as a singleton that:
   - Serializes the game state to JSON with validation
   - Compresses large save data with error handling
   - Stores data in localStorage with storage limit detection
   - Includes a version number and checksums for data integrity
   - Handles autosaving at regular intervals with recovery options
   - Implements multiple save slots for backup purposes
   - Provides self-healing for corrupted save data

3. Create a robust load system with validation:
   - Retrieves and deserializes save data with error handling
   - Validates the data structure with comprehensive checks
   - Handles version migrations with fallback strategies
   - Sanitizes loaded data to prevent injection
   - Initializes default state for new games with validation
   - Detects and recovers from partially corrupted saves

4. Create UI components for save management with error boundaries:
   - Save button with confirmation for major state changes
   - Load button with save slot selection
   - Reset game button with double confirmation
   - Save status indicator with error state display
   - Import/Export functionality for backup
   - Detailed error reporting for save issues

5. Implement Redux actions with proper validation:
   - Saving the game with pre-save validation
   - Loading a saved game with comprehensive error handling
   - Resetting the game with proper cleanup
   - Migrating between save versions safely
   - Handling storage quota exceeded errors

6. Write comprehensive tests for:
   - Save manager singleton initialization
   - Serialization/deserialization with edge cases
   - Data validation with various corruption scenarios
   - Migration handling with version jumps
   - Error recovery from partial data
   - Storage limitation handling
   - Type safety and security validation

7. Implement defensive integration with other systems:
   - Safe connection to game state with validation
   - Proper exception handling for all storage operations
   - Automatic recovery mechanisms
   - Backup strategies for critical save failures
   - Save data integrity monitoring

Integrate this with our existing game systems using our defensive programming patterns. Implement comprehensive error handling for corrupted save data with multiple fallback strategies. Ensure the autosave functionality works reliably with our game loop, including handling interrupted saves during page unload.
```

## Phase 2: Core Gameplay Mechanics

### Step 7: Building System Implementation

```markdown
# Anti-Capitalist Idle Game: Building System

Let's implement the building/structure system that allows players to construct revolutionary infrastructure, following our singleton pattern and defensive programming approach. Please create:

1. Create structure data models first:
   - StructureCategory enum (ORGANIZING, PRODUCTION, INFRASTRUCTURE, DEFENSE)
   - Structure interface with proper typing for all properties
   - BuildingRequirement interface for purchase prerequisites
   - UpgradeEffect interface for level benefits
   - ProductionFormula interface for resource generation

2. Implement a BuildingManager service as a singleton that:
   - Handles building initialization and unlocking with validation
   - Performs purchase validation with comprehensive checks
   - Manages level upgrades with proper error handling
   - Calculates production with bounds checking and error recovery
   - Implements self-healing for inconsistent building states
   - Uses factory methods for creating building instances

3. Create Redux slice for buildings with:
   - Properly typed state structure with categories
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived building data

4. Implement building action creators with proper type safety:
   - Initializing buildings with validation
   - Purchasing new buildings with requirement checks
   - Upgrading existing buildings with level validation
   - Assigning workers to buildings with bounds enforcement

5. Define building definitions for initial structures with proper validation:
   - Community Center (SOCIAL category, generates Solidarity)
   - Union Office (ORGANIZING category, generates Collective Bargaining Power)
   - Alternative Media Outlet (INFORMATION category, counters opposition)
   - Mutual Aid Network (INFRASTRUCTURE category, generates Material Resources)

6. Create UI components for buildings with error boundaries:
   - Building list component with category filtering
   - Individual building display with fallback rendering showing:
     - Name, description, level with proper null handling
     - Cost to purchase/upgrade with availability indicators
     - Production rates with efficiency calculation
     - Worker assignment controls with validation
   - Building purchase/upgrade button with proper feedback

7. Write comprehensive tests for:
   - Building manager singleton initialization
   - Purchase validation with edge cases
   - Upgrade mechanics with boundary testing
   - Production calculations with error scenarios
   - Worker assignment with validation
   - Type safety and null handling

8. Implement defensive integration with other systems:
   - Safe connection to resource system for costs and production
   - Proper validation with game stage requirements
   - Error handling for all building operations
   - Recovery mechanisms for inconsistent states

Ensure buildings affect resource generation rates in the game loop using proper validation. Implement comprehensive requirements before buildings can be purchased, including resource checks, game stage validation, and prerequisite structures. Connect the UI components to our Redux store using proper type safety and error handling.
```

### Step 8: Worker Assignment System

```markdown
# Anti-Capitalist Idle Game: Worker Assignment System

Let's implement the worker assignment system that allows players to allocate organizers to different structures, following our singleton pattern and defensive programming approach. Please create:

1. Create worker management data models first:
   - Worker interface with proper typing for worker properties
   - WorkerRole enum for different specializations
   - WorkerAssignment interface for tracking allocations
   - EfficiencyFormula interface for calculating productivity
   - WorkerRequirement interface for unlocking conditions

2. Implement a WorkerManager service as a singleton that:
   - Tracks total available workers with validation
   - Handles worker allocation to buildings with bounds checking
   - Calculates efficiency based on worker allocation with error handling
   - Implements worker unlocking progression with validation
   - Provides self-healing for inconsistent worker states
   - Uses factory methods for worker operations

3. Create Redux slice for workers with:
   - Properly typed state structure
   - Action creators with comprehensive validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived worker data

4. Implement worker action creators with proper type safety:
   - Adding new workers with validation
   - Assigning workers to buildings with requirement checks
   - Removing workers from buildings with state verification
   - Automating worker assignment with fallback strategies

5. Extend the building system with defensive patterns:
   - Calculate production based on worker count with validation
   - Define worker efficiency curves with bounds checking
   - Set minimum/maximum worker limits per building with enforcement
   - Handle invalid worker assignments with recovery mechanisms

6. Create UI components for worker management with error boundaries:
   - Worker overview showing total/assigned workers with proper null handling
   - Worker assignment controls with validation feedback
   - Worker efficiency indicators with fallback displays
   - Auto-assign options with confirmation for major changes

7. Write comprehensive tests for:
   - Worker manager singleton initialization
   - Assignment logic with edge cases
   - Production calculation with boundary testing
   - Validation of worker limits with error scenarios
   - Automatic assignment algorithms with various cases
   - Type safety and null handling

8. Implement defensive integration with other systems:
   - Safe connection to building system for assignments
   - Proper dependency validation with resource costs
   - Error handling for all worker operations
   - Recovery mechanisms for inconsistent assignments

Integrate this with our existing building and resource systems using our established defensive patterns. Implement proper error recovery mechanisms for all worker operations. Ensure worker assignments persist with saves and affect resource generation appropriately, with validation at all interaction points.
```

### Step 9: Tasks and Activities System

```markdown
# Anti-Capitalist Idle Game: Tasks and Activities System

Let's implement the tasks and activities system that allows players to take actions for immediate rewards, following our established defensive programming patterns and singleton architecture. Please create:

1. Create the Task data models first:
   - Task interface with proper typing (id, name, description, duration, cost, rewards)
   - TaskCategory enum for categorizing different types of tasks
   - TaskType enum for specific task functionality
   - TaskStatus enum to track task state (idle, in-progress, completed, failed)
   - TaskRequirement interface for prerequisite validation
   - TaskReward interface for typed reward structures

2. Implement a TaskManager service as a singleton that handles:
   - Task initialization and unlocking with proper validation
   - Task start validation with comprehensive error handling
   - Task completion and reward distribution
   - Task duration and progress tracking
   - Self-healing for inconsistent task states
   - Use factory methods for creating tasks
   - Register with GameLoop singleton for progress updates
   - Expose getInstance() static method for access from other systems

3. Create Redux slice for tasks with:
   - Properly typed state structure
   - Action creators with validation
   - Error handling in reducers
   - Memoized selectors for derived data

4. Implement task action creators with:
   - Proper type safety and validation
   - Initializing available tasks
   - Starting a task with requirement checks
   - Completing a task with reward distribution
   - Canceling an in-progress task

5. Define initial tasks with proper categorization:
   - Distribute Flyers (ORGANIZING category, quick, small impact)
   - Host Community Meeting (EDUCATION category, medium duration, medium impact)
   - Workplace Organizing (ORGANIZING category, long duration, large impact)
   - Mutual Aid Project (COMMUNITY category, variable duration, community trust impact)

6. Create UI components for tasks with error boundaries:
   - Task list component with filtering by category
   - Individual task display with proper null/undefined handling showing:
     - Name, description, duration
     - Resource costs to start
     - Potential rewards
     - Progress indicator for active tasks
   - Task start button with proper validation feedback

7. Integrate with the game loop using defensive patterns:
   - Update task progress on each tick with error handling
   - Auto-complete tasks when they reach 100%
   - Distribute rewards on completion with validation
   - Handle edge cases like interrupted tasks

8. Write comprehensive tests for:
   - Task singleton initialization
   - Task start validation including edge cases
   - Progress calculation with boundary testing
   - Reward distribution with validation
   - Task completion handling with error scenarios
   - Type safety and null handling

Ensure tasks work with our existing systems including resource costs/rewards and worker assignments. Implement proper error recovery mechanisms and follow the defensive programming patterns established in our other systems. Add visual feedback for task completion and connect UI components to Redux using proper typing.
```

### Step 10: Basic Event System

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

Ensure events provide meaningful choices with different strategic implications. Implement proper error recovery mechanisms and follow the defensive programming patterns established in our other systems. Connect the event UI to our Redux store using proper typing and make sure events are saved properly in the game state with validation.
```

## Phase 3: Game Progression and Content

### Step 11: Game Stage and Progression System

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

Connect progression to the existing game systems using our established defensive patterns. Ensure proper error recovery mechanisms are in place for all progression operations. Verify it works with the save/load functionality including migration between versions. Create a cohesive narrative flow through the progression stages with proper state validation at each step.
```

### Step 12: Opposition and Resistance System

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

Integrate with our event system so opposition can trigger specific events, using proper validation between systems. Implement error recovery mechanisms for all opposition operations. Ensure opposition scales appropriately with player progress using bounded algorithms to maintain challenge throughout the game without creating impossible situations.
```

### Step 13: Moral Decision Framework

```markdown
# Anti-Capitalist Idle Game: Moral Decision Framework

Let's implement the moral decision system that presents players with ideological choices, following our defensive programming patterns and singleton architecture. Please create:

1. Create the Moral Decision data models first:
   - IdeologyPosition interface with multi-dimensional typing
   - IdeologyAxis enum for structuring ideological dimensions
   - DecisionRecord interface for tracking player choices
   - FactionRelationship interface with proper typing
   - DecisionCategory enum (TACTICAL, RESOURCE, POLITICAL)
   - IdeologicalEffect interface for gameplay consequences
   - IdeologicalRequirement interface for content gating

2. Implement a MoralFrameworkManager service as a singleton that:
   - Tracks player ideological positioning with bounds validation
   - Records decision history with data integrity checks
   - Calculates faction relationships with robust algorithms
   - Applies consequences based on choices with proper validation
   - Uses factory methods for creating moral decisions
   - Implements self-healing for inconsistent ideological states
   - Coordinates with EventManager for moral choice events
   - Interfaces with other managers to apply ideological effects
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for moral framework with:
   - Properly typed state structure for ideological data
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived ideological data

4. Implement moral decision action creators with proper type safety:
   - Recording moral decisions with validation
   - Updating ideology metrics with bounds checking
   - Changing faction relationships with consistency validation
   - Applying ideological effects with proper error handling

5. Define decision categories with robust typing:
   - Tactical Choices (e.g., nonviolence vs. property destruction) with validation
   - Resource Allocation (e.g., immediate relief vs. long-term building) with bounds checking
   - Political Alignment (e.g., coalition building vs. ideological purity) with consistency checks

6. Create UI components for moral framework with error boundaries:
   - Ideology tracker visualization with fallback display
   - Decision history log with proper null/undefined handling
   - Faction relationship panel with defensive rendering
   - Decision impact preview with validation checks

7. Integrate with the event system using defensive patterns:
   - Present moral dilemmas through events with proper validation
   - Show different options based on previous choices with consistency checks
   - Apply short and long-term consequences with error handling
   - Change available strategies based on ideology with validation
   - Handle edge cases like contradictory decisions or missing history

8. Write comprehensive tests for:
   - Moral framework singleton initialization
   - Decision recording with edge cases
   - Consequence application with boundary testing
   - Faction relationship calculations with validation
   - Ideological constraints and limits
   - Type safety and null handling

Ensure choices have meaningful gameplay impacts while avoiding simplistic "good/bad" binaries. Implement proper error recovery mechanisms for all moral framework operations. Connect moral choices to narrative elements with proper state validation and create tension between idealism and pragmatism through well-validated gameplay consequences.
```

### Step 14: Tutorial and Help System

```markdown
# Anti-Capitalist Idle Game: Tutorial and Help System

Let's implement a tutorial and help system to guide new players, following our defensive programming patterns and singleton architecture. Please create:

1. Create the Tutorial data models first:
   - TutorialStep interface with proper typing for progression
   - TutorialSection enum for categorizing different tutorials
   - TutorialTrigger interface for activation conditions
   - TutorialPreference interface for user settings
   - HelpTopic interface for documentation structure
   - TutorialAction interface for defining interactive elements
   - TutorialCompletionStatus enum for tracking progress

2. Implement a TutorialManager service as a singleton that:
   - Tracks tutorial progress with data validation
   - Triggers tutorial steps based on player actions with error handling
   - Provides contextual guidance with proper state checks
   - Handles enable/disable functionality with preference validation
   - Uses factory methods for creating tutorial sequences
   - Implements self-healing for interrupted tutorial flows
   - Registers with all other manager singletons for system-specific tutorials
   - Exposes getInstance() static method for access from other systems

3. Create Redux slice for tutorials with:
   - Properly typed state structure for tutorial progress
   - Action creators with validation
   - Error handling in reducers for all edge cases
   - Memoized selectors for derived tutorial data

4. Implement tutorial action creators with proper type safety:
   - Starting/stopping tutorials with validation
   - Advancing tutorial steps with progress verification
   - Marking topics as learned with data integrity checks
   - Setting tutorial preferences with proper error handling

5. Define tutorial contents with robust validation:
   - Basic resource generation tutorial with step validation
   - Building and upgrading structures tutorial with error handling
   - Worker assignment tutorial with proper state checking
   - Task completion tutorial with progress validation
   - Handling events and opposition tutorial with fallback logic

6. Create UI components for tutorials with error boundaries:
   - Tutorial overlay with fallback display and proper z-index management
   - Step-by-step instruction panels with defensive rendering
   - Interactive tutorial elements with proper null/undefined handling
   - Help encyclopedia with structured content and proper error states

7. Develop educational content with validation:
   - Game mechanics with tooltips and fallback explanations
   - Anti-capitalist concepts through validated encyclopedia entries
   - Historical references with proper content delivery verification
   - Strategy suggestions with context-aware recommendations

8. Write comprehensive tests for:
   - Tutorial singleton initialization
   - Trigger conditions with edge cases
   - Progress tracking with data integrity testing
   - UI interaction with boundary testing
   - Help content accessibility with validation
   - Type safety and null handling

Make the tutorial unintrusive but comprehensive, allowing players to learn at their own pace. Implement proper error recovery mechanisms for interrupted tutorials or unexpected game states. Apply defensive programming practices throughout the help system to ensure information is always available, even in edge cases. Ensure all game terms and concepts are explained in tooltips or the encyclopedia, with fallback explanations for critical information.
```

## Phase 4: Content and Polish

### Step 15: Early Game Content Implementation

```markdown
# Anti-Capitalist Idle Game: Early Game Content

Let's implement the early game content focusing on initial organizing and education, following our singleton pattern and defensive programming approach. Please create:

1. Create comprehensive data models first:
   - EarlyGameContent interface with proper typing for all early content
   - ContentUnlockSequence interface for progression logic
   - BalanceParameters interface for gameplay tuning
   - TutorialSequence interface for new player guidance

2. Implement early game buildings using our factory methods:
   - Community Center (SOCIAL category, solidarity generation) with validation
   - Union Office (ORGANIZING category, bargaining power) with error handling
   - Alternative Media Outlet (INFORMATION category, counters propaganda) with validation
   - Mutual Aid Network (INFRASTRUCTURE category, community resources) with bounds checking
   - Study Group (EDUCATION category, education) with proper validation

3. Define early game tasks with proper error handling:
   - Distribute Flyers (ORGANIZING category, awareness) with validation
   - Host Community Meetings (EDUCATION category, solidarity) with error checking
   - Workplace Organizing (ORGANIZING category, identifying issues) with validation
   - Mutual Aid Projects (COMMUNITY category, community trust) with error handling
   - Educational Workshops (EDUCATION category, ideology) with proper validation

4. Create early game events with defensive patterns:
   - Initial Workplace Grievance with validation and fallbacks
   - Community Need Identified with error handling
   - Supportive Community Member with validation
   - First Confrontation with Management with proper state checking
   - Educational Breakthrough with error handling and validation

5. Implement balance parameters with robust validation:
   - Initial resource generation rates with bounds checking
   - Building costs and outputs with validation
   - Task durations and rewards with proper constraints
   - Event frequencies and impacts with safe randomization
   - Implement self-correcting balance mechanisms

6. Create UI refinements for the early game with error boundaries:
   - Clear new player guidance with fallback displays
   - Visual progression indicators with proper null handling
   - Achievement notifications with defensive rendering
   - Early game art assets with loading fallbacks
   - Proper error messaging for new players

7. Implement comprehensive integration with existing systems:
   - Proper registration with system managers
   - Safe interconnection between systems with validation
   - Error recovery for system boundaries
   - Consistent state validation across components

8. Write extensive tests for early game experience:
   - Progression pacing with boundary testing
   - Resource balance with economic simulation
   - Tutorial effectiveness with various player behaviors
   - New player experience with error scenarios
   - Edge cases for all content interactions

Ensure the early game provides a gentle learning curve while introducing key mechanics. Implement comprehensive error handling for all new player interactions to prevent frustration. Apply our defensive programming practices to create a robust and forgiving early game experience that teaches basic strategies while being resilient to unexpected player actions or state inconsistencies.
```

### Step 16: Mid-Game Content Implementation

```markdown
# Anti-Capitalist Idle Game: Mid-Game Content

Building on the early game content, let's implement the mid-game focusing on direct action and resistance, following our singleton pattern and defensive programming approach. Please create:

1. Create mid-game data models first:
   - MidGameContent interface with proper typing for all mid-game content
   - ProgressionThreshold interface for unlocking conditions
   - DifficultyScaling interface for challenge progression
   - OppositionResponse interface for antagonist mechanics

2. Implement mid-game buildings using our factory methods:
   - Worker Cooperative (PRODUCTION category, self-managed workplace) with validation
   - Neighborhood Assembly (ORGANIZING category, decision-making) with error handling
   - People's Kitchen (SOCIAL category, food and community) with validation
   - Free School (EDUCATION category, higher education) with bounds checking
   - Legal Aid Collective (DEFENSE category, legal opposition) with proper validation

3. Define mid-game tasks with proper error handling:
   - Coordinate Strike Actions (DIRECT_ACTION category, disrupts production) with validation
   - Establish Worker Cooperatives (PRODUCTION category, alternative workplaces) with error checking
   - Build Alternative Institutions (INFRASTRUCTURE category, parallel structures) with validation
   - Counter Corporate Propaganda (INFORMATION category, media work) with error handling
   - Community Defense Training (DEFENSE category, resistance) with proper validation

4. Create mid-game events with defensive patterns:
   - Strike at Local Factory with validation and fallbacks
   - Police Crackdown on Organizers with error handling
   - Corporate Union-Busting Campaign with validation
   - Community Defense Success with proper state checking
   - Coalition Building Opportunity with error handling and validation

5. Implement enhanced opposition mechanics with robust error handling:
   - Police harassment escalation with bounded progression
   - Legal challenges to organizations with validation
   - Corporate infiltration attempts with detection mechanisms
   - Targeted surveillance of leaders with proper state tracking
   - Self-correcting opposition difficulty with player progress

6. Create UI enhancements for mid-game with error boundaries:
   - More detailed progress tracking with fallback displays
   - Strategic choice visualizations with proper null handling
   - Relationship network mapping with defensive rendering
   - Mid-game art assets with loading fallbacks
   - Advanced error reporting with recovery suggestions

7. Implement comprehensive integration with existing systems:
   - Proper validation between early and mid-game content
   - Safe progression thresholds with error handling
   - Transition state validation with recovery mechanisms
   - Consistent validation across content boundaries

8. Write extensive tests for mid-game experience:
   - Difficulty scaling with boundary testing
   - Strategic depth with decision tree testing
   - Opposition balance with simulation testing
   - Feature integration with component interaction tests
   - Edge cases for progression transitions
   - Error recovery from invalid game states

Ensure the mid-game provides meaningful strategic choices while maintaining robust error handling. Implement proper validation for increased complexity to prevent cascading failures. Create clear feedback systems that guide players through new mechanics while applying our defensive programming patterns to maintain stability as game complexity increases. Design systems to gracefully recover from unexpected player behaviors or state inconsistencies.
```

### Step 17: Late-Game Content Implementation

```markdown
# Anti-Capitalist Idle Game: Late-Game Content

Let's implement the late-game content focusing on revolutionary activity and system change, following our singleton pattern and defensive programming approach. Please create:

1. Create late-game data models first:
   - LateGameContent interface with proper typing for all late content
   - VictoryCondition interface for win-state requirements
   - EndingVariant interface for different conclusions
   - RevolutionaryProgress interface for final phase tracking
   - SystemTransformation interface for game-changing mechanics

2. Implement late-game buildings using our factory methods:
   - General Strike Headquarters (REVOLUTIONARY category, mass action) with validation
   - Revolutionary Council (GOVERNANCE category, decision-making) with error handling
   - Autonomous Zone (TERRITORY category, self-governed area) with validation
   - People's Defense Committee (DEFENSE category, protection) with bounds checking
   - Alternative Economic System (INFRASTRUCTURE category, replacement structures) with validation

3. Define late-game tasks with proper error handling:
   - General Strike Organization (REVOLUTIONARY category, mass stoppage) with validation
   - Factory Occupations (DIRECT_ACTION category, worker control) with error checking
   - Critical Infrastructure Defense (DEFENSE category, protecting gains) with validation
   - Establish People's Governance (GOVERNANCE category, new structures) with error handling
   - System Replacement Projects (REVOLUTIONARY category, alternatives) with proper validation

4. Create late-game events with defensive patterns:
   - General Strike Declaration with validation and fallbacks
   - Major Factory Occupation with error handling
   - State Violence Escalation with validation
   - Revolutionary Moment with proper state checking
   - System Transformation Opportunities with error handling and validation

5. Implement victory conditions with robust validation:
   - Revolutionary transformation with comprehensive state verification
   - Dual power sustainability with validation checks
   - Community autonomy with proper prerequisite validation
   - Different endings based on ideology with state consistency validation
   - Graceful handling of edge cases in victory state

6. Create UI enhancements for late-game with error boundaries:
   - Revolutionary progress visualization with fallback displays
   - System transformation indicators with proper null handling
   - Victory approach tracking with defensive rendering
   - Late-game art assets with loading fallbacks
   - Victory screen with error recovery mechanisms

7. Implement comprehensive integration with existing systems:
   - Proper validation between mid and late-game content
   - Safe progression thresholds with error handling
   - End-game state validation with recovery mechanisms
   - Consistent validation across victory conditions
   - Graceful shutdown of ongoing systems during victory

8. Write extensive tests for late-game experience:
   - End-game balance with boundary testing
   - Victory condition triggers with validation testing
   - Narrative coherence with state consistency tests
   - Overall game satisfaction with completion testing
   - Edge cases for victory conditions
   - Error recovery from near-victory invalid states
   - Player experience through multiple endings

Ensure the late-game provides a satisfying conclusion while maintaining robust error handling. Implement comprehensive validation for victory conditions to prevent false or premature wins. Create clear feedback systems that celebrate player achievements while applying our defensive programming patterns to ensure a stable and satisfying conclusion regardless of the player's path. Design systems to gracefully handle unexpected state combinations during the complex final phase of gameplay.
```

### Step 18: Visual Enhancements and Animations

```markdown
# Anti-Capitalist Idle Game: Visual Enhancements and Animations

Let's implement visual enhancements and animations to improve the game's look and feel, following our defensive programming practices and performance-conscious approach. Please create:

1. Create visual system data models first:
   - AnimationConfig interface with proper typing for animation settings
   - VisualTheme interface for styling configuration
   - AccessibilitySettings interface for user preferences
   - PerformanceProfile interface for different device capabilities
   - AnimationState interface for tracking and managing animations

2. Implement an AnimationManager service as a singleton that:
   - Manages animation lifecycles with proper cleanup
   - Handles performance throttling with adaptive degradation
   - Provides fallbacks for unsupported features
   - Implements self-healing for stuck animations
   - Uses factory methods for creating animation instances
   - Handles browser compatibility issues gracefully

3. Create enhanced UI components with error boundaries:
   - Polished button and control styles with fallback rendering
   - Consistent color scheme following the art guide with theme validation
   - Improved layout and spacing with responsive validation
   - Custom scrollbars and focus states with accessibility-aware fallbacks
   - Defensive error handling for all visual components

4. Implement an animation system with performance safeguards:
   - Resource gain/loss feedback with bounds checking
   - Building construction and upgrades with loading state handling
   - Task completion celebrations with cancellation support
   - Event notifications with proper state validation
   - Victory sequences with fallback simplified versions
   - Performance monitoring with automatic quality adjustment

5. Create visual progress indicators with robust fallbacks:
   - Building level transformations with state validation
   - Revolutionary progress visualization with error recovery
   - Opposition threat indicators with defensive rendering
   - Resource flow animations with performance-based simplification
   - Text-based alternatives for all visual indicators

6. Develop SVG-based graphics with proper asset management:
   - Building representations with loading fallbacks
   - Worker visualizations with error state handling
   - Event illustrations with defensive rendering
   - Resource icons with accessibility alternatives
   - Achievement badges with proper asset validation
   - Lazy loading for non-essential graphics

7. Implement accessibility enhancements with comprehensive testing:
   - High contrast mode with proper contrast ratio validation
   - Animation toggle with complete animation suspension
   - Text size controls with layout adjustment validation
   - Screen reader optimizations with ARIA compliance
   - Keyboard navigation with comprehensive focus management
   - Color blindness accommodations with pattern alternatives

8. Write extensive tests for visual systems:
   - Animation performance with various device profiles
   - Visual consistency across browsers and devices
   - Accessibility compliance with WCAG standards
   - Mobile responsiveness with various screen sizes
   - Graceful degradation for low-end devices
   - Error recovery for visual component failures
   - Memory leak prevention for animations

Ensure all visual elements degrade gracefully under different conditions. Implement animations that provide useful feedback without being distracting or performance-intensive. Apply our defensive programming principles to visual systems, ensuring proper error handling, fallback displays, and self-healing mechanisms. Maintain the "ant farm of revolution" aesthetic described in the specification, with a clean, minimalist approach that works reliably across different browsers and devices.
```

### Step 19: Balancing and Tuning

```markdown
# Anti-Capitalist Idle Game: Balancing and Tuning

Let's implement systems for balancing and tuning the game economy and progression, following our defensive programming practices and data-driven approach. Please create:

1. Create balance-related data models first:
   - GameBalanceConfig interface with proper typing for all balance parameters
   - AnalyticsData interface for tracking gameplay metrics
   - DifficultyPreset interface for difficulty configurations
   - SimulationResult interface for playthrough testing
   - BalanceAdjustment interface for tuning operations

2. Implement an AnalyticsManager service as a singleton that:
   - Tracks resource generation rates over time with bounds validation
   - Monitors building purchase patterns with statistical analysis
   - Records task usage frequency with proper categorization
   - Measures progression speed through game stages with validation
   - Analyzes player decision patterns with error handling
   - Uses sampling techniques to minimize performance impact
   - Implements privacy-conscious data collection

3. Create a BalanceManager service as a singleton that:
   - Manages resource generation multipliers with validation
   - Controls building cost curves with bounds checking
   - Adjusts task reward scaling with consistency verification
   - Tunes opposition difficulty with player progress correlation
   - Regulates idle progression efficiency with proper constraints
   - Implements self-healing for out-of-bounds parameters
   - Uses factory methods for creating balanced game entities

4. Implement a configuration system with robust validation:
   - Centralizes game parameters with type safety
   - Provides balance presets (easy, normal, challenging) with validation
   - Handles dynamic difficulty adjustment with proper bounds
   - Manages per-resource and per-building tuning with consistency checks
   - Validates configuration changes before application
   - Prevents invalid configurations that could break gameplay

5. Create a simulation system with comprehensive testing:
   - Simulates playthroughs with various player strategies
   - Identifies progression bottlenecks with statistical analysis
   - Validates victory conditions with multiple paths
   - Checks resource balance with economic modeling
   - Provides detailed reports on simulation outcomes
   - Handles edge cases and unexpected gameplay patterns
   - Tests all difficulty settings for completability

6. Develop UI components for developers with error boundaries:
   - Debug panel (toggleable) with comprehensive controls
   - Parameter adjustment controls with bounds validation
   - Progression visualization with proper data rendering
   - Resource flow diagram with state validation
   - Performance monitoring with threshold alerts
   - Save state inspector with data manipulation safeguards

7. Implement safeguards for production environments:
   - Prevent debug tools in production builds
   - Add cryptographic verification for difficulty settings
   - Create proper separation between dev and player features
   - Implement audit logging for balance changes
   - Design safe reset mechanisms for fixing balance issues

8. Write extensive tests for balance systems:
   - Economy balance with mathematical modeling
   - Progression pacing with statistical analysis
   - Difficulty curves with player skill simulation
   - Long-term sustainability with extended playthroughs
   - Balance parameter validation with boundary testing
   - Configuration system integrity with corruption testing
   - Analytics accuracy with mock data validation

Focus on creating a balanced experience where idle and active play are both viable strategies. Apply our defensive programming principles to balance systems, ensuring proper validation of all parameters and protection against invalid states that could break game progression. Implement comprehensive simulation capabilities to identify and resolve balance issues before they affect players. Create flexible tuning mechanisms that can adapt to different player skill levels while maintaining game integrity.
```

### Step 20: Final Polish and Integration

```markdown
# Anti-Capitalist Idle Game: Final Polish and Integration

Let's complete the final polish and integration of all systems for the finished game. Please create:

1. Comprehensive integration of all systems:
   - Ensure all components communicate properly
   - Verify save/load works with all features
   - Check event triggers across game stages
   - Validate progression paths to victory

2. Performance optimizations:
   - Resource calculation efficiency
   - Render optimization for UI components
   - Memory usage improvements
   - Idle calculation optimizations

3. Browser compatibility fixes:
   - Cross-browser testing
   - Mobile device optimizations
   - Touch interface enhancements
   - Offline capability refinement

4. Accessibility final pass:
   - Screen reader testing
   - Keyboard navigation improvements
   - Color contrast verification
   - Motion sensitivity accommodation

5. Final game content:
   - Victory and ending sequences
   - Final achievement implementations
   - Complete encyclopedia entries
   - Narrative consistency check

6. Deployment preparation:
   - Production build configuration
   - Asset optimization
   - Loading performance
   - Error tracking and reporting

Include comprehensive tests for all integrated systems and perform full playthroughs to validate the complete game experience. Ensure the game performs well on target devices and browsers.
```