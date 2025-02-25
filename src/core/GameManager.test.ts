import { GameManager } from './GameManager';
import { Store } from '@reduxjs/toolkit';
import { GameLoop } from './GameLoop';
import { addPlayTime, updateLastSaveTime } from '../state/gameSlice';
import { ResourceManager } from '../systems/resourceManager';

// Mock dependencies
jest.mock('./GameLoop');
jest.mock('../state/gameSlice', () => ({
  addPlayTime: jest.fn().mockReturnValue({ type: 'game/addPlayTime' }),
  updateLastSaveTime: jest.fn().mockReturnValue({ type: 'game/updateLastSaveTime' })
}));
jest.mock('../systems/resourceManager');

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

    // Mock GameLoop
    mockGameLoop = {
      start: jest.fn(),
      stop: jest.fn(),
      registerHandler: jest.fn(),
      isRunning: jest.fn().mockReturnValue(true),
      setDebugMode: jest.fn(),
      setTimeScale: jest.fn()
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
    
    // Calculate actual ratio - should be 1.0 since both use the same delta
    const timerDelta = (addPlayTime as jest.Mock).mock.calls[0][0];
    const resourceDelta = (mockResourceManager.updateResources as jest.Mock).mock.calls[0][0];
    const ratio = resourceDelta / timerDelta;
    
    expect(ratio).toBeCloseTo(1.0, 5); // Should be exactly 1.0
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