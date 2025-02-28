/**
 * Tests for the GameLoop implementation
 */
import { GameLoop } from './gameLoop';
import { addPlayTime, updateLastSaveTime } from '../state/gameSlice';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import structuresReducer from '../state/structuresSlice';
import gameReducer from '../state/gameSlice';
import tasksReducer from '../state/tasksSlice';

// Mock ResourceManager
jest.mock('./resourceManager', () => {
  return {
    ResourceManager: {
      getInstance: jest.fn().mockReturnValue({
        initialize: jest.fn(),
        calculateResourceGeneration: jest.fn(),
        updateResources: jest.fn(),
        initializeResources: jest.fn(),
      }),
    },
  };
});

// Mock BuildingManager
jest.mock('./buildingManager', () => {
  return {
    BuildingManager: {
      getInstance: jest.fn().mockReturnValue({
        initialize: jest.fn(),
      }),
    },
  };
});

// Mock GameLoopManager
jest.mock('../managers/GameLoopManager', () => {
  return {
    GameLoopManager: {
      getInstance: jest.fn().mockReturnValue({
        startGameLoop: jest.fn(),
        isGameLoopRunning: jest.fn().mockReturnValue(false),
      }),
    },
  };
});

describe('GameLoop', () => {
  let gameLoop: GameLoop;
  let store: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Date.now to return predictable values
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);

    // Create a test store
    store = configureStore({
      reducer: {
        resources: resourcesReducer,
        structures: structuresReducer,
        game: gameReducer,
        tasks: tasksReducer,
      },
    });

    // Spy on store.dispatch
    jest.spyOn(store, 'dispatch');

    // Get GameLoop instance
    gameLoop = GameLoop.getInstance();
    gameLoop.initialize(store);
  });

  afterEach(() => {
    // Reset Date.now mock
    jest.restoreAllMocks();
  });

  test('should initialize properly', () => {
    expect(gameLoop).toBeDefined();
  });

  test('dispatches addPlayTime with correct value', () => {
    // Direct test of the Redux action
    const initialState = store.getState();
    const initialPlayTime = initialState.game.totalPlayTime;

    // Dispatch addPlayTime action directly
    store.dispatch(addPlayTime(10));

    // Check if state was updated correctly
    const newState = store.getState();
    expect(newState.game.totalPlayTime).toBe(initialPlayTime + 10);
  });
});
