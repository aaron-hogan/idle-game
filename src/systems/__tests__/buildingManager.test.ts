import { BuildingManager, createInitialBuildings } from '../buildingManager';
import { configureStore, Store } from '@reduxjs/toolkit';
import structuresReducer from '../../state/structuresSlice';
import resourcesReducer from '../../state/resourcesSlice';
import { Structure } from '../../models/structure';
import { resetSingleton, createMockStore } from '../../utils/testUtils';

// Helper function to create test building
const createTestBuilding = (
  id: string,
  name: string,
  description: string,
  level: number = 0,
  maxLevel: number = 3,
  cost: Record<string, number> = { collective_bargaining_power: 10 },
  production: Record<string, number> = { solidarity: 0.5 },
  unlocked: boolean = true,
  workers: number = 0,
  maxWorkers: number = 5,
  category: string = 'test'
): Structure => {
  return {
    id,
    name,
    description,
    level,
    maxLevel,
    cost,
    production,
    unlocked,
    workers,
    maxWorkers,
    category,
  };
};

describe('BuildingManager', () => {
  let buildingManager: BuildingManager;
  let store: Store;
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;

  // Helper function to create a properly initialized BuildingManager
  const createBuildingManager = (state: any) => {
    // Reset singleton instance
    resetSingleton(BuildingManager);

    // Import action creators
    const structureActions = require('../../state/structuresSlice');
    const resourceActions = require('../../state/resourcesSlice');

    // Set up mockGetState to return the provided state
    mockGetState.mockReturnValue(state);

    // Create BuildingManager with explicit dependencies
    return BuildingManager.getInstance({
      dispatch: mockDispatch,
      getState: mockGetState,
      actions: {
        addStructure: structureActions.addStructure,
        upgradeStructure: structureActions.upgradeStructure,
        updateProduction: structureActions.updateProduction,
        deductResources: resourceActions.deductResources,
      },
    });
  };

  beforeEach(() => {
    // Reset singleton instance for each test
    resetSingleton(BuildingManager);

    // Set up mock store
    const mocks = createMockStore();
    store = mocks.mockStore;
    mockDispatch = mocks.mockDispatch;
    mockGetState = mocks.mockGetState;

    // Set up complete mock state with structures
    const mockState = {
      resources: {
        collective_bargaining_power: {
          id: 'collective_bargaining_power',
          name: 'Collective Bargaining Power',
          amount: 15,
          maxAmount: 100,
          perSecond: 1,
          description: 'Test resource',
          unlocked: true,
          category: 'primary',
        },
        solidarity: {
          id: 'solidarity',
          name: 'Solidarity',
          amount: 0,
          maxAmount: 100,
          perSecond: 0,
          description: 'Test resource',
          unlocked: true,
          category: 'primary',
        },
      },
      structures: {
        test_building: createTestBuilding('test_building', 'Test Building', 'A test building'),
      },
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
      tasks: {},
      events: {},
      progression: {},
      tutorial: {},
    };

    // Create BuildingManager with proper dependencies
    buildingManager = createBuildingManager(mockState);

    // Reset mocks before each test
    mockDispatch.mockReset();
  });

  describe('initialization', () => {
    it('should initialize a building', () => {
      // Create a new test building
      const testBuilding = createTestBuilding(
        'new_test_building',
        'New Test Building',
        'A new test building'
      );

      // Initialize with empty structures
      const emptyState = {
        resources: {},
        structures: {},
        game: {
          gameStage: 1,
        },
      };

      const emptyManager = createBuildingManager(emptyState);

      // Initialize the building
      emptyManager.initializeBuilding(testBuilding);

      // Check that dispatch was called with the correct action
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('structures/addStructure'),
          payload: testBuilding,
        })
      );
    });

    it('should initialize multiple buildings', () => {
      const testBuildings = [
        createTestBuilding('test_building1', 'Test Building 1', 'Test building 1'),
        createTestBuilding(
          'test_building2',
          'Test Building 2',
          'Test building 2',
          0,
          3,
          { solidarity: 20 },
          { community_trust: 0.3 },
          true,
          0,
          3
        ),
      ];

      // Create manager with empty structures
      const emptyState = {
        resources: {},
        structures: {},
        game: {
          gameStage: 1,
        },
      };

      const emptyManager = createBuildingManager(emptyState);

      // Initialize the buildings
      emptyManager.initializeBuildings(testBuildings);

      // Check that dispatch was called twice
      expect(mockDispatch).toHaveBeenCalledTimes(2);

      // Check that it was called with the correct actions
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('structures/addStructure'),
          payload: testBuildings[0],
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('structures/addStructure'),
          payload: testBuildings[1],
        })
      );
    });
  });

  describe('purchase validation', () => {
    // Default state already has a building with 15 resources, which is enough to buy

    it('should correctly validate if player can afford a building', () => {
      // Test with default state (enough resources - 15 > 10 cost)
      const result1 = buildingManager.canPurchaseBuilding('test_building');
      expect(result1).toBe(true);

      // Create a new manager with insufficient resources
      const notEnoughState = {
        structures: {
          test_building: createTestBuilding('test_building', 'Test Building', 'A test building'),
        },
        resources: {
          collective_bargaining_power: {
            id: 'collective_bargaining_power',
            name: 'Collective Bargaining Power',
            amount: 5, // Not enough to buy
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: true,
            category: 'primary',
          },
        },
      };

      const poorManager = createBuildingManager(notEnoughState);

      // Test with insufficient resources
      const result2 = poorManager.canPurchaseBuilding('test_building');
      expect(result2).toBe(false);
    });

    it('should return false for non-existent buildings', () => {
      const result = buildingManager.canPurchaseBuilding('non_existent');
      expect(result).toBe(false);
    });

    it('should return false for locked buildings', () => {
      // Create a state with locked building
      const lockedState = {
        structures: {
          test_building: {
            ...createTestBuilding('test_building', 'Test Building', 'A test building'),
            unlocked: false,
          },
        },
        resources: {
          collective_bargaining_power: {
            id: 'collective_bargaining_power',
            name: 'Collective Bargaining Power',
            amount: 15,
            maxAmount: 100,
            perSecond: 1,
            description: 'Test resource',
            unlocked: true,
            category: 'primary',
          },
        },
      };

      const lockedManager = createBuildingManager(lockedState);

      const result = lockedManager.canPurchaseBuilding('test_building');
      expect(result).toBe(false);
    });
  });

  describe('purchasing', () => {
    // Default state has a building and enough resources

    it('should purchase a building and deduct resources', () => {
      // Mock that the building can be purchased
      jest.spyOn(buildingManager, 'canPurchaseBuilding').mockReturnValue(true);

      const result = buildingManager.purchaseBuilding('test_building');

      expect(result).toBe(true);

      // Check that the right actions were dispatched
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('structures/upgradeStructure'),
          payload: { id: 'test_building' },
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('resources/deductResources'),
          payload: { collective_bargaining_power: 10 },
        })
      );
    });

    it('should not purchase if player cannot afford it', () => {
      // Mock that the building cannot be purchased
      jest.spyOn(buildingManager, 'canPurchaseBuilding').mockReturnValue(false);

      const result = buildingManager.purchaseBuilding('test_building');

      expect(result).toBe(false);

      // Check that no actions were dispatched
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('production calculation', () => {
    it('should correctly calculate production based on level and workers', () => {
      // Create a state with a leveled building and workers
      const state = {
        structures: {
          test_building: createTestBuilding(
            'test_building',
            'Test Building',
            'A test building',
            1, // level
            3, // maxLevel
            { collective_bargaining_power: 10 },
            { solidarity: 0.5 },
            true, // unlocked
            2, // workers
            5 // maxWorkers
          ),
        },
        resources: {},
      };

      const productionManager = createBuildingManager(state);

      productionManager.recalculateProduction('test_building');

      // Check that the updateProduction action was dispatched
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('structures/updateProduction'),
          payload: expect.objectContaining({
            id: 'test_building',
            production: expect.objectContaining({
              solidarity: expect.any(Number),
            }),
          }),
        })
      );
    });
  });

  describe('createInitialBuildings', () => {
    it('should create the correct number of initial buildings', () => {
      const buildings = createInitialBuildings();

      // Check if we have all 5 buildings from the spec
      expect(buildings.length).toBe(5);

      // Check if we have the expected buildings
      const buildingIds = buildings.map((b) => b.id);
      expect(buildingIds).toContain('community_center');
      expect(buildingIds).toContain('union_office');
      expect(buildingIds).toContain('alt_media_outlet');
      expect(buildingIds).toContain('mutual_aid_network');
      expect(buildingIds).toContain('study_group');
    });

    it('should set Community Center as the only initially unlocked building', () => {
      const buildings = createInitialBuildings();

      const communityCenter = buildings.find((b) => b.id === 'community_center');
      expect(communityCenter?.unlocked).toBe(true);

      // Check that other buildings are locked
      const otherBuildings = buildings.filter((b) => b.id !== 'community_center');
      otherBuildings.forEach((building) => {
        expect(building.unlocked).toBe(false);
      });
    });
  });
});
