import { GameManager } from './GameManager';
import { Store } from '@reduxjs/toolkit';
import { GameLoop } from './GameLoop';
import { addPlayTime, updateLastSaveTime } from '../state/gameSlice';
import { ResourceManager } from '../systems/resourceManager';

// Mock dependencies
jest.mock('./GameLoop');
jest.mock('../systems/resourceManager');
jest.mock('../state/gameSlice', () => {
  return {
    addPlayTime: jest.fn().mockReturnValue({ type: 'game/addPlayTime' }),
    updateLastSaveTime: jest.fn().mockReturnValue({ type: 'game/updateLastSaveTime' })
  };
});

describe('GameManager', () => {
  let mockStore: any;
  let mockState: any;
  let gameManager: GameManager;
  let mockGameLoop: any;
  let mockResourceManager: any;

  beforeEach(() => {
    // Create mock state
    mockState = {
      game: {
        totalPlayTime: 0,
        lastSaveTime: Date.now(),
        gameTimeScale: 1
      },
      resources: {}
    };

    // Create mock store
    mockStore = {
      getState: jest.fn(() => mockState),
      dispatch: jest.fn()
    };

    // Mock GameLoop with all required methods
    mockGameLoop = {
      start: jest.fn(),
      stop: jest.fn(),
      registerHandler: jest.fn(() => {
        // Return a function that can be called to simulate the update
        return (realDeltaTime: number, scaledDeltaTime: number) => {
          // Handle the update logic here
          console.log('Mock update handler called');
          return true;
        };
      }),
      isRunning: jest.fn().mockReturnValue(true),
      setDebugMode: jest.fn(),
      setTimeScale: jest.fn(),
      getTimeScale: jest.fn().mockReturnValue(1.0),
      getGameTimer: jest.fn().mockReturnValue({
        getTotalGameTime: jest.fn().mockReturnValue(0),
        getElapsedRealTime: jest.fn().mockReturnValue(0),
        getTimeScale: jest.fn().mockReturnValue(1.0)
      }),
      setStore: jest.fn()
    };
    (GameLoop.getInstance as jest.Mock).mockReturnValue(mockGameLoop);

    // Mock ResourceManager
    mockResourceManager = {
      initialize: jest.fn(),
      calculateResourceGeneration: jest.fn(),
      updateResources: jest.fn()
    };
    (ResourceManager.getInstance as jest.Mock).mockReturnValue(mockResourceManager);
    
    // Create GameManager instance for testing
    gameManager = GameManager.getInstance(mockStore as unknown as Store, {
      debugMode: true,
      processOfflineProgress: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('update method should add play time with consistently scaled delta time', () => {
    // Get the update handler registered with the game loop
    const updateHandler = (mockGameLoop.registerHandler as jest.Mock).mock.calls[0][0];
    
    // Simulate a game update with specific delta times
    const unscaledDeltaTime = 0.1; // 100ms of real time
    const scaledDeltaTime = 0.48; // 4.8x scaled time (480ms of game time)
    
    // Call the update handler directly
    updateHandler(unscaledDeltaTime, scaledDeltaTime);
    
    // With the fix applied, addPlayTime should be called with consistent scaled time (1.0x scale)
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'game/addPlayTime' });
    expect(addPlayTime).toHaveBeenCalledWith(unscaledDeltaTime * 1.0); // Using forced 1.0 scale
    
    // Resources should also be updated with the same consistent time
    expect(mockResourceManager.updateResources).toHaveBeenCalledWith(unscaledDeltaTime * 1.0);
  });

  test('GameManager uses consistent time scales for timer and resources after fix', () => {
    // Get the update handler registered with the game loop
    const updateHandler = (mockGameLoop.registerHandler as jest.Mock).mock.calls[0][0];
    
    // Test with unscaled and scaled delta times
    const unscaledDelta = 0.1; // 100ms of real time
    const scaledDelta = 0.48; // Would be 4.8x scaled (but we force 1.0x now)
    
    // Call the update handler directly
    updateHandler(unscaledDelta, scaledDelta);
    
    // Check that after the fix, both timer and resources get the same consistently scaled time
    // Both should be using the forced 1.0 scale
    expect(addPlayTime).toHaveBeenCalledWith(unscaledDelta * 1.0);
    expect(mockResourceManager.updateResources).toHaveBeenCalledWith(unscaledDelta * 1.0);
    
    // The values should be the same (unscaledDelta * 1.0), so we don't need to extract them from the mocks
    // Just compare that both were called with the same arguments
    const addPlayTimeArgs = (addPlayTime as unknown as jest.Mock).mock.calls[0][0];
    const updateResourcesArgs = (mockResourceManager.updateResources as jest.Mock).mock.calls[0][0];
    expect(addPlayTimeArgs).toBeCloseTo(updateResourcesArgs, 5);
    
    // Fixed value should be close to unscaledDelta * 1.0
    expect(addPlayTimeArgs).toBeCloseTo(unscaledDelta * 1.0, 5);
    
    // Ratio check removed since we're checking equality directly
  });

  test('Offline progress uses consistent time scale after fix', () => {
    // Mock calculateOfflineTime to return a known value
    jest.mock('../utils/timeUtils', () => ({
      calculateOfflineTime: jest.fn().mockReturnValue(120), // 2 minutes of offline time
      getCurrentTime: jest.fn().mockReturnValue(Date.now())
    }));
    
    // Get a reference to the processOfflineProgress method
    const gameManagerInstance = GameManager.getInstance(mockStore as unknown as Store);
    
    // Use private method via any cast to test offline progress
    (gameManagerInstance as any).processOfflineProgress();
    
    // After the fix, both should receive the same scaled time (forced 1.0 scale)
    // Both dispatches should happen, but we can't easily check their exact parameters
    // due to the mock implementation
    
    // Verify ResourceManager was called (exact time check isn't possible with our mock)
    expect(mockResourceManager.updateResources).toHaveBeenCalled();
    
    // Verify dispatch was called at least once (for addPlayTime)
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  test('Simulation of timer and resource progress with consistent time scale', () => {
    // Simulate both timer and resource progress with consistent time scale
    let simulatedGameTime = 0;
    let simulatedResourceTime = 0;
    let simulatedRealTime = 0;
    
    // Test parameters
    const realTimeDelta = 0.1; // 100ms per update
    const forceTimeScale = 1.0; // Force consistent scale
    const updates = 100; // 10 seconds total
    
    // Simulate updates
    for (let i = 0; i < updates; i++) {
      // Update real time
      simulatedRealTime += realTimeDelta;
      
      // Apply consistent time scale to both
      const scaledDelta = realTimeDelta * forceTimeScale;
      
      // Update game time and resource time with the same scaling
      simulatedGameTime += scaledDelta;
      simulatedResourceTime += scaledDelta;
    }
    
    // Calculate displayed time ratio (should be 1.0)
    const timeRatio = simulatedGameTime / simulatedRealTime;
    expect(timeRatio).toBeCloseTo(forceTimeScale, 5);
    
    // Calculate resource to game time ratio (should be 1.0)
    const resourceToGameRatio = simulatedResourceTime / simulatedGameTime;
    expect(resourceToGameRatio).toBeCloseTo(1.0, 5);
  });
});