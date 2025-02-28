/**
 * GameLoop.ts
 * 
 * Industry-standard fixed timestep game loop implementation based on
 * the pattern described in https://gafferongames.com/post/fix_your_timestep/
 * 
 * Uses GameTimer as the authoritative source of time.
 */
import { GameTimer } from './GameTimer';
import { checkGameEndConditions } from '../systems/gameEndConditions';

/**
 * Type for tick handlers that receive both real and scaled time
 */
export type TickHandler = (
  deltaTime: number,       // Unscaled real time delta in seconds
  scaledDeltaTime: number  // Scaled game time delta in seconds
) => void;

/**
 * Configuration interface for the game loop
 */
export interface GameLoopConfig {
  /** Target tick rate in Hz (e.g., 1 = 1 update per second) */
  tickRate: number;
  /** Maximum allowed frame time to prevent spiral of death */
  maxFrameTime: number;
  /** Maximum number of updates to process in a single frame */
  maxUpdatesPerFrame: number;
  /** Debug mode flag */
  debugMode: boolean;
}

/**
 * Default game loop configuration
 */
const DEFAULT_CONFIG: GameLoopConfig = {
  tickRate: 1, // 1 tick per second to match gameSlice (KEEP AT 1 for 1:1 timing)
  maxFrameTime: 0.1, // 100ms max frame time (balance between skipping and catching up)
  maxUpdatesPerFrame: 3, // Maximum updates per frame for catching up after tab switches
  debugMode: false, // Debug mode off by default
};

/**
 * Main game loop that handles time progression and system updates
 * Uses GameTimer for all time tracking.
 */
export class GameLoop {
  private static instance: GameLoop | null = null;
  private animationFrameId: number | null = null;
  private accumulatedTime: number = 0;
  private tickHandlers: Array<TickHandler> = [];
  private config: GameLoopConfig;
  private tickCount: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdateTime: number = 0;
  private currentFps: number = 0;
  private gameTimer: GameTimer;
  private store: any | null = null;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config: Partial<GameLoopConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Get GameTimer instance with matching configuration
    this.gameTimer = GameTimer.getInstance({
      maxFrameTime: this.config.maxFrameTime,
      debugMode: this.config.debugMode
    });
    
    this.lastFpsUpdateTime = this.gameTimer.getTotalGameTime();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(config?: Partial<GameLoopConfig>): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop(config);
    } else if (config) {
      // Update config if provided
      GameLoop.instance.config = { ...GameLoop.instance.config, ...config };
      
      // Update debug mode on timer to match
      if (config.debugMode !== undefined) {
        GameLoop.instance.gameTimer.setDebugMode(config.debugMode);
      }
      
      // Update max frame time on timer to match
      if (config.maxFrameTime !== undefined) {
        GameLoop.instance.gameTimer = GameTimer.getInstance({ 
          maxFrameTime: config.maxFrameTime 
        });
      }
    }
    return GameLoop.instance;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.animationFrameId !== null) return; // Already running
    
    // Reset timing variables
    this.accumulatedTime = 0;
    this.tickCount = 0;
    this.frameCount = 0;
    
    // Start the game timer
    this.gameTimer.start();
    
    // Start the animation frame loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    
    if (this.config.debugMode) {
      console.log(`GameLoop: Started with tick rate ${this.config.tickRate}Hz`);
    }
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    if (this.animationFrameId === null) return; // Not running
    
    // Cancel animation frame
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    
    // Pause the game timer
    this.gameTimer.pause();
    
    if (this.config.debugMode) {
      console.log(`GameLoop: Stopped after ${this.tickCount} ticks and ${this.frameCount} frames`);
    }
  }

  /**
   * Check if the game loop is running
   */
  public isRunning(): boolean {
    return this.animationFrameId !== null;
  }

  /**
   * Enable or disable debug output
   */
  public setDebugMode(enabled: boolean): void {
    this.config.debugMode = enabled;
    this.gameTimer.setDebugMode(enabled);
  }

  /**
   * Main game loop function called by requestAnimationFrame
   */
  private gameLoop(_timestamp: number): void {
    try {
      // Update the game timer
      this.gameTimer.update();
      
      // Get elapsed time values from the timer
      const deltaTime = this.gameTimer.getElapsedRealTime();
      
      // Increment frame counter
      this.frameCount++;
      
      // Update FPS counter every second of game time
      const totalGameTime = this.gameTimer.getTotalGameTime();
      if (totalGameTime - this.lastFpsUpdateTime >= 1.0) {
        const timeSinceLastFpsUpdate = totalGameTime - this.lastFpsUpdateTime;
        this.currentFps = this.frameCount / timeSinceLastFpsUpdate;
        this.frameCount = 0;
        this.lastFpsUpdateTime = totalGameTime;
        
        // We've disabled the console.log here to reduce console spam
      }
      
      // Accumulate time since last update
      this.accumulatedTime += deltaTime;
      
      // Calculate fixed time step interval
      const fixedTimeStep = 1.0 / this.config.tickRate;
      
      // Process as many fixed updates as needed to catch up
      let updateCount = 0;
      
      while (this.accumulatedTime >= fixedTimeStep && updateCount < this.config.maxUpdatesPerFrame) {
        // Process fixed update with the consistent time step
        // CRITICAL FIX: Ensure time scale is applied correctly for day counting
        const currentTimeScale = this.gameTimer.getTimeScale();
        const scaledTime = fixedTimeStep * currentTimeScale;
        
        // Ensure minimum progress even with extremely small time scale
        const minScaledTime = 0.001; // Minimum 1ms game time per tick
        const effectiveScaledTime = Math.max(scaledTime, minScaledTime);
        
        this.processFixedUpdate(fixedTimeStep, effectiveScaledTime);
        
        // Reduce accumulated time
        this.accumulatedTime -= fixedTimeStep;
        updateCount++;
        this.tickCount++;
      }
      
      // If we've hit the max updates, discard remaining time to avoid spiral
      if (updateCount >= this.config.maxUpdatesPerFrame && this.accumulatedTime > fixedTimeStep) {
        if (this.config.debugMode) {
          console.warn(`GameLoop: Too many updates needed, discarding ${this.accumulatedTime.toFixed(3)}s`);
        }
        this.accumulatedTime = 0;
      }
      
      // Schedule next frame if still running
      if (this.animationFrameId !== null) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
      }
    } catch (error) {
      console.error('GameLoop: Error in game loop:', error);
      
      // Try to recover
      this.accumulatedTime = 0;
      this.gameTimer.resetFrameTiming();
      
      // Schedule next frame anyway to keep the game running
      if (this.animationFrameId !== null) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
      }
    }
  }
  
  /**
   * Process a single fixed update
   * @param deltaTime Unscaled time step in seconds (real time)
   * @param scaledDeltaTime Scaled time step in seconds (game time)
   */
  private processFixedUpdate(deltaTime: number, scaledDeltaTime: number): void {
    // Call all registered tick handlers with both real and scaled time
    for (const handler of this.tickHandlers) {
      try {
        // Logging disabled to reduce console spam
        
        // Pass both real and scaled time to handlers
        handler(deltaTime, scaledDeltaTime);
      } catch (error) {
        console.error('GameLoop: Error in tick handler:', error);
        // Continue with other handlers despite errors
      }
    }
    
    // Check for game end conditions if store is available
    if (this.store) {
      // Check every 10 ticks to avoid overhead
      if (this.tickCount % 10 === 0) {
        try {
          const gameEnded = checkGameEndConditions(this.store);
          
          // If game ended, stop the game loop
          if (gameEnded) {
            this.stop();
          }
        } catch (error) {
          console.error('GameLoop: Error checking game end conditions:', error);
        }
      }
    }
  }
  
  /**
   * Set the Redux store to enable game end condition checks
   * @param store The Redux store
   */
  public setStore(store: any): void {
    this.store = store;
  }
  
  /**
   * Register a handler to be called on each fixed update
   * The handler receives both unscaled real time and scaled game time
   * @returns Function to unregister the handler
   */
  public registerHandler(handler: TickHandler): () => void {
    // Avoid duplicate registrations
    if (!this.tickHandlers.includes(handler)) {
      this.tickHandlers.push(handler);
      
      if (this.config.debugMode) {
        console.log(`GameLoop: Registered handler, total: ${this.tickHandlers.length}`);
      }
    }
    
    // Return a function to unregister
    return () => this.unregisterHandler(handler);
  }
  
  /**
   * Unregister a previously registered handler
   */
  public unregisterHandler(handler: TickHandler): void {
    const index = this.tickHandlers.indexOf(handler);
    if (index !== -1) {
      this.tickHandlers.splice(index, 1);
      
      if (this.config.debugMode) {
        console.log(`GameLoop: Unregistered handler, remaining: ${this.tickHandlers.length}`);
      }
    }
  }
  
  /**
   * Get stats about the current game loop
   */
  public getStats(): {
    tickRate: number;
    tickCount: number;
    fps: number;
    handlerCount: number;
    timeStep: number;
    timeScale: number;
    timeRatio: number;
    accumulator: number;
    totalGameTime: number;
    currentDay: number;
    dayProgress: number;
  } {
    // Calculate day information based on total game time
    const totalGameTime = this.gameTimer.getTotalGameTime();
    const secondsPerDay = 60; // Same as SECONDS_PER_DAY from timeUtils
    const currentDay = Math.floor(totalGameTime / secondsPerDay) + 1;
    const dayProgress = (totalGameTime % secondsPerDay) / secondsPerDay;
    
    return {
      tickRate: this.config.tickRate,
      tickCount: this.tickCount,
      fps: this.currentFps,
      handlerCount: this.tickHandlers.length,
      timeStep: 1.0 / this.config.tickRate,
      timeScale: this.gameTimer.getTimeScale(),
      timeRatio: this.gameTimer.getTimeRatio(),
      accumulator: this.accumulatedTime,
      totalGameTime: totalGameTime,
      currentDay: currentDay,
      dayProgress: dayProgress
    };
  }
  
  /**
   * Update the tick rate
   */
  public setTickRate(tickRate: number): void {
    // Validate input
    if (tickRate <= 0) {
      console.error("GameLoop: Invalid tick rate, must be greater than 0");
      return;
    }
    
    // Update config
    this.config.tickRate = tickRate;
    
    if (this.config.debugMode) {
      console.log(`GameLoop: Tick rate updated to ${tickRate}Hz`);
    }
  }
  
  /**
   * Get the GameTimer instance used by this loop
   */
  public getGameTimer(): GameTimer {
    return this.gameTimer;
  }
  
  /**
   * Set the time scale for the game
   */
  public setTimeScale(timeScale: number): void {
    this.gameTimer.setTimeScale(timeScale);
  }
  
  /**
   * Get the current time scale
   */
  public getTimeScale(): number {
    return this.gameTimer.getTimeScale();
  }
  
  /**
   * Register a named callback to be called on each fixed update
   * @param name Unique name for the callback
   * @param callback Function to call on each fixed update
   * @returns Function to unregister the callback
   */
  public registerCallback(name: string, callback: TickHandler): () => void {
    if (this.config.debugMode) {
      console.log(`GameLoop: Registered named callback '${name}'`);
    }
    // Delegate to the existing registerHandler method
    return this.registerHandler(callback);
  }
}