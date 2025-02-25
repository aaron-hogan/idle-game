# Milestone Tracking System

## Overview
The milestone tracking system monitors player progress and rewards achievements as they accumulate resources and complete game objectives. This document explains how resources like "collective-power" are tracked toward milestones and displayed in the debug panel.

## Core Components

### Resource Definitions
Resources are defined in `/src/constants/resources.ts` with the following structure:
```typescript
export const INITIAL_RESOURCES: Record<string, Resource> = {
  'collective-power': {
    id: 'collective-power',
    name: 'Collective Bargaining Power',
    amount: 0,
    maxAmount: 1000,
    perSecond: 0.1,
    description: 'The core resource representing the movement\'s ability to negotiate and demand change',
    unlocked: true,
    category: 'PRIMARY',
  },
  // Other resources...
}
```

### Milestone Definitions
Milestones are defined in `/src/data/progression/milestones.ts` and structured by game stage:
```typescript
export const earlyGameMilestones: Milestone[] = [
  {
    id: 'first-collective-power',
    name: 'First Collective Power',
    description: 'Begin your journey by gathering initial collective bargaining power.',
    stage: GameStage.EARLY,
    type: MilestoneType.AWARENESS,
    completed: false,
    requirements: [
      {
        type: 'resourceAmount',
        target: 'collective-power',
        value: 10
      }
    ],
    unlocks: ['basic-resources'],
    order: 1,
    visible: true
  },
  // Other milestones...
]
```

### Progression Manager
The ProgressionManager in `/src/managers/progression/ProgressionManager.ts` handles:
- Checking milestone requirements against current game state
- Calculating progress percentages
- Completing milestones when requirements are met
- Unlocking achievements and providing rewards

Key methods:
- `checkRequirements()`: Evaluates if requirements are met
- `canCompleteMilestone()`: Checks if a milestone can be completed
- `completeMilestone()`: Marks a milestone as complete and triggers rewards
- `checkAllProgressionItems()`: Updates all milestone and achievement statuses

### Debug Panel Integration
The debug panel has two tabs relevant to milestone tracking:

1. **ResourceDebugTab**: Shows resource amounts and progress toward next milestone
```typescript
// From ResourceDebugTab.tsx
resourceRequirements[resource.id] = {
  nextTarget: targetAmount,
  milestone: milestone.name,
  progress: currentAmount / targetAmount * 100
};
```

2. **ProgressionDebugTab**: Shows all milestones and their completion status
```typescript
// From ProgressionDebugTab.tsx
<td>{milestone.completed ? '✓' : '✗'}</td>
```

## Usage Guide

### How Resources Count Toward Milestones
1. Resources accumulate in the game state based on production rates
2. The ProgressionManager periodically checks if milestone requirements are met
3. For resource-based milestones, it compares current resource amounts to required thresholds
4. Progress percentage is calculated as: `(currentAmount / targetAmount) * 100`
5. When a resource amount exceeds the milestone requirement, the milestone becomes eligible for completion

### Debugging Milestone Progress
The debug panel provides visibility into milestone tracking:
- Resource tab shows each resource with its next milestone target and completion percentage
- Progression tab shows all milestones with their current completion status
- Console debugging is available via `debug.progressionManager().checkAllProgressionItems()`

## Integration with Other Systems
- **Resource Generation**: Resource accumulation directly affects milestone progress
- **Game Loop**: The game loop triggers milestone checks at regular intervals
- **Redux Store**: All milestone and resource data is stored in the Redux state
- **UI Components**: Milestone progress can be displayed in various UI elements

## Best Practices

### Defining New Milestones
When adding new milestones:
1. Use consistent ID naming (kebab-case)
2. Verify resource IDs match exactly with defined resources
3. Order milestones logically within their game stage
4. Set appropriate visibility flags

### Testing Milestone Progress
To test milestone tracking:
1. Use the debug panel to monitor resource accumulation
2. Verify progress percentage calculations
3. Check milestone completion at threshold values
4. Ensure proper rewards and unlocks are triggered