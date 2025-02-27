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
        initializeResources: jest.fn()
      })
    }
  };
});

// Mock BuildingManager
jest.mock('./buildingManager', () => {
  return {
    BuildingManager: {
      getInstance: jest.fn().mockReturnValue({
        initialize: jest.fn()
      })
    }
  };
});

// Mock GameLoopManager
jest.mock('../managers/GameLoopManager', () => {
  return {
    GameLoopManager: {
      getInstance: jest.fn().mockReturnValue({
        startGameLoop: jest.fn(),
        isGameLoopRunning: jest.fn().mockReturnValue(false)
      })
    }
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
      }
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
  
  test('should start the game loop', () => {
    // Mock setInterval
    jest.spyOn(window, 'setInterval').mockReturnValue(123 as unknown as NodeJS.Timeout);
    
    gameLoop.start();
    
    // Check if setInterval was called
    expect(window.setInterval).toHaveBeenCalled();
    
    // Clean up
    gameLoop.stop();
  });
  
  test('should stop the game loop', () => {
    // Mock setInterval and clearInterval
    jest.spyOn(window, 'setInterval').mockReturnValue(123 as unknown as NodeJS.Timeout);
    jest.spyOn(window, 'clearInterval').mockImplementation(() => {});
    
    // Start and then stop
    gameLoop.start();
    gameLoop.stop();
    
    // Check if clearInterval was called
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });
  
  test('should update time and resources on tick', () => {
    // Mock Date.now to simulate time passing
    const dateSpy = jest.spyOn(Date, 'now');
    
    // First call - initialization
    dateSpy.mockReturnValueOnce(1000000);
    
    // Start the loop
    gameLoop.start();
    
    // Reset dispatch tracking
    (store.dispatch as jest.Mock).mockClear();
    
    // Second call - during tick (1 second later)
    dateSpy.mockReturnValueOnce(1001000);
    
    // Simulate a tick by directly calling the private method
    // @ts-ignore - access private method for testing
    gameLoop['tick']();
    
    // Expect addPlayTime and updateLastSaveTime to be called
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: expect.stringContaining('game/addPlayTime')
    }));
    
    // Check if total play time was updated
    const state = store.getState();
    expect(state.game.totalPlayTime).toBeGreaterThan(0);
    
    // Clean up
    gameLoop.stop();
  });
  
  test('multiple ticks should accumulate play time', () => {
    // Mock Date.now for controlled testing
    const dateSpy = jest.spyOn(Date, 'now');
    
    // Initialize to 1000 seconds since epoch
    dateSpy.mockReturnValueOnce(1000000);
    
    // Start the loop
    gameLoop.start();
    
    // First tick (1 second later)
    dateSpy.mockReturnValueOnce(1001000);
    // @ts-ignore - access private method for testing
    gameLoop['tick']();
    
    // Second tick (another 1 second later)
    dateSpy.mockReturnValueOnce(1002000);
    // @ts-ignore - access private method for testing
    gameLoop['tick']();
    
    // Third tick (another 2 seconds later)
    dateSpy.mockReturnValueOnce(1004000);
    // @ts-ignore - access private method for testing
    gameLoop['tick']();
    
    // Check if total play time was updated correctly (should be about 4 seconds)
    const state = store.getState();
    expect(state.game.totalPlayTime).toBeCloseTo(4, 1);
    
    // Clean up
    gameLoop.stop();
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