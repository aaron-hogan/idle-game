import { createAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { assignWorkers, changeWorkerCount } from '../structuresSlice';
import { WorkerManager } from '../../systems/workerManager';
import { invariant } from '../../utils/errorUtils';
import { safeGetStructure } from '../../types/nullObjects';

// Action types
export const ASSIGN_WORKERS = 'workers/assign';
export const CHANGE_WORKER_COUNT = 'workers/changeCount';
export const AUTO_ASSIGN_WORKERS = 'workers/autoAssign';

// Event tracking actions (for analytics/logging only)
export const assignWorkersAction = createAction<{
  buildingId: string;
  workers: number;
}>(ASSIGN_WORKERS);

export const changeWorkerCountAction = createAction<{
  buildingId: string;
  delta: number;
}>(CHANGE_WORKER_COUNT);

export const autoAssignWorkersAction = createAction<{
  strategy: 'balanced' | 'focused' | 'efficiency';
}>(AUTO_ASSIGN_WORKERS);

/**
 * Assign workers to a building
 * @param buildingId The ID of the building
 * @param workers The number of workers to assign
 */
export const assignWorkersToBuilding = (
  buildingId: string, 
  workers: number
): AppThunk => (dispatch, getState) => {
  try {
    invariant(buildingId?.trim(), 'Building ID is required', 'assignWorkersToBuilding');
    
    const state = getState();
    const building = safeGetStructure(state.structures, buildingId);
    
    // Building exists and is valid
    invariant(building.id !== 'null-structure', `Building ${buildingId} not found`, 'assignWorkersToBuilding');
    
    // Ensure valid worker count
    const workerCount = Math.max(0, Math.min(Number(workers) || 0, building.maxWorkers));
    
    // Get total available workers
    const workerManager = WorkerManager.getInstance();
    workerManager.initialize(dispatch, getState);
    
    // Calculate how many workers are used in other buildings
    const currentlyAssigned = workerManager.getTotalAssignedWorkers() - building.workers;
    const totalAvailable = workerManager.getTotalAvailableWorkers();
    const maxAssignable = Math.max(0, totalAvailable - currentlyAssigned);
    
    // Limit workers to what's available
    const finalWorkers = Math.min(workerCount, maxAssignable);
    
    // Consolidated dispatch - handles both state change and tracking
    const result = dispatch(assignWorkers({
      id: buildingId,
      workers: finalWorkers,
      track: true // Flag to indicate tracking should happen in middleware
    }));
    
    return true;
  } catch (error) {
    console.error('Error assigning workers:', error);
    return false;
  }
};

/**
 * Change worker count for a building by a delta amount
 * @param buildingId The ID of the building
 * @param delta The change in worker count (positive or negative)
 */
export const changeWorkers = (
  buildingId: string, 
  delta: number
): AppThunk => (dispatch, getState) => {
  try {
    invariant(buildingId?.trim(), 'Building ID is required', 'changeWorkers');
    
    const state = getState();
    const building = safeGetStructure(state.structures, buildingId);
    
    // Building exists and is valid
    invariant(building.id !== 'null-structure', `Building ${buildingId} not found`, 'changeWorkers');
    
    // Get worker manager
    const workerManager = WorkerManager.getInstance();
    workerManager.initialize(dispatch, getState);
    
    // Validate delta to ensure it's within bounds
    let validatedDelta = Number(delta) || 0;
    
    // If adding workers, check if we have enough free workers
    if (validatedDelta > 0) {
      const remainingWorkers = workerManager.getRemainingWorkers();
      // Limit to available workers
      validatedDelta = Math.min(validatedDelta, remainingWorkers);
      // Also limit by building's max capacity
      validatedDelta = Math.min(validatedDelta, building.maxWorkers - building.workers);
    } else if (validatedDelta < 0) {
      // If removing workers, don't remove more than are assigned
      validatedDelta = Math.max(validatedDelta, -building.workers);
    }
    
    // Skip if no change
    if (validatedDelta === 0) {
      return false;
    }
    
    // Consolidated dispatch - handles both state change and tracking
    const result = dispatch(changeWorkerCount({
      id: buildingId,
      delta: validatedDelta,
      track: true // Flag to indicate tracking should happen in middleware
    }));
    
    return true;
  } catch (error) {
    console.error('Error changing workers:', error);
    return false;
  }
};

/**
 * Auto-assign all workers based on a strategy
 * @param strategy The assignment strategy to use
 */
export const autoAssignWorkers = (
  strategy: 'balanced' | 'focused' | 'efficiency' = 'balanced'
): AppThunk => (dispatch, getState) => {
  try {
    // Validate strategy
    const validStrategies = ['balanced', 'focused', 'efficiency'];
    invariant(
      validStrategies.includes(strategy),
      `Invalid strategy: ${strategy}. Must be one of: ${validStrategies.join(', ')}`,
      'autoAssignWorkers'
    );
    
    // Get worker manager
    const workerManager = WorkerManager.getInstance();
    workerManager.initialize(dispatch, getState);
    
    // Let the manager handle the distribution algorithm and dispatch actions
    // This avoids double dispatching since the manager will directly use dispatch
    const success = workerManager.autoAssignWorkers(strategy);
    
    if (success) {
      // Only dispatch the tracking action, not state changes (already done by manager)
      dispatch(autoAssignWorkersAction({ strategy }));
    }
    
    return success;
  } catch (error) {
    console.error('Error auto-assigning workers:', error);
    return false;
  }
};