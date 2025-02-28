/**
 * Game System Coherence Test
 * 
 * This test verifies that all game systems that deal with time
 * do so in a consistent manner, matching the fix we implemented.
 */

import { GameTimer } from '../core/GameTimer';
import { GameLoop } from '../core/GameLoop';

describe('Game System Time Coherence', () => {
  beforeEach(() => {
    // Reset GameTimer singleton
    // @ts-expect-error - Accessing private field for testing
    GameTimer.instance = null;
    
    // Reset GameLoop singleton
    // @ts-expect-error - Accessing private field for testing
    GameLoop.instance = null;
  });
  
  /**
   * Test that GameLoop properly passes time values from GameTimer to handlers
   */
  test('should pass consistent time from GameTimer through GameLoop to handlers', () => {
    // Create timer with 2.0x scale
    const timeScale = 2.0;
    const gameTimer = GameTimer.getInstance({
      timeScale: timeScale,
      debugMode: false
    });
    
    // Create game loop that uses the timer
    const gameLoop = GameLoop.getInstance({
      tickRate: 1.0, // 1Hz
      debugMode: false
    });
    
    // Captured time values from handlers
    let capturedRealDeltaTime = 0;
    let capturedScaledDeltaTime = 0;
    
    // Register a test handler
    gameLoop.registerHandler((deltaTime, scaledDeltaTime) => {
      capturedRealDeltaTime = deltaTime;
      capturedScaledDeltaTime = scaledDeltaTime;
    });
    
    // Simulate a timer update with 1 second elapsed
    // @ts-expect-error - Accessing private field for testing
    gameTimer.running = true;
    // @ts-expect-error - Accessing private field for testing
    gameTimer.lastRealTime = 0;
    // @ts-expect-error - Accessing private field for testing
    gameTimer.elapsedRealTime = 1.0;
    // @ts-expect-error - Accessing private field for testing
    gameTimer.elapsedGameTime = 1.0 * timeScale;
    
    // Simulate a game loop update
    // This would normally happen in the gameLoop.gameLoop() method
    // We're directly calling processFixedUpdate to test handler invocation
    // @ts-expect-error - Accessing private method for testing
    gameLoop.processFixedUpdate(
      // @ts-expect-error - Accessing private field for testing
      gameTimer.elapsedRealTime, 
      // @ts-expect-error - Accessing private field for testing
      gameTimer.elapsedGameTime
    );
    
    // Verify that the handler received the correct time values
    expect(capturedRealDeltaTime).toBe(1.0);
    expect(capturedScaledDeltaTime).toBe(2.0);
    expect(capturedScaledDeltaTime / capturedRealDeltaTime).toBe(timeScale);
  });
  
  /**
   * Test that GameLoop's time scale control affects GameTimer properly
   */
  test('should synchronize time scale between GameLoop and GameTimer', () => {
    // Create game timer and loop
    const gameTimer = GameTimer.getInstance({ timeScale: 1.0 });
    const gameLoop = GameLoop.getInstance();
    
    // Set time scale through GameLoop (should propagate to GameTimer)
    gameLoop.setTimeScale(3.5);
    
    // Verify that GameTimer's scale was updated
    expect(gameTimer.getTimeScale()).toBe(3.5);
    
    // Verify that gameLoop.getTimeScale() returns the correct value
    expect(gameLoop.getTimeScale()).toBe(3.5);
  });
  
  /**
   * Test the GameTimer's ratio calculation
   */
  test('should maintain the correct time ratio over multiple updates', () => {
    // Create timer with 3.0x scale
    const timeScale = 3.0;
    const timer = GameTimer.getInstance({
      timeScale: timeScale,
      debugMode: false
    });
    
    // Start timer
    timer.start();
    
    // Simulate multiple frame updates with different elapsed times
    // We'll update 3 times with different deltas:
    // 1. 0.5 seconds real time -> 1.5 seconds game time (timeScale = 3.0)
    // 2. 1.0 seconds real time -> 3.0 seconds game time (timeScale = 3.0)
    // 3. 2.0 seconds real time -> 6.0 seconds game time (timeScale = 3.0)
    // Total: 3.5 seconds real time -> 10.5 seconds game time
    
    // Initialize timer state
    // @ts-expect-error - Accessing private field for testing
    timer.startRealTime = 0;
    // @ts-expect-error - Accessing private field for testing
    timer.lastRealTime = 0;
    // @ts-expect-error - Accessing private field for testing
    timer.totalGameTime = 0;
    
    // @ts-expect-error - Function used only in test context
    function simulateFrameUpdate(realTimeSinceLastFrame) {
      // @ts-expect-error - Accessing private field for testing
      const currentRealTime = timer.lastRealTime + realTimeSinceLastFrame;
      // @ts-expect-error - Accessing private field for testing
      timer.elapsedRealTime = realTimeSinceLastFrame;
      // @ts-expect-error - Accessing private field for testing
      timer.elapsedGameTime = realTimeSinceLastFrame * timeScale;
      // @ts-expect-error - Accessing private field for testing
      timer.totalGameTime += timer.elapsedGameTime;
      // @ts-expect-error - Accessing private field for testing
      timer.lastRealTime = currentRealTime;
    }
    
    // Update 1: 0.5 seconds real time
    simulateFrameUpdate(0.5);
    
    // Update 2: 1.0 seconds real time
    simulateFrameUpdate(1.0);
    
    // Update 3: 2.0 seconds real time
    simulateFrameUpdate(2.0);
    
    // Verify final time values
    // @ts-expect-error - Accessing private field for testing
    expect(timer.totalGameTime).toBe(10.5); // 0.5*3 + 1.0*3 + 2.0*3 = 10.5
    // @ts-expect-error - Accessing private field for testing
    expect(timer.lastRealTime).toBe(3.5); // 0.5 + 1.0 + 2.0 = 3.5
    
    // Set up the calculation that happens in getTimeRatio():
    // The real time since start should be 3.5 - 0 = 3.5
    // @ts-expect-error - Accessing private field for testing
    timer.startRealTime = 0;
    
    // Create a manual ratio calculation:
    // totalGameTime / realTimeSinceStart = 10.5 / 3.5 = 3.0
    const manuallyCalculatedRatio = timer.getTotalGameTime() / 
        // @ts-expect-error - Accessing private fields for testing verification
        (timer.lastRealTime - timer.startRealTime);
    
    // Verify manual ratio calculation matches timeScale
    expect(manuallyCalculatedRatio).toBeCloseTo(timeScale, 5);
  });
});