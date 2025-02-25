# Anti-Capitalist Idle Game: Progression System Plan

## Overview
The Progression System will track player advancement through the game by defining distinct stages, milestones, and achievements. This system will serve as the backbone for unlocking new content, scaling game difficulty, and providing players with a sense of advancement and purpose.

## Goals
- Create a flexible stage-based progression structure (early, mid, late game)
- Implement milestone tracking that unlocks new game content and mechanics
- Design a achievement system that rewards player actions that align with anti-capitalist values
- Build UI components to visualize progression and celebrate player achievements
- Connect progression to other game systems (resources, events, opposition)

## Approach
We'll implement a singleton ProgressionManager that tracks the player's current stage, completed milestones, and unlocked achievements. The system will use Redux for state management and provide hooks for other systems to react to progression changes. The progression system will be closely integrated with the event system to trigger stage transitions and milestone completions.

## Timeline
- Core data models and ProgressionManager: 2 days
- Redux integration and action creators: 1 day
- UI components for progression visualization: 2 days
- Integration with other game systems: 2 days
- Testing and refinement: 1 day

## Future Enhancements
- Branching progression paths based on player choices
- Social movement growth mechanics tied to progression
- Player-defined goals and custom achievement creation
- Advanced analytics to track player progression patterns
- Adaptive difficulty scaling based on progression speed

## Implementation Prompt

```markdown
# Anti-Capitalist Idle Game: Progression System Implementation

Let's implement a comprehensive progression system for our anti-capitalist idle game, following our defensive programming patterns and singleton architecture.

1. Create the Progression data models first:
   - `GameStage` enum for different stages (EARLY, MID, LATE, END_GAME)
   - `Milestone` interface with proper typing for tracking accomplishments
   - `Achievement` interface for special accomplishments with rewards
   - `ProgressionState` interface for overall progression state
   - `StageRequirement` interface to define criteria for advancing stages
   - `MilestoneType` and `AchievementType` enums for categorization

2. Implement a ProgressionManager service as a singleton that:
   - Manages player progression through game stages with validation
   - Tracks milestone completion with proper error handling
   - Manages achievement unlocking with defensive programming
   - Uses factory methods for creating milestone and achievement instances
   - Implements self-healing for inconsistent progression states
   - Coordinates with EventManager, ResourceManager for progression triggers
   - Exposes getInstance() static method for access from other systems
   - Provides methods to check if content should be unlocked based on progression

3. Create Redux slice for progression with:
   - Properly typed state structure for stages, milestones, and achievements
   - Action creators with validation for stage advancement
   - Action creators for milestone completion and achievement unlocking
   - Error handling in reducers for all edge cases (invalid stage transitions, etc.)
   - Memoized selectors for derived data (current stage, available content, etc.)

4. Implement progression action creators with proper type safety:
   - checkStageAdvancement with condition validation
   - completeMilestone with error handling
   - unlockAchievement with state verification
   - resetProgression with confirmation safety

5. Define initial progression elements with proper structure:
   - Early game milestones focused on resource gathering and awareness
   - Mid game milestones focused on organization building and resistance
   - Late game milestones focused on system transformation
   - Special achievements for ethical and strategic choices

6. Create UI components for progression with error boundaries:
   - ProgressionTracker component with proper null/undefined handling
   - StageIndicator showing current and upcoming stages
   - MilestoneList with defensive rendering of completion status
   - AchievementDisplay with state validation and unlock animations
   - ProgressionSummary to show overall game progress

7. Integrate with game systems using defensive patterns:
   - Connection to Resource system to trigger milestones based on accumulation
   - Connection to Event system to trigger progression based on story events
   - Connection to Timer system to track timed achievements
   - Handle edge cases like state loading/saving and game resets
   - Prepare for future integration with Opposition and Moral systems

8. Write comprehensive tests for:
   - Progression singleton initialization and state management
   - Stage transition logic and requirements validation
   - Milestone and achievement unlocking mechanics
   - Component rendering with different progression states
   - Integration with other systems (events, resources)
   - Type safety and null handling throughout the system
```