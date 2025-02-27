import { Structure, NULL_RESOURCE } from '../models/types';
import { Resource } from '../models/resource';
import { INITIAL_RESOURCES, ResourceId } from '../constants/resources';
import { invariant } from '../utils/errorUtils';
import { validateObject } from '../utils/validationUtils';
import { GameLoop } from '../core/GameLoop';
import { UpgradeType } from '../models/resource';
import { 
  ResourceGeneration, 
  UpgradeSettings, 
  StructureSettings,
  calculateClickPower,
  calculatePassiveGeneration,
  calculateUpgradeCost
} from '../config/gameBalance';

// Import only the types needed for dependency injection
import type { AppDispatch, RootState } from '../state/store';
import type { 
  addResource, 
  updateResourceAmount, 
  addResourceAmount, 
  updateResourcePerSecond,
  toggleResourceUnlocked,
  updateClickPower,
  updateUpgradeLevel,
  updateBaseResourcePerSecond,
} from '../state/resourcesSlice';

/**
 * Dependencies needed by ResourceManager
 */
export interface ResourceManagerDependencies {
  dispatch: AppDispatch;
  getState: () => RootState;
  actions: {
    addResource: typeof addResource;
    updateResourceAmount: typeof updateResourceAmount;
    addResourceAmount: typeof addResourceAmount;
    updateResourcePerSecond: typeof updateResourcePerSecond;
    toggleResourceUnlocked: typeof toggleResourceUnlocked;
    updateClickPower: typeof updateClickPower;
    updateUpgradeLevel: typeof updateUpgradeLevel;
    updateBaseResourcePerSecond: typeof updateBaseResourcePerSecond;
  };
}

/**
 * Manages all resource-related operations
 */
export class ResourceManager {
  private static instance: ResourceManager | null = null;
  private dispatch: AppDispatch;
  private getState: () => RootState;
  private actions: ResourceManagerDependencies['actions'];
  private unregisterHandler: (() => void) | null = null;
  
  /**
   * Constructor that accepts dependencies
   * @param dependencies The dependencies needed by ResourceManager
   */
  constructor(dependencies: ResourceManagerDependencies) {
    this.dispatch = dependencies.dispatch;
    this.getState = dependencies.getState;
    this.actions = dependencies.actions;
  }
  
  /**
   * Get or create the singleton instance of ResourceManager
   * @param dependencies The dependencies needed by ResourceManager or store for backward compatibility
   * @returns The singleton ResourceManager instance
   */
  public static getInstance(dependenciesOrStore?: ResourceManagerDependencies | any): ResourceManager {
    if (!ResourceManager.instance) {
      if (!dependenciesOrStore) {
        // Create instance without dependencies, initialize() will be called later
        ResourceManager.instance = new ResourceManager({
          dispatch: (() => {}) as any, // Placeholder
          getState: (() => ({})) as any, // Placeholder
          actions: {} as any // Placeholder
        });
      } else if ('dispatch' in dependenciesOrStore && 'getState' in dependenciesOrStore && 'actions' in dependenciesOrStore) {
        // If full dependencies are provided
        ResourceManager.instance = new ResourceManager(dependenciesOrStore as ResourceManagerDependencies);
      } else {
        // If a store is provided (backward compatibility)
        const instance = new ResourceManager({
          dispatch: (() => {}) as any, // Placeholder
          getState: (() => ({})) as any, // Placeholder  
          actions: {} as any // Placeholder
        });
        instance.initialize(dependenciesOrStore);
        ResourceManager.instance = instance;
      }
    } else if (dependenciesOrStore && !('dispatch' in dependenciesOrStore && 'getState' in dependenciesOrStore && 'actions' in dependenciesOrStore)) {
      // If instance exists and a store is provided, initialize with it (backward compatibility)
      ResourceManager.instance.initialize(dependenciesOrStore);
    }
    
    return ResourceManager.instance;
  }
  
  /**
   * Initialize the manager with a Redux store
   * For backwards compatibility with existing code
   * @param store The Redux store
   * @deprecated Use dependency injection through constructor instead
   */
  public initialize(store: any): void {
    // Check if already initialized properly
    try {
      this.ensureInitialized();
      return; // Already initialized
    } catch (e) {
      // Continue with initialization
    }

    // Import necessary action creators
    const resourceActions = require('../state/resourcesSlice');
    
    // Set up dependencies from store
    this.dispatch = store.dispatch;
    this.getState = store.getState;
    this.actions = {
      addResource: resourceActions.addResource,
      updateResourceAmount: resourceActions.updateResourceAmount,
      addResourceAmount: resourceActions.addResourceAmount,
      updateResourcePerSecond: resourceActions.updateResourcePerSecond,
      toggleResourceUnlocked: resourceActions.toggleResourceUnlocked,
      updateClickPower: resourceActions.updateClickPower,
      updateUpgradeLevel: resourceActions.updateUpgradeLevel,
      updateBaseResourcePerSecond: resourceActions.updateBaseResourcePerSecond,
    };
  }

  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.dispatch !== undefined && this.getState !== undefined && this.actions !== undefined,
      'ResourceManager not properly initialized with dependencies',
      'ResourceManager'
    );
  }
  
  /**
   * Initialize resources in the Redux store
   */
  initializeResources(): void {
    // Add each initial resource to the store
    Object.values(INITIAL_RESOURCES).forEach(resource => {
      if (validateObject(resource, ['id', 'name', 'amount', 'perSecond', 'unlocked'], 'initializeResources')) {
        this.dispatch(this.actions.addResource(resource));
      }
    });
  }
  
  /**
   * Update all resources based on elapsed game time
   * @param gameTimeInSeconds Scaled game time elapsed since last update (in seconds)
   */
  updateResources(gameTimeInSeconds: number): void {
    if (gameTimeInSeconds < 0) {
      return; // Don't process negative time
    }
    
    if (gameTimeInSeconds === 0) {
      // Even if elapsed time is 0, we'll add a tiny amount to ensure progress
      // This is mainly for debugging the issue with game not ticking
      gameTimeInSeconds = 0.01;
    }
    
    const state = this.getState();
    // Use any type to work with both state formats
    const resources: any = state.resources;
    
    // Special handling for oppression resource - always ensure it's generated
    const oppression = resources.byId ? resources.byId[ResourceId.OPPRESSION] : resources[ResourceId.OPPRESSION];
    
    if (oppression) {
      // Get the oppression rate from game balance config
      const OPPRESSION_RATE = ResourceGeneration.BASE_RATES[ResourceId.OPPRESSION];
      
      // If the perSecond value is incorrect, update it
      if (oppression.perSecond !== OPPRESSION_RATE) {
        this.dispatch(this.actions.updateResourcePerSecond({
          id: ResourceId.OPPRESSION,
          perSecond: OPPRESSION_RATE,
        }));
      }
      
      const oppressionAmount = OPPRESSION_RATE * gameTimeInSeconds;
      
      // Only dispatch if we have a positive amount to add
      if (oppressionAmount > 0) {
        this.dispatch(this.actions.addResourceAmount({
          id: ResourceId.OPPRESSION,
          amount: oppressionAmount,
        }));
      }
    }
    
    // For each resource, add the generated amount based on the game time that passed
    // Handle both formats of resources (direct object or byId structure)
    const resourceValues = resources.byId ? Object.values(resources.byId) : Object.values(resources);
    resourceValues.forEach((resource: unknown) => {
      if (resource && typeof resource === 'object' && 
          'perSecond' in resource && typeof resource.perSecond === 'number' && 
          'id' in resource && typeof resource.id === 'string') {
            
        // Skip oppression since we already handled it
        if (resource.id === ResourceId.OPPRESSION) {
          return;
        }
            
        if (resource.perSecond > 0) {
          // Calculate generation based on scaled game time
          const generatedAmount = resource.perSecond * gameTimeInSeconds;
          
          this.dispatch(this.actions.addResourceAmount({
            id: resource.id,
            amount: generatedAmount,
          }));
        } else if (!('name' in resource) || !resource.name) {
          // Log only occasionally to reduce console spam
          if (Math.random() < 0.01) { // Only log 1% of the time
            console.warn(`ResourceManager: Found malformed resource with id ${resource.id}`);
          }
        }
      }
    });
  }
  
  /**
   * Calculate and update resource generation rates based on structures
   */
  calculateResourceGeneration(): void {
    const state = this.getState();
    const resources = state.resources;
    const structures = state.structures;
    
    // First, calculate base generation rates (from structures and initial values)
    const baseRates: Record<string, number> = {};
    
    // Set base rates from initial resource definitions
    Object.values(INITIAL_RESOURCES).forEach(resource => {
      baseRates[resource.id] = resource.perSecond;
    });
    
    // Add production from all structures
    Object.values(structures).forEach((structure: unknown) => {
      // Skip structures that aren't built or don't have workers assigned
      if (!structure || typeof structure !== 'object' ||
          !('unlocked' in structure) || !('level' in structure) ||
          !('workers' in structure) || !('maxWorkers' in structure) ||
          !('production' in structure) ||
          structure.unlocked !== true || 
          typeof structure.level !== 'number' || structure.level <= 0) {
        return;
      }
      
      // Calculate efficiency based on worker assignment
      const workers = typeof structure.workers === 'number' ? structure.workers : 0;
      const maxWorkers = typeof structure.maxWorkers === 'number' ? structure.maxWorkers : 1;
      const efficiency = workers > 0 ? workers / maxWorkers : StructureSettings.MIN_EFFICIENCY;
      
      // Ensure production exists and is an object before getting entries
      if (structure.production && typeof structure.production === 'object') {
        // Add production to each resource this structure generates
        Object.entries(structure.production as Record<string, unknown>).forEach(([resourceId, baseProduction]) => {
          // Skip if the production is not a valid number
          if (typeof baseProduction !== 'number' || isNaN(baseProduction)) {
            return;
          }
          
          // Scale production by level and worker efficiency
          const level = typeof structure.level === 'number' ? structure.level : 0;
          const levelMultiplier = 1 + (level * StructureSettings.LEVEL_MULTIPLIER);
          const actualProduction = baseProduction * levelMultiplier * efficiency;
          
          // Add to the base rate (or initialize if it doesn't exist)
          baseRates[resourceId] = (baseRates[resourceId] || 0) + actualProduction;
        });
      }
    });
    
    // Update each resource's basePerSecond value and recalculate total perSecond
    Object.keys(baseRates).forEach(resourceId => {
      // Skip oppression resource - it should always keep its original rate
      if (resourceId === ResourceId.OPPRESSION) {
        // Force oppression rate to constant value
        this.dispatch(this.actions.updateResourcePerSecond({
          id: resourceId,
          perSecond: 0.05,
        }));
        return;
      }
      
      const baseRate = baseRates[resourceId];
      if (typeof baseRate === 'number' && !isNaN(baseRate)) {
        // Get the current resource
        const resource = resources[resourceId];
        
        if (resource) {
          // Get the current upgrade level for passive generation
          const passiveLevel = resource.upgrades?.passiveGeneration || 0;
          
          // Update base rate
          this.dispatch(this.actions.updateBaseResourcePerSecond({
            id: resourceId,
            basePerSecond: baseRate,
          }));
        } else {
          // If the resource doesn't exist yet, just set the base rate
          // This will automatically set perSecond to the same value
          this.dispatch(this.actions.updateBaseResourcePerSecond({
            id: resourceId,
            basePerSecond: baseRate,
          }));
        }
      }
    });
  }
  
  /**
   * Check if the player can afford a cost
   * @param costs Resource costs as a record of resource IDs to amounts
   * @returns True if all resources are available and sufficient
   */
  canAfford(costs: Record<string, number>): boolean {
    if (!costs || Object.keys(costs).length === 0) {
      return true; // No costs, so it's free
    }
    
    const state = this.getState();
    const resources = state.resources;
    
    // Check each resource cost
    for (const [resourceId, amount] of Object.entries(costs)) {
      // The resource must exist, be unlocked, and have sufficient amount
      const resource = resources[resourceId];
      if (!resource || !resource.unlocked || resource.amount < amount) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Apply a resource cost, deducting from available resources
   * @param costs Resource costs as a record of resource IDs to amounts
   * @returns True if costs were successfully applied
   */
  applyResourceCost(costs: Record<string, number>): boolean {
    if (!costs || Object.keys(costs).length === 0) {
      return true; // No costs to apply
    }
    
    // First check if the player can afford all costs
    if (!this.canAfford(costs)) {
      return false;
    }
    
    // Apply all costs
    for (const [resourceId, amount] of Object.entries(costs)) {
      this.dispatch(this.actions.addResourceAmount({
        id: resourceId,
        amount: -amount, // Negative amount to deduct
      }));
    }
    
    return true;
  }
  
  /**
   * Unlock a resource if it's not already unlocked
   * @param resourceId The ID of the resource to unlock
   * @returns True if the resource was newly unlocked, false if it was already unlocked or doesn't exist
   */
  unlockResource(resourceId: string): boolean {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't unlock a resource that doesn't exist or is already unlocked
    if (!resource || resource.unlocked) {
      return false;
    }
    
    // Toggle the resource to unlocked
    this.dispatch(this.actions.toggleResourceUnlocked({
      id: resourceId,
      unlocked: true,
    }));
    
    return true;
  }
  
  /**
   * Add a specific amount to a resource
   * @param resourceId The ID of the resource
   * @param amount The amount to add (can be negative to subtract)
   * @returns True if successful
   */
  addResourceAmount(resourceId: string, amount: number): boolean {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't add to a resource that doesn't exist
    if (!resource) {
      return false;
    }
    
    // Add the amount
    this.dispatch(this.actions.addResourceAmount({
      id: resourceId,
      amount: amount,
    }));
    
    return true;
  }
  
  /**
   * Set a resource to a specific amount
   * @param resourceId The ID of the resource
   * @param amount The new amount to set
   * @returns True if successful
   */
  setResourceAmount(resourceId: string, amount: number): boolean {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't set a resource that doesn't exist
    if (!resource) {
      return false;
    }
    
    // Set the amount
    this.dispatch(this.actions.updateResourceAmount({
      id: resourceId,
      amount: amount,
    }));
    
    return true;
  }
  
  /**
   * Handle a user click to generate resources
   * @param resourceId The ID of the resource to generate
   * @returns The amount of resources added
   */
  handleResourceClick(resourceId: string): number {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't generate a resource that doesn't exist or isn't unlocked
    if (!resource || !resource.unlocked) {
      return 0;
    }
    
    // Use click power or default to 1 if not set
    const clickPower = resource.clickPower || 1;
    
    // Add the resources
    this.dispatch(this.actions.addResourceAmount({
      id: resourceId,
      amount: clickPower,
    }));
    
    // Return the amount added for UI feedback
    return clickPower;
  }
  
  /**
   * Upgrade the click power for a resource
   * @param resourceId The ID of the resource to upgrade
   * @returns True if the upgrade was successful
   */
  upgradeClickPower(resourceId: string): boolean {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't upgrade a resource that doesn't exist or isn't unlocked
    if (!resource || !resource.unlocked) {
      return false;
    }
    
    // Get current upgrade level
    const currentLevel = resource.upgrades?.[UpgradeType.CLICK_POWER] || 0;
    
    // Calculate the cost of the upgrade (exponential scaling)
    const baseCost = 10; // Starting cost
    const scaleFactor = 1.5; // Cost increases by this factor each time
    const upgradeCost = Math.floor(baseCost * Math.pow(scaleFactor, currentLevel));
    
    // Check if player can afford the upgrade
    const costs = {
      [resourceId]: upgradeCost
    };
    
    if (!this.canAfford(costs)) {
      return false;
    }
    
    // Apply the cost
    this.applyResourceCost(costs);
    
    // Increment the upgrade level
    const newLevel = currentLevel + 1;
    
    // Update the upgrade level (this will also update clickPower)
    this.dispatch(this.actions.updateUpgradeLevel({
      id: resourceId,
      upgradeType: UpgradeType.CLICK_POWER,
      level: newLevel,
    }));
    
    // Log important gameplay progress less frequently
    if (Math.random() < 0.5) { // 50% chance to log upgrades
      console.log(`ResourceManager: Upgraded ${resourceId} click power to level ${newLevel}`);
    }
    
    return true;
  }
  
  /**
   * Get the cost to upgrade click power for a resource
   * @param resourceId The ID of the resource
   * @returns The cost to upgrade or -1 if resource doesn't exist
   */
  getClickUpgradeCost(resourceId: string): number {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't get cost for a resource that doesn't exist
    if (!resource) {
      return -1;
    }
    
    // Get current upgrade level from the upgrades object
    const currentLevel = resource.upgrades?.[UpgradeType.CLICK_POWER] || 0;
    
    // Use the game balance configuration for upgrade costs
    const cost = calculateUpgradeCost(
      UpgradeSettings.CLICK_POWER.BASE_COST,
      UpgradeSettings.CLICK_POWER.COST_SCALE_FACTOR,
      currentLevel
    );
    
    // Only log occasionally to reduce console spam
    if (Math.random() < 0.05) { // Only log 5% of the time
      console.log(
        `ResourceManager: Calculating click upgrade cost for ${resourceId}: ` +
        `current level=${currentLevel}, cost=${cost}`
      );
    }
    
    return cost;
  }
  
  /**
   * Upgrade the passive generation rate for a resource
   * @param resourceId The ID of the resource to upgrade
   * @returns True if the upgrade was successful
   */
  upgradePassiveGeneration(resourceId: string): boolean {
    // Prevent upgrading oppression - it should always generate at constant rate
    if (resourceId === ResourceId.OPPRESSION) {
      console.warn('Cannot upgrade oppression resource - it has a fixed generation rate');
      return false;
    }
    
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't upgrade a resource that doesn't exist or isn't unlocked
    if (!resource || !resource.unlocked) {
      return false;
    }
    
    // Get current upgrade level
    const currentLevel = resource.upgrades?.[UpgradeType.PASSIVE_GENERATION] || 0;
    
    // Calculate the cost of the upgrade (exponential scaling)
    const upgradeCost = this.getPassiveUpgradeCost(resourceId);
    
    if (upgradeCost <= 0) {
      return false;
    }
    
    // Check if player can afford the upgrade
    const costs = {
      [resourceId]: upgradeCost
    };
    
    if (!this.canAfford(costs)) {
      return false;
    }
    
    // Apply the cost
    this.applyResourceCost(costs);
    
    // Increment the upgrade level
    const newLevel = currentLevel + 1;
    
    // Update the upgrade level (this will also update perSecond based on basePerSecond)
    this.dispatch(this.actions.updateUpgradeLevel({
      id: resourceId,
      upgradeType: UpgradeType.PASSIVE_GENERATION,
      level: newLevel,
    }));
    
    // Log important gameplay progress less frequently
    if (Math.random() < 0.5) { // 50% chance to log upgrades
      console.log(`ResourceManager: Upgraded ${resourceId} passive generation to level ${newLevel}`);
    }
    
    return true;
  }
  
  /**
   * Get the cost to upgrade passive generation for a resource
   * @param resourceId The ID of the resource
   * @returns The cost to upgrade or -1 if resource doesn't exist
   */
  getPassiveUpgradeCost(resourceId: string): number {
    const state = this.getState();
    const resource = state.resources[resourceId];
    
    // Can't get cost for a resource that doesn't exist
    if (!resource) {
      return -1;
    }
    
    // Get current upgrade level from the upgrades object
    const currentLevel = resource.upgrades?.[UpgradeType.PASSIVE_GENERATION] || 0;
    
    // Use the game balance configuration for upgrade costs
    const cost = calculateUpgradeCost(
      UpgradeSettings.PASSIVE_GENERATION.BASE_COST,
      UpgradeSettings.PASSIVE_GENERATION.COST_SCALE_FACTOR,
      currentLevel
    );
    
    // Only log occasionally to reduce console spam
    if (Math.random() < 0.05) { // Log only 5% of the time
      console.log(
        `ResourceManager: Calculating passive upgrade cost for ${resourceId}: ` +
        `current level=${currentLevel}, cost=${cost}`
      );
    }
    
    return cost;
  }
}