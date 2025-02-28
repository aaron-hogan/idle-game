import { ResourceManager } from './resourceManager';
import { Resource, Structure } from '../models/types';
import { INITIAL_RESOURCES } from '../constants/resources';
import * as resourceActions from '../state/resourcesSlice';
import { Store } from 'redux';
import { resetSingleton, createMockStore } from '../utils/testUtils';

describe('ResourceManager', () => {
  let resourceManager: ResourceManager;
  let mockStore: Store;
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;

  // Helper function to create a properly initialized ResourceManager
  const createResourceManager = (mockState: any) => {
    // Reset singleton instance
    resetSingleton(ResourceManager);

    // Import action creators
    const resourceActionsModule = require('../state/resourcesSlice');

    // Set up mockGetState to return the provided state
    mockGetState.mockReturnValue(mockState);

    // Create ResourceManager with explicit dependencies
    return ResourceManager.getInstance({
      dispatch: mockDispatch,
      getState: mockGetState,
      actions: {
        addResource: resourceActionsModule.addResource,
        updateResourceAmount: resourceActionsModule.updateResourceAmount,
        addResourceAmount: resourceActionsModule.addResourceAmount,
        updateResourcePerSecond: resourceActionsModule.updateResourcePerSecond,
        toggleResourceUnlocked: resourceActionsModule.toggleResourceUnlocked,
        updateClickPower: resourceActionsModule.updateClickPower,
        updateUpgradeLevel: resourceActionsModule.updateUpgradeLevel,
        updateBaseResourcePerSecond: resourceActionsModule.updateBaseResourcePerSecond,
      },
    });
  };

  beforeEach(() => {
    // Reset singleton instance for each test
    resetSingleton(ResourceManager);

    // Set up mock store using the standard utility
    const mocks = createMockStore();
    mockStore = mocks.mockStore;
    mockDispatch = mocks.mockDispatch;
    mockGetState = mocks.mockGetState;

    // Create a default state with some resources
    const defaultState = {
      resources: {
        'test-resource': {
          id: 'test-resource',
          name: 'Test Resource',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test',
        },
        'test-resource-1': {
          id: 'test-resource-1',
          name: 'Test Resource 1',
          amount: 50,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test',
        },
        'test-resource-2': {
          id: 'test-resource-2',
          name: 'Test Resource 2',
          amount: 30,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'test',
        },
      },
      structures: {},
      game: {
        gameStage: 1,
        lastSaveTime: Date.now(),
        totalPlayTime: 0,
        isRunning: true,
        tickRate: 1000,
        gameTimeScale: 1,
        startDate: Date.now(),
        gameEnded: false,
        gameWon: false,
        endReason: null,
      },
      tasks: {
        tasks: {},
        activeTasks: [],
        completedTasks: [],
        failedTasks: [],
      },
      events: {
        availableEvents: {},
        activeEvents: [],
        completedEvents: [],
        eventHistory: [],
      },
      progression: {
        level: 1,
        experience: 0,
        experienceNeeded: 100,
        skillPoints: 0,
        skills: {},
      },
      tutorial: {
        active: false,
        currentStep: null,
        completedTutorials: [],
        tutorialsEnabled: true,
        firstTimeUser: true,
        showContextualHelp: true,
      },
    };

    // Create ResourceManager with proper dependencies
    resourceManager = createResourceManager(defaultState);

    // Reset mocks before each test
    mockDispatch.mockReset();
  });

  describe('initializeResources', () => {
    test('dispatches addResource action for each initial resource', () => {
      // Import the actual module to spy on
      const resourceActionsModule = require('../state/resourcesSlice');

      // Spy on addResource action creator
      const addResourceSpy = jest.spyOn(resourceActionsModule, 'addResource');

      // Call the function
      resourceManager.initializeResources();

      // Check that dispatch was called for each resource
      expect(mockDispatch).toHaveBeenCalledTimes(Object.keys(INITIAL_RESOURCES).length);

      // Verify each resource was added (using mock dispatch calls instead of action spy)
      Object.values(INITIAL_RESOURCES).forEach((resource) => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('resources/addResource'),
            payload: expect.objectContaining({ id: resource.id }),
          })
        );
      });

      // Clean up spy
      addResourceSpy.mockRestore();
    });
  });

  describe('updateResources', () => {
    test('updates resource amounts based on perSecond rates and elapsed time', () => {
      // Create complete test state
      const testState = {
        resources: {
          'test-resource-1': {
            id: 'test-resource-1',
            name: 'Test Resource 1',
            amount: 10,
            maxAmount: 100,
            perSecond: 2,
            description: 'Test resource with generation',
            unlocked: true,
            category: 'test',
          },
          'test-resource-2': {
            id: 'test-resource-2',
            name: 'Test Resource 2',
            amount: 5,
            maxAmount: 50,
            perSecond: 0, // No generation
            description: 'Test resource without generation',
            unlocked: true,
            category: 'test',
          },
        },
        structures: {},
        game: {
          gameStage: 1,
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
        },
        tasks: { tasks: {} },
        events: { availableEvents: {} },
        progression: { level: 1 },
        tutorial: { active: false },
      };

      // Create a resource manager with our test state
      const testResourceManager = createResourceManager(testState);

      // Set elapsed time (5 seconds)
      const elapsedTime = 5;

      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      testResourceManager.updateResources(elapsedTime);

      // Check dispatch was called with correct parameters for test-resource-1
      // (2 per second * 5 seconds = 10)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/addResourceAmount'),
          payload: expect.objectContaining({
            id: 'test-resource-1',
            amount: 10,
          }),
        })
      );
    });
  });

  describe('calculateResourceGeneration', () => {
    test('calculates and updates resource generation rates based on structures', () => {
      // Create complete test state with resources and structures
      const testState = {
        resources: {
          'test-resource-1': {
            id: 'test-resource-1',
            name: 'Test Resource 1',
            amount: 0,
            maxAmount: 100,
            perSecond: 1, // Base generation
            description: 'Test resource',
            unlocked: true,
            category: 'test',
          },
          'test-resource-2': {
            id: 'test-resource-2',
            name: 'Test Resource 2',
            amount: 0,
            maxAmount: 100,
            perSecond: 0, // No base generation
            description: 'Test resource',
            unlocked: true,
            category: 'test',
          },
        },
        structures: {
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
            category: 'test',
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
            category: 'test',
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
            category: 'test',
          },
        },
        game: {
          gameStage: 1,
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
        },
        tasks: { tasks: {} },
        events: { availableEvents: {} },
        progression: { level: 1 },
        tutorial: { active: false },
      };

      // Create a resource manager with our test state
      const testResourceManager = createResourceManager(testState);

      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      testResourceManager.calculateResourceGeneration();

      // Check that base resource rates were updated
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/updateBaseResourcePerSecond'),
          payload: expect.objectContaining({
            id: expect.any(String),
            basePerSecond: expect.any(Number),
          }),
        })
      );
    });
  });

  describe('canAfford', () => {
    test('returns true when all resources are available and sufficient', () => {
      // With default state already set up in beforeEach

      // Define costs that are affordable
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
      // Create test state with insufficient resources
      const testState = {
        resources: {
          'test-resource-1': {
            id: 'test-resource-1',
            name: 'Test Resource 1',
            amount: 50,
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: true,
            category: 'test',
          },
          'test-resource-2': {
            id: 'test-resource-2',
            name: 'Test Resource 2',
            amount: 15, // Not enough
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: true,
            category: 'test',
          },
        },
        structures: {},
        game: {
          gameStage: 1,
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
        },
        tasks: { tasks: {} },
        events: { availableEvents: {} },
        progression: { level: 1 },
        tutorial: { active: false },
      };

      // Create manager with test state
      const testResourceManager = createResourceManager(testState);

      // Define costs that exceed available amount
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20, // Higher than available
      };

      // Check if affordable
      const result = testResourceManager.canAfford(costs);

      // Should not be affordable
      expect(result).toBe(false);
    });

    test('returns false when any resource is not unlocked', () => {
      // Create test state with locked resource
      const testState = {
        resources: {
          'test-resource-1': {
            id: 'test-resource-1',
            name: 'Test Resource 1',
            amount: 50,
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: true,
            category: 'test',
          },
          'test-resource-2': {
            id: 'test-resource-2',
            name: 'Test Resource 2',
            amount: 30,
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: false, // Not unlocked
            category: 'test',
          },
        },
        structures: {},
        game: {
          gameStage: 1,
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
        },
        tasks: { tasks: {} },
        events: { availableEvents: {} },
        progression: { level: 1 },
        tutorial: { active: false },
      };

      // Create manager with test state
      const testResourceManager = createResourceManager(testState);

      // Define costs with the locked resource
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20,
      };

      // Check if affordable
      const result = testResourceManager.canAfford(costs);

      // Should not be affordable
      expect(result).toBe(false);
    });

    test('returns false when any resource is missing', () => {
      // Using the default state which doesn't have 'missing-resource'

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
      // Define costs using default state resources
      const costs = {
        'test-resource-1': 30,
        'test-resource-2': 20,
      };

      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      const result = resourceManager.applyResourceCost(costs);

      // Should be successful
      expect(result).toBe(true);

      // Check that the correct actions were dispatched with negative amounts
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/addResourceAmount'),
          payload: expect.objectContaining({
            id: 'test-resource-1',
            amount: -30,
          }),
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/addResourceAmount'),
          payload: expect.objectContaining({
            id: 'test-resource-2',
            amount: -20,
          }),
        })
      );
    });
  });

  describe('unlockResource', () => {
    test('unlocks a locked resource and returns true', () => {
      // Create test state with a locked resource
      const testState = {
        resources: {
          'test-resource': {
            id: 'test-resource',
            name: 'Test Resource',
            amount: 0,
            maxAmount: 100,
            perSecond: 0,
            description: 'Test resource',
            unlocked: false, // Initially locked
            category: 'test',
          },
        },
        structures: {},
        game: {
          gameStage: 1,
          lastSaveTime: Date.now(),
          totalPlayTime: 0,
          isRunning: true,
          tickRate: 1000,
          gameTimeScale: 1,
        },
        tasks: { tasks: {} },
        events: { availableEvents: {} },
        progression: { level: 1 },
        tutorial: { active: false },
      };

      // Create resource manager with test state
      const testResourceManager = createResourceManager(testState);

      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      const result = testResourceManager.unlockResource('test-resource');

      // Check that the correct action was dispatched
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/toggleResourceUnlocked'),
          payload: expect.objectContaining({
            id: 'test-resource',
            unlocked: true,
          }),
        })
      );

      // Check that the function returned true (resource was newly unlocked)
      expect(result).toBe(true);
    });

    test('returns false for already unlocked resources', () => {
      // Default state has unlocked resources

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      const result = resourceManager.unlockResource('test-resource');

      // Check that dispatch was not called
      expect(mockDispatch).not.toHaveBeenCalled();

      // Check that the function returned false (resource was already unlocked)
      expect(result).toBe(false);
    });

    test('returns false for non-existent resources', () => {
      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

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
      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      const result = resourceManager.addResourceAmount('test-resource', 25);

      // Check success
      expect(result).toBe(true);

      // Check that dispatch was called correctly
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/addResourceAmount'),
          payload: expect.objectContaining({
            id: 'test-resource',
            amount: 25,
          }),
        })
      );
    });

    test('setResourceAmount sets absolute value for resource', () => {
      // Import action creator module
      const resourceActionsModule = require('../state/resourcesSlice');

      // Reset dispatch mock to clear previous calls
      mockDispatch.mockReset();

      // Call the function
      const result = resourceManager.setResourceAmount('test-resource', 75);

      // Check success
      expect(result).toBe(true);

      // Check that dispatch was called correctly
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/updateResourceAmount'),
          payload: expect.objectContaining({
            id: 'test-resource',
            amount: 75,
          }),
        })
      );
    });
  });
});
