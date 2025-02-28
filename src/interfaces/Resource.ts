/**
 * Interface for game resources
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

  /** Amount of resource gained per click */
  clickPower?: number;

  /** Description of the resource and its purpose */
  description: string;

  /** Whether the resource is visible to the player */
  unlocked: boolean;

  /** Optional category for grouping related resources */
  category?: ResourceCategory;

  /** Tags for filtering and special behaviors */
  tags?: string[];

  /** Optional display settings for UI */
  display?: {
    color?: string;
    icon?: string;
    priority?: number;
  };

  /**
   * Properly typed string indexing for accessing resource properties
   * This allows properties like resource['amount'] to work with type safety
   */
  [key: string]:
    | string
    | number
    | boolean
    | ResourceCategory
    | undefined
    | string[]
    | {
        color?: string;
        icon?: string;
        priority?: number;
      };
}

/**
 * Resource categories for organization and filtering
 */
export enum ResourceCategory {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ADVANCED = 'advanced',
  SPECIAL = 'special',
  THREAT = 'threat',
}

/**
 * Common resource tags
 */
export const ResourceTags = {
  BASIC: 'basic',
  CURRENCY: 'currency',
  MATERIAL: 'material',
  CONSUMABLE: 'consumable',
  CRAFTABLE: 'craftable',
  LIMITED: 'limited',
  SPECIAL: 'special',
};
