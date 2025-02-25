import { Structure } from '../models/structure';
import { Store } from 'redux';
import { 
  addStructure, 
  upgradeStructure, 
  updateProduction 
} from '../state/structuresSlice';
import { deductResources } from '../state/resourcesSlice';
import { RootState } from '../state/store';
import { WorkerManager } from './workerManager';
import { validateObject, validateNumber } from '../utils/validationUtils';
import { invariant } from '../utils/errorUtils';

/**
 * BuildingManager handles all operations related to buildings/structures
 * including initialization, purchasing, upgrading, and production calculations
 */
export class BuildingManager {
  private static instance: BuildingManager | null = null;
  private store: Store | null = null;
  
  /**
   * Private constructor for singleton pattern
   * @param store The Redux store (optional)
   */
  private constructor(store?: Store) {
    if (store) {
      this.store = store;
    }
  }
  
  /**
   * Get the singleton instance of BuildingManager
   * @returns The singleton BuildingManager instance
   */
  public static getInstance(): BuildingManager {
    if (!BuildingManager.instance) {
      BuildingManager.instance = new BuildingManager();
    }
    return BuildingManager.instance;
  }
  
  /**
   * Initialize the manager with a Redux store
   * @param store The Redux store
   */
  public initialize(store: Store): void {
    this.store = store;
  }
  
  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.store !== null,
      'BuildingManager not properly initialized with Redux store',
      'BuildingManager'
    );
  }
  
  /**
   * Initializes a building and adds it to the store
   * @param building The building to initialize
   */
  initializeBuilding(building: Structure): void {
    this.ensureInitialized();
    
    // Validate building structure
    const requiredProps: Array<keyof Structure> = [
      'id', 'name', 'level', 'maxLevel', 'cost', 'production', 'unlocked'
    ];
    
    if (!validateObject(building, requiredProps, 'BuildingManager.initializeBuilding')) {
      return;
    }
    
    this.store!.dispatch(addStructure(building));
  }
  
  /**
   * Initializes multiple buildings at once
   * @param buildings Array of buildings to initialize
   */
  initializeBuildings(buildings: Structure[]): void {
    if (!Array.isArray(buildings)) {
      return;
    }
    
    buildings.forEach(building => this.initializeBuilding(building));
  }
  
  /**
   * Checks if player can afford to purchase or upgrade a building
   * @param buildingId The building ID
   * @returns Boolean indicating if purchase is possible
   */
  canPurchaseBuilding(buildingId: string): boolean {
    this.ensureInitialized();
    
    if (!buildingId || buildingId.trim() === '') {
      return false;
    }
    
    const state = this.store!.getState() as RootState;
    const building = state.structures[buildingId];
    
    // If building doesn't exist or is not unlocked, return false
    if (!building || !building.unlocked) {
      return false;
    }
    
    // Check if player has enough resources
    for (const [resourceId, amount] of Object.entries(building.cost)) {
      const resource = state.resources[resourceId];
      if (!resource || typeof resource !== 'object' || 
          !('amount' in resource) || typeof resource.amount !== 'number' || 
          resource.amount < (typeof amount === 'number' ? amount : 0)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Purchases a building by deducting resources and upgrading it
   * @param buildingId The building ID to purchase/upgrade
   * @returns Boolean indicating if purchase was successful
   */
  purchaseBuilding(buildingId: string): boolean {
    // Validate parameters and check affordability
    if (!buildingId || buildingId.trim() === '' || !this.canPurchaseBuilding(buildingId)) {
      return false;
    }
    
    this.ensureInitialized();
    const state = this.store!.getState() as RootState;
    const building = state.structures[buildingId];
    
    // Deduct resources
    this.store!.dispatch(deductResources(building.cost));
    
    // Upgrade the building
    this.store!.dispatch(upgradeStructure({ id: buildingId }));
    
    // Calculate new production values based on level
    this.recalculateProduction(buildingId);
    
    return true;
  }
  
  /**
   * Recalculates the production values for a building based on its level and workers
   * @param buildingId The building ID to recalculate
   * @param workerEfficiencyMultiplier Optional custom worker efficiency multiplier
   */
  recalculateProduction(buildingId: string, workerEfficiencyMultiplier?: number): void {
    if (!buildingId || buildingId.trim() === '') {
      return;
    }
    
    this.ensureInitialized();
    const state = this.store!.getState() as RootState;
    const building = state.structures[buildingId];
    
    if (!building) {
      return;
    }
    
    // Validate worker efficiency if provided
    if (workerEfficiencyMultiplier !== undefined) {
      workerEfficiencyMultiplier = validateNumber(workerEfficiencyMultiplier, 0, 2, 0);
    }
    
    // Calculate base production values multiplied by level and worker efficiency
    const newProduction: Record<string, number> = {};
    
    // Default worker efficiency calculation (linear) if not provided
    const workerEfficiency = workerEfficiencyMultiplier !== undefined 
      ? workerEfficiencyMultiplier 
      : (building.workers > 0 ? building.workers / building.maxWorkers : 0);
    
    for (const [resourceId, baseAmount] of Object.entries(building.production)) {
      // Calculate based on level and workers
      const levelMultiplier = 1 + (building.level * 0.25); // 25% increase per level
      
      // Apply worker multiplier based on efficiency
      // If no workers, production is 10% of base
      const workerMultiplier = building.workers > 0 ? workerEfficiency : 0.1;
      
      if (typeof baseAmount === 'number') {
        newProduction[resourceId] = baseAmount * levelMultiplier * workerMultiplier;
      } else {
        newProduction[resourceId] = 0;
      }
    }
    
    // Update the production values in the store
    this.store!.dispatch(updateProduction({
      id: buildingId,
      production: newProduction
    }));
  }
  
  /**
   * Calculates the cost to upgrade a building to the next level
   * @param buildingId The building ID
   * @returns Record of resources and amounts needed
   */
  calculateUpgradeCost(buildingId: string): Record<string, number> {
    if (!buildingId || buildingId.trim() === '') {
      return {};
    }
    
    this.ensureInitialized();
    const state = this.store!.getState() as RootState;
    const building = state.structures[buildingId];
    
    if (!building) {
      return {};
    }
    
    // Calculate cost scaling based on current level
    // Each level increases cost by 50%
    const scaleFactor = 1 + (building.level * 0.5);
    const upgradeCost: Record<string, number> = {};
    
    for (const [resourceId, baseAmount] of Object.entries(building.cost)) {
      if (typeof baseAmount === 'number') {
        upgradeCost[resourceId] = Math.floor(baseAmount * scaleFactor);
      } else {
        upgradeCost[resourceId] = 0;
      }
    }
    
    return upgradeCost;
  }
  
  /**
   * Updates production for all buildings at once
   * @param useWorkerManager Whether to use the WorkerManager for efficiency calculation
   */
  updateAllProduction(useWorkerManager: boolean = true): void {
    this.ensureInitialized();
    const state = this.store!.getState() as RootState;
    const workerManager = useWorkerManager ? WorkerManager.getInstance() : null;
    
    // If using worker manager, ensure it's initialized
    if (workerManager && this.store) {
      workerManager.initialize(this.store);
    }
    
    for (const buildingId of Object.keys(state.structures)) {
      if (workerManager) {
        // Use the advanced efficiency calculation from WorkerManager
        const efficiency = workerManager.calculateWorkerEfficiency(buildingId);
        this.recalculateProduction(buildingId, efficiency);
      } else {
        // Use the default linear efficiency calculation
        this.recalculateProduction(buildingId);
      }
    }
  }
}

/**
 * Creates initial buildings data
 * @returns Array of initial building structures
 */
export function createInitialBuildings(): Structure[] {
  return [
    // Community Center - Generates solidarity
    {
      id: "community_center",
      name: "Community Center",
      description: "A gathering place for the community to meet and organize.",
      level: 0,
      maxLevel: 5,
      cost: { 
        collective_bargaining_power: 25 
      },
      production: { 
        solidarity: 0.5
      },
      unlocked: true,
      workers: 0,
      maxWorkers: 5,
      category: "COMMUNITY"
    },
    
    // Union Office - Generates collective bargaining power
    {
      id: "union_office",
      name: "Union Office",
      description: "A base of operations for workplace organizing.",
      level: 0,
      maxLevel: 5,
      cost: { 
        collective_bargaining_power: 50, 
        solidarity: 25 
      },
      production: { 
        collective_bargaining_power: 0.8 
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 8,
      category: "ORGANIZING"
    },
    
    // Alternative Media Outlet - Counters corporate propaganda
    {
      id: "alt_media_outlet",
      name: "Alternative Media Outlet",
      description: "Spreads the word about your movement and counters corporate narratives.",
      level: 0,
      maxLevel: 5,
      cost: { 
        collective_bargaining_power: 75, 
        solidarity: 40 
      },
      production: { 
        solidarity: 0.6,
        community_trust: 0.3
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 6,
      category: "MEDIA"
    },
    
    // Mutual Aid Network - Provides material resources
    {
      id: "mutual_aid_network",
      name: "Mutual Aid Network",
      description: "Organizes community support systems and resource sharing.",
      level: 0,
      maxLevel: 5,
      cost: { 
        collective_bargaining_power: 60, 
        solidarity: 30 
      },
      production: { 
        community_trust: 0.7,
        solidarity: 0.4
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 7,
      category: "COMMUNITY"
    },
    
    // Study Group - Increases education level
    {
      id: "study_group",
      name: "Study Group",
      description: "Educates members about theory, history, and organizing tactics.",
      level: 0,
      maxLevel: 5,
      cost: { 
        collective_bargaining_power: 40, 
        solidarity: 20 
      },
      production: { 
        solidarity: 0.3,
        community_trust: 0.2
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 4,
      category: "EDUCATION"
    }
  ];
}