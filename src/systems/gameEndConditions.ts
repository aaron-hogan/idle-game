/**
 * Game End Conditions system
 * Checks for win and lose conditions and ends the game appropriately
 */
import { Store } from '@reduxjs/toolkit';
import { ResourceId } from '../constants/resources';
import { endGame } from '../state/gameSlice';
import { GameEndConditions } from '../config/gameBalance';

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
  const resources = state.resources;
  // Handle both old (byId) and new (flat) structure for backward compatibility
  const power = resources.byId
    ? resources.byId[ResourceId.COLLECTIVE_POWER]
    : resources[ResourceId.COLLECTIVE_POWER];
  const oppression = resources.byId
    ? resources.byId[ResourceId.OPPRESSION]
    : resources[ResourceId.OPPRESSION];

  // Skip check if resources aren't loaded yet
  if (!power || !oppression) {
    return false;
  }

  // Win condition: Collective power reaches maximum
  const powerThreshold = GameEndConditions.WIN.POWER_THRESHOLD;
  if (power.amount >= powerThreshold || power.amount >= power.maxAmount) {
    store.dispatch(
      endGame({
        won: true,
        reason:
          'Your movement has reached maximum collective power and successfully created lasting change!',
      })
    );
    return true;
  }

  // Lose condition: Oppression exceeds collective power by the configured ratio
  const oppressionRatio = GameEndConditions.LOSE.OPPRESSION_POWER_RATIO;
  if (oppression.amount > power.amount * oppressionRatio) {
    store.dispatch(
      endGame({
        won: false,
        reason:
          'Corporate oppression has overwhelmed your movement. The struggle continues elsewhere...',
      })
    );
    return true;
  }

  // Game is still running
  return false;
};
