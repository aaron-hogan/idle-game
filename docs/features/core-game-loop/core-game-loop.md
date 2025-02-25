# Core Game Loop Documentation

## Overview
The core game loop is the fundamental gameplay cycle that drives player engagement in our idle game. It consists of clicking to generate resources, reaching milestones, and upgrading resource production to tackle increasingly difficult milestones.

## Core Components

### ClickableResource Component
The main interactive element that allows players to generate resources by clicking. Features include:
- Visual feedback on click (animations, particles)
- Display of current click power (resources per click)
- Connection to the ResourceManager for resource generation

### ResourceManager Extensions
Added functionality to the ResourceManager to support click-based resource generation:
- `handleResourceClick`: Generates resources based on click power
- `upgradeClickPower`: Increases resources generated per click
- Resource click modifiers and multipliers

### Upgrade System
A system for players to spend resources to enhance their click power:
- Tiered upgrades with increasing costs
- Clear display of current level and next upgrade benefits
- Cost scaling to create progression curve

### Milestone Integration
Connection between resource generation and the progression system:
- Visual feedback when milestones are reached
- Clear display of next milestone requirements
- Progress tracking towards milestones

## Usage Guide

### Resource Generation
Resources are generated through two primary methods:
1. **Clicking**: Player actively clicks the ClickableResource to generate immediate resources
2. **Passive Generation**: Resources continue to accumulate over time based on perSecond rates

```typescript
// Example: Handle a resource click
const resourceManager = ResourceManager.getInstance();
resourceManager.handleResourceClick('collective-power');
```

### Upgrades
Players can purchase upgrades to increase their click power:

```typescript
// Example: Purchase a click power upgrade
const resourceManager = ResourceManager.getInstance();
resourceManager.upgradeClickPower('collective-power');
```

### Milestone Tracking
The game automatically tracks progress towards milestones:

```typescript
// Example: Check milestone progress after a click
function afterClickHandler() {
  const progressionManager = ProgressionManager.getInstance();
  progressionManager.checkMilestoneProgress();
}
```

## Integration with Other Systems

### Resource System
- Extends the existing Resource interface with click-related properties
- Uses the Redux store for state management
- Leverages existing resource display components with click additions

### Progression System
- Utilizes the milestone system to track player progress
- Triggers milestone checks when resources change via clicking
- Updates game stage based on milestone completion

### User Interface
- Integrated with the main App component
- Uses consistent styling and animations
- Provides clear feedback for all player actions

## Best Practices

1. **Click Interactions**
   - Keep click feedback responsive and immediate
   - Ensure resource updates are visually clear
   - Don't require too many clicks for basic progression

2. **Upgrade Balance**
   - Scale upgrade costs and benefits to create a smooth progression curve
   - Make early upgrades attainable within minutes
   - Ensure each upgrade feels meaningful

3. **Visual Feedback**
   - Provide clear indication when milestones are reached
   - Use animations that are satisfying but not distracting
   - Keep resource numbers legible and up-to-date

4. **Progression Clarity**
   - Always show the player their next goal
   - Make milestone requirements understandable
   - Show progress towards the next milestone/stage

## Implementation Notes
The core game loop implementation focuses on simplicity and extensibility, allowing for future features to be integrated easily. The click-based resource generation serves as the foundation for player engagement while the milestone and upgrade systems provide short and long-term goals.