/**
 * Game End Conditions system
 * Checks for win and lose conditions and ends the game appropriately
 */
import { Store } from '@reduxjs/toolkit';
import { ResourceId } from '../constants/resources';
import { endGame } from '../state/gameSlice';
import { GameEndConditions } from '../config/gameBalance';
import { victoryEvent, defeatEvent } from '../data/events/gameEndEvents';
import { EventManager } from './eventManager';

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
    // Trigger victory sequence
    handleVictory(store);
    return true;
  }

  // Lose condition: Oppression exceeds collective power by the configured ratio
  const oppressionRatio = GameEndConditions.LOSE.OPPRESSION_POWER_RATIO;
  if (oppression.amount > power.amount * oppressionRatio) {
    // Trigger defeat sequence
    handleDefeat(store);
    return true;
  }

  // Game is still running
  return false;
};

/**
 * Handle game victory by triggering victory event and updating game state
 * @param store Redux store
 */
const handleVictory = (store: Store): void => {
  try {
    // First update game state
    store.dispatch(
      endGame({
        won: true,
        reason:
          'Your movement has reached maximum collective power and successfully created lasting change!',
      })
    );

    // Then trigger the victory event
    const eventManager = EventManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: require('../state/eventsSlice'),
    });

    // Register and trigger the victory event
    eventManager.registerEvent(victoryEvent);
    eventManager.triggerEvent(victoryEvent.id);

    console.log('Victory achieved! Game complete.');
  } catch (error) {
    console.error('Error handling victory:', error);
  }
};

/**
 * Handle game defeat by triggering defeat event and updating game state
 * @param store Redux store
 */
const handleDefeat = (store: Store): void => {
  try {
    // First update game state
    store.dispatch(
      endGame({
        won: false,
        reason:
          'Corporate oppression has overwhelmed your movement. The struggle continues elsewhere...',
      })
    );

    // Then trigger the defeat event
    const eventManager = EventManager.getInstance({
      dispatch: store.dispatch,
      getState: store.getState,
      actions: require('../state/eventsSlice'),
    });

    // Register and trigger the defeat event
    eventManager.registerEvent(defeatEvent);
    eventManager.triggerEvent(defeatEvent.id);

    console.log('Movement defeated. Game over.');
  } catch (error) {
    console.error('Error handling defeat:', error);
  }
};
