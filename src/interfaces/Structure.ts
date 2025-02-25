/**
 * Interface for game structures (buildings)
 */
export interface Structure {
  /** Unique identifier for the structure */
  id: string;
  
  /** Display name of the structure */
  name: string;
  
  /** Description of the structure and its effects */
  description: string;
  
  /** Current level of the structure */
  level: number;
  
  /** Maximum possible level */
  maxLevel: number;
  
  /** Resource costs to build or upgrade, mapping resource IDs to amounts */
  cost: Record<string, number>;
  
  /** Resources produced per second, mapping resource IDs to amounts */
  production: Record<string, number>;
  
  /** Whether the structure is visible to the player */
  unlocked: boolean;
  
  /** Current number of workers assigned to this structure */
  workers: number;
  
  /** Maximum number of workers that can be assigned */
  maxWorkers: number;
  
  /** Optional category for grouping related structures */
  category?: StructureCategory;
  
  /** Tags for filtering and special behaviors */
  tags?: string[];
  
  /** Optional display settings for UI */
  display?: {
    color?: string;
    icon?: string;
    priority?: number;
  };
}

/**
 * Structure categories for organization and filtering
 */
export enum StructureCategory {
  PRODUCTION = 'production',
  STORAGE = 'storage',
  SPECIAL = 'special',
  UTILITY = 'utility'
}

/**
 * Common structure tags
 */
export const StructureTags = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  AUTOMATED: 'automated',
  MANUAL: 'manual',
  SPECIAL: 'special'
};