import { Resource, UpgradeType } from '../models/resource';

/**
 * Initial resources available in the game
 */
export const INITIAL_RESOURCES: Record<string, Resource> = {
  'collective-power': {
    id: 'collective-power',
    name: 'Collective Bargaining Power',
    amount: 0,
    maxAmount: 1000,
    perSecond: 0.1, // Small starting amount
    basePerSecond: 0.1, // Base generation rate before upgrades
    clickPower: 1, // Initial click power
    description: 'The core resource representing the movement\'s ability to negotiate and demand change',
    unlocked: true, // Available from the start
    category: 'PRIMARY',
    upgrades: {
      [UpgradeType.CLICK_POWER]: 0, // Start at level 0 (1 power)
      [UpgradeType.PASSIVE_GENERATION]: 0, // Start at level 0 (no bonus)
    }
  },
  
  'oppression': {
    id: 'oppression',
    name: 'Corporate Oppression',
    amount: 0,
    maxAmount: 1000, // Same as collective power
    perSecond: 0.05, // Consistent passive generation
    basePerSecond: 0.05, // Base generation rate (static)
    description: 'Represents the opposition to your movement. If this exceeds your collective power, you will lose.',
    unlocked: true, // Available from the start
    category: 'THREAT',
    upgrades: {
      [UpgradeType.CLICK_POWER]: 0,
      [UpgradeType.PASSIVE_GENERATION]: 0,
    }
  },
  
  'solidarity': {
    id: 'solidarity',
    name: 'Solidarity',
    amount: 0,
    maxAmount: 500,
    perSecond: 0,
    basePerSecond: 0,
    description: 'Represents unity among workers and community members, essential for effective organizing',
    unlocked: false, // Initially locked
    category: 'SOCIAL',
    upgrades: {
      [UpgradeType.CLICK_POWER]: 0,
      [UpgradeType.PASSIVE_GENERATION]: 0,
    }
  },
  
  'community-trust': {
    id: 'community-trust',
    name: 'Community Trust',
    amount: 0,
    maxAmount: 500,
    perSecond: 0,
    basePerSecond: 0,
    description: 'Represents the community\'s faith in the movement, vital for gaining broader support',
    unlocked: false, // Initially locked
    category: 'SOCIAL',
    upgrades: {
      [UpgradeType.CLICK_POWER]: 0,
      [UpgradeType.PASSIVE_GENERATION]: 0,
    }
  },
};

/**
 * Resource IDs for easy reference
 */
export enum ResourceId {
  COLLECTIVE_POWER = 'collective-power',
  OPPRESSION = 'oppression',
  SOLIDARITY = 'solidarity',
  COMMUNITY_TRUST = 'community-trust',
}