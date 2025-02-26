/**
 * Game Balance Configuration
 * 
 * This file contains all configurable values that affect game balance.
 * Edit these values to adjust the difficulty, progression rate, and overall game experience.
 * 
 * IMPORTANT: After changing values, run tests to ensure the game still functions properly.
 */

// Define resource IDs directly to avoid circular imports
export const GameResourceIds = {
  COLLECTIVE_POWER: 'collective-power',
  OPPRESSION: 'oppression',
  SOLIDARITY: 'solidarity',
  COMMUNITY_TRUST: 'community-trust',
};

/**
 * Resource Generation Settings
 */
export const ResourceGeneration = {
  // Base generation rates per second
  BASE_RATES: {
    [GameResourceIds.COLLECTIVE_POWER]: 0.1,
    [GameResourceIds.OPPRESSION]: 0.05,
    [GameResourceIds.SOLIDARITY]: 0,
    [GameResourceIds.COMMUNITY_TRUST]: 0,
  },

  // Click power (how much is added per click)
  CLICK_POWER: {
    [GameResourceIds.COLLECTIVE_POWER]: 1,
    [GameResourceIds.SOLIDARITY]: 0.5,
    [GameResourceIds.COMMUNITY_TRUST]: 0.5,
  },

  // Resource maximum amounts
  MAX_AMOUNTS: {
    [GameResourceIds.COLLECTIVE_POWER]: 1000,
    [GameResourceIds.OPPRESSION]: 1000,
    [GameResourceIds.SOLIDARITY]: 500,
    [GameResourceIds.COMMUNITY_TRUST]: 500,
  }
};

/**
 * Upgrade Settings
 */
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

/**
 * Game End Conditions
 */
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

/**
 * Time Settings
 */
export const TimeSettings = {
  // Game tick interval in milliseconds
  TICK_INTERVAL: 1000,
  
  // Game speed (default is 1, higher means faster gameplay)
  DEFAULT_GAME_SPEED: 1,
  
  // Available game speeds for debug/testing
  AVAILABLE_SPEEDS: [0.5, 1, 2, 5, 10]
};

/**
 * Structure Settings
 * For buildings and other structures that generate resources
 */
export const StructureSettings = {
  // Base worker efficiency (if not fully staffed)
  MIN_EFFICIENCY: 0.1,
  
  // Level multiplier for structures
  LEVEL_MULTIPLIER: 0.25, // Each level increases production by 25%
};

/**
 * Helper function to calculate click power for a resource at a given upgrade level
 */
export function calculateClickPower(resourceId: string, upgradeLevel: number): number {
  const basePower = ResourceGeneration.CLICK_POWER[resourceId as keyof typeof ResourceGeneration.CLICK_POWER] || 1;
  return basePower + (upgradeLevel * UpgradeSettings.CLICK_POWER.POWER_INCREASE_PER_LEVEL);
}

/**
 * Helper function to calculate passive generation rate for a resource at a given upgrade level
 */
export function calculatePassiveGeneration(resourceId: string, baseRate: number, upgradeLevel: number): number {
  // Oppression should always use the constant rate
  if (resourceId === GameResourceIds.OPPRESSION) {
    return ResourceGeneration.BASE_RATES[GameResourceIds.OPPRESSION];
  }
  
  const boost = 1 + (upgradeLevel * UpgradeSettings.PASSIVE_GENERATION.GENERATION_BOOST_PER_LEVEL);
  return baseRate * boost;
}

/**
 * Helper function to calculate upgrade cost based on current level
 */
export function calculateUpgradeCost(
  baseValue: number, 
  scaleFactor: number, 
  currentLevel: number
): number {
  return Math.floor(baseValue * Math.pow(scaleFactor, currentLevel));
}