/**
 * GameLoopManager is responsible for running the main game loop
 * and coordinating updates with other systems
 */
import { getCurrentTime } from '../utils/timeUtils';
export class GameLoopManager {
  private static instance: GameLoopManager | null = null;
  private tickHandlers: Array<(deltaTime: number) => void> = [];
  private lastTickTime: number = 0;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private debuggingEnabled: boolean = true;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.lastTickTime = getCurrentTime();
  }

  /**
   * Get the singleton instance of GameLoopManager
   */
  public static getInstance(): GameLoopManager {
    if (!GameLoopManager.instance) {
      GameLoopManager.instance = new GameLoopManager();
    }
    return GameLoopManager.instance;
  }

  /**
   * Register a handler to be called on each game tick
   * @param handler Function to call on each tick
   */
  public registerTickHandler(handler: (deltaTime: number) => void): void {
    if (!this.tickHandlers.includes(handler)) {
      this.tickHandlers.push(handler);
      if (this.debuggingEnabled) {
        console.log(
          'GameLoopManager: Registered tick handler, total handlers:',
          this.tickHandlers.length
        );
      }
    }
  }

  /**
   * Remove a previously registered tick handler
   * @param handler Function to remove
   */
  public unregisterTickHandler(handler: (deltaTime: number) => void): void {
    const index = this.tickHandlers.indexOf(handler);
    if (index !== -1) {
      this.tickHandlers.splice(index, 1);
      if (this.debuggingEnabled) {
        console.log(
          'GameLoopManager: Unregistered tick handler, remaining handlers:',
          this.tickHandlers.length
        );
      }
    }
  }

  /**
   * Start the game loop
   */
  public startGameLoop(): void {
    if (this.isRunning) {
      return;
    }

    // DISABLED: Now using only the core/GameLoop implementation
    console.log('GameLoopManager: DISABLED - Using new GameLoop implementation instead');

    // Still mark as running but don't actually start the loop
    this.isRunning = true;
    this.lastTickTime = getCurrentTime();

    // Don't call this.tick()
  }

  /**
   * Stop the game loop
   */
  public stopGameLoop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;

      if (this.debuggingEnabled) {
        console.log('GameLoopManager: Stopped game loop');
      }
    }
  }

  /**
   * Main tick function that drives the game loop
   */
  private tick(): void {
    const currentTime = getCurrentTime();
    const deltaTime = currentTime - this.lastTickTime;
    this.lastTickTime = currentTime;

    try {
      // Log that this is the legacy loop (disabled for time updates)
      if (this.debuggingEnabled && Math.random() < 0.01) {
        console.log(`GameLoopManager (LEGACY): Not updating game time, using new GameLoop instead`);
      }

      // Call all registered tick handlers
      for (const handler of this.tickHandlers) {
        try {
          handler(deltaTime);
        } catch (error) {
          console.error('Error in tick handler:', error);
          // Continue with other handlers despite the error
        }
      }

      // Debug log every 60 ticks (approximately once per second)
      if (this.debuggingEnabled && Math.random() < 0.01) {
        console.log(
          `GameLoopManager: Tick processed, deltaTime=${deltaTime}ms, handlers=${this.tickHandlers.length}`
        );
      }
    } catch (error) {
      console.error('Error in game loop tick:', error);
      // Continue with the game loop despite the error
    }

    // Schedule the next tick if still running
    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(() => this.tick());
    }
  }

  /**
   * Check if the game loop is currently running
   */
  public isGameLoopRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get the current game time
   */
  public getCurrentTime(): number {
    return getCurrentTime();
  }

  /**
   * Get the time elapsed since the last tick
   */
  public getTimeSinceLastTick(): number {
    return getCurrentTime() - this.lastTickTime;
  }
}
