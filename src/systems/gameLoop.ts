import { AnyAction, Store, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { ResourceManager } from './resourceManager';
import { BuildingManager } from './buildingManager';
import { 
  calculateElapsedSeconds, 
  calculateOfflineTime, 
  getCurrentTime,
  calculateElapsedSecondsFromNow
} from '../utils/timeUtils';
import { addPlayTime, updateLastSaveTime } from '../state/gameSlice';
import { updateResourceGeneration } from '../state/actions/gameActions';
import { ErrorLogger, invariant, safeFn } from '../utils/errorUtils';

/**
 * Game loop configuration
 */
export interface GameLoopConfig {
  /** Target frames per second for the main loop (default: 60 fps, giving smooth UI updates) */
  fps: number;
  /** Game tick rate in Hz (how many game state updates per second - default: 10) */
  tickRate: number;
  /** Whether the game should process progress while inactive (default: true) */
  processOfflineProgress: boolean;
  /** Maximum allowed offline time to process in seconds (default: 86400 = 24 hours) */
  maxOfflineTime: number;
  /** Interval in milliseconds (added for compatibility with older code) */
  tickInterval?: number;
}

/**
 * Default game loop configuration
 */
const DEFAULT_CONFIG: GameLoopConfig = {
  fps: 60, // 60 frames per second for UI updates
  tickRate: 10, // 10 updates per second for game logic
  processOfflineProgress: true,
  maxOfflineTime: 86400, // 24 hours (in seconds)
  tickInterval: 100, // Added for backward compatibility (100ms = 10Hz)
};

/**
 * Manages the main game loop and time tracking
 */
export class GameLoop {
  private static instance: GameLoop | null = null;
  private animationFrameId: number | null = null;
  private lastAnimationFrameTime: number = 0;
  private lastGameTickTime: number = 0;
  private accumulatedTime: number = 0;
  private config: GameLoopConfig;
  private store: Store<RootState> | null = null;
  private isPaused: boolean = false;
  private logger = ErrorLogger.getInstance();
  private tickCount: number = 0;
  private uiUpdateCount: number = 0;
  private eventListenersAttached: boolean = false;
  private gameTimeAtStart: number = 0;

  /**
   * Private constructor for singleton pattern
   * @param store Redux store (optional)
   * @param config Configuration options (optional)
   */
  // Private property to address TypeScript errors
  private lastTickTime: number = 0;
  private intervalId: number | null = null;

  private constructor(store?: Store<RootState>, config: Partial<GameLoopConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize lastTickTime with centralized time function
    this.lastTickTime = getCurrentTime();
    
    if (store) {
      this.initialize(store, config);
    }
  }

  /**
   * Get the singleton instance of GameLoop
   * @returns The singleton GameLoop instance
   */
  public static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  /**
   * Initialize the game loop with a store and configuration
   * @param store The Redux store
   * @param config Optional configuration parameters
   */
  public initialize(store: Store<RootState>, config: Partial<GameLoopConfig> = {}): void {
    this.store = store;
    this.config = { ...this.config, ...config };
    
    if (!this.eventListenersAttached) {
      this.setupWindowEventListeners();
      this.eventListenersAttached = true;
    }
  }
  
  /**
   * Update the game loop configuration
   * @param config Configuration options to update
   */
  public configure(config: Partial<GameLoopConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.store !== null,
      'GameLoop not properly initialized with Redux store',
      'GameLoop'
    );
  }

  /**
   * Start the game loop using requestAnimationFrame for optimal performance
   */
  start(): void {
    // DISABLED: Now using only the core/GameLoop implementation
    console.log('LEGACY GameLoop: DISABLED - Using new GameLoop implementation instead');
    
    // Mark as initialized but don't actually start the loop
    this.ensureInitialized();
    const state = this.store!.getState();
    this.gameTimeAtStart = state.game.totalPlayTime;
    
    // Still initialize managers to prevent errors in other systems
    const resourceManager = ResourceManager.getInstance();
    resourceManager.initialize(this.store!);
    
    const buildingManager = BuildingManager.getInstance();
    buildingManager.initialize(this.store!);
    
    // But don't start the animation frame
  }
  
  /**
   * Main frame update function called by requestAnimationFrame
   * This implements a fixed timestep game loop with variable rendering
   * See: https://gafferongames.com/post/fix_your_timestep/
   */
  private frameUpdate(timestamp: number): void {
    if (this.isPaused) {
      // If paused, just request the next frame without updating
      this.animationFrameId = requestAnimationFrame(ts => this.frameUpdate(ts));
      return;
    }
    
    try {
      this.ensureInitialized();
      
      // Calculate frame time delta in seconds
      const deltaTime = (timestamp - this.lastAnimationFrameTime) / 1000;
      this.lastAnimationFrameTime = timestamp;
      
      // Cap maximum delta to avoid spiral of death after tab switch/sleep
      const maxDelta = 0.1; // Maximum 100ms per frame 
      const clampedDelta = Math.min(deltaTime, maxDelta);
      
      // Accumulate time since last update
      this.accumulatedTime += clampedDelta;
      
      // Fixed timestep for simulation updates
      const tickDeltaTime = 1.0 / this.config.tickRate; // e.g., 0.1s for 10Hz
      
      // Process as many fixed updates as needed to catch up
      let updatesThisFrame = 0;
      const maxUpdatesPerFrame = 5; // Prevent spiral of death
      
      while (this.accumulatedTime >= tickDeltaTime && updatesThisFrame < maxUpdatesPerFrame) {
        // Run fixed update at fixed timestep
        this.fixedUpdate(tickDeltaTime);
        this.accumulatedTime -= tickDeltaTime;
        updatesThisFrame++;
      }
      
      // If we've hit the max updates, consume remaining time to avoid buildup
      if (updatesThisFrame >= maxUpdatesPerFrame && this.accumulatedTime > tickDeltaTime) {
        console.log(`GameLoop: Too many updates needed, skipping ${this.accumulatedTime.toFixed(3)}s`);
        this.accumulatedTime = 0;
      }
      
      // Increment UI update counter and log every 60 frames (roughly once per second)
      this.uiUpdateCount++;
      if (this.uiUpdateCount % 60 === 0) {
        const state = this.store!.getState();
        console.log(`GameLoop: UI frame #${this.uiUpdateCount}, deltaTime=${deltaTime.toFixed(4)}s, game time=${state.game.totalPlayTime.toFixed(2)}s`);
      }
      
      // Schedule next frame
      this.animationFrameId = requestAnimationFrame(ts => this.frameUpdate(ts));
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)), 
        'GameLoop.frameUpdate'
      );
      
      // Continue loop even if there was an error
      this.animationFrameId = requestAnimationFrame(ts => this.frameUpdate(ts));
    }
  }
  
  /**
   * Fixed update function that runs at a consistent rate regardless of frame rate
   * This is where all game logic should happen
   */
  private fixedUpdate(deltaTime: number): void {
    try {
      // Update game state
      this.updateGameState(deltaTime);
      
      // Update tick counter and last tick time
      this.tickCount++;
      this.lastGameTickTime = performance.now();
      
      // Log every 10 ticks (roughly every second at 10Hz)
      if (this.tickCount % 10 === 0) {
        const state = this.store!.getState();
        console.log(`GameLoop: Tick #${this.tickCount}, delta=${deltaTime.toFixed(3)}s, game time=${state.game.totalPlayTime.toFixed(2)}s`);
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'GameLoop.fixedUpdate'
      );
    }
  }

  /**
   * Stop the game loop
   * @param skipSaveTimeUpdate Set to true to skip updating the last save time (to avoid loops)
   */
  stop(skipSaveTimeUpdate: boolean = false): void {
    // Cancel the animation frame if running
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log("GameLoop: Animation frame cancelled");
    }
    
    // Only update save time if requested (and avoiding potential loops)
    if (!skipSaveTimeUpdate) {
      this.ensureInitialized();
      // Just record that we stopped - don't dispatch any actions to avoid loops
      const state = this.store!.getState();
      const gameRunTime = state.game.totalPlayTime - this.gameTimeAtStart;
      console.log(`GameLoop: Stopped game loop, session duration: ${gameRunTime.toFixed(2)}s`);
    }
  }

  /**
   * Process a single tick
   */
  private tick(): void {
    if (this.isPaused) return;
    
    try {
      this.ensureInitialized();
      
      const currentTime = getCurrentTime();
      
      // Sanity check - if lastTickTime is 0 or in the future, reset it
      if (this.lastTickTime === 0 || this.lastTickTime > currentTime) {
        console.log("GameLoop: Invalid lastTickTime, resetting");
        this.lastTickTime = currentTime;
        return;
      }
      
      const elapsedSeconds = calculateElapsedSeconds(currentTime, this.lastTickTime);
      
      // Safety check - impose both minimum and maximum time per tick
      const minTickTime = 0.1; // 100ms minimum per tick
      const maxTickTime = 1.0; // 1 second maximum per tick
      const effectiveElapsed = Math.min(Math.max(elapsedSeconds, minTickTime), maxTickTime);
      
      // Debug logging for every tick
      console.log(`GameLoop: Tick ${this.tickCount}, actual=${elapsedSeconds.toFixed(3)}s, effective=${effectiveElapsed.toFixed(3)}s`);

      // Update all game systems with the effective elapsed time
      this.updateGameState(effectiveElapsed);

      // Update last tick time
      this.lastTickTime = currentTime;
      this.tickCount++;
      
      // Get the game state to verify total play time after update
      const state = this.store!.getState();
      console.log(`GameLoop: After tick, totalPlayTime=${state.game.totalPlayTime.toFixed(2)}s, lastSave=${calculateElapsedSecondsFromNow(state.game.lastSaveTime).toFixed(2)}s ago`);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'GameLoop.tick'
      );
    }
  }

  /**
   * Update game state for the elapsed time
   * @param deltaTime The fixed time step in seconds
   */
  private updateGameState(deltaTime: number): void {
    this.ensureInitialized();
    const store = this.store!;
    
    try {
      // DISABLED: Don't update play time in the legacy game loop
      // store.dispatch(addPlayTime(deltaTime));
      console.log(`LEGACY GameLoop: Not updating time, using new GameLoop instead. Delta: ${deltaTime.toFixed(3)}s`);
      
      // Keep track of time for every 10th tick for logging
      if (this.tickCount % 10 === 0) {
        const state = store.getState();
        console.log(`LEGACY GameLoop: Game time: ${state.game.totalPlayTime.toFixed(2)}s, delta: ${deltaTime.toFixed(3)}s`);
      }

      // Get resource manager
      const resourceManager = ResourceManager.getInstance();
      
      // Recalculate resource generation rates from buildings (every 5 seconds)
      // Using frame count % 50 for 10Hz tick rate = every 5 seconds
      if (this.tickCount % 50 === 0) {
        resourceManager.calculateResourceGeneration();
      }

      // Update resources based on the fixed time step
      resourceManager.updateResources(deltaTime);
      
      // Process events every 5 seconds (at 10Hz = every 50 ticks)
      // Less frequent to prevent UI update loops
      if (this.tickCount % 50 === 0) {
        try {
          const { EventManager } = require('./eventManager');
          const eventManager = EventManager.getInstance();
          
          // Initialize if needed
          if (!eventManager.initialized) {
            eventManager.initialize(store);
          }
          
          // Process possible events
          eventManager.processEvents();
        } catch (eventError) {
          console.error('Error processing events:', eventError);
        }
      }
      
      // Log detailed resource info occasionally
      if (this.tickCount % 100 === 0) { // Every 10 seconds at 10Hz
        const state = store.getState() as RootState;
        Object.values(state.resources).forEach((resource) => {
          if (resource && resource.name) {
            console.log(`Resource ${resource.name}: amount=${resource.amount.toFixed(2)}, perSecond=${resource.perSecond.toFixed(2)}`);
          }
        });
      }

      // Update the last save time at regular intervals
      // Every 6 seconds at 10Hz = 60 ticks
      if (this.tickCount % 60 === 0) {
        this.updateLastSaveTime();
      }
      
      // Make sure the GameLoopManager is running (for TaskManager)
      const { GameLoopManager } = require('../managers/GameLoopManager');
      const gameLoopManager = GameLoopManager.getInstance();
      
      if (!gameLoopManager.isGameLoopRunning()) {
        gameLoopManager.startGameLoop();
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'GameLoop.updateGameState'
      );
    }
  }

  /**
   * Process offline progress since last save
   */
  private processOfflineProgress(): void {
    this.ensureInitialized();
    
    try {
      const state = this.store!.getState() as RootState;
      const currentTime = getCurrentTime();
      const lastSaveTime = state.game.lastSaveTime;

      // Use the improved offline time calculation from timeUtils
      const offlineSeconds = calculateOfflineTime(currentTime, lastSaveTime, {
        useSafeLimit: true, 
        applyEfficiency: true
      });
      
      console.log(`LEGACY GameLoop: Processing ${offlineSeconds.toFixed(1)}s of offline progress (resources only)`);

      // If significant time has passed
      if (offlineSeconds > 1) {
        // Get resource manager
        const resourceManager = ResourceManager.getInstance();
        resourceManager.initialize(this.store!);
        
        // Update resources for offline time
        resourceManager.updateResources(offlineSeconds);

        // DISABLED: Don't update total play time in legacy game loop
        // this.store!.dispatch(addPlayTime(offlineSeconds));
        
        console.log(`GameLoop: Added ${offlineSeconds.toFixed(1)}s to play time for offline progress`);
      } else {
        console.log(`GameLoop: Offline time (${offlineSeconds.toFixed(1)}s) too small, skipping`);
      }

      // Update last save time - use skipDispatch to avoid loops
      this.updateLastSaveTime(true);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'GameLoop.processOfflineProgress'
      );
    }
  }

  /**
   * Update the last save time in the store
   * @param skipDispatch If true, doesn't dispatch Redux action (to avoid loops)
   */
  public updateLastSaveTime(skipDispatch: boolean = false): void {
    this.ensureInitialized();
    
    if (!skipDispatch) {
      this.store!.dispatch(updateLastSaveTime());
    } else {
      // For debugging, just log the save time update
      console.log("GameLoop: Last save time updated (without dispatch)");
    }
  }

  /**
   * Pause the game (e.g., when tab is not focused)
   */
  pause(): void {
    this.isPaused = true;
    // Use skipDispatch=true to avoid potential render loops during pause/resume cycles
    this.updateLastSaveTime(true);
  }

  /**
   * Resume the game (e.g., when tab gets focus again)
   */
  resume(): void {
    try {
      // Check how long the game has been paused
      const currentTime = getCurrentTime();
      const pauseDuration = currentTime - this.lastTickTime;
      
      // Log for debugging
      console.log(`GameLoop: Resuming after ${(pauseDuration / 1000).toFixed(1)}s pause`);
      
      // Update last tick time to now (to avoid large time jumps)
      this.lastTickTime = currentTime;
      
      // Resume game
      this.isPaused = false;
      
      // Only process offline progress for very long pauses (over 1 minute)
      // and only if specifically enabled
      const LONG_PAUSE_THRESHOLD = 60 * 1000; // 1 minute
      if (pauseDuration > LONG_PAUSE_THRESHOLD && 
          this.config.processOfflineProgress) {
        console.log("GameLoop: Processing long pause as offline progress");
        // Don't call processOfflineProgress directly, as this can cause UI loops
        // Instead, just update the timestamp
        this.updateLastSaveTime(true);
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'GameLoop.resume'
      );
    }
  }

  /**
   * Setup window focus/blur event listeners
   */
  private setupWindowEventListeners(): void {
    // Store bound method references to ensure we can remove them later
    this.boundPauseHandler = safeFn(() => {
      console.log("GameLoop: Window blur event - pausing");
      this.pause();
    }, 'GameLoop.onBlur');
    
    this.boundResumeHandler = safeFn(() => {
      console.log("GameLoop: Window focus event - resuming");
      this.resume();
    }, 'GameLoop.onFocus');
    
    // Pause when window loses focus
    window.addEventListener('blur', this.boundPauseHandler);

    // Resume when window gains focus
    window.addEventListener('focus', this.boundResumeHandler);
    
    console.log("GameLoop: Window event listeners attached");
  }
  
  // Store these as class members so we can reference them later
  private boundPauseHandler: EventListener = () => {};
  private boundResumeHandler: EventListener = () => {};

  /**
   * Change the game speed (for debugging or features like time warp)
   * @param multiplier Speed multiplier (1.0 = normal speed)
   */
  setGameSpeed(multiplier: number): void {
    this.ensureInitialized();
    
    // Validate input
    multiplier = Math.max(0.1, Math.min(10, multiplier));
    
    // Adjust tick interval
    const defaultInterval = DEFAULT_CONFIG.tickInterval || 100; // Use 100ms as fallback
    const newInterval = Math.round(defaultInterval / multiplier);
    
    // Only restart if there's a significant change
    const currentInterval = this.config.tickInterval || 100; // Use 100ms as fallback
    if (Math.abs(currentInterval - newInterval) > 50) {
      this.config.tickInterval = newInterval;
      
      // Restart the game loop if it's running
      if (this.intervalId !== null) {
        this.stop();
        this.start();
      }
    }
  }

  /**
   * Get the current state of the game loop
   * @returns Object with current state
   */
  getStatus(): { 
    isRunning: boolean, 
    isPaused: boolean, 
    tickInterval: number,
    tickCount: number,
    elapsedSinceLastTick: number
  } {
    return {
      isRunning: this.intervalId !== null,
      isPaused: this.isPaused,
      tickInterval: this.config.tickInterval || 100, // Use default if undefined
      tickCount: this.tickCount,
      elapsedSinceLastTick: calculateElapsedSeconds(Date.now(), this.lastTickTime)
    };
  }

  /**
   * Clean up resources when shutting down
   */
  cleanup(): void {
    console.log("GameLoop: Cleaning up resources");
    
    // Stop the game loop
    this.stop(true); // Skip save time update to avoid loops
    
    // Remove event listeners if we added them
    if (this.eventListenersAttached && this.boundPauseHandler && this.boundResumeHandler) {
      console.log("GameLoop: Removing window event listeners");
      window.removeEventListener('blur', this.boundPauseHandler);
      window.removeEventListener('focus', this.boundResumeHandler);
      this.eventListenersAttached = false;
    }
    
    // Save final game state
    this.ensureInitialized();
    this.updateLastSaveTime(true); // Don't dispatch to avoid loops
    
    // Log how long the game was running
    const state = this.store!.getState();
    const gameRunTime = state.game.totalPlayTime - this.gameTimeAtStart;
    console.log(`GameLoop: Cleaned up after ${gameRunTime.toFixed(2)}s of game time`);
  }
}