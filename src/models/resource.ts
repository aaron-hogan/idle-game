/**
 * Types of resource upgrades available
 */
export enum UpgradeType {
  CLICK_POWER = 'clickPower',
  PASSIVE_GENERATION = 'passiveGeneration',
}

/**
 * Tracks upgrades for a resource
 */
export interface ResourceUpgrades {
  /** Click power upgrade level */
  [UpgradeType.CLICK_POWER]?: number;

  /** Passive generation upgrade level */
  [UpgradeType.PASSIVE_GENERATION]?: number;
}

/**
 * Represents a resource in the game that players can collect or spend
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

  /** Base rate of generation without upgrades */
  basePerSecond?: number;

  /** Amount of resource gained per click */
  clickPower?: number;

  /** Description of the resource and its purpose */
  description: string;

  /** Whether the resource is visible to the player */
  unlocked: boolean;

  /** Resource category for organization */
  category: string;

  /** Optional icon for the resource */
  icon?: string;

  /** Tracks upgrade levels for this resource */
  upgrades?: ResourceUpgrades;
}
