/**
 * Utilities for saving and loading game state
 */

import { RootState } from '../state/store';

// Current save version
export const SAVE_VERSION = '1.0.0';

// LocalStorage key for game save
export const SAVE_KEY = 'unnamed-idle-game-save';

// Backup saves
export const BACKUP_SAVE_KEYS = [
  'unnamed-idle-game-save-backup-1',
  'unnamed-idle-game-save-backup-2',
];

/**
 * Save data structure with version info
 */
export interface SaveData {
  version: string;
  timestamp: number;
  state: Partial<RootState>;
}

/**
 * Save the game state to localStorage
 * @param state Game state to save
 * @param maxBackups Maximum number of backups to keep (default: 2)
 * @returns Boolean indicating if save was successful
 */
export function saveGame(state: RootState, maxBackups: number = 2): boolean {
  try {
    // Create save data object with version
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      state: {
        resources: state.resources,
        structures: state.structures,
        game: state.game,
      },
    };

    // Serialize to JSON
    const serializedState = JSON.stringify(saveData);
    
    // Check if we need to rotate backup saves
    // Only use maxBackups if the number is smaller than our BACKUP_SAVE_KEYS array
    const useMaxBackups = Math.min(maxBackups, BACKUP_SAVE_KEYS.length);
    rotateBackups();

    // Save to localStorage
    localStorage.setItem(SAVE_KEY, serializedState);
    
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

/**
 * Load the game state from localStorage
 */
export function loadGame(): SaveData | null {
  try {
    // Try to get save from localStorage
    const serializedState = localStorage.getItem(SAVE_KEY);
    
    // If no save exists, return null
    if (!serializedState) {
      return null;
    }
    
    // Parse the serialized data
    const saveData: SaveData = JSON.parse(serializedState);
    
    // Basic validation
    if (!saveData || !saveData.version || !saveData.state) {
      console.error('Invalid save data format');
      return null;
    }
    
    // Version compatibility check (to be expanded in future)
    if (saveData.version !== SAVE_VERSION) {
      console.warn(`Save version mismatch: ${saveData.version} vs current ${SAVE_VERSION}`);
      // Future: add migration logic here
    }
    
    return saveData;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Delete the saved game
 */
export function deleteSave(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    // Also remove backups
    BACKUP_SAVE_KEYS.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Failed to delete save:', error);
    return false;
  }
}

/**
 * Create a backup of the current save
 */
export function backupSave(): boolean {
  try {
    const currentSave = localStorage.getItem(SAVE_KEY);
    if (!currentSave) return false;
    
    // Save to the first backup slot
    localStorage.setItem(BACKUP_SAVE_KEYS[0], currentSave);
    return true;
  } catch (error) {
    console.error('Failed to backup save:', error);
    return false;
  }
}

/**
 * Rotate backup saves (shift older backups)
 */
export function rotateBackups(): void {
  try {
    // Move the first backup to the second slot
    const firstBackup = localStorage.getItem(BACKUP_SAVE_KEYS[0]);
    if (firstBackup) {
      localStorage.setItem(BACKUP_SAVE_KEYS[1], firstBackup);
    }
    
    // Current save becomes the first backup
    const currentSave = localStorage.getItem(SAVE_KEY);
    if (currentSave) {
      localStorage.setItem(BACKUP_SAVE_KEYS[0], currentSave);
    }
  } catch (error) {
    console.error('Failed to rotate backups:', error);
  }
}

/**
 * Restore from a backup save
 */
export function restoreFromBackup(backupIndex: number = 0): SaveData | null {
  try {
    if (backupIndex >= BACKUP_SAVE_KEYS.length) {
      console.error('Invalid backup index');
      return null;
    }
    
    const backupKey = BACKUP_SAVE_KEYS[backupIndex];
    const serializedState = localStorage.getItem(backupKey);
    
    if (!serializedState) {
      console.error('No backup found at index', backupIndex);
      return null;
    }
    
    // Restore backup to current save
    localStorage.setItem(SAVE_KEY, serializedState);
    
    // Parse and return the state
    const saveData: SaveData = JSON.parse(serializedState);
    return saveData;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return null;
  }
}

/**
 * Export save data as a JSON string for user to download
 */
export function exportSave(): string {
  const serializedState = localStorage.getItem(SAVE_KEY);
  return serializedState || '';
}

/**
 * Import save data from a JSON string provided by the user
 */
export function importSave(saveString: string): SaveData | null {
  try {
    // Parse the string
    const saveData: SaveData = JSON.parse(saveString);
    
    // Validate the data
    if (!saveData || !saveData.version || !saveData.state) {
      console.error('Invalid save data format');
      return null;
    }
    
    // Save to localStorage
    localStorage.setItem(SAVE_KEY, saveString);
    
    return saveData;
  } catch (error) {
    console.error('Failed to import save:', error);
    return null;
  }
}

/**
 * Check if a save game exists
 */
export function saveExists(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Check if any backup saves exist
 */
export function backupExists(index: number = 0): boolean {
  if (index >= BACKUP_SAVE_KEYS.length) return false;
  return localStorage.getItem(BACKUP_SAVE_KEYS[index]) !== null;
}