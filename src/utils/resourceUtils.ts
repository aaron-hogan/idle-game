import { Resource, Structure, NULL_RESOURCE, NULL_STRUCTURE } from '../models/types';
import { ErrorLogger, ErrorSeverity } from './errorUtils';
import { store, RootState } from '../state/store';

/**
 * Safely get a resource, returning the NULL_RESOURCE if not found
 * @param resources Resources dictionary
 * @param resourceId Resource ID to find
 * @param context Optional context for error logging
 * @returns The found resource or NULL_RESOURCE
 */
export function safeGetResource(
  resources: Record<string, Resource>,
  resourceId: string,
  context: string = 'safeGetResource'
): Resource {
  if (!resourceId || !resources) {
    ErrorLogger.getInstance().logError(
      `Invalid resource lookup: ${resourceId}`,
      context,
      ErrorSeverity.WARNING
    );
    return { ...NULL_RESOURCE };
  }

  const resource = resources[resourceId];

  if (!resource) {
    ErrorLogger.getInstance().logError(
      `Resource not found: ${resourceId}`,
      context,
      ErrorSeverity.INFO
    );
    return { ...NULL_RESOURCE, id: resourceId };
  }

  return resource;
}

/**
 * Safely get a structure, returning the NULL_STRUCTURE if not found
 * @param structures Structures dictionary
 * @param structureId Structure ID to find
 * @param context Optional context for error logging
 * @returns The found structure or NULL_STRUCTURE
 */
export function safeGetStructure(
  structures: Record<string, Structure>,
  structureId: string,
  context: string = 'safeGetStructure'
): Structure {
  if (!structureId || !structures) {
    ErrorLogger.getInstance().logError(
      `Invalid structure lookup: ${structureId}`,
      context,
      ErrorSeverity.WARNING
    );
    return { ...NULL_STRUCTURE };
  }

  const structure = structures[structureId];

  if (!structure) {
    ErrorLogger.getInstance().logError(
      `Structure not found: ${structureId}`,
      context,
      ErrorSeverity.INFO
    );
    return { ...NULL_STRUCTURE, id: structureId };
  }

  return structure;
}

/**
 * Get resources by category
 * @param resources Resources dictionary
 * @param category Category to filter by
 * @returns Array of resources in the specified category
 */
export function getResourcesByCategory(
  resources: Record<string, Resource>,
  category: string
): Resource[] {
  return Object.values(resources).filter(
    (resource) => resource.category === category && resource.unlocked
  );
}

/**
 * Get structures by category
 * @param structures Structures dictionary
 * @param category Category to filter by
 * @returns Array of structures in the specified category
 */
export function getStructuresByCategory(
  structures: Record<string, Structure>,
  category: string
): Structure[] {
  return Object.values(structures).filter(
    (structure) => structure.category === category && structure.unlocked
  );
}

/**
 * Calculate total resources production per second by category
 * @param resources Resources dictionary
 * @param category Category to filter by
 * @returns Total production per second
 */
export function getTotalProductionByCategory(
  resources: Record<string, Resource>,
  category: string
): number {
  return getResourcesByCategory(resources, category).reduce(
    (total, resource) => total + resource.perSecond,
    0
  );
}

/**
 * Check if all resources in a cost object are available
 * @param resources Resources dictionary
 * @param costs Costs to check
 * @returns Boolean indicating if all resources are available
 */
export function canAffordCost(
  resources: Record<string, Resource>,
  costs: Record<string, number>
): boolean {
  if (!costs || Object.keys(costs).length === 0) {
    return true; // No costs means it's free
  }

  return Object.entries(costs).every(([resourceId, cost]) => {
    const resource = safeGetResource(resources, resourceId);
    return resource.unlocked && resource.amount >= cost;
  });
}

/**
 * Check if required resources are available using the current state
 * @param required Map of resource IDs to required amounts
 * @returns True if all required resources are available
 */
export function checkResourceAvailability(required: Record<string, number>): boolean {
  try {
    if (!required || Object.keys(required).length === 0) {
      return true; // No requirements means always available
    }

    const state = store.getState() as RootState;
    // First cast to unknown to bypass type checking, then to the expected format
    const resources = state.resources.resources as unknown as Record<string, {
      unlocked: boolean;
      amount: number;
    }>;

    return Object.entries(required).every(([resourceId, amount]) => {
      if (!resources) return false;
      
      const resource = resources[resourceId];
      if (!resource) return false;
      
      return resource.unlocked && resource.amount >= amount;
    });
  } catch (error) {
    console.error('Error checking resource availability:', error);
    return false; // Fail safe
  }
}

/**
 * Calculate the maximum number of times an action can be performed
 * based on available resources
 * @param cost Cost per action
 * @returns Maximum number of times the action can be performed
 */
export function calculateMaxActions(cost: Record<string, number>): number {
  try {
    if (!cost || Object.keys(cost).length === 0) {
      return Infinity; // No cost means unlimited actions
    }

    const state = store.getState() as RootState;
    const resources = state.resources;

    let maxCount = Infinity;

    for (const [resourceId, amount] of Object.entries(cost)) {
      // Use safeGetResource instead of direct indexing
      const resource = safeGetResource(resources, resourceId, 'calculateMaxActions');

      if (!resource.unlocked) {
        return 0; // Resource doesn't exist or isn't unlocked, can't perform action
      }

      if (amount <= 0) {
        continue; // Skip non-positive costs
      }

      const availableCount = Math.floor(resource.amount / amount);
      maxCount = Math.min(maxCount, availableCount);
    }

    return maxCount;
  } catch (error) {
    console.error('Error calculating max actions:', error);
    return 0; // Fail safe
  }
}

/**
 * Format resource amount with appropriate units
 * @param amount Resource amount to format
 * @returns Formatted string with appropriate units
 */
export function formatResourceAmount(amount: number): string {
  try {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(1)}K`;
    } else {
      return amount.toFixed(0);
    }
  } catch (error) {
    console.error('Error formatting resource amount:', error);
    return '0'; // Fail safe
  }
}
