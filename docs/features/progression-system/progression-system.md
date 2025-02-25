# Progression System

## Overview
The Progression System tracks player advancement through the game by defining distinct stages, milestones, and achievements. This system serves as the backbone for unlocking new content, scaling game difficulty, and providing players with a sense of advancement and purpose as they progress through the anti-capitalist journey.

## Core Components

### Data Models
The progression system is built around several key data structures:

- **GameStage**: Enum defining the different stages of gameplay (EARLY, MID, LATE, END_GAME)
- **Milestone**: Interface representing accomplishments that advance the game stage
- **Achievement**: Interface representing special accomplishments with rewards
- **StageRequirement**: Interface defining criteria for advancing stages or unlocking content
- **AchievementReward**: Interface representing rewards given for unlocking achievements

### State Management
The system uses Redux for state management with a dedicated slice:

- **ProgressionState**: Maintains the current game stage, milestones, and achievements
- **Action Creators**: Handle milestone completion, achievement unlocking, and stage advancement
- **Selectors**: Provide filtered views into progression state (e.g., visible milestones, completed milestones)

### Components
The UI components provide a clear visualization of player progress:

- **ProgressionTracker**: Main component for displaying overall progression information
- **StageIndicator**: Visual representation of game stages and current progress
- **MilestoneList**: Interactive list of milestones with completion status
- **AchievementDisplay**: Grid display of achievements with filtering capabilities

### Services
The progression system is managed by a singleton service:

- **ProgressionManager**: Core service for evaluating progression requirements, managing milestone completion, and handling achievement unlocking

## Usage Guide

### Checking Progression Requirements
```typescript
// Use the ProgressionManager singleton to check requirements
const progressionManager = ProgressionManager.getInstance();

// Check if a milestone can be completed
if (progressionManager.canCompleteMilestone('milestone-id')) {
  // Complete the milestone
  progressionManager.completeMilestone('milestone-id');
}

// Check if an achievement can be unlocked
if (progressionManager.canUnlockAchievement('achievement-id')) {
  // Unlock the achievement
  progressionManager.unlockAchievement('achievement-id');
}
```

### Adding Progression UI to Components
```typescript
import { ProgressionTracker } from '../components/progression';

// In a React component
const GamePanel: React.FC = () => {
  return (
    <div className="game-panel">
      <h1>Anti-Capitalist Idle Game</h1>
      
      {/* Add the progression tracker */}
      <ProgressionTracker />
      
      {/* Other game components */}
    </div>
  );
};
```

## Integration
The progression system integrates with several other game systems:

1. **Resource System**: Milestone and achievement requirements often depend on resource accumulation
2. **Event System**: Story events can trigger milestones or be triggered by progression
3. **Timer System**: For time-based achievements and progression checks
4. **Game Loop**: Regular checks for progression updates

## Best Practices

1. **Define Clear Stages**: Each game stage should have a distinct theme and set of mechanics that build upon previous stages.

2. **Balance Milestone Requirements**: Ensure milestone requirements create a smooth difficulty curve that keeps players engaged without frustration.

3. **Create Meaningful Achievements**: Achievements should reward strategic gameplay and reinforce anti-capitalist values.

4. **Provide Visual Feedback**: Always give clear visual feedback when milestones are completed or achievements are unlocked.

5. **Update Progression Regularly**: The progression system should be regularly checked for updates (the ProgressionManager includes built-in periodic checks).

6. **Associate Unlocks with Progression**: Use the progression system to gate features and content, making advancement feel meaningful.

7. **Include Varied Requirements**: Mix different types of requirements (resource-based, time-based, event-based) to create diverse gameplay paths.