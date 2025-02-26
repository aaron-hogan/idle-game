import { configureStore } from '@reduxjs/toolkit';
import { GameManager } from '../../core/GameManager';
import resourcesReducer from '../../state/resourcesSlice';
import gameReducer from '../../state/gameSlice';
import structuresReducer from '../../state/structuresSlice';
import eventsReducer from '../../state/eventsSlice';
import tasksReducer from '../../state/tasksSlice';
import progressionReducer from '../../redux/progressionSlice';
import { Resource } from '../../models/resource';

describe('GameManager - Resource Updates', () => {
  // Mock update method so we can spy on it later
  jest.mock('../resourceManager', () => {
    const original = jest.requireActual('../resourceManager');
    return {
      ...original,
      ResourceManager: {
        ...original.ResourceManager,
        getInstance: jest.fn(() => ({
          initialize: jest.fn(),
          updateResources: jest.fn(),
          calculateResourceGeneration: jest.fn(),
        })),
      },
    };
  });

  // Import after mocking
  const { ResourceManager } = require('../resourceManager');

  // Create a test function to create a full store
  const setupTestStore = () => {
    return configureStore({
      reducer: {
        resources: resourcesReducer,
        game: gameReducer,
        structures: structuresReducer,
        events: eventsReducer,
        tasks: tasksReducer,
        progression: progressionReducer,
      },
    });
  };

  // Setup GameManager with the test store
  const setupGameManager = (store: any) => {
    const gameManager = GameManager.getInstance(store, {
      debugMode: false,
      processOfflineProgress: false,
      maxOfflineTime: 60,
    });
    
    return gameManager;
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test that the GameManager calls ResourceManager.updateResources
  it('should call ResourceManager.updateResources during update', () => {
    // Setup
    const store = setupTestStore();
    const gameManager = setupGameManager(store);
    const resourceManager = ResourceManager.getInstance();
    
    // Initialize the GameManager (which sets up the update loop)
    gameManager.initialize();
    
    // Manually trigger the update method (normally called by the game loop)
    // Access private method for testing
    (gameManager as any).update(1.0, 1.0);
    
    // Check if ResourceManager.updateResources was called
    expect(resourceManager.updateResources).toHaveBeenCalledWith(1.0);
  });

  // Test that the GameManager calls ResourceManager.calculateResourceGeneration periodically
  it('should call ResourceManager.calculateResourceGeneration periodically', () => {
    // Setup
    const store = setupTestStore();
    const gameManager = setupGameManager(store);
    const resourceManager = ResourceManager.getInstance();
    
    // Initialize the GameManager
    gameManager.initialize();
    
    // Set total play time to 4.9 seconds
    store.dispatch({ type: 'game/setTotalPlayTime', payload: 4.9 });
    
    // First update - should not call calculateResourceGeneration
    (gameManager as any).update(0.05, 0.05);
    expect(resourceManager.calculateResourceGeneration).not.toHaveBeenCalled();
    
    // Second update crosses the 5 second threshold - should call calculateResourceGeneration
    (gameManager as any).update(0.15, 0.15);
    expect(resourceManager.calculateResourceGeneration).toHaveBeenCalled();
  });

  // Test that the GameManager uses the correct deltaTime value
  it('should use correct delta time for resource updates', () => {
    // Setup
    const store = setupTestStore();
    const gameManager = setupGameManager(store);
    const resourceManager = ResourceManager.getInstance();
    
    // Initialize the GameManager
    gameManager.initialize();
    
    // Send multiple updates with different delta times
    (gameManager as any).update(0.1, 0.1);
    expect(resourceManager.updateResources).toHaveBeenLastCalledWith(0.1);
    
    (gameManager as any).update(0.5, 0.5);
    expect(resourceManager.updateResources).toHaveBeenLastCalledWith(0.5);
    
    (gameManager as any).update(1.0, 1.0);
    expect(resourceManager.updateResources).toHaveBeenLastCalledWith(1.0);
  });
});