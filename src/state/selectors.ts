import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { NULL_RESOURCE, NULL_STRUCTURE } from '../models/types';
import { Resource } from '../models/resource';
import { Structure } from '../models/structure';

// Resource selectors
export const selectAllResources = (state: RootState) => state.resources;

export const selectResourceById = (id: string) => 
  (state: RootState) => state.resources[id] || NULL_RESOURCE;

/**
 * Safe version of selectResourceById that returns null if resource doesn't exist
 */
export const selectResourceByIdNullable = (id: string) => 
  (state: RootState) => state.resources[id] || null;

export const selectUnlockedResources = createSelector(
  selectAllResources,
  (resources): Resource[] => {
    // Need to explicitly cast to Resource[] to make TypeScript happy
    return Object.values(resources).filter(
      (resource): resource is Resource => 
        resource !== undefined && 
        typeof resource === 'object' && 
        resource !== null && 
        'unlocked' in resource && 
        resource.unlocked === true
    );
  }
);

/**
 * Selects resources by category
 */
export const selectResourcesByCategory = (category: string) => createSelector(
  selectAllResources,
  (resources): Resource[] => {
    return Object.values(resources).filter(
      (resource): resource is Resource => 
        resource !== undefined && 
        typeof resource === 'object' && 
        resource !== null && 
        'category' in resource && 
        resource.category === category
    );
  }
);

/**
 * Selects unlocked resources by category
 */
export const selectUnlockedResourcesByCategory = (category: string) => createSelector(
  selectUnlockedResources,
  (resources): Resource[] => resources.filter(resource => resource.category === category)
);

export const selectTotalResourceGeneration = createSelector(
  selectAllResources,
  (resources): number => {
    return Object.values(resources).reduce<number>(
      (total, resource) => {
        if (resource && typeof resource === 'object' && 'perSecond' in resource && 
            typeof resource.perSecond === 'number') {
          return total + resource.perSecond;
        }
        return total;
      },
      0
    );
  }
);

// Structure selectors
export const selectAllStructures = (state: RootState) => state.structures;

export const selectStructureById = (id: string) => 
  (state: RootState) => state.structures[id] || NULL_STRUCTURE;

/**
 * Safe version of selectStructureById that returns null if structure doesn't exist
 */
export const selectStructureByIdNullable = (id: string) => 
  (state: RootState) => state.structures[id] || null;

export const selectUnlockedStructures = createSelector(
  selectAllStructures,
  (structures): Structure[] => {
    return Object.values(structures).filter(
      (structure): structure is Structure => 
        structure !== undefined && 
        typeof structure === 'object' && 
        structure !== null && 
        'unlocked' in structure && 
        structure.unlocked === true
    );
  }
);

/**
 * Selects structures by category
 */
export const selectStructuresByCategory = (category: string) => createSelector(
  selectAllStructures,
  (structures): Structure[] => {
    return Object.values(structures).filter(
      (structure): structure is Structure => 
        structure !== undefined && 
        typeof structure === 'object' && 
        structure !== null && 
        'category' in structure && 
        structure.category === category
    );
  }
);

/**
 * Selects unlocked structures by category
 */
export const selectUnlockedStructuresByCategory = (category: string) => createSelector(
  selectUnlockedStructures,
  (structures): Structure[] => structures.filter(structure => structure.category === category)
);

export const selectTotalWorkers = createSelector(
  selectAllStructures,
  (structures): number => {
    return Object.values(structures).reduce<number>(
      (total, structure) => {
        if (structure && typeof structure === 'object' && 'workers' in structure && 
            typeof structure.workers === 'number') {
          return total + structure.workers;
        }
        return total;
      },
      0
    );
  }
);

// Game state selectors
export const selectGameStage = (state: RootState) => state.game.gameStage;
export const selectLastSaveTime = (state: RootState) => state.game.lastSaveTime;
export const selectTotalPlayTime = (state: RootState) => state.game.totalPlayTime;
export const selectIsGameRunning = (state: RootState) => state.game.isRunning;
export const selectTickRate = (state: RootState) => state.game.tickRate;
export const selectGameTimeScale = (state: RootState) => state.game.gameTimeScale;