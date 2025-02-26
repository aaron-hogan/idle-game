/**
 * GameManager.ts
 * 
 * High-level game management system that coordinates all game systems
 * and manages the game loop.
 */
import { Store } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { GameLoop } from './GameLoop';
import { addPlayTime, setTotalPlayTime, updateLastSaveTime } from '../state/gameSlice';
import { calculateOfflineTime, getCurrentTime } from '../utils/timeUtils';
import { ResourceManager } from '../systems/resourceManager';
import { BuildingManager } from '../systems/buildingManager';
import { ProgressionManager } from '../managers/progression/ProgressionManager';

/**
 * Configuration for the GameManager
 */
export interface GameManagerConfig {
  /** Whether to process offline progress when the game starts */
  processOfflineProgress: boolean;
  /** Maximum offline time to process in seconds */
  maxOfflineTime: number;
  /** Debug mode flag */
  debugMode: boolean;
  /** Synchronize Redux time with GameTimer time */
  syncReduxWithTimerTime: boolean;
}

/**
 * Default GameManager configuration
 */
const DEFAULT_CONFIG: GameManagerConfig = {
  processOfflineProgress: true,
  maxOfflineTime: 86400, // 24 hours in seconds
  debugMode: false,
  syncReduxWithTimerTime: true, // Default to syncing Redux with timer
};

/**
 * Master game controller that coordinates all game systems
 */
export class GameManager {
  private static instance: GameManager | null = null;
  private gameLoop: GameLoop;
  private store: Store<RootState>;
  private config: GameManagerConfig;
  private initialized: boolean = false;
  private startTime: number = 0;
  private gameTimeAtStart: number = 0;
  private timeSyncInterval: number | null = null;
  private reduxTimeSyncInterval: number | null = null;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(store: Store<RootState>, config: Partial<GameManagerConfig> = {}) {
    this.store = store;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Get the game loop instance with appropriate configuration
    this.gameLoop = GameLoop.getInstance({
      tickRate: 1, // Match tickRate in gameSlice (1 per second)
      maxFrameTime: 0.1, // 100ms max frame time for stability
      maxUpdatesPerFrame: 3 // Limit updates per frame to prevent spiraling
    });
    
    // Match debug modes
    this.gameLoop.setDebugMode(this.config.debugMode);
    
    // Register the main update handler
    this.gameLoop.registerHandler(this.update.bind(this));
    
    // Start regular sync of Redux time scale to game timer
    this.startTimeScaleSync();
    
    // Start sync of Redux time with timer time if enabled
    if (this.config.syncReduxWithTimerTime) {
      this.startReduxTimeSync();
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(store?: Store<RootState>, config?: Partial<GameManagerConfig>): GameManager {
    if (!GameManager.instance) {
      if (!store) {
        throw new Error("GameManager requires a store on first initialization");
      }
      GameManager.instance = new GameManager(store, config);
    } else if (config) {
      // Update config if provided
      GameManager.instance.config = { 
        ...GameManager.instance.config, 
        ...config 
      };
      
      // Update sync strategy if config changed
      if (config.syncReduxWithTimerTime !== undefined) {
        if (config.syncReduxWithTimerTime) {
          GameManager.instance.startReduxTimeSync();
        } else {
          GameManager.instance.stopReduxTimeSync();
        }
      }
    }
    
    return GameManager.instance;
  }

  /**
   * Initialize all game systems
   */
  public initialize(): void {
    if (this.initialized) return;
    
    if (this.config.debugMode) {
      console.log("GameManager: Initializing game systems");
    }
    
    // Store current time for reference
    this.startTime = getCurrentTime();
    
    // Store current game time for debugging
    const state = this.store.getState();
    this.gameTimeAtStart = state.game.totalPlayTime;
    
    // Initialize core systems
    this.initializeResourceManager();
    this.initializeBuildingManager();
    
    // Force TimeScale to exactly 1.0 to ensure consistent game timing at start
    // This ensures we begin with a stable, predictable time scale
    this.gameLoop.setTimeScale(1.0);
    
    // Force a frame update to initialize timing properly
    this.gameLoop.getGameTimer().resetFrameTiming();
    
    this.initialized = true;
    
    if (this.config.debugMode) {
      console.log(`GameManager: Initialization complete, game time at start: ${this.gameTimeAtStart.toFixed(2)}s`);
    }
    
    // Sync Redux time with timer time right after initialization
    // Wrap in try/catch to ensure initialization completes even if sync fails
    if (this.config.syncReduxWithTimerTime) {
      try {
        this.syncReduxWithTimerTime();
      } catch (error) {
        console.error("GameManager: Error syncing Redux time during initialization:", error);
        // Continue initialization despite sync error
      }
    }
  }

  /**
   * Initialize the resource manager
   */
  private initializeResourceManager(): void {
    const resourceManager = ResourceManager.getInstance();
    resourceManager.initialize(this.store);
    
    // Calculate initial resource generation
    resourceManager.calculateResourceGeneration();
    
    if (this.config.debugMode) {
      console.log("GameManager: ResourceManager initialized");
    }
  }

  /**
   * Initialize the building manager
   */
  private initializeBuildingManager(): void {
    const buildingManager = BuildingManager.getInstance();
    buildingManager.initialize(this.store);
    
    if (this.config.debugMode) {
      console.log("GameManager: BuildingManager initialized");
    }
  }

  /**
   * Start the game
   */
  public start(): void {
    // Ensure systems are initialized
    if (!this.initialized) {
      this.initialize();
    }
    
    // Process offline progress if enabled
    if (this.config.processOfflineProgress) {
      this.processOfflineProgress();
    }
    
    // Force TimeScale to match Redux or default to 1.0 for consistency
    this.syncTimeScaleWithRedux();
    
    // Reset frame timing to ensure a clean start
    this.gameLoop.getGameTimer().resetFrameTiming();
    
    // Start the game loop
    this.gameLoop.start();
    
    if (this.config.debugMode) {
      console.log("GameManager: Game started");
    }
    
    // Start regular sync of Redux time scale to game timer
    this.startTimeScaleSync();
    
    // Start sync of Redux time with timer time if enabled
    if (this.config.syncReduxWithTimerTime) {
      // Start sync without immediate extra sync to avoid React update loops
      this.startReduxTimeSync();
      
      // Note: Removed the immediate sync here that was redundant with
      // the sync done in startReduxTimeSync(), which could cause update loops
    }
  }

  /**
   * Stop the game
   * @param skipSaveTimeUpdate If true, skip updating the last save time (to avoid loops during unmounting)
   */
  public stop(skipSaveTimeUpdate: boolean = false): void {
    // Stop the game loop
    this.gameLoop.stop();
    
    // Stop time scale sync
    this.stopTimeScaleSync();
    
    // Stop Redux time sync
    this.stopReduxTimeSync();
    
    // Update the last save time if not skipped
    if (!skipSaveTimeUpdate) {
      this.updateLastSaveTime();
    } else if (this.config.debugMode) {
      console.log("GameManager: Skipping save time update on stop");
    }
    
    if (this.config.debugMode) {
      const state = this.store.getState();
      const gameRunTime = state.game.totalPlayTime - this.gameTimeAtStart;
      console.log(`GameManager: Game stopped, session duration: ${gameRunTime.toFixed(2)}s`);
    }
  }

  /**
   * Start regularly syncing the Redux time scale with the game timer
   */
  private startTimeScaleSync(): void {
    // Clear any existing interval
    this.stopTimeScaleSync();
    
    // Sync immediately
    this.syncTimeScaleWithRedux();
    
    // Set up regular sync every 100ms to ensure consistency
    this.timeSyncInterval = window.setInterval(() => {
      this.syncTimeScaleWithRedux();
    }, 100);
    
    if (this.config.debugMode) {
      console.log("GameManager: Started time scale sync interval");
    }
  }

  /**
   * Stop syncing the Redux time scale with the game timer
   */
  private stopTimeScaleSync(): void {
    if (this.timeSyncInterval !== null) {
      window.clearInterval(this.timeSyncInterval);
      this.timeSyncInterval = null;
      
      if (this.config.debugMode) {
        console.log("GameManager: Stopped time scale sync interval");
      }
    }
  }

  /**
   * Start regularly syncing Redux game time with timer time
   */
  private startReduxTimeSync(): void {
    // Clear any existing interval
    this.stopReduxTimeSync();
    
    // Sync immediately (wrapped in try/catch for safety during mount)
    try {
      this.syncReduxWithTimerTime();
    } catch (error) {
      console.error("GameManager: Error during initial Redux time sync:", error);
    }
    
    // Set up regular sync with appropriate interval (250ms)
    // - Fast enough for smooth UI updates
    // - Slow enough to avoid React update flickering or overshooting
    this.reduxTimeSyncInterval = window.setInterval(() => {
      this.syncReduxWithTimerTime();
    }, 250);
    
    if (this.config.debugMode) {
      console.log("GameManager: Started Redux time sync interval");
    }
  }

  /**
   * Stop syncing Redux game time with timer time
   */
  private stopReduxTimeSync(): void {
    if (this.reduxTimeSyncInterval !== null) {
      window.clearInterval(this.reduxTimeSyncInterval);
      this.reduxTimeSyncInterval = null;
      
      if (this.config.debugMode) {
        console.log("GameManager: Stopped Redux time sync interval");
      }
    }
  }

  /**
   * Synchronize the GameTimer's time scale with Redux's gameTimeScale
   */
  private syncTimeScaleWithRedux(): void {
    const state = this.store.getState();
    const reduxTimeScale = state.game.gameTimeScale || 1.0;
    const currentTimeScale = this.gameLoop.getTimeScale();
    
    // Only update if there's a meaningful difference
    if (Math.abs(reduxTimeScale - currentTimeScale) > 0.001) {
      this.gameLoop.setTimeScale(reduxTimeScale);
      
      if (this.config.debugMode) {
        console.log(`GameManager: Synced time scale from Redux (${reduxTimeScale.toFixed(2)}x) to GameTimer`);
      }
    }
  }

  /**
   * Synchronize Redux game time with the GameTimer's time
   */
  private syncReduxWithTimerTime(): void {
    // Use try/catch to prevent errors from propagating during React component lifecycle
    try {
      const gameTimer = this.gameLoop.getGameTimer();
      const timerTime = gameTimer.getTotalGameTime();
      const state = this.store.getState();
      const reduxTime = state.game.totalPlayTime;
      
      // Always update to keep the UI synchronized with the game timer
      // This ensures the timer display updates smoothly
      this.store.dispatch(setTotalPlayTime(timerTime));
        
      // Only log significant time differences to avoid console spam
      if (this.config.debugMode && Math.abs(reduxTime - timerTime) > 0.5) {
        console.log(`GameManager: Synced Redux time (${reduxTime.toFixed(2)}s) to match timer time (${timerTime.toFixed(2)}s)`);
      }
    } catch (error) {
      console.error("GameManager: Error during Redux time sync:", error);
      // Do not rethrow - silently fail to prevent React update loop crashes
    }
  }

  /**
   * Main update function called by the game loop
   * @param deltaTime Unscaled real time in seconds since last update
   * @param scaledDeltaTime Scaled game time in seconds since last update
   */
  private update(deltaTime: number, scaledDeltaTime: number): void {
    try {
      // Get current state
      const state = this.store.getState();
      
      // BEST PRACTICE: Use scaled time consistently for both timer and resources
      // This follows standard game development patterns where game time and systems
      // all use the same time scale consistently
      
      // Log debug info about time values
      if (this.config.debugMode && Math.random() < 0.01) {
        console.log(`GameManager: Using consistent scaled time: realDelta=${deltaTime.toFixed(5)}s, ` +
                    `scaledDelta=${scaledDeltaTime.toFixed(5)}s, ` +
                    `scale=${this.gameLoop.getTimeScale().toFixed(2)}x`);
      }
      
      // Only update Redux game time if we're not syncing directly from timer
      if (!this.config.syncReduxWithTimerTime) {
        // Update total play time in the store with SCALED delta time
        this.store.dispatch(addPlayTime(scaledDeltaTime));
      }
      
      // Use the SAME scaled delta time for game systems and resource updates
      this.updateResourceSystem(scaledDeltaTime);
      
      // Periodically update the last save time (every 10 seconds of game time)
      // Reuse state from above to avoid double access
      const ticksSinceLastSave = (state.game.totalPlayTime - state.game.lastSaveTime) / scaledDeltaTime;
      
      if (ticksSinceLastSave >= 10) { // Every 10 seconds at 1Hz
        this.updateLastSaveTime();
      }
      
      // Log debug info occasionally
      if (this.config.debugMode && Math.random() < 0.01) {
        const gameTimeScale = state.game.gameTimeScale || 1;
        console.log(`GameManager: realDelta=${deltaTime.toFixed(3)}s, gameDelta=${scaledDeltaTime.toFixed(3)}s, scale=${gameTimeScale.toFixed(1)}x, gameTime=${state.game.totalPlayTime.toFixed(1)}s`);
      }
    } catch (error) {
      console.error("GameManager: Error in update:", error);
    }
  }

  /**
   * Update the resource system
   */
  private updateResourceSystem(deltaTime: number): void {
    const resourceManager = ResourceManager.getInstance();
    
    // Recalculate resource generation rates from buildings (every 5 seconds)
    const state = this.store.getState();
    const ticksSinceLastUpdate = (state.game.totalPlayTime % 5) < deltaTime;
    
    if (ticksSinceLastUpdate) {
      resourceManager.calculateResourceGeneration();
      
      // Re-enable progression manager now that we've fixed type issues
      try {
        const progressionManager = ProgressionManager.getInstance();
        progressionManager.checkAllProgressionItems();
      } catch (error) {
        console.error("GameManager: Error checking progression items:", error);
      }
    }
    
    // Update resources based on the fixed time step
    resourceManager.updateResources(deltaTime);
  }

  /**
   * Process offline progress since last save
   */
  private processOfflineProgress(): void {
    try {
      const state = this.store.getState();
      const currentTime = getCurrentTime();
      const lastSaveTime = state.game.lastSaveTime;
      
      // Make sure we have valid timestamps before proceeding
      if (!lastSaveTime || lastSaveTime <= 0) {
        console.log("GameManager: No valid last save time found, skipping offline progress");
        this.updateLastSaveTime(); // Update the timestamp for future calculations
        return;
      }
      
      // Use the game's actual time scale for consistent behavior
      const gameTimeScale = state.game.gameTimeScale || 1.0;
      
      // Calculate offline time (real time elapsed) with safety limits
      const offlineSeconds = calculateOfflineTime(currentTime, lastSaveTime, {
        useSafeLimit: true, // Use safe limits to prevent excessive resource generation
        applyEfficiency: true
      });
      
      // Apply consistent time scale to both timer and resources
      const scaledOfflineSeconds = offlineSeconds * gameTimeScale;
      
      if (this.config.debugMode) {
        console.log(`GameManager: Processing ${offlineSeconds.toFixed(1)}s of real time (${scaledOfflineSeconds.toFixed(1)}s game time)`);
      }
      
      // Only process if we have a reasonable amount of time (1-3600 seconds)
      if (offlineSeconds > 1 && offlineSeconds < 3600) {
        // Make sure the ResourceManager is initialized before using it
        const resourceManager = ResourceManager.getInstance();
        if (!resourceManager) {
          console.error("GameManager: ResourceManager not available");
          return;
        }
        
        // Update resources with consistently scaled time
        resourceManager.updateResources(scaledOfflineSeconds);
        
        // Update total play time with the SAME scaled time
        this.store.dispatch(addPlayTime(scaledOfflineSeconds));
        
        if (this.config.debugMode) {
          console.log(
            `GameManager: Added ${scaledOfflineSeconds.toFixed(1)}s to play time ` + 
            `and processed ${scaledOfflineSeconds.toFixed(1)}s of game time for resources`
          );
        }
      } else if (offlineSeconds >= 3600) {
        // Cap extremely long offline periods
        console.log(`GameManager: Capping offline progress at 1 hour (actual: ${(offlineSeconds/3600).toFixed(2)} hours)`);
        
        // Add capped time (1 hour)
        this.store.dispatch(addPlayTime(3600 * gameTimeScale));
        
        // Process resources with capped time
        const resourceManager = ResourceManager.getInstance();
        resourceManager.updateResources(3600 * gameTimeScale);
      }
      
      // Update last save time
      this.updateLastSaveTime();
    } catch (error) {
      console.error("GameManager: Error processing offline progress:", error);
    }
  }

  /**
   * Update the last save time in the store
   */
  public updateLastSaveTime(): void {
    this.store.dispatch(updateLastSaveTime());
    
    if (this.config.debugMode) {
      console.log("GameManager: Last save time updated");
    }
  }

  /**
   * Get the game loop instance
   */
  public getGameLoop(): GameLoop {
    return this.gameLoop;
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.config.debugMode = enabled;
    this.gameLoop.setDebugMode(enabled);
  }
}