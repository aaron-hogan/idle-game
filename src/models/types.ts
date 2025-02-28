/**
 * Game state interfaces and types
 */

// Resource definition
export interface Resource {
  id: string;
  name: string;
  amount: number;
  maxAmount: number;
  perSecond: number;
  description: string;
  unlocked: boolean;
  category?: string;
  icon?: string;
}

/**
 * Null object pattern for Resource
 * Used when a resource is requested but not found
 */
export const NULL_RESOURCE: Resource = {
  id: 'null-resource',
  name: 'Unknown Resource',
  amount: 0,
  maxAmount: 0,
  perSecond: 0,
  description: 'This resource does not exist.',
  unlocked: false,
  category: 'unknown',
};

// Structure (building) definition
export interface Structure {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: Record<string, number>;
  production: Record<string, number>;
  unlocked: boolean;
  workers: number;
  maxWorkers: number;
  category: string;
  icon?: string;
}

/**
 * Null object pattern for Structure
 * Used when a structure is requested but not found
 */
export const NULL_STRUCTURE: Structure = {
  id: 'null-structure',
  name: 'Unknown Structure',
  description: 'This structure does not exist.',
  level: 0,
  maxLevel: 0,
  cost: {},
  production: {},
  unlocked: false,
  workers: 0,
  maxWorkers: 0,
  category: 'unknown',
};

// Main game state
export interface GameState {
  resources: Record<string, Resource>;
  structures: Record<string, Structure>;
  gameStage: number;
  lastSaveTime: number;
  totalPlayTime: number;
}
