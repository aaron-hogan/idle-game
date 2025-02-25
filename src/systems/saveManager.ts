/**
 * SaveManager - Handles save/load operations and autosave functionality
 */

import { Store } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { saveGame, loadGame, SaveData, deleteSave, restoreFromBackup } from '../utils/saveUtils';
import { resetGame } from '../state/gameSlice';
import { resetResources } from '../state/resourcesSlice';
import { resetStructures } from '../state/structuresSlice';
import { ErrorLogger, invariant } from '../utils/errorUtils';
import { safeJsonParse } from '../utils/validationUtils';

/**
 * SaveManager configuration options
 */
export interface SaveManagerConfig {
  /** Autosave interval in milliseconds (default: 60000 = 1 minute) */
  autosaveInterval: number;
  /** Whether autosave is enabled (default: true) */
  autosaveEnabled: boolean;
  /** Maximum number of backups to keep (default: 5) */
  maxBackups: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: SaveManagerConfig = {
  autosaveInterval: 60000, // 1 minute
  autosaveEnabled: true,
  maxBackups: 5,
};

/**
 * Manages game save operations and autosave functionality
 */
export class SaveManager {
  private static instance: SaveManager | null = null;
  private store: Store | null = null;
  private config: SaveManagerConfig;
  private autosaveIntervalId: number | null = null;
  private logger = ErrorLogger.getInstance();

  /**
   * Private constructor for singleton pattern
   * @param store Redux store (optional)
   * @param config Configuration options (optional)
   */
  private constructor(store?: Store, config: Partial<SaveManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (store) {
      this.initialize(store, config);
    }
  }

  /**
   * Get the singleton instance of SaveManager
   * @returns The singleton SaveManager instance
   */
  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  /**
   * Initialize the manager with a Redux store and optional configuration
   * @param store The Redux store
   * @param config Optional configuration parameters
   */
  public initialize(store: Store, config: Partial<SaveManagerConfig> = {}): void {
    this.store = store;
    this.setConfig(config);
    
    // Only start autosave if explicitly enabled
    if (this.config.autosaveEnabled) {
      this.startAutosave();
    }
  }
  
  /**
   * Ensure the manager is properly initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    invariant(
      this.store !== null,
      'SaveManager not properly initialized with Redux store',
      'SaveManager'
    );
  }

  /**
   * Save the current game state
   */
  saveGame(): boolean {
    this.ensureInitialized();
    
    try {
      const state = this.store!.getState() as RootState;
      const saved = saveGame(state, this.config.maxBackups);
      
      if (saved) {
        // Update last save time in the store
        this.store!.dispatch({ type: 'game/updateLastSaveTime' });
      }
      
      return saved;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.saveGame'
      );
      return false;
    }
  }

  /**
   * Load the game from saved state
   */
  loadGame(): boolean {
    this.ensureInitialized();
    
    try {
      const saveData = loadGame();
      if (!saveData || !saveData.state) return false;

      // Apply state from save data
      this.applyLoadedState(saveData);
      return true;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.loadGame'
      );
      return false;
    }
  }

  /**
   * Reset the game state to defaults
   */
  resetGame(): void {
    this.ensureInitialized();
    
    this.store!.dispatch(resetGame());
    this.store!.dispatch(resetResources());
    this.store!.dispatch(resetStructures());
  }

  /**
   * Delete the saved game and reset to defaults
   */
  deleteSaveAndReset(): boolean {
    this.ensureInitialized();
    
    try {
      const deleted = deleteSave();
      if (deleted) {
        this.resetGame();
      }
      return deleted;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.deleteSaveAndReset'
      );
      return false;
    }
  }

  /**
   * Start autosave
   */
  startAutosave(): void {
    this.ensureInitialized();
    
    if (this.autosaveIntervalId !== null) {
      this.stopAutosave();
    }

    this.autosaveIntervalId = window.setInterval(() => {
      this.saveGame();
    }, this.config.autosaveInterval);
  }

  /**
   * Stop autosave
   */
  stopAutosave(): void {
    if (this.autosaveIntervalId !== null) {
      window.clearInterval(this.autosaveIntervalId);
      this.autosaveIntervalId = null;
    }
  }

  /**
   * Set autosave configuration
   */
  setConfig(config: Partial<SaveManagerConfig>): void {
    const wasEnabled = this.config.autosaveEnabled;
    this.config = { ...this.config, ...config };

    // Handle autosave toggle changes
    if (!wasEnabled && this.config.autosaveEnabled) {
      this.startAutosave();
    } else if (wasEnabled && !this.config.autosaveEnabled) {
      this.stopAutosave();
    } else if (this.config.autosaveEnabled && this.autosaveIntervalId !== null) {
      // Restart with new interval if still enabled and interval has changed
      this.stopAutosave();
      this.startAutosave();
    }
  }

  /**
   * Restore from a backup save
   */
  restoreFromBackup(backupIndex: number = 0): boolean {
    this.ensureInitialized();
    
    try {
      const saveData = restoreFromBackup(backupIndex);
      if (!saveData || !saveData.state) return false;

      // Apply state from save data
      this.applyLoadedState(saveData);
      return true;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.restoreFromBackup'
      );
      return false;
    }
  }

  /**
   * Check if a saved game exists
   */
  hasSavedGame(): boolean {
    try {
      const saveData = loadGame();
      return saveData !== null && saveData.state !== undefined;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.hasSavedGame'
      );
      return false;
    }
  }

  /**
   * Get the timestamp of the last save
   */
  getLastSaveTime(): number | null {
    try {
      const saveData = loadGame();
      if (!saveData || !saveData.timestamp) return null;
      return saveData.timestamp;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.getLastSaveTime'
      );
      return null;
    }
  }

  /**
   * Apply loaded state to Redux store
   */
  private applyLoadedState(saveData: SaveData): void {
    this.ensureInitialized();
    
    // Reset current state first to clear any data
    this.resetGame();

    try {
      // Set game state
      if (saveData.state.game) {
        // Update individual properties to avoid type issues with unknown properties
        const { 
          gameStage, 
          lastSaveTime, 
          totalPlayTime,
          isRunning,
          tickRate,
          gameTimeScale
        } = saveData.state.game;

        if (gameStage !== undefined) {
          this.store!.dispatch({ type: 'game/setGameStage', payload: gameStage });
        }
        if (totalPlayTime !== undefined) {
          this.store!.dispatch({ type: 'game/setTotalPlayTime', payload: totalPlayTime });
        }
        if (isRunning !== undefined) {
          this.store!.dispatch({ 
            type: isRunning ? 'game/startGame' : 'game/stopGame' 
          });
        }
        if (tickRate !== undefined) {
          this.store!.dispatch({ type: 'game/setTickRate', payload: tickRate });
        }
        if (gameTimeScale !== undefined) {
          this.store!.dispatch({ type: 'game/setGameTimeScale', payload: gameTimeScale });
        }
        // Update last save time last
        this.store!.dispatch({ type: 'game/updateLastSaveTime' });
      }

      // Load resources
      if (saveData.state.resources) {
        const resources = saveData.state.resources;
        Object.values(resources).forEach(resource => {
          this.store!.dispatch({ type: 'resources/addResource', payload: resource });
        });
      }

      // Load structures
      if (saveData.state.structures) {
        const structures = saveData.state.structures;
        Object.values(structures).forEach(structure => {
          this.store!.dispatch({ type: 'structures/addStructure', payload: structure });
        });
      }
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.applyLoadedState'
      );
      throw error; // Re-throw to allow the caller to handle the error
    }
  }

  /**
   * Import save data from a JSON string
   * @param json JSON string containing save data
   * @returns Boolean indicating if import was successful
   */
  importSaveFromJSON(json: string): boolean {
    this.ensureInitialized();
    
    try {
      // Parse the JSON string with safety measures
      const saveData = safeJsonParse<SaveData>(json, { state: {}, timestamp: 0, version: '0' });
      
      // Validate the imported data
      if (!saveData || !saveData.state || !saveData.version) {
        this.logger.logError('Invalid save data format', 'SaveManager.importSaveFromJSON');
        return false;
      }
      
      // Apply the imported state
      this.applyLoadedState(saveData);
      return true;
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.importSaveFromJSON'
      );
      return false;
    }
  }

  /**
   * Export current game state as a JSON string
   * @returns JSON string of the current save state or null on error
   */
  exportSaveAsJSON(): string | null {
    this.ensureInitialized();
    
    try {
      const state = this.store!.getState() as RootState;
      const saveData: SaveData = {
        state,
        timestamp: Date.now(),
        version: '1.0'  // You should use your game's actual version
      };
      
      return JSON.stringify(saveData);
    } catch (error) {
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'SaveManager.exportSaveAsJSON'
      );
      return null;
    }
  }

  /**
   * Cleanup (call when unmounting)
   */
  cleanup(): void {
    this.stopAutosave();
  }
}