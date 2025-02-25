import { createAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { Structure } from '../../models/structure';
import { BuildingManager, createInitialBuildings } from '../../systems/buildingManager';

// Define AppThunk type
// Note: This should return an action object for proper TypeScript compatibility with dispatch
export type AppThunk<ReturnType = { type: string }> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;
import { 
  addStructure, 
  upgradeStructure, 
  assignWorkers, 
  changeWorkerCount
} from '../structuresSlice';
import { deductResources } from '../resourcesSlice';

// Action types
export const INITIALIZE_BUILDINGS = 'buildings/initialize';
export const PURCHASE_BUILDING = 'buildings/purchase';
export const UPGRADE_BUILDING = 'buildings/upgrade';
export const ASSIGN_WORKERS = 'buildings/assignWorkers';

// Plain actions
export const initializeBuildingsAction = createAction<Structure[]>(INITIALIZE_BUILDINGS);

// Thunk action creators
/**
 * Initialize all buildings in the game
 */
export const initializeBuildings = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const buildings = createInitialBuildings();
    
    // Dispatch individual actions for each building
    buildings.forEach(building => {
      dispatch(addStructure(building));
    });
    
    // Dispatch the combined action for tracking
    dispatch(initializeBuildingsAction(buildings));
    
    // Return an action for TypeScript compatibility
    return { type: INITIALIZE_BUILDINGS };
  };
};

/**
 * Purchase a building if player has enough resources
 * @param buildingId The ID of the building to purchase
 */
export const purchaseBuilding = (buildingId: string): AppThunk => (dispatch, getState) => {
  const state = getState();
  const building = state.structures[buildingId];
  
  if (!building || !building.unlocked) {
    return { type: `${PURCHASE_BUILDING}/failed` };
  }
  
  // Check if player has enough resources
  for (const [resourceId, amount] of Object.entries(building.cost)) {
    const resource = state.resources[resourceId];
    if (!resource || resource.amount < amount) {
      return { type: `${PURCHASE_BUILDING}/failed` };
    }
  }
  
  // Deduct resources
  dispatch(deductResources(building.cost));
  
  // Upgrade building
  dispatch(upgradeStructure({ id: buildingId }));
  
  return { type: `${PURCHASE_BUILDING}/success` };
};

/**
 * Assign workers to a building
 * @param buildingId The ID of the building
 * @param workers The number of workers to assign
 */
export const assignWorkersToBuilding = (
  buildingId: string, 
  workers: number
): AppThunk => (dispatch, getState) => {
  const state = getState();
  const building = state.structures[buildingId];
  
  if (!building) {
    return { type: `${ASSIGN_WORKERS}/failed` };
  }
  
  // Ensure worker count is within valid range
  const workerCount = Math.max(0, Math.min(workers, building.maxWorkers));
  
  dispatch(assignWorkers({
    id: buildingId,
    workers: workerCount
  }));
  
  return { type: `${ASSIGN_WORKERS}/success` };
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
  dispatch(changeWorkerCount({
    id: buildingId,
    delta
  }));
  
  return { type: 'buildings/changeWorkers/complete' };
};