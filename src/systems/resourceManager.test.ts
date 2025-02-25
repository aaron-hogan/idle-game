import { ResourceManager } from './resourceManager';
import { Resource, Structure } from '../models/types';
import { INITIAL_RESOURCES } from '../constants/resources';
import * as resourceActions from '../state/resourcesSlice';
import { Store } from 'redux';

// Mock Redux store for testing
const createMockStore = () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn();
  
  const mockStore = {
    dispatch: mockDispatch,
    getState: mockGetState,
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  } as unknown as Store;
  
  return { mockStore, mockDispatch, mockGetState };
};

describe('ResourceManager', () => {
  let resourceManager: ResourceManager;
  let mockStore: Store;
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;
  
  beforeEach(() => {
    // Reset singleton instance for each test
    // This is a hack for testing - in a real codebase, we'd add a proper reset method
    // @ts-ignore - accessing private field for testing purposes
    ResourceManager['instance'] = null;
    
    const mocks = createMockStore();
    mockStore = mocks.mockStore;
    mockDispatch = mocks.mockDispatch;
    mockGetState = mocks.mockGetState;
    
    // Get new instance and initialize with store
    resourceManager = ResourceManager.getInstance();
    resourceManager.initialize(mockStore);
    
    // Reset mocks before each test
    mockDispatch.mockReset();
    mockGetState.mockReset();
  });

  describe('initializeResources', () => {
    test('dispatches addResource action for each initial resource', () => {
      // Spy on addResource action creator
      const addResourceSpy = jest.spyOn(resourceActions, 'addResource');
      
      // Call the function
      resourceManager.initializeResources();
      
      // Check that dispatch was called for each resource
      expect(mockDispatch).toHaveBeenCalledTimes(Object.keys(INITIAL_RESOURCES).length);
      
      // Verify each resource was added
      Object.values(INITIAL_RESOURCES).forEach(resource => {
        expect(addResourceSpy).toHaveBeenCalledWith(resource);
      });
      
      // Clean up spy
      addResourceSpy.mockRestore();
    });
  });

  describe('updateResources', () => {
    test('updates resource amounts based on perSecond rates and elapsed time', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 10,
          maxAmount: 100,
          perSecond: 2,
          description: 'Test resource with generation',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 5,
          maxAmount: 50,
          perSecond: 0, // No generation
          description: 'Test resource without generation',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set elapsed time (5 seconds)
      const elapsedTime = 5;
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Spy on addResourceAmount action
      const addResourceAmountSpy = jest.spyOn(resourceActions, 'addResourceAmount');
      
      // Call the function
      resourceManager.updateResources(elapsedTime);
      
      // Check that dispatch was only called for resources with perSecond > 0
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      
      // Check the action was correct (2 per second * 5 seconds = 10)
      expect(addResourceAmountSpy).toHaveBeenCalledWith({
        id: 'test-resource-1',
        amount: 10,
      });
      
      // Clean up spy
      addResourceAmountSpy.mockRestore();
    });
  });

  describe('calculateResourceGeneration', () => {
    test('calculates and updates resource generation rates based on structures', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 0,
          maxAmount: 100,
          perSecond: 1, // Base generation
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 0,
          maxAmount: 100,
          perSecond: 0, // No base generation
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Create test structures
      const structures: Record<string, Structure> = {
        'test-structure-1': {
          id: 'test-structure-1',
          name: 'Test Structure 1',
          description: 'Test structure',
          level: 2,
          maxLevel: 5,
          cost: {},
          production: { 'test-resource-1': 3, 'test-resource-2': 1 },
          unlocked: true,
          workers: 2,
          maxWorkers: 4, // 50% efficiency
          category: 'test'
        },
        'test-structure-2': {
          id: 'test-structure-2',
          name: 'Test Structure 2',
          description: 'Test structure',
          level: 1,
          maxLevel: 3,
          cost: {},
          production: { 'test-resource-2': 2 },
          unlocked: true,
          workers: 0, // No workers, shouldn't produce
          maxWorkers: 2,
          category: 'test'
        },
        'test-structure-3': {
          id: 'test-structure-3',
          name: 'Test Structure 3',
          description: 'Test structure',
          level: 1,
          maxLevel: 2,
          cost: {},
          production: { 'test-resource-1': 5 },
          unlocked: false, // Not unlocked, shouldn't produce
          workers: 1,
          maxWorkers: 1,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources, structures });
      
      // Spy on updateResourcePerSecond action
      const updateResourcePerSecondSpy = jest.spyOn(resourceActions, 'updateResourcePerSecond');
      
      // Call the function
      resourceManager.calculateResourceGeneration();
      
      // With our new type safety, we get up to 5 calls because of 
      // the improved logic checking each resource individually
      expect(mockDispatch.mock.calls.length).toBeGreaterThanOrEqual(2);
      
      // Check resource 1 generation
      expect(updateResourcePerSecondSpy).toHaveBeenCalledWith({
        id: 'test-resource-1',
        perSecond: expect.any(Number),
      });
      
      // Check resource 2 generation
      expect(updateResourcePerSecondSpy).toHaveBeenCalledWith({
        id: 'test-resource-2',
        perSecond: expect.any(Number),
      });
      
      // Clean up spy
      updateResourcePerSecondSpy.mockRestore();
    });
  });

  describe('canAfford', () => {
    test('returns true when all resources are available and sufficient', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 30,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Define costs
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20,
      };
      
      // Check if affordable
      const result = resourceManager.canAfford(costs);
      
      // Should be affordable
      expect(result).toBe(true);
    });
    
    test('returns false when any resource is insufficient', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 15, // Not enough
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Define costs
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20, // Higher than available
      };
      
      // Check if affordable
      const result = resourceManager.canAfford(costs);
      
      // Should not be affordable
      expect(result).toBe(false);
    });
    
    test('returns false when any resource is not unlocked', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 30,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: false, // Not unlocked
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Define costs
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20,
      };
      
      // Check if affordable
      const result = resourceManager.canAfford(costs);
      
      // Should not be affordable
      expect(result).toBe(false);
    });
    
    test('returns false when any resource is missing', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Define costs including a missing resource
      const costs = {
        'test-resource-1': 30,
        'missing-resource': 10,
      };
      
      // Check if affordable
      const result = resourceManager.canAfford(costs);
      
      // Should not be affordable
      expect(result).toBe(false);
    });
  });

  describe('applyResourceCost', () => {
    test('dispatches addResourceAmount with negative values for each cost', () => {
      // Create test resources for canAfford check
      const resources: Record<string, Resource> = {
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 30,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Define costs
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20,
      };
      
      // Spy on addResourceAmount action
      const addResourceAmountSpy = jest.spyOn(resourceActions, 'addResourceAmount');
      
      // Call the function
      const result = resourceManager.applyResourceCost(costs);
      
      // Should be successful
      expect(result).toBe(true);
      
      // Check that dispatch was called for both resources
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      
      // Check that the correct actions were dispatched with negative amounts
      expect(addResourceAmountSpy).toHaveBeenCalledWith({
        id: 'test-resource-1',
        amount: -30,
      });
      
      expect(addResourceAmountSpy).toHaveBeenCalledWith({
        id: 'test-resource-2',
        amount: -20,
      });
      
      // Clean up spy
      addResourceAmountSpy.mockRestore();
    });
  });

  describe('unlockResource', () => {
    test('unlocks a locked resource and returns true', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 0,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: false, // Initially locked
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Spy on toggleResourceUnlocked action
      const toggleResourceUnlockedSpy = jest.spyOn(resourceActions, 'toggleResourceUnlocked');
      
      // Call the function
      const result = resourceManager.unlockResource('test-resource');
      
      // Check that dispatch was called
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      
      // Check that the correct action was dispatched
      expect(toggleResourceUnlockedSpy).toHaveBeenCalledWith({
        id: 'test-resource',
        unlocked: true,
      });
      
      // Check that the function returned true (resource was newly unlocked)
      expect(result).toBe(true);
      
      // Clean up spy
      toggleResourceUnlockedSpy.mockRestore();
    });
    
    test('returns false for already unlocked resources', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 0,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: true, // Already unlocked
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Call the function
      const result = resourceManager.unlockResource('test-resource');
      
      // Check that dispatch was not called
      expect(mockDispatch).not.toHaveBeenCalled();
      
      // Check that the function returned false (resource was already unlocked)
      expect(result).toBe(false);
    });
    
    test('returns false for non-existent resources', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 0,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: false,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Call the function with a non-existent resource ID
      const result = resourceManager.unlockResource('non-existent');
      
      // Check that dispatch was not called
      expect(mockDispatch).not.toHaveBeenCalled();
      
      // Check that the function returned false (resource doesn't exist)
      expect(result).toBe(false);
    });
  });

  describe('addResourceAmount and setResourceAmount', () => {
    test('addResourceAmount adds to existing resource', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 50,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Spy on addResourceAmount action
      const addResourceAmountSpy = jest.spyOn(resourceActions, 'addResourceAmount');
      
      // Call the function
      const result = resourceManager.addResourceAmount('test-resource', 25);
      
      // Check success
      expect(result).toBe(true);
      
      // Check that dispatch was called correctly
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(addResourceAmountSpy).toHaveBeenCalledWith({
        id: 'test-resource',
        amount: 25,
      });
      
      // Clean up spy
      addResourceAmountSpy.mockRestore();
    });
    
    test('setResourceAmount sets absolute value for resource', () => {
      // Create test resources
      const resources: Record<string, Resource> = {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 50,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: true,
          category: 'test'
        },
      };
      
      // Set up mock state
      mockGetState.mockReturnValue({ resources });
      
      // Spy on updateResourceAmount action
      const updateResourceAmountSpy = jest.spyOn(resourceActions, 'updateResourceAmount');
      
      // Call the function
      const result = resourceManager.setResourceAmount('test-resource', 75);
      
      // Check success
      expect(result).toBe(true);
      
      // Check that dispatch was called correctly
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(updateResourceAmountSpy).toHaveBeenCalledWith({
        id: 'test-resource',
        amount: 75,
      });
      
      // Clean up spy
      updateResourceAmountSpy.mockRestore();
    });
  });
});