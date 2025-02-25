/**
 * Represents a structure or building that can be constructed in the game
 */
export interface Structure {
  /** Unique identifier for the structure */
  id: string;
  
  /** Display name of the structure */
  name: string;
  
  /** Description of the structure and its purpose */
  description: string;
  
  /** Current upgrade level of the structure */
  level: number;
  
  /** Maximum possible upgrade level */
  maxLevel: number;
  
  /** Resources required to purchase or upgrade the structure */
  cost: Record<string, number>;
  
  /** Resources produced by the structure per second */
  production: Record<string, number>;
  
  /** Whether the structure is visible to the player */
  unlocked: boolean;
  
  /** Number of organizers currently assigned to the structure */
  workers: number;
  
  /** Maximum number of organizers that can be assigned */
  maxWorkers: number;
  
  /** Category of the structure (e.g., 'production', 'community', etc.) */
  category: string;
}