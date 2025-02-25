import { GameLoopManager } from './GameLoopManager';

describe('GameLoopManager', () => {
  let gameLoopManager: GameLoopManager;
  
  beforeEach(() => {
    // Reset the singleton instance for each test
    // @ts-ignore - we're testing the singleton
    GameLoopManager.instance = null;
    
    // Get a fresh instance for each test
    gameLoopManager = GameLoopManager.getInstance();
  });
  
  test('getInstance returns the same instance', () => {
    const instance1 = GameLoopManager.getInstance();
    const instance2 = GameLoopManager.getInstance();
    
    expect(instance1).toBe(instance2);
  });
  
  test('registerTickHandler adds handler to the list', () => {
    const mockHandler = jest.fn();
    gameLoopManager.registerTickHandler(mockHandler);
    
    // Indirectly verify by checking if handler is called when we manually trigger tick
    // @ts-ignore - calling private method for testing
    gameLoopManager.tick();
    
    expect(mockHandler).toHaveBeenCalled();
  });
});