import { createAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ResourceManager } from '../../systems/resourceManager';
import {
  startGame,
  stopGame,
  updateLastSaveTime,
  addPlayTime,
  processOfflineProgress as processOfflineProgressAction,
} from '../gameSlice';
import { BuildingManager } from '../../systems/buildingManager';

import { AnyAction, ThunkAction } from '@reduxjs/toolkit';

// Define AppThunk type
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, undefined, AnyAction>;

// Action types
export const START_GAME_LOOP = 'game/startLoop';
export const STOP_GAME_LOOP = 'game/stopLoop';
export const TICK_GAME = 'game/tick';
export const UPDATE_RESOURCE_GENERATION = 'game/updateResourceGeneration';

// Plain actions
export const tickGameAction = createAction<number>(TICK_GAME);
export const updateResourceGenerationAction = createAction(UPDATE_RESOURCE_GENERATION);

// Thunk action creators

/**
 * Start the game loop
 */
export const startGameLoop = (): AppThunk => (dispatch) => {
  dispatch(startGame());
};

/**
 * Stop the game loop
 */
export const stopGameLoop = (): AppThunk => (dispatch) => {
  dispatch(stopGame());
};

/**
 * Process a game tick
 * @param elapsedTime Seconds since last tick
 */
export const processTick =
  (elapsedTime: number): AppThunk =>
  (dispatch, getState) => {
    const state = getState();

    // Get resource manager instance
    const resourceManager = ResourceManager.getInstance();

    // Update resources based on elapsed time
    resourceManager.updateResources(elapsedTime);

    // Update last tick time
    dispatch(updateLastSaveTime());

    // Dispatch plain action for tracking
    dispatch(tickGameAction(elapsedTime));
  };

/**
 * Update resource generation rates based on buildings and other factors
 */
export const updateResourceGeneration = (): AppThunk => (dispatch, getState) => {
  // Get resource manager instance
  const resourceManager = ResourceManager.getInstance();

  // Calculate resource generation from buildings
  resourceManager.calculateResourceGeneration();

  // Dispatch plain action for tracking
  dispatch(updateResourceGenerationAction());
};

/**
 * Process offline progress
 * @param offlineTime Seconds that passed while game was closed
 */
export const processOfflineProgress =
  (offlineTime: number): AppThunk =>
  (dispatch, getState) => {
    // Apply diminishing returns to offline time (e.g., 80% efficiency)
    const adjustedTime = offlineTime * 0.8;

    // Cap offline time to a maximum (e.g., 12 hours)
    const cappedTime = Math.min(adjustedTime, 12 * 60 * 60);

    // Get resource manager instance
    const resourceManager = ResourceManager.getInstance();

    // Update resources for the offline period
    resourceManager.updateResources(cappedTime);

    // Add the offline time to total play time
    dispatch(addPlayTime(cappedTime));

    // Dispatch the Redux action
    dispatch(processOfflineProgressAction(cappedTime));
  };
