# Game Balance Configuration

## Overview

This document describes the game balance configuration system for the Anti-Capitalist Idle Game. The system allows designers and developers to easily adjust game parameters without modifying game logic code, facilitating rapid iteration and balance tweaking.

## Configuration File

The main configuration file is located at `/src/config/gameBalance.ts`. This file contains all tunable parameters affecting game balance, organized into logical categories:

- Resource Generation
- Upgrade Settings
- Game End Conditions
- Time Settings
- Structure Settings

## Resource Generation

Controls the base rates at which resources are generated, click power values, and maximum resource amounts.

```typescript
export const ResourceGeneration = {
  // Base generation rates per second
  BASE_RATES: {
    [ResourceId.COLLECTIVE_POWER]: 0.1,
    [ResourceId.OPPRESSION]: 0.05,
    [ResourceId.SOLIDARITY]: 0,
    [ResourceId.COMMUNITY_TRUST]: 0,
  },

  // Click power (how much is added per click)
  CLICK_POWER: {
    [ResourceId.COLLECTIVE_POWER]: 1,
    [ResourceId.SOLIDARITY]: 0.5,
    [ResourceId.COMMUNITY_TRUST]: 0.5,
  },

  // Resource maximum amounts
  MAX_AMOUNTS: {
    [ResourceId.COLLECTIVE_POWER]: 1000,
    [ResourceId.OPPRESSION]: 1000,
    [ResourceId.SOLIDARITY]: 500,
    [ResourceId.COMMUNITY_TRUST]: 500,
  }
};
```

## Upgrade Settings

Defines parameters for resource upgrades, including base costs and scaling factors.

```typescript
export const UpgradeSettings = {
  // Click power upgrade settings
  CLICK_POWER: {
    BASE_COST: 10,
    COST_SCALE_FACTOR: 1.5,
    POWER_INCREASE_PER_LEVEL: 1,
  },

  // Passive generation upgrade settings
  PASSIVE_GENERATION: {
    BASE_COST: 20,
    COST_SCALE_FACTOR: 1.8,
    GENERATION_BOOST_PER_LEVEL: 0.1, // Multiplier increase per level
  }
};
```

## Game End Conditions

Specifies the conditions under which the player can win or lose the game.

```typescript
export const GameEndConditions = {
  // Win conditions
  WIN: {
    // Power required to win (can be overridden by MAX_AMOUNTS)
    POWER_THRESHOLD: 1000,
  },

  // Lose conditions
  LOSE: {
    // How much oppression can exceed power before losing
    OPPRESSION_POWER_RATIO: 1.5,
  }
};
```

## Time Settings

Controls timing-related parameters like tick interval and game speed options.

```typescript
export const TimeSettings = {
  // Game tick interval in milliseconds
  TICK_INTERVAL: 1000,
  
  // Game speed (default is 1, higher means faster gameplay)
  DEFAULT_GAME_SPEED: 1,
  
  // Available game speeds for debug/testing
  AVAILABLE_SPEEDS: [0.5, 1, 2, 5, 10]
};
```

## Structure Settings

Configures behavior of game structures (buildings) that generate resources.

```typescript
export const StructureSettings = {
  // Base worker efficiency (if not fully staffed)
  MIN_EFFICIENCY: 0.1,
  
  // Level multiplier for structures
  LEVEL_MULTIPLIER: 0.25, // Each level increases production by 25%
};
```

## Helper Functions

The configuration file also includes helper functions to perform common calculations based on the configuration values:

- `calculateClickPower(resourceId, upgradeLevel)` - Calculates click power based on upgrade level
- `calculatePassiveGeneration(resourceId, baseRate, upgradeLevel)` - Calculates passive generation rate based on upgrade level
- `calculateUpgradeCost(baseValue, scaleFactor, currentLevel)` - Calculates upgrade cost based on current level

## Usage

To adjust game balance:

1. Modify values in the `gameBalance.ts` file
2. Test gameplay to ensure changes produce the desired effect
3. Iterate as needed

## Integration

The game balance configuration is integrated with the following systems:

- Resource Manager - Uses config values for resource generation and upgrade costs
- Initial Resource Setup - Uses config for starting values
- Game End Conditions - Uses config for win/lose thresholds
- Structure Management - Uses config for building productivity

## Tips for Balancing

When adjusting balance parameters, consider:

- Resource generation rates should feel meaningful but not trivial
- Upgrade costs should provide a sense of progression without excessive grinding
- The oppression rate should create tension but not frustrate players
- Structure efficiencies should reward strategic decisions

## Validation

After making changes to balance parameters, always:

1. Run the full test suite (`npm test`)
2. Playtest the game manually for at least 5 minutes
3. Check both early and late game behavior