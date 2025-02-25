/**
 * Mock Resource interface for tests
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: string;
  
  /** Display name of the resource */
  name: string;
  
  /** Current amount the player has */
  amount: number;
  
  /** Maximum amount that can be stored */
  maxAmount: number;
  
  /** Rate of generation per second */
  perSecond: number;
  
  /** Description of the resource and its purpose */
  description: string;
  
  /** Whether the resource is visible to the player */
  unlocked: boolean;
  
  /** Allow string indexing for tests */
  [key: string]: any;
}

/**
 * Resource categories for organization and filtering
 */
export enum ResourceCategory {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ADVANCED = 'advanced',
  SPECIAL = 'special'
}