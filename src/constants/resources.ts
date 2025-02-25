import { Resource } from '../models/resource';

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
    description: 'The core resource representing the movement\'s ability to negotiate and demand change',
    unlocked: true, // Available from the start
    category: 'PRIMARY',
  },
  
  'solidarity': {
    id: 'solidarity',
    name: 'Solidarity',
    amount: 0,
    maxAmount: 500,
    perSecond: 0,
    description: 'Represents unity among workers and community members, essential for effective organizing',
    unlocked: false, // Initially locked
    category: 'SOCIAL',
  },
  
  'community-trust': {
    id: 'community-trust',
    name: 'Community Trust',
    amount: 0,
    maxAmount: 500,
    perSecond: 0,
    description: 'Represents the community\'s faith in the movement, vital for gaining broader support',
    unlocked: false, // Initially locked
    category: 'SOCIAL',
  },
};

/**
 * Resource IDs for easy reference
 */
export enum ResourceId {
  COLLECTIVE_POWER = 'collective-power',
  SOLIDARITY = 'solidarity',
  COMMUNITY_TRUST = 'community-trust',
}