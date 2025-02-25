/**
 * Debug tools for the game
 * Provides utilities for testing and debugging game functions
 */
import { store } from '../state/store';
import { calculateOfflineTime, getCurrentTime } from '../utils/timeUtils';
import { ResourceManager } from '../systems/resourceManager';
import { GameLoop } from '../core/GameLoop';
import { GameManager } from '../core/GameManager';
import { ProgressionManager } from '../managers/progression/ProgressionManager';

let debugEnabled = false;

/**
 * Initialize debug tools
 */
export function initializeDebugTools() {
  if (process.env.NODE_ENV === 'development') {
    debugEnabled = true;
    setupDebugInterface();
    // GameDebugger component is now integrated directly in the React app
  }
}

/**
 * Set up debugging interface for the game
 */
function setupDebugInterface() {
  // Disable excessive console logging for ProgressionManager
  const progressionManager = ProgressionManager.getInstance();
  if ((progressionManager as any).debuggingEnabled !== undefined) {
    (progressionManager as any).debuggingEnabled = false;
  }
  
  const debugObj = {
    // Game state access
    getState: () => store.getState(),
    
    // Game systems
    gameManager: () => GameManager.getInstance(),
    gameLoop: () => GameLoop.getInstance(),
    resourceManager: () => ResourceManager.getInstance(),
    progressionManager: () => ProgressionManager.getInstance(),
    
    // Game control
    startGame: () => GameManager.getInstance().start(),
    stopGame: () => GameManager.getInstance().stop(),
    
    // Time utilities
    getCurrentTime: () => getCurrentTime(),
    calculateOfflineTime: (lastSaveTime?: number) => {
      const current = getCurrentTime();
      const last = lastSaveTime || store.getState().game.lastSaveTime;
      return calculateOfflineTime(current, last);
    },
    
    // Resource utilities
    addResources: (amount: number) => {
      const resourceManager = ResourceManager.getInstance();
      const state = store.getState();
      
      Object.keys(state.resources.byId).forEach(id => {
        resourceManager.addResourceAmount(id, amount);
      });
      
      return `Added ${amount} to all resources`;
    },
    
    // Debug info
    getGameLoopStats: () => {
      const gameLoop = GameLoop.getInstance();
      return gameLoop.getStats();
    },
    
    // Progression utilities
    checkProgressionItems: () => {
      const progressionManager = ProgressionManager.getInstance();
      const updatedCount = progressionManager.checkAllProgressionItems();
      return `Checked progression items, updated ${updatedCount} items`;
    },
    
    // Toggle progression debugging
    toggleProgressionDebug: () => {
      const progressionManager = ProgressionManager.getInstance();
      if ((progressionManager as any).debuggingEnabled !== undefined) {
        (progressionManager as any).debuggingEnabled = !(progressionManager as any).debuggingEnabled;
        return `Progression debugging set to ${(progressionManager as any).debuggingEnabled}`;
      }
      return 'Unable to toggle progression debugging';
    },
    
    // Game time multiplier (for testing)
    setTickRate: (tickRate: number) => {
      if (tickRate < 0.1 || tickRate > 60) {
        return "Tick rate must be between 0.1 and 60";
      }
      
      const gameLoop = GameLoop.getInstance();
      gameLoop.setTickRate(tickRate);
      
      if (gameLoop.isRunning()) {
        gameLoop.stop();
        gameLoop.start();
      }
      
      return `Tick rate set to ${tickRate}Hz`;
    }
  };
  
  // Add to window for console access
  (window as any).debug = debugObj;
  
  console.log("Debug tools enabled. Type 'debug' in the console to access.");
}

/**
 * Log a debug message if debugging is enabled
 */
export function debugLog(message: string, ...args: any[]) {
  if (debugEnabled) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}