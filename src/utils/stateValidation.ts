import { Middleware } from 'redux';
import { Resource } from '../models/resource';
import { Structure } from '../models/structure';
import { RootState } from '../state/store';
import { ErrorLogger } from './errorUtils';

/**
 * Validates resource state properties
 * @param resource Resource to validate
 * @returns Boolean indicating if resource is valid
 */
export function validateResource(resource: Resource): boolean {
  // Check required fields
  if (!resource.id || !resource.name) {
    ErrorLogger.getInstance().logError(
      `Resource missing required fields: ${JSON.stringify(resource)}`,
      'validateResource'
    );
    return false;
  }
  
  // Check numeric values
  if (typeof resource.amount !== 'number' || isNaN(resource.amount) || resource.amount < 0) {
    ErrorLogger.getInstance().logError(
      `Resource has invalid amount: ${resource.amount}`,
      'validateResource'
    );
    return false;
  }
  
  if (typeof resource.perSecond !== 'number' || isNaN(resource.perSecond)) {
    ErrorLogger.getInstance().logError(
      `Resource has invalid perSecond: ${resource.perSecond}`,
      'validateResource'
    );
    return false;
  }
  
  return true;
}

/**
 * Validates structure state properties
 * @param structure Structure to validate
 * @returns Boolean indicating if structure is valid
 */
export function validateStructure(structure: Structure): boolean {
  // Check required fields
  if (!structure.id || !structure.name) {
    ErrorLogger.getInstance().logError(
      `Structure missing required fields: ${JSON.stringify(structure)}`,
      'validateStructure'
    );
    return false;
  }
  
  // Check numeric values
  if (typeof structure.level !== 'number' || isNaN(structure.level) || structure.level < 0) {
    ErrorLogger.getInstance().logError(
      `Structure has invalid level: ${structure.level}`,
      'validateStructure'
    );
    return false;
  }
  
  if (typeof structure.maxLevel !== 'number' || isNaN(structure.maxLevel) || structure.maxLevel < 1) {
    ErrorLogger.getInstance().logError(
      `Structure has invalid maxLevel: ${structure.maxLevel}`,
      'validateStructure'
    );
    return false;
  }
  
  if (typeof structure.workers !== 'number' || isNaN(structure.workers) || structure.workers < 0) {
    ErrorLogger.getInstance().logError(
      `Structure has invalid workers: ${structure.workers}`,
      'validateStructure'
    );
    return false;
  }
  
  if (typeof structure.maxWorkers !== 'number' || isNaN(structure.maxWorkers) || structure.maxWorkers < 0) {
    ErrorLogger.getInstance().logError(
      `Structure has invalid maxWorkers: ${structure.maxWorkers}`,
      'validateStructure'
    );
    return false;
  }
  
  // Check that level doesn't exceed maxLevel
  if (structure.level > structure.maxLevel) {
    ErrorLogger.getInstance().logError(
      `Structure level (${structure.level}) exceeds maxLevel (${structure.maxLevel})`,
      'validateStructure'
    );
    return false;
  }
  
  // Check that workers doesn't exceed maxWorkers
  if (structure.workers > structure.maxWorkers) {
    ErrorLogger.getInstance().logError(
      `Structure workers (${structure.workers}) exceeds maxWorkers (${structure.maxWorkers})`,
      'validateStructure'
    );
    return false;
  }
  
  // Check that cost and production are valid objects
  if (!structure.cost || typeof structure.cost !== 'object') {
    ErrorLogger.getInstance().logError(
      `Structure has invalid cost: ${structure.cost}`,
      'validateStructure'
    );
    return false;
  }
  
  if (!structure.production || typeof structure.production !== 'object') {
    ErrorLogger.getInstance().logError(
      `Structure has invalid production: ${structure.production}`,
      'validateStructure'
    );
    return false;
  }
  
  return true;
}

/**
 * Validates game state properties
 * @param gameState Game state to validate
 * @returns Boolean indicating if game state is valid
 */
export function validateGameState(gameState: any): boolean {
  // Check required fields
  if (gameState === undefined || gameState === null) {
    ErrorLogger.getInstance().logError(
      'Game state is undefined or null',
      'validateGameState'
    );
    return false;
  }
  
  // Check gameStage
  if (typeof gameState.gameStage !== 'number' || isNaN(gameState.gameStage) || gameState.gameStage < 0) {
    ErrorLogger.getInstance().logError(
      `Game state has invalid gameStage: ${gameState.gameStage}`,
      'validateGameState'
    );
    return false;
  }
  
  // Check totalPlayTime
  if (typeof gameState.totalPlayTime !== 'number' || isNaN(gameState.totalPlayTime) || gameState.totalPlayTime < 0) {
    ErrorLogger.getInstance().logError(
      `Game state has invalid totalPlayTime: ${gameState.totalPlayTime}`,
      'validateGameState'
    );
    return false;
  }
  
  // Check lastSaveTime
  if (gameState.lastSaveTime && (typeof gameState.lastSaveTime !== 'number' || isNaN(gameState.lastSaveTime) || gameState.lastSaveTime < 0)) {
    ErrorLogger.getInstance().logError(
      `Game state has invalid lastSaveTime: ${gameState.lastSaveTime}`,
      'validateGameState'
    );
    return false;
  }
  
  return true;
}

/**
 * Validates the entire game state
 * @param state Redux state to validate
 * @returns Boolean indicating if overall state is valid
 */
export function validateState(state: RootState): boolean {
  const logger = ErrorLogger.getInstance();
  let isValid = true;
  
  // Validate resources
  if (!state.resources) {
    logger.logError('Resources state is missing', 'validateState');
    isValid = false;
  } else {
    Object.values(state.resources).forEach(resource => {
      if (!validateResource(resource)) {
        isValid = false;
      }
    });
  }
  
  // Validate structures
  if (!state.structures) {
    logger.logError('Structures state is missing', 'validateState');
    isValid = false;
  } else {
    Object.values(state.structures).forEach(structure => {
      if (!validateStructure(structure)) {
        isValid = false;
      }
    });
  }
  
  // Validate game state
  if (!state.game) {
    logger.logError('Game state is missing', 'validateState');
    isValid = false;
  } else if (!validateGameState(state.game)) {
    isValid = false;
  }
  
  return isValid;
}

/**
 * Redux middleware for validating state after each action
 */
export const stateValidationMiddleware: Middleware = store => next => action => {
  // First, let the action pass through and update state
  const result = next(action);
  
  // Only validate state for specific critical actions, not on every state change
  // This prevents console spam and improves performance
  if (
    action.type.includes('init') || 
    action.type.includes('reset') || 
    action.type.includes('load') ||
    action.type.includes('add') && !action.type.includes('addResourceAmount')
  ) {
    const state = store.getState() as RootState;
    validateState(state);
  }
  
  // Always return the result of the next middleware
  return result;
};