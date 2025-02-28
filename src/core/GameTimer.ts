/**
 * GameTimer.ts
 * 
 * Authoritative game timer implementation that manages game time progression
 * with precise control over time scaling and pausing.
 * 
 * This is the single source of truth for all time-related values in the game.
 */

/**
 * Configuration interface for the game timer
 */
export interface GameTimerConfig {
  /** Maximum allowed frame time in seconds to prevent spiral of death */
  maxFrameTime: number;
  /** Initial time scale (1.0 = real time) */
  timeScale: number;
  /** Debug mode flag */
  debugMode: boolean;
  /** Whether to pause automatically when tab loses focus */
  pauseOnHidden: boolean;
}

/**
 * Default timer configuration
 */
const DEFAULT_CONFIG: GameTimerConfig = {
  maxFrameTime: 0.1, // 100ms max frame time for stability (reduced from 10s)
  timeScale: 1.0,    // Real-time by default
  debugMode: false,  // Debug mode off by default
  pauseOnHidden: false, // Don't pause automatically when tab loses focus
};

/**
 * Debug information for the timer
 */
export interface TimerDebugInfo {
  /** Is the timer currently running */
  running: boolean;
  /** Time scale (game time / real time) */
  timeScale: number;
  /** Elapsed real time since last update in seconds */
  elapsedRealTime: number;
  /** Elapsed game time since last update in seconds */
  elapsedGameTime: number;
  /** Total game time in seconds */
  totalGameTime: number;
  /** Real time ratio (should be close to 1.0) */
  timeRatio: number;
  /** Time since timer start in seconds (real time) */
  realTimeSinceStart: number;
}

/**
 * GameTimer handles time tracking for the game loop
 * It is the single source of truth for all time-related values
 */
export class GameTimer {
  private static instance: GameTimer | null = null;
  private config: GameTimerConfig;
  private running: boolean = false;
  private lastRealTime: number = 0;
  private startRealTime: number = 0;
  private totalGameTime: number = 0;
  private elapsedRealTime: number = 0;
  private elapsedGameTime: number = 0;
  private wasPausedByVisibility: boolean = false;
  private visibilityHandler: ((event: Event) => void) | null = null;
  
  /**
   * Constructor for GameTimer
   */
  constructor(config: Partial<GameTimerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.reset();
    this.setupVisibilityHandling();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(config?: Partial<GameTimerConfig>): GameTimer {
    if (!GameTimer.instance) {
      GameTimer.instance = new GameTimer(config);
    } else if (config) {
      // Update config if provided
      GameTimer.instance.config = { 
        ...GameTimer.instance.config, 
        ...config 
      };
    }
    return GameTimer.instance;
  }
  
  /**
   * Reset the timer to initial state
   */
  public reset(): void {
    const now = this.getTimestamp();
    this.running = false;
    this.lastRealTime = now;
    this.startRealTime = now;
    this.totalGameTime = 0;
    this.elapsedRealTime = 0;
    this.elapsedGameTime = 0;
    
    // Timer reset complete
  }
  
  /**
   * Set up visibility change handling for browser tab focus
   */
  private setupVisibilityHandling(): void {
    // Remove any existing handler
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    
    // Create and add new handler
    this.visibilityHandler = (_event: Event) => {
      if (document.hidden) {
        // Tab lost focus
        if (this.config.pauseOnHidden && this.running) {
          this.wasPausedByVisibility = true;
          this.pause();
          // Tab hidden, game paused
        }
      } else {
        // Tab gained focus
        // Reset frame timing to prevent huge time jumps
        this.resetFrameTiming();
        
        // Resume if it was paused by visibility change
        if (this.config.pauseOnHidden && this.wasPausedByVisibility) {
          this.resume();
          this.wasPausedByVisibility = false;
          // Tab visible, game resumed
        }
      }
    };
    
    document.addEventListener('visibilitychange', this.visibilityHandler);
    
    // Visibility handling configured
  }
  
  /**
   * Reset frame timing without affecting total game time
   * Used after tab becomes visible to prevent large time jumps
   */
  public resetFrameTiming(): void {
    this.lastRealTime = this.getTimestamp();
    this.elapsedRealTime = 0;
    this.elapsedGameTime = 0;
    
    // Frame timing reset completed
  }
  
  /**
   * Start the timer
   */
  public start(): void {
    if (this.running) return;
    
    const now = this.getTimestamp();
    this.running = true;
    this.lastRealTime = now;
    this.startRealTime = now;
    
    // Timer started
  }
  
  /**
   * Pause the timer
   */
  public pause(): void {
    if (!this.running) return;
    
    this.running = false;
    
    // Timer paused
  }
  
  /**
   * Resume the timer
   */
  public resume(): void {
    if (this.running) return;
    
    this.running = true;
    this.lastRealTime = this.getTimestamp();
    
    // Timer resumed
  }
  
  /**
   * Set game time to a specific value
   * Used for loading saved games
   */
  public setTotalGameTime(timeInSeconds: number): void {
    if (timeInSeconds < 0) {
      console.error('GameTimer: Cannot set negative game time');
      return;
    }
    
    this.totalGameTime = timeInSeconds;
    
    // Total game time set
  }
  
  /**
   * Update the timer (called every frame)
   */
  public update(): void {
    try {
      if (!this.running) {
        this.elapsedRealTime = 0;
        this.elapsedGameTime = 0;
        return;
      }
      
      const currentTime = this.getTimestamp();
      
      // Calculate elapsed real time since last update
      this.elapsedRealTime = Math.max(0, currentTime - this.lastRealTime);
      
      // Cap maximum frame time to prevent spiral of death
      this.elapsedRealTime = Math.min(this.elapsedRealTime, this.config.maxFrameTime);
      
      // Calculate elapsed game time using time scale
      // Use precise time scale calculation with fixed 2-decimal precision to prevent tiny rounding errors
      const timeScale = Math.round(this.config.timeScale * 100) / 100;
      
      // Ensure time scale is at least 0.1 and not zero to prevent stuck timer
      const safeTimeScale = Math.max(0.1, timeScale);
      this.elapsedGameTime = this.elapsedRealTime * safeTimeScale;
      
      // CRITICAL FIX: Ensure we always have at least some minimal time progress
      // This prevents the day counter from appearing stuck due to small time values
      const minTimeIncrement = 0.001; // Minimum 1ms game time increment per frame
      this.elapsedGameTime = Math.max(this.elapsedGameTime, minTimeIncrement);
      
      // Update total game time - use precise time accumulation
      this.totalGameTime += this.elapsedGameTime;
      
      // Update last time for next frame
      this.lastRealTime = currentTime;
      
      // Log detailed update info occasionally (0.1% of updates)
      if (this.config.debugMode && Math.random() < 0.001) {
        console.log(
          `GameTimer: update - elapsed real=${this.elapsedRealTime.toFixed(5)}s, ` +
          `scale=${safeTimeScale.toFixed(2)}x, ` +
          `game time=${this.totalGameTime.toFixed(2)}s`
        );
      }
      
      // Timer updated successfully
    } catch (error) {
      console.error('GameTimer: Error in update:', error);
      // Recover from error by resetting frame timing
      this.resetFrameTiming();
    }
  }
  
  /**
   * Get high-precision timestamp in seconds
   */
  private getTimestamp(): number {
    try {
      return performance.now() / 1000; // Convert ms to seconds
    } catch (_e) {
      // Fallback in case performance.now() is not available
      console.warn('GameTimer: performance.now() not available, falling back to Date.now()');
      return Date.now() / 1000;
    }
  }
  
  /**
   * Get elapsed real time since last update
   */
  public getElapsedRealTime(): number {
    return this.elapsedRealTime;
  }
  
  /**
   * Get elapsed game time since last update
   */
  public getElapsedGameTime(): number {
    return this.elapsedGameTime;
  }
  
  /**
   * Get total elapsed game time
   */
  public getTotalGameTime(): number {
    return this.totalGameTime;
  }
  
  /**
   * Get real time elapsed since timer start
   */
  public getRealTimeSinceStart(): number {
    return (this.getTimestamp() - this.startRealTime);
  }
  
  /**
   * Simplified method to get the elapsed time (same as getElapsedGameTime)
   */
  public getElapsedTime(): number {
    return this.elapsedGameTime;
  }
  
  /**
   * Calculate current time ratio (game time / real time)
   * Should be close to timeScale if everything is working correctly
   */
  public getTimeRatio(): number {
    const realTimeSinceStart = this.getRealTimeSinceStart();
    if (realTimeSinceStart <= 0) return this.config.timeScale;
    return this.totalGameTime / realTimeSinceStart;
  }
  
  /**
   * Set the time scale
   */
  public setTimeScale(scale: number): void {
    // Validate input
    if (scale <= 0) {
      console.error('GameTimer: Invalid time scale, must be greater than 0');
      return;
    }
    
    this.config.timeScale = scale;
    
    // Time scale updated
  }
  
  /**
   * Get the current time scale
   */
  public getTimeScale(): number {
    return this.config.timeScale;
  }
  
  /**
   * Check if the timer is running
   */
  public isRunning(): boolean {
    return this.running;
  }
  
  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.config.debugMode = enabled;
  }
  
  /**
   * Set whether to pause when tab loses focus
   */
  public setPauseOnHidden(enabled: boolean): void {
    this.config.pauseOnHidden = enabled;
  }
  
  /**
   * Get timer debug information for debugging tools
   */
  public getDebugInfo(): TimerDebugInfo {
    return {
      running: this.running,
      timeScale: this.config.timeScale,
      elapsedRealTime: this.elapsedRealTime,
      elapsedGameTime: this.elapsedGameTime,
      totalGameTime: this.totalGameTime,
      timeRatio: this.getTimeRatio(),
      realTimeSinceStart: this.getRealTimeSinceStart()
    };
  }
  
  /**
   * Clean up resources (like event listeners)
   */
  public dispose(): void {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    
    // Timer resources disposed
  }
}