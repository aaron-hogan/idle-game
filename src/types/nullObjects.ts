/**
 * Contains utility functions to safely access objects with null object pattern
 */
import { Resource, Structure, NULL_RESOURCE, NULL_STRUCTURE } from '../models/types';

/**
 * Safely get a resource, returning NULL_RESOURCE if not found
 */
export function safeGetResource(resources: Record<string, Resource>, id: string): Resource {
  return resources[id] || NULL_RESOURCE;
}

/**
 * Safely get a structure, returning NULL_STRUCTURE if not found
 */
export function safeGetStructure(structures: Record<string, Structure>, id: string): Structure {
  return structures[id] || NULL_STRUCTURE;
}
