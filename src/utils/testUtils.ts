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
 * Common interface for singleton classes in the game
 * This creates a more flexible type for working with singletons in tests
 */
export interface SingletonClass {
  getInstance: (...args: unknown[]) => unknown;
}

/**
 * Helper to reset singleton instances for testing
 * This is used to reset singleton classes between tests
 * @param singletonClass Class with private constructor and static getInstance method
 */
export function resetSingleton(singletonClass: unknown): void {
  // Access private static instance field and reset it
  // Note: This is a hack for testing purposes only
  const classWithInstance = singletonClass as { instance?: unknown };

  if (classWithInstance && 'instance' in classWithInstance) {
    // Direct private field access for testing - intentionally bypassing TypeScript protection
    classWithInstance.instance = null;
  }

  // Special case for ErrorLogger which has a proper reset method
  if (singletonClass === ErrorLogger) {
    ErrorLogger.resetInstance();
  }
}

/**
 * Mock implementation for getInstance that allows direct instance creation in tests
 * This lets you bypass the private constructor for testing
 * @param singletonClass Class to mock
 * @param mockInstance Mock instance to return from getInstance
 */
export function mockGetInstance<T>(
  singletonClass: SingletonClass,
  mockInstance: T
): jest.SpyInstance {
  return jest.spyOn(singletonClass, 'getInstance').mockReturnValue(mockInstance);
}

/**
 * Type for constructor function with static getInstance method
 */
interface SingletonConstructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInstance(...args: any[]): T;
  // Private static field that we'll access in tests
  instance?: T;
}

/**
 * Create test versions of our singleton manager classes
 * This bypasses the private constructor restriction by creating a testing subclass
 * @param BaseClass The singleton class to extend
 * @returns A class that can be instantiated for testing
 */
export function createTestableManager<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BaseClass: any
): { new (...args: unknown[]): T } {
  // Create a test subclass that can be directly instantiated
  // We use any here because we're purposely breaking the type system to access private members
  class TestManager extends BaseClass {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    // Add static method to set the singleton instance for testing
    static setTestInstance(instance: T): void {
      BaseClass.instance = instance;
    }
  }

  return TestManager as unknown as { new (...args: unknown[]): T };
}
