/**
 * Game End Conditions system
 * Checks for win and lose conditions and ends the game appropriately
 */
import { Store } from '@reduxjs/toolkit';
import { ResourceId } from '../constants/resources';
import { endGame } from '../state/gameSlice';

/**
 * Check if any game end conditions have been met
 * @param store The Redux store
 * @returns true if game ended, false if still running
 */
export const checkGameEndConditions = (store: Store): boolean => {
  const state = store.getState();
  
  // Game already ended or not running
  if (state.game.gameEnded || !state.game.isRunning) {
    return true;
  }
  
  // Get the relevant resources
  const resources = state.resources.byId;
  const power = resources[ResourceId.COLLECTIVE_POWER];
  const oppression = resources[ResourceId.OPPRESSION];
  
  // Skip check if resources aren't loaded yet
  if (!power || !oppression) {
    return false;
  }
  
  // Win condition: Collective power reaches maximum
  if (power.amount >= power.maxAmount) {
    store.dispatch(endGame({ 
      won: true, 
      reason: 'Your movement has reached maximum collective power and successfully created lasting change!' 
    }));
    return true;
  }
  
  // Lose condition: Oppression exceeds collective power by 50%
  if (oppression.amount > power.amount * 1.5) {
    store.dispatch(endGame({ 
      won: false, 
      reason: 'Corporate oppression has overwhelmed your movement. The struggle continues elsewhere...' 
    }));
    return true;
  }
  
  // Game is still running
  return false;
};