import { Structure } from '../models/structure';
import { WorkerManager } from './workerManager';
import { validateObject, validateNumber } from '../utils/validationUtils';
import { invariant } from '../utils/errorUtils';

// Import types for dependency injection
import type { RootState } from '../state/store';
import type { AppDispatch } from '../state/store';
import type { addStructure, upgradeStructure, updateProduction } from '../state/structuresSlice';
import type { deductResources } from '../state/resourcesSlice';

/**
 * Dependencies required by BuildingManager
 */
export interface BuildingManagerDependencies {
  dispatch: AppDispatch;
  getState: () => RootState;
  actions: {
    addStructure: typeof addStructure;
    upgradeStructure: typeof upgradeStructure;
    updateProduction: typeof updateProduction;
    deductResources: typeof deductResources;
  };
}

/**
 * BuildingManager handles all operations related to buildings/structures
 * including initialization, purchasing, upgrading, and production calculations
 */
export class BuildingManager {
  private static instance: BuildingManager | null = null;
  private dispatch: AppDispatch;
  private getState: () => RootState;
  private actions: BuildingManagerDependencies['actions'];

  /**
   * Constructor that accepts dependencies
   * @param dependencies The dependencies needed by BuildingManager
   */
  constructor(dependencies: BuildingManagerDependencies) {
    this.dispatch = dependencies.dispatch;
    this.getState = dependencies.getState;
    this.actions = dependencies.actions;
  }

  /**
   * Get or create the singleton instance of BuildingManager
   * @param dependencies The dependencies needed by BuildingManager or store for backward compatibility
   * @returns The singleton BuildingManager instance
   */
  public static getInstance(
    dependenciesOrStore?: BuildingManagerDependencies | { dispatch: unknown; getState: unknown }
  ): BuildingManager {
    if (!BuildingManager.instance) {
      if (!dependenciesOrStore) {
        // Create instance without dependencies, initialize() will be called later
        BuildingManager.instance = new BuildingManager({
          dispatch: (() => {}) as AppDispatch, // Placeholder
          getState: () => ({}) as RootState, // Placeholder
          actions: {} as BuildingManagerDependencies['actions'], // Placeholder
        });
      } else if (
        'dispatch' in dependenciesOrStore &&
        'getState' in dependenciesOrStore &&
        'actions' in dependenciesOrStore
      ) {
        // If full dependencies are provided
        BuildingManager.instance = new BuildingManager(
          dependenciesOrStore as BuildingManagerDependencies
        );
      } else {
        // If a store is provided (backward compatibility)
        const instance = new BuildingManager({
          dispatch: (() => {}) as AppDispatch, // Placeholder
          getState: () => ({}) as RootState, // Placeholder
          actions: {} as BuildingManagerDependencies['actions'], // Placeholder
        });
        instance.initialize(dependenciesOrStore);
        BuildingManager.instance = instance;
      }
    } else if (
      dependenciesOrStore &&
      !(
        'dispatch' in dependenciesOrStore &&
        'getState' in dependenciesOrStore &&
        'actions' in dependenciesOrStore
      )
    ) {
      // If instance exists and a store is provided, initialize with it (backward compatibility)
      BuildingManager.instance.initialize(dependenciesOrStore);
    }

    return BuildingManager.instance;
  }

  /**
   * Initialize the manager with a Redux store
   * For backwards compatibility with existing code
   * @param store The Redux store
   * @deprecated Use dependency injection through constructor instead
   */
  public initialize(store: { dispatch: unknown; getState: unknown }): void {
    // Check if already initialized properly
    try {
      this.ensureInitialized();
      return; // Already initialized
    } catch (e) {
      // Continue with initialization
    }

    // Import necessary action creators
    const structureActions = require('../state/structuresSlice');
    const resourceActions = require('../state/resourcesSlice');

    // Set up dependencies from store
    this.dispatch = store.dispatch as AppDispatch;
    this.getState = store.getState as () => RootState;
    this.actions = {
      addStructure: structureActions.addStructure,
      upgradeStructure: structureActions.upgradeStructure,
      updateProduction: structureActions.updateProduction,
      deductResources: resourceActions.deductResources,
    };
  }

  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.dispatch !== undefined && this.getState !== undefined && this.actions !== undefined,
      'BuildingManager not properly initialized with dependencies',
      'BuildingManager'
    );
  }

  /**
   * Initializes a building and adds it to the store
   * @param building The building to initialize
   */
  initializeBuilding(building: Structure): void {
    // Validate building structure
    const requiredProps: Array<keyof Structure> = [
      'id',
      'name',
      'level',
      'maxLevel',
      'cost',
      'production',
      'unlocked',
    ];

    if (!validateObject(building, requiredProps, 'BuildingManager.initializeBuilding')) {
      return;
    }

    this.dispatch(this.actions.addStructure(building));
  }

  /**
   * Initializes multiple buildings at once
   * @param buildings Array of buildings to initialize
   */
  initializeBuildings(buildings: Structure[]): void {
    if (!Array.isArray(buildings)) {
      return;
    }

    buildings.forEach((building) => this.initializeBuilding(building));
  }

  /**
   * Checks if player can afford to purchase or upgrade a building
   * @param buildingId The building ID
   * @returns Boolean indicating if purchase is possible
   */
  canPurchaseBuilding(buildingId: string): boolean {
    if (!buildingId || buildingId.trim() === '') {
      return false;
    }

    const state = this.getState();
    const building = state.structures[buildingId];

    // If building doesn't exist or is not unlocked, return false
    if (!building || !building.unlocked) {
      return false;
    }

    // Check if player has enough resources
    for (const [resourceId, amount] of Object.entries(building.cost)) {
      const resource = state.resources[resourceId];
      if (
        !resource ||
        typeof resource !== 'object' ||
        !('amount' in resource) ||
        typeof resource.amount !== 'number' ||
        resource.amount < (typeof amount === 'number' ? amount : 0)
      ) {
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

    const state = this.getState();
    const building = state.structures[buildingId];

    // Deduct resources
    this.dispatch(this.actions.deductResources(building.cost));

    // Upgrade the building
    this.dispatch(this.actions.upgradeStructure({ id: buildingId }));

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

    const state = this.getState();
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
    const workerEfficiency =
      workerEfficiencyMultiplier !== undefined
        ? workerEfficiencyMultiplier
        : building.workers > 0
          ? building.workers / building.maxWorkers
          : 0;

    for (const [resourceId, baseAmount] of Object.entries(building.production)) {
      // Calculate based on level and workers
      const levelMultiplier = 1 + building.level * 0.25; // 25% increase per level

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
    this.dispatch(
      this.actions.updateProduction({
        id: buildingId,
        production: newProduction,
      })
    );
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

    const state = this.getState();
    const building = state.structures[buildingId];

    if (!building) {
      return {};
    }

    // Calculate cost scaling based on current level
    // Each level increases cost by 50%
    const scaleFactor = 1 + building.level * 0.5;
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
    const state = this.getState();
    const workerManager = useWorkerManager ? WorkerManager.getInstance() : null;

    // If using worker manager, ensure it gets the same dependencies
    // This will be changed in future updates with proper DI for WorkerManager
    if (workerManager) {
      // For now, we still need to handle backward compatibility
      // This should be updated when WorkerManager is updated to use DI
      try {
        // Note: this implementation is temporary during transition to DI
        if ('initialize' in workerManager) {
          // @ts-ignore - Call it if it exists, assuming it expects a store-like object
          workerManager.initialize({
            dispatch: this.dispatch,
            getState: this.getState,
          });
        }
      } catch (err) {
        console.warn('Could not initialize WorkerManager with dependencies', err);
      }
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
      id: 'community_center',
      name: 'Community Center',
      description: 'A gathering place for the community to meet and organize.',
      level: 0,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 25,
      },
      production: {
        solidarity: 0.5,
      },
      unlocked: true,
      workers: 0,
      maxWorkers: 5,
      category: 'COMMUNITY',
    },

    // Union Office - Generates collective bargaining power
    {
      id: 'union_office',
      name: 'Union Office',
      description: 'A base of operations for workplace organizing.',
      level: 0,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 50,
        solidarity: 25,
      },
      production: {
        collective_bargaining_power: 0.8,
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 8,
      category: 'ORGANIZING',
    },

    // Alternative Media Outlet - Counters corporate propaganda
    {
      id: 'alt_media_outlet',
      name: 'Alternative Media Outlet',
      description: 'Spreads the word about your movement and counters corporate narratives.',
      level: 0,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 75,
        solidarity: 40,
      },
      production: {
        solidarity: 0.6,
        community_trust: 0.3,
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 6,
      category: 'MEDIA',
    },

    // Mutual Aid Network - Provides material resources
    {
      id: 'mutual_aid_network',
      name: 'Mutual Aid Network',
      description: 'Organizes community support systems and resource sharing.',
      level: 0,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 60,
        solidarity: 30,
      },
      production: {
        community_trust: 0.7,
        solidarity: 0.4,
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 7,
      category: 'COMMUNITY',
    },

    // Study Group - Increases education level
    {
      id: 'study_group',
      name: 'Study Group',
      description: 'Educates members about theory, history, and organizing tactics.',
      level: 0,
      maxLevel: 5,
      cost: {
        collective_bargaining_power: 40,
        solidarity: 20,
      },
      production: {
        solidarity: 0.3,
        community_trust: 0.2,
      },
      unlocked: false,
      workers: 0,
      maxWorkers: 4,
      category: 'EDUCATION',
    },
  ];
}
