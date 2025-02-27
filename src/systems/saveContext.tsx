/**
 * SaveContext - Provides save management functionality throughout the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SaveManager, SaveManagerConfig } from './saveManager';
import { useAppSelector } from '../state/hooks';
import { store } from '../state/store';
import { formatTimeSince } from '../utils/timeUtils';
import { saveExists, backupExists } from '../utils/saveUtils';

/**
 * Interface for the save context value
 */
interface SaveContextValue {
  /** Save manager instance */
  saveManager: SaveManager | null;
  /** Save the game */
  saveGame: () => boolean;
  /** Load the game */
  loadGame: () => boolean;
  /** Reset the game state */
  resetGame: () => void;
  /** Delete save and reset */
  deleteSaveAndReset: () => boolean;
  /** Restore from backup */
  restoreFromBackup: (index?: number) => boolean;
  /** Time since last save */
  timeSinceLastSave: string;
  /** Whether autosave is enabled */
  autosaveEnabled: boolean;
  /** Set autosave enabled */
  setAutosaveEnabled: (enabled: boolean) => void;
  /** Whether a save exists */
  hasSave: boolean;
  /** Whether a backup exists */
  hasBackup: boolean;
  /** Show success message */
  showSuccess: (message: string) => void;
  /** Show error message */
  showError: (message: string) => void;
  /** Whether a message is visible */
  messageVisible: boolean;
  /** Current message */
  message: string;
  /** Message type (success or error) */
  messageType: 'success' | 'error';
}

/**
 * Save context
 */
const SaveContext = createContext<SaveContextValue | null>(null);

/**
 * Props for SaveProvider
 */
interface SaveProviderProps {
  children: React.ReactNode;
  config?: Partial<SaveManagerConfig>;
}

/**
 * SaveProvider component
 */
export const SaveProvider: React.FC<SaveProviderProps> = ({ 
  children, 
  config 
}) => {
  const [saveManager, setSaveManager] = useState<SaveManager | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>('0s');
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(
    config?.autosaveEnabled ?? true
  );
  const [hasSave, setHasSave] = useState<boolean>(saveExists());
  const [hasBackup, setHasBackup] = useState<boolean>(backupExists());
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [messageVisible, setMessageVisible] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  const lastSaveTime = useAppSelector(state => state.game.lastSaveTime);
  
  // Initialize save manager
  useEffect(() => {
    // Create a minimal store with dispatch for SaveManager
    // Adding the [Symbol.observable] property to satisfy Redux store type
    const storeProxy = {
      dispatch,
      getState: () => ({}),
      subscribe: () => () => {},
      replaceReducer: () => {},
      [Symbol.observable]: () => ({
        subscribe: () => ({
          unsubscribe: () => {}
        })
      })
    };
    
    // Import required action creators
    const gameActions = require('../state/gameSlice');
    const resourcesActions = require('../state/resourcesSlice');
    const structureActions = require('../state/structuresSlice');
    
    // Initialize save manager with dependencies
    const manager = SaveManager.getInstance({
      dispatch: dispatch,
      getState: () => store.getState(),
      actions: {
        resetGame: gameActions.resetGame,
        resetResources: resourcesActions.resetResources,
        resetStructures: structureActions.resetStructures
      },
      config: config
    });
    
    setSaveManager(manager);
    
    // Attempt to load saved game on startup
    if (saveExists()) {
      manager.loadGame();
    }
    
    // Clean up on unmount
    return () => {
      manager.cleanup();
    };
  }, [dispatch, config]);
  
  // Update time since last save
  useEffect(() => {
    if (!lastSaveTime) return;
    
    const intervalId = setInterval(() => {
      setTimeSinceLastSave(formatTimeSince(lastSaveTime));
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [lastSaveTime]);
  
  // Show message for 3 seconds
  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setMessageVisible(true);
    
    setTimeout(() => {
      setMessageVisible(false);
    }, 3000);
  };
  
  // Function to show success message
  const showSuccess = (msg: string) => {
    showMessage(msg, 'success');
  };
  
  // Function to show error message
  const showError = (msg: string) => {
    showMessage(msg, 'error');
  };
  
  // Save game function
  const saveGame = (): boolean => {
    if (!saveManager) return false;
    
    const success = saveManager.saveGame();
    if (success) {
      showSuccess('Game saved successfully');
      setHasSave(true);
      setHasBackup(true);
    } else {
      showError('Failed to save game');
    }
    
    return success;
  };
  
  // Load game function
  const loadGame = (): boolean => {
    if (!saveManager) return false;
    
    const success = saveManager.loadGame();
    if (success) {
      showSuccess('Game loaded successfully');
    } else {
      showError('Failed to load game');
    }
    
    return success;
  };
  
  // Reset game function
  const resetGame = (): void => {
    if (!saveManager) return;
    
    saveManager.resetGame();
    showSuccess('Game has been reset');
  };
  
  // Delete save and reset function
  const deleteSaveAndReset = (): boolean => {
    if (!saveManager) return false;
    
    const success = saveManager.deleteSaveAndReset();
    if (success) {
      showSuccess('Save deleted and game reset');
      setHasSave(false);
    } else {
      showError('Failed to delete save');
    }
    
    return success;
  };
  
  // Restore from backup function
  const restoreFromBackup = (index: number = 0): boolean => {
    if (!saveManager) return false;
    
    const success = saveManager.restoreFromBackup(index);
    if (success) {
      showSuccess('Restored from backup');
    } else {
      showError('Failed to restore from backup');
    }
    
    return success;
  };
  
  // Update autosave enabled
  const updateAutosaveEnabled = (enabled: boolean): void => {
    if (!saveManager) return;
    
    setAutosaveEnabled(enabled);
    saveManager.setConfig({ autosaveEnabled: enabled });
    
    if (enabled) {
      showSuccess('Autosave enabled');
    } else {
      showSuccess('Autosave disabled');
    }
  };
  
  const value: SaveContextValue = {
    saveManager,
    saveGame,
    loadGame,
    resetGame,
    deleteSaveAndReset,
    restoreFromBackup,
    timeSinceLastSave,
    autosaveEnabled,
    setAutosaveEnabled: updateAutosaveEnabled,
    hasSave,
    hasBackup,
    showSuccess,
    showError,
    messageVisible,
    message,
    messageType,
  };
  
  return (
    <SaveContext.Provider value={value}>
      {children}
    </SaveContext.Provider>
  );
};

/**
 * Custom hook to access the save context
 */
export const useSave = (): SaveContextValue => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
};