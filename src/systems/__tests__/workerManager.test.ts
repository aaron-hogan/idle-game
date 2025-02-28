import { configureStore } from '@reduxjs/toolkit';
import { WorkerManager } from '../workerManager';
import resourcesReducer from '../../state/resourcesSlice';
import structuresReducer, { addStructure, assignWorkers, changeWorkerCount } from '../../state/structuresSlice';
import gameReducer, { setGameStage } from '../../state/gameSlice';
import { Structure } from '../../models/structure';
import { resetSingleton, createMockStore } from '../../utils/testUtils';

describe('WorkerManager', () => {
  let store: any;
  let workerManager: WorkerManager;
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;
  
  // Example structures for testing
  const testStructures: Structure[] = [
    {
      id: 'building1',
      name: 'Test Building 1',
      description: 'A test building',
      level: 1,
      maxLevel: 5,
      cost: {},
      production: {},
      unlocked: true,
      workers: 0,
      maxWorkers: 5,
      category: 'test'
    },
    {
      id: 'building2',
      name: 'Test Building 2',
      description: 'Another test building',
      level: 2,
      maxLevel: 5,
      cost: {},
      production: {},
      unlocked: true,
      workers: 0,
      maxWorkers: 8,
      category: 'test'
    },
    {
      id: 'building3',
      name: 'Test Building 3',
      description: 'Yet another test building',
      level: 3,
      maxLevel: 5,
      cost: {},
      production: {},
      unlocked: true,
      workers: 0,
      maxWorkers: 10,
      category: 'test'
    }
  ];
  
  // Helper function to create a properly initialized WorkerManager
  const createWorkerManager = (state: any) => {
    // Reset singleton instance
    resetSingleton(WorkerManager);
    
    // Set up mockGetState to return the provided state
    mockGetState.mockReturnValue(state);
    
    // Create WorkerManager with explicit dependencies
    return WorkerManager.getInstance({
      dispatch: mockDispatch,
      getState: mockGetState,
      actions: {
        assignWorkers,
        changeWorkerCount
      }
    });
  };
  
  beforeEach(() => {
    // Reset singleton instance
    resetSingleton(WorkerManager);
    
    // Set up mock store
    const mocks = createMockStore();
    store = mocks.mockStore;
    mockDispatch = mocks.mockDispatch;
    mockGetState = mocks.mockGetState;
    
    // Set up mock state with game stage and structures
    const mockState = {
      game: { gameStage: 1 }, // 5 base workers + 3 from stage = 8 total
      structures: {
        building1: testStructures[0],
        building2: testStructures[1],
        building3: testStructures[2],
      },
      resources: {}
    };
    
    // Create WorkerManager with explicit dependencies
    workerManager = createWorkerManager(mockState);
  });
  
  describe('Worker counting', () => {
    test('should get total available workers based on game stage', () => {
      expect(workerManager.getTotalAvailableWorkers()).toBe(8); // 5 base + 3 from stage 1
      
      // Update mock state to stage 2
      mockGetState.mockReturnValue({
        ...mockGetState(),
        game: { gameStage: 2 } // 5 base + 6 from stage 2 = 11 total
      });
      
      expect(workerManager.getTotalAvailableWorkers()).toBe(11);
    });
    
    test('should get total assigned workers', () => {
      // Initial state has no workers assigned
      expect(workerManager.getTotalAssignedWorkers()).toBe(0);
      
      // Update mock state to have workers assigned
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 3 },
          building2: { ...testStructures[1], workers: 2 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      
      expect(workerManager.getTotalAssignedWorkers()).toBe(5);
    });
    
    test('should get remaining workers correctly', () => {
      expect(workerManager.getRemainingWorkers()).toBe(8); // All 8 free initially
      
      // Update mock state to have workers assigned
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 3 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      
      expect(workerManager.getRemainingWorkers()).toBe(5); // 5 remaining
    });
  });
  
  describe('Worker assignment', () => {
    test('should assign workers to buildings', () => {
      // Assign 3 workers to building1
      const result = workerManager.assignWorkersToBuilding('building1', 3);
      
      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 3 }
      }));
    });
    
    test('should limit assignment to available workers', () => {
      // Try to assign 10 workers when only 8 are available
      workerManager.assignWorkersToBuilding('building1', 10);
      
      // Should limit to maxWorkers of building (5)
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 5 }
      }));
    });
    
    test('should limit assignment to maxWorkers', () => {
      // Try to assign 8 workers to building1 which has maxWorkers 5
      workerManager.assignWorkersToBuilding('building1', 8);
      
      // Should limit to maxWorkers (5)
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 5 }
      }));
    });
    
    test('should handle nonexistent building', () => {
      const result = workerManager.assignWorkersToBuilding('nonexistent', 3);
      
      expect(result).toBe(false);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
  
  describe('Changing worker count', () => {
    test('should add workers by delta', () => {
      // Update mock state to have 2 workers in building1
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 2 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      
      // Add 1 more
      workerManager.changeWorkerCount('building1', 1);
      
      // Should have dispatched with 3 workers
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 3 }
      }));
    });
    
    test('should remove workers by delta', () => {
      // Update mock state to have 5 workers in building1
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 5 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      
      // Remove 2 workers
      workerManager.changeWorkerCount('building1', -2);
      
      // Should have dispatched with 3 workers
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 3 }
      }));
    });
    
    test('should limit addition by available workers', () => {
      // Update mock state to have 7 workers in building2 (1 remaining)
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 0 },
          building2: { ...testStructures[1], workers: 7 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      
      // Try to add 3 more to building1 when only 1 is available
      workerManager.changeWorkerCount('building1', 3);
      
      // Should have dispatched with only 1 worker
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building1', workers: 1 }
      }));
    });
  });
  
  describe('Worker efficiency', () => {
    test('should calculate worker efficiency correctly', () => {
      // Mock structure states for different tests
      
      // No workers = 0 efficiency
      expect(workerManager.calculateWorkerEfficiency('building1')).toBe(0);
      
      // 2 workers in building1 (40% staffed)
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 2 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      expect(workerManager.calculateWorkerEfficiency('building1')).toBeCloseTo(1.0, 1);
      
      // 4 workers in building1 (80% staffed)
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 4 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      expect(workerManager.calculateWorkerEfficiency('building1')).toBeCloseTo(2.0, 1);
      
      // 5 workers in building1 (100% staffed)
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 5 },
          building2: { ...testStructures[1], workers: 0 },
          building3: { ...testStructures[2], workers: 0 },
        }
      });
      expect(workerManager.calculateWorkerEfficiency('building1')).toBeCloseTo(1.0, 1);
    });
    
    test('should handle nonexistent building for efficiency', () => {
      expect(workerManager.calculateWorkerEfficiency('nonexistent')).toBe(0);
    });
  });
  
  describe('Auto-assignment', () => {
    test('should auto-assign with balanced strategy', () => {
      // Set up to check if dispatch was called for each building
      workerManager.autoAssignWorkers('balanced');
      
      // Expect dispatches for all buildings
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: expect.objectContaining({ id: 'building1' })
      }));
      
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: expect.objectContaining({ id: 'building2' })
      }));
      
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: expect.objectContaining({ id: 'building3' })
      }));
    });
    
    test('should auto-assign with focused strategy', () => {
      workerManager.autoAssignWorkers('focused');
      
      // For focused, should prioritize building3 (level 3)
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/assignWorkers'),
        payload: { id: 'building3', workers: 8 } // All workers to highest level
      }));
    });
    
    test('should auto-assign with efficiency strategy', () => {
      // Mock workers already assigned
      mockGetState.mockReturnValue({
        ...mockGetState(),
        structures: {
          building1: { ...testStructures[0], workers: 2 },
          building2: { ...testStructures[1], workers: 3 },
          building3: { ...testStructures[2], workers: 3 },
        }
      });
      
      // Test the assignment
      workerManager.autoAssignWorkers('efficiency');
      
      // Just verify that dispatches were made
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});