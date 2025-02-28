import { Dispatch, Store } from 'redux';
import { RootState } from '../state/store';
import { Structure } from '../models/structure';
import { invariant } from '../utils/errorUtils';
import { validateNumber } from '../utils/validationUtils';
import * as structuresActions from '../state/structuresSlice';

// Import only the types needed for dependency injection
import type { AppDispatch } from '../state/store';
import type { assignWorkers, changeWorkerCount } from '../state/structuresSlice';

/**
 * Dependencies needed by WorkerManager
 */
export interface WorkerManagerDependencies {
  dispatch: AppDispatch;
  getState: () => RootState;
  actions: {
    assignWorkers: typeof assignWorkers;
    changeWorkerCount: typeof changeWorkerCount;
  };
}

/**
 * WorkerManager handles worker allocation and management across buildings
 * including efficiency calculations and automatic assignment
 */
export class WorkerManager {
  private static instance: WorkerManager | null = null;
  private dispatch: AppDispatch;
  private getState: () => RootState;
  private actions: WorkerManagerDependencies['actions'];
  private initialized = false;

  /**
   * Constructor that accepts dependencies
   * @param dependencies The dependencies needed by WorkerManager
   */
  constructor(dependencies: WorkerManagerDependencies) {
    this.dispatch = dependencies.dispatch;
    this.getState = dependencies.getState;
    this.actions = dependencies.actions;
    this.initialized = true;
  }

  /**
   * Get or create the singleton instance of WorkerManager
   * @param dependenciesOrStore The dependencies needed by WorkerManager or store/dispatch for backward compatibility
   * @param getState Optional getState function (if dispatch is provided) for backward compatibility
   * @returns The singleton WorkerManager instance
   */
  public static getInstance(
    dependenciesOrStore?: WorkerManagerDependencies | Store | Dispatch,
    getState?: () => RootState
  ): WorkerManager {
    if (!WorkerManager.instance) {
      if (!dependenciesOrStore) {
        // Create instance without dependencies, initialize() will be called later
        WorkerManager.instance = new WorkerManager({
          dispatch: (() => {}) as AppDispatch, // Placeholder
          getState: () => ({}) as RootState, // Placeholder
          actions: {} as WorkerManagerDependencies['actions'], // Placeholder
        });
      } else if (
        'dispatch' in dependenciesOrStore &&
        'getState' in dependenciesOrStore &&
        'actions' in dependenciesOrStore
      ) {
        // If full dependencies are provided
        WorkerManager.instance = new WorkerManager(
          dependenciesOrStore as WorkerManagerDependencies
        );
      } else {
        // If a store or dispatch is provided (backward compatibility)
        const instance = new WorkerManager({
          dispatch: (() => {}) as AppDispatch, // Placeholder
          getState: () => ({}) as RootState, // Placeholder
          actions: {} as WorkerManagerDependencies['actions'], // Placeholder
        });
        instance.initialize(dependenciesOrStore, getState);
        WorkerManager.instance = instance;
      }
    } else if (
      dependenciesOrStore &&
      !(
        'dispatch' in dependenciesOrStore &&
        'getState' in dependenciesOrStore &&
        'actions' in dependenciesOrStore
      )
    ) {
      // If instance exists and a store/dispatch is provided, initialize with it (backward compatibility)
      WorkerManager.instance.initialize(dependenciesOrStore, getState);
    }

    return WorkerManager.instance;
  }

  /**
   * Initialize the manager with store or dispatch
   * @param storeOrDispatch The Redux store or dispatch function
   * @param getState Optional getState function (if dispatch is provided)
   * @deprecated Use dependency injection through constructor instead
   */
  public initialize(storeOrDispatch: Store | Dispatch, getState?: () => RootState): void {
    // Check if already initialized properly
    try {
      this.ensureInitialized();
      return; // Already initialized
    } catch (e) {
      // Continue with initialization
    }

    // Use the imported action creators

    // Try to determine if it's a store or dispatch function
    const isStore = storeOrDispatch && 'getState' in storeOrDispatch;

    if (isStore) {
      // It's a store
      const store = storeOrDispatch as Store;
      this.dispatch = store.dispatch;
      this.getState = store.getState as () => RootState;
    } else {
      // It's a dispatch function
      this.dispatch = storeOrDispatch as Dispatch;
      this.getState =
        getState ||
        (() => {
          throw new Error('getState not provided');
        });
    }

    // Set up actions
    this.actions = {
      assignWorkers: structuresActions.assignWorkers,
      changeWorkerCount: structuresActions.changeWorkerCount,
    };

    this.initialized = true;
  }

  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.initialized &&
        this.dispatch !== undefined &&
        this.getState !== undefined &&
        this.actions !== undefined,
      'WorkerManager not properly initialized with dependencies',
      'WorkerManager'
    );
  }

  /**
   * Get the total number of available workers
   * @returns Number of available workers
   */
  getTotalAvailableWorkers(): number {
    this.ensureInitialized();
    const state = this.getState!();

    // Available workers are determined by current game stage
    // 5 base workers + 3 per game stage
    return 5 + state.game.gameStage * 3;
  }

  /**
   * Get the total number of workers currently assigned
   * @returns Number of assigned workers
   */
  getTotalAssignedWorkers(): number {
    this.ensureInitialized();
    const state = this.getState!();

    return Object.values(state.structures).reduce((total: number, structure: unknown) => {
      if (
        structure &&
        typeof structure === 'object' &&
        'workers' in structure &&
        typeof structure.workers === 'number'
      ) {
        return total + structure.workers;
      }
      return total;
    }, 0);
  }

  /**
   * Calculate remaining free workers that can be assigned
   * @returns Number of workers available to assign
   */
  getRemainingWorkers(): number {
    return this.getTotalAvailableWorkers() - this.getTotalAssignedWorkers();
  }

  /**
   * Assign workers to a building
   * @param buildingId The building ID
   * @param workers The number of workers to assign
   * @returns Boolean indicating if assignment was successful
   */
  assignWorkersToBuilding(buildingId: string, workers: number): boolean {
    this.ensureInitialized();

    // Validate parameters
    if (!buildingId || buildingId.trim() === '') {
      return false;
    }

    workers = validateNumber(workers, 0);

    const state = this.getState();
    const building = state.structures[buildingId];

    if (!building) {
      return false;
    }

    // Calculate total assigned workers excluding this building
    const currentlyAssigned = this.getTotalAssignedWorkers() - building.workers;
    const total = this.getTotalAvailableWorkers();

    // Check if this assignment would exceed total available
    if (workers > total - currentlyAssigned) {
      // Only assign as many as possible
      workers = total - currentlyAssigned;
    }

    // Limit by building's max worker capacity
    workers = Math.max(0, Math.min(workers, building.maxWorkers));

    this.dispatch(
      this.actions.assignWorkers({
        id: buildingId,
        workers,
      })
    );

    return true;
  }

  /**
   * Change the number of workers in a building by a delta amount
   * @param buildingId The building ID
   * @param delta The change in worker count (positive or negative)
   * @returns Boolean indicating if change was successful
   */
  changeWorkerCount(buildingId: string, delta: number): boolean {
    this.ensureInitialized();

    // Validate parameters
    if (!buildingId || buildingId.trim() === '') {
      return false;
    }

    delta = validateNumber(delta);

    const state = this.getState();
    const building = state.structures[buildingId];

    if (!building) {
      return false;
    }

    // Calculate the new worker count instead of just sending a delta
    const currentWorkers = building.workers;
    let newWorkerCount = currentWorkers + delta;

    // If adding workers, check if we have enough free workers
    if (delta > 0) {
      const remaining = this.getRemainingWorkers();

      // Limit newWorkerCount based on available workers
      const maxPossible = currentWorkers + remaining;
      newWorkerCount = Math.min(newWorkerCount, maxPossible);

      // Also limit by building's max capacity
      newWorkerCount = Math.min(newWorkerCount, building.maxWorkers);
    } else if (delta < 0) {
      // If removing workers, don't go below 0
      newWorkerCount = Math.max(newWorkerCount, 0);
    }

    // If no change, return false
    if (newWorkerCount === currentWorkers) {
      return false;
    }

    // Use assignWorkers directly with the new count instead of changeWorkerCount
    this.dispatch(
      this.actions.assignWorkers({
        id: buildingId,
        workers: newWorkerCount,
      })
    );

    return true;
  }

  /**
   * Calculate efficiency of workers in a building
   * @param buildingId The building ID
   * @returns Efficiency multiplier (0-2 range)
   */
  calculateWorkerEfficiency(buildingId: string): number {
    this.ensureInitialized();

    // Validate parameters
    if (!buildingId || buildingId.trim() === '') {
      return 0;
    }

    const state = this.getState!();
    const building = state.structures[buildingId];

    if (!building || building.workers === 0) {
      return 0;
    }

    // Base efficiency is linear with worker count
    let efficiency = building.workers / building.maxWorkers;

    // Apply efficiency curve - starts slow, peaks at 100%, then diminishes
    // This creates an optimal point at around 80% staffing
    if (efficiency <= 0.8) {
      // Ramp up gradually (0 to 2)
      efficiency = (efficiency / 0.8) * 2;
    } else {
      // Diminishing returns after 80% staffing
      efficiency = 2 - (efficiency - 0.8) / 0.2;
    }

    return efficiency;
  }

  /**
   * Auto-assign workers to buildings based on optimization strategy
   * @param strategy The optimization strategy to use
   * @returns Boolean indicating if assignment was successful
   */
  autoAssignWorkers(strategy: 'balanced' | 'focused' | 'efficiency' = 'balanced'): boolean {
    this.ensureInitialized();

    const state = this.getState!();
    const buildings = Object.values(state.structures).filter((b: unknown): b is Structure => {
      return (
        b !== undefined &&
        typeof b === 'object' &&
        b !== null &&
        'unlocked' in b &&
        'level' in b &&
        b.unlocked === true &&
        typeof b.level === 'number' &&
        b.level > 0
      );
    });
    const totalWorkers = this.getTotalAvailableWorkers();

    // Reset all building worker counts to 0
    buildings.forEach((building: Structure) => {
      this.assignWorkersToBuilding(building.id, 0);
    });

    if (buildings.length === 0 || totalWorkers === 0) {
      return false;
    }

    switch (strategy) {
      case 'balanced':
        // Distribute workers evenly among buildings
        this.assignWorkersEvenly(buildings, totalWorkers);
        break;

      case 'focused':
        // Focus workers on the highest level buildings first
        this.assignWorkersFocused(buildings, totalWorkers);
        break;

      case 'efficiency':
        // Assign workers to 80% capacity for best efficiency
        this.assignWorkersEfficiently(buildings, totalWorkers);
        break;

      default:
        return false;
    }

    return true;
  }

  /**
   * Assign workers evenly among buildings
   * @param buildings List of buildings to assign workers to
   * @param totalWorkers Total number of workers to distribute
   */
  private assignWorkersEvenly(buildings: Structure[], totalWorkers: number): void {
    // Calculate base workers per building
    const baseWorkers = Math.floor(totalWorkers / buildings.length);
    let remaining = totalWorkers - baseWorkers * buildings.length;

    // Assign base workers to each building
    buildings.forEach((building) => {
      let workersToAssign = Math.min(baseWorkers, building.maxWorkers);

      // Distribute remaining workers one by one
      if (remaining > 0 && workersToAssign < building.maxWorkers) {
        workersToAssign++;
        remaining--;
      }

      this.assignWorkersToBuilding(building.id, workersToAssign);
    });

    // If any workers left, assign to buildings that can take more
    if (remaining > 0) {
      buildings
        .sort((a, b) => b.maxWorkers - b.workers - (a.maxWorkers - a.workers))
        .forEach((building) => {
          if (remaining <= 0) return;

          const canTake = building.maxWorkers - building.workers;
          const toAssign = Math.min(canTake, remaining);

          if (toAssign > 0) {
            this.changeWorkerCount(building.id, toAssign);
            remaining -= toAssign;
          }
        });
    }
  }

  /**
   * Assign workers focusing on highest level buildings first
   * @param buildings List of buildings to assign workers to
   * @param totalWorkers Total number of workers to distribute
   */
  private assignWorkersFocused(buildings: Structure[], totalWorkers: number): void {
    // Sort buildings by level (highest first)
    const sortedBuildings = [...buildings].sort((a, b) => b.level - a.level);
    let remainingWorkers = totalWorkers;

    // Assign to highest level buildings first, up to max
    sortedBuildings.forEach((building) => {
      if (remainingWorkers <= 0) return;

      const toAssign = Math.min(building.maxWorkers, remainingWorkers);
      this.assignWorkersToBuilding(building.id, toAssign);
      remainingWorkers -= toAssign;
    });
  }

  /**
   * Assign workers to achieve optimal efficiency (80% capacity)
   * @param buildings List of buildings to assign workers to
   * @param totalWorkers Total number of workers to distribute
   */
  private assignWorkersEfficiently(buildings: Structure[], totalWorkers: number): void {
    let remainingWorkers = totalWorkers;

    // First pass - assign 80% capacity to each building
    buildings.forEach((building) => {
      if (remainingWorkers <= 0) return;

      // Calculate 80% of max capacity (optimal efficiency point)
      const optimalWorkers = Math.ceil(building.maxWorkers * 0.8);
      const toAssign = Math.min(optimalWorkers, remainingWorkers);

      this.assignWorkersToBuilding(building.id, toAssign);
      remainingWorkers -= toAssign;
    });

    // Second pass - distribute remaining workers
    if (remainingWorkers > 0) {
      // Sort by level for remaining distribution
      const sortedBuildings = [...buildings].sort((a, b) => b.level - a.level);

      sortedBuildings.forEach((building) => {
        if (remainingWorkers <= 0) return;

        const currentWorkers = building.workers;
        const canTake = building.maxWorkers - currentWorkers;
        const toAssign = Math.min(canTake, remainingWorkers);

        if (toAssign > 0) {
          this.changeWorkerCount(building.id, toAssign);
          remainingWorkers -= toAssign;
        }
      });
    }
  }
}
