import {
  safeGetResource,
  safeGetStructure,
  getResourcesByCategory,
  getStructuresByCategory,
  getTotalProductionByCategory,
  canAffordCost,
  checkResourceAvailability,
  calculateMaxActions,
  formatResourceAmount
} from './resourceUtils';
import { store } from '../state/store';

// Mock store
jest.mock('../state/store', () => ({
  store: {
    getState: jest.fn().mockReturnValue({
      resources: {
        'solidarity': {
          id: 'solidarity',
          name: 'Solidarity',
          amount: 100,
          maxAmount: 1000,
          perSecond: 1,
          description: 'A measure of worker unity',
          category: 'social',
          unlocked: true
        },
        'collective_bargaining_power': {
          id: 'collective_bargaining_power',
          name: 'Collective Bargaining Power',
          amount: 50,
          maxAmount: 500,
          perSecond: 0.5,
          description: 'Power through unity',
          category: 'organizing',
          unlocked: true
        },
        'community_trust': {
          id: 'community_trust',
          name: 'Community Trust',
          amount: 75,
          maxAmount: 750,
          perSecond: 0.2,
          description: 'Trust from the community',
          category: 'social',
          unlocked: true
        },
        'locked_resource': {
          id: 'locked_resource',
          name: 'Locked Resource',
          amount: 30,
          maxAmount: 300,
          perSecond: 0,
          description: 'A locked resource',
          category: 'special',
          unlocked: false
        }
      },
      structures: {
        'community_center': {
          id: 'community_center',
          name: 'Community Center',
          description: 'A place for community gathering',
          level: 2,
          maxLevel: 5,
          cost: { 'solidarity': 100 },
          production: { 'community_trust': 5 },
          unlocked: true,
          workers: 0,
          maxWorkers: 10,
          category: 'social'
        },
        'union_office': {
          id: 'union_office',
          name: 'Union Office',
          description: 'Office for union activities',
          level: 1,
          maxLevel: 3,
          cost: { 'solidarity': 50 },
          production: { 'collective_bargaining_power': 2 },
          unlocked: true,
          workers: 0,
          maxWorkers: 5,
          category: 'organizing'
        },
        'locked_structure': {
          id: 'locked_structure',
          name: 'Locked Structure',
          description: 'A locked structure',
          level: 0,
          maxLevel: 1,
          cost: { 'locked_resource': 10 },
          production: {},
          unlocked: false,
          workers: 0,
          maxWorkers: 0,
          category: 'special'
        }
      }
    })
  },
  RootState: {} // Mock type for RootState
}));

// Mock ErrorLogger
jest.mock('./errorUtils', () => ({
  ErrorLogger: {
    getInstance: jest.fn().mockReturnValue({
      logError: jest.fn()
    })
  },
  ErrorSeverity: {
    WARNING: 'warning',
    INFO: 'info'
  }
}));

describe('resourceUtils', () => {
  describe('safeGetResource', () => {
    const resources = {
      'solidarity': {
        id: 'solidarity',
        name: 'Solidarity',
        amount: 100,
        maxAmount: 1000,
        perSecond: 1,
        description: 'A measure of worker unity',
        unlocked: true,
        category: 'social'
      }
    };
    
    test('should return the resource if found', () => {
      const result = safeGetResource(resources, 'solidarity');
      expect(result).toBe(resources.solidarity);
    });
    
    test('should return NULL_RESOURCE with id if resource not found', () => {
      const result = safeGetResource(resources, 'unknown');
      expect(result).toEqual(expect.objectContaining({
        id: 'unknown'
      }));
    });
    
    test('should handle null inputs gracefully', () => {
      // @ts-ignore - testing invalid input
      const result = safeGetResource(null, null);
      expect(result).toEqual(expect.objectContaining({
        id: 'null-resource'
      }));
    });
  });
  
  describe('safeGetStructure', () => {
    const structures = {
      'community_center': {
        id: 'community_center',
        name: 'Community Center',
        description: 'A place for community gathering',
        level: 2,
        maxLevel: 5,
        cost: { 'solidarity': 100 },
        production: { 'community_trust': 5 },
        unlocked: true,
        workers: 0,
        maxWorkers: 10,
        category: 'social'
      }
    };
    
    test('should return the structure if found', () => {
      const result = safeGetStructure(structures, 'community_center');
      expect(result).toBe(structures.community_center);
    });
    
    test('should return NULL_STRUCTURE with id if structure not found', () => {
      const result = safeGetStructure(structures, 'unknown');
      expect(result).toEqual(expect.objectContaining({
        id: 'unknown'
      }));
    });
  });
  
  describe('getResourcesByCategory', () => {
    // Using store mock for this test
    const state = store.getState();
    const resources = state.resources as Record<string, any>;
    
    test('should filter resources by category', () => {
      const socialResources = getResourcesByCategory(resources, 'social');
      expect(socialResources).toHaveLength(2);
      expect(socialResources[0].id).toBe('solidarity');
      expect(socialResources[1].id).toBe('community_trust');
    });
    
    test('should only include unlocked resources', () => {
      const specialResources = getResourcesByCategory(resources, 'special');
      expect(specialResources).toHaveLength(0); // The special resource is locked
    });
  });
  
  describe('getStructuresByCategory', () => {
    // Using store mock for this test
    const state = store.getState();
    const structures = state.structures as Record<string, any>;
    
    test('should filter structures by category', () => {
      const organizingStructures = getStructuresByCategory(structures, 'organizing');
      expect(organizingStructures).toHaveLength(1);
      expect(organizingStructures[0].id).toBe('union_office');
    });
    
    test('should only include unlocked structures', () => {
      const specialStructures = getStructuresByCategory(structures, 'special');
      expect(specialStructures).toHaveLength(0); // The special structure is locked
    });
  });
  
  describe('getTotalProductionByCategory', () => {
    // Using store mock for this test
    const state = store.getState();
    const resources = state.resources as Record<string, any>;
    
    test('should calculate total production for a category', () => {
      const socialProduction = getTotalProductionByCategory(resources, 'social');
      // solidarity (1) + community_trust (0.2) = 1.2
      expect(socialProduction).toBeCloseTo(1.2);
    });
    
    test('should return 0 for a category with no resources', () => {
      const nonexistentProduction = getTotalProductionByCategory(resources, 'nonexistent');
      expect(nonexistentProduction).toBe(0);
    });
  });
  
  describe('canAffordCost', () => {
    // Using store mock for this test
    const state = store.getState();
    const resources = state.resources as Record<string, any>;
    
    test('should return true if all resources are available', () => {
      const cost = {
        'solidarity': 50,
        'collective_bargaining_power': 25
      };
      
      expect(canAffordCost(resources, cost)).toBe(true);
    });
    
    test('should return false if any resource is insufficient', () => {
      const cost = {
        'solidarity': 200, // More than available (100)
        'collective_bargaining_power': 25
      };
      
      expect(canAffordCost(resources, cost)).toBe(false);
    });
    
    test('should return false if a resource is not unlocked', () => {
      const cost = {
        'solidarity': 10,
        'locked_resource': 10 // This resource exists but is locked
      };
      
      expect(canAffordCost(resources, cost)).toBe(false);
    });
    
    test('should return true for empty or null costs', () => {
      expect(canAffordCost(resources, {})).toBe(true);
      expect(canAffordCost(resources, null as any)).toBe(true);
    });
  });
  
  describe('checkResourceAvailability', () => {
    test('should check if resources are available in the store', () => {
      // Successful case
      expect(checkResourceAvailability({
        'solidarity': 50,
        'collective_bargaining_power': 25
      })).toBe(true);
      
      // Insufficient case
      expect(checkResourceAvailability({
        'solidarity': 200
      })).toBe(false);
      
      // Locked resource case
      expect(checkResourceAvailability({
        'locked_resource': 10
      })).toBe(false);
      
      // Empty case
      expect(checkResourceAvailability({})).toBe(true);
      expect(checkResourceAvailability(null as any)).toBe(true);
    });
  });
  
  describe('calculateMaxActions', () => {
    test('should calculate maximum number of actions possible', () => {
      // solidarity: 100 / 10 = 10 actions
      // collective_bargaining_power: 50 / 25 = 2 actions
      // The minimum is 2, so that's the max actions
      expect(calculateMaxActions({
        'solidarity': 10,
        'collective_bargaining_power': 25
      })).toBe(2);
    });
    
    test('should return Infinity for zero costs', () => {
      expect(calculateMaxActions({})).toBe(Infinity);
      expect(calculateMaxActions(null as any)).toBe(Infinity);
    });
    
    test('should return 0 if any resource is not available or locked', () => {
      expect(calculateMaxActions({
        'nonexistent': 10
      })).toBe(0);
      
      expect(calculateMaxActions({
        'locked_resource': 10
      })).toBe(0);
    });
    
    test('should handle zero cost resources gracefully', () => {
      expect(calculateMaxActions({
        'solidarity': 0, // zero cost - ignore
        'collective_bargaining_power': 10 // 50 / 10 = 5 actions
      })).toBe(5);
    });
  });
  
  describe('formatResourceAmount', () => {
    test('should format numbers with appropriate units', () => {
      expect(formatResourceAmount(123)).toBe('123');
      expect(formatResourceAmount(1234)).toBe('1.2K');
      expect(formatResourceAmount(1234567)).toBe('1.2M');
    });
    
    test('should handle errors gracefully', () => {
      // Mock a scenario where formatting throws an error
      const originalToFixed = Number.prototype.toFixed;
      Number.prototype.toFixed = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      // Mock console.error to silence the expected error
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      expect(formatResourceAmount(1234)).toBe('0');
      
      // Restore mocks
      Number.prototype.toFixed = originalToFixed;
      console.error = originalConsoleError;
    });
  });
});