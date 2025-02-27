import { Store } from 'redux';
import { ErrorLogger } from './errorUtils';
import { RootState } from '../state/store';

/**
 * Factory to create a mock Redux store for testing
 * @returns Mock store and its dispatch/getState mocks
 */
export const createMockStore = () => {
  const mockDispatch = jest.fn();
  
  // Create a mock state that follows the shape of our Redux store
  const mockState = {
    resources: {},
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
      endReason: null
    },
    tasks: { 
      tasks: {},
      activeTasks: [],
      completedTasks: [],
      failedTasks: []
    },
    events: { 
      availableEvents: {},
      activeEvents: [],
      completedEvents: [],
      eventHistory: []
    },
    progression: { 
      level: 1, 
      experience: 0,
      experienceNeeded: 100,
      skillPoints: 0,
      skills: {}
    },
    tutorial: { 
      active: false, 
      currentStep: null,
      completedTutorials: [], 
      tutorialsEnabled: true,
      firstTimeUser: true,
      showContextualHelp: true
    }
  };
  
  const mockGetState = jest.fn().mockReturnValue(mockState);
  
  const mockStore = {
    dispatch: mockDispatch,
    getState: mockGetState,
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  } as unknown as Store;
  
  return { mockStore, mockDispatch, mockGetState };
};

/**
 * Helper to reset singleton instances for testing
 * This is used to reset singleton classes between tests
 * @param singletonClass Class with private constructor and static getInstance method
 */
export function resetSingleton(singletonClass: any): void {
  // Access private static instance field and reset it
  // Note: This is a hack for testing purposes only
  if ('instance' in singletonClass) {
    // @ts-ignore - Accessing private field for testing
    singletonClass.instance = null;
  }
  
  // For error logger, use the proper reset method if available
  if (singletonClass === ErrorLogger && typeof ErrorLogger.resetInstance === 'function') {
    ErrorLogger.resetInstance();
  }
}

/**
 * Mock implementation for getInstance that allows direct instance creation in tests
 * This lets you bypass the private constructor for testing
 * @param singletonClass Class to mock
 * @param mockInstance Mock instance to return from getInstance
 */
export function mockGetInstance<T>(singletonClass: any, mockInstance: T): jest.SpyInstance {
  return jest.spyOn(singletonClass, 'getInstance').mockReturnValue(mockInstance);
}

/**
 * Create test versions of our singleton manager classes
 * This bypasses the private constructor restriction by creating a testing subclass
 * @param BaseClass The singleton class to extend
 * @returns A class that can be instantiated for testing
 */
export function createTestableManager<T>(BaseClass: any): new (...args: any[]) => T {
  // Create a test subclass that can be directly instantiated
  return class TestManager extends BaseClass {
    constructor(...args: any[]) {
      // @ts-ignore - Accessing private constructor for testing
      super(...args);
    }
    
    // Add static method to set the singleton instance for testing
    static setTestInstance(instance: any): void {
      // @ts-ignore - Setting private static field for testing
      BaseClass.instance = instance;
    }
  } as any;
}