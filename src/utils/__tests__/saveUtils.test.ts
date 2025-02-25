import {
  saveGame,
  loadGame,
  deleteSave,
  backupSave,
  restoreFromBackup,
  exportSave,
  importSave,
  saveExists,
  backupExists,
  SAVE_KEY,
  BACKUP_SAVE_KEYS,
  SAVE_VERSION,
  SaveData
} from '../saveUtils';
import { RootState } from '../../state/store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    store
  };
})();

// Assign mock to window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Sample game state for testing
const mockGameState: Partial<RootState> = {
  game: {
    gameStage: 1,
    lastSaveTime: 1612345678901,
    totalPlayTime: 3600,
    isRunning: true,
    tickRate: 1000,
    gameTimeScale: 1
  },
  resources: {
    'resource1': {
      id: 'resource1',
      name: 'Test Resource 1',
      amount: 100,
      maxAmount: 1000,
      perSecond: 5,
      description: 'A test resource',
      unlocked: true,
      category: 'BASIC'
    },
    'resource2': {
      id: 'resource2',
      name: 'Test Resource 2',
      amount: 50,
      maxAmount: 500,
      perSecond: 2,
      description: 'Another test resource',
      unlocked: false,
      category: 'ADVANCED'
    }
  },
  structures: {
    'structure1': {
      id: 'structure1',
      name: 'Test Structure 1',
      description: 'A test structure',
      level: 2,
      maxLevel: 10,
      cost: { 'resource1': 50 },
      production: { 'resource2': 1 },
      unlocked: true,
      workers: 1,
      maxWorkers: 5,
      category: 'TEST'
    }
  }
};

describe('saveUtils', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });
  
  describe('saveGame', () => {
    it('should save game state to localStorage', () => {
      // Act
      const result = saveGame(mockGameState as RootState);
      
      // Assert
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SAVE_KEY,
        expect.any(String)
      );
      
      const savedData = JSON.parse(localStorageMock.getItem(SAVE_KEY) || '');
      expect(savedData.version).toBe(SAVE_VERSION);
      expect(savedData.timestamp).toBeGreaterThan(0);
      expect(savedData.state.game).toEqual(mockGameState.game);
      expect(savedData.state.resources).toEqual(mockGameState.resources);
      expect(savedData.state.structures).toEqual(mockGameState.structures);
    });
    
    it('should return false when saving fails', () => {
      // Arrange
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Act
      const result = saveGame(mockGameState as RootState);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('loadGame', () => {
    it('should load game state from localStorage', () => {
      // Arrange
      const mockSaveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: mockGameState
      };
      localStorageMock.setItem(SAVE_KEY, JSON.stringify(mockSaveData));
      
      // Act
      const result = loadGame();
      
      // Assert
      expect(result).toEqual(mockSaveData);
    });
    
    it('should return null when no save exists', () => {
      // Act
      const result = loadGame();
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should return null when save data is invalid', () => {
      // Arrange
      localStorageMock.setItem(SAVE_KEY, 'invalid json data');
      
      // Act
      const result = loadGame();
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should log warning when version mismatch', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const mockSaveData: SaveData = {
        version: '0.9.0',
        timestamp: Date.now(),
        state: mockGameState
      };
      localStorageMock.setItem(SAVE_KEY, JSON.stringify(mockSaveData));
      
      // Act
      const result = loadGame();
      
      // Assert
      expect(result).toEqual(mockSaveData);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Save version mismatch')
      );
      
      // Cleanup
      consoleSpy.mockRestore();
    });
  });
  
  describe('deleteSave', () => {
    it('should delete save and backups from localStorage', () => {
      // Arrange
      localStorageMock.setItem(SAVE_KEY, 'test data');
      localStorageMock.setItem(BACKUP_SAVE_KEYS[0], 'backup 1');
      localStorageMock.setItem(BACKUP_SAVE_KEYS[1], 'backup 2');
      
      // Act
      const result = deleteSave();
      
      // Assert
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(SAVE_KEY);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(BACKUP_SAVE_KEYS[0]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(BACKUP_SAVE_KEYS[1]);
    });
    
    it('should return false when deletion fails', () => {
      // Arrange
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      // Act
      const result = deleteSave();
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('backupSave', () => {
    it('should create a backup of the current save', () => {
      // Arrange
      const saveData = 'test save data';
      localStorageMock.setItem(SAVE_KEY, saveData);
      
      // Act
      const result = backupSave();
      
      // Assert
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        BACKUP_SAVE_KEYS[0],
        saveData
      );
    });
    
    it('should return false when no save exists', () => {
      // Act
      const result = backupSave();
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('restoreFromBackup', () => {
    it('should restore the main save from a backup', () => {
      // Arrange
      const mockSaveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: mockGameState
      };
      const saveString = JSON.stringify(mockSaveData);
      localStorageMock.setItem(BACKUP_SAVE_KEYS[0], saveString);
      
      // Act
      const result = restoreFromBackup();
      
      // Assert
      expect(result).toEqual(mockSaveData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(SAVE_KEY, saveString);
    });
    
    it('should return null when backup does not exist', () => {
      // Act
      const result = restoreFromBackup();
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should return null when backup index is invalid', () => {
      // Act
      const result = restoreFromBackup(99);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('exportSave and importSave', () => {
    it('should export save data as string', () => {
      // Arrange
      const mockSaveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: mockGameState
      };
      const saveString = JSON.stringify(mockSaveData);
      localStorageMock.setItem(SAVE_KEY, saveString);
      
      // Act
      const result = exportSave();
      
      // Assert
      expect(result).toBe(saveString);
    });
    
    it('should import valid save data', () => {
      // Arrange
      const mockSaveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: mockGameState
      };
      const saveString = JSON.stringify(mockSaveData);
      
      // Act
      const result = importSave(saveString);
      
      // Assert
      expect(result).toEqual(mockSaveData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(SAVE_KEY, saveString);
    });
    
    it('should return null when importing invalid data', () => {
      // Act
      const result = importSave('not valid json');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should return null when importing data without required fields', () => {
      // Arrange
      const invalidData = JSON.stringify({ foo: 'bar' });
      
      // Act
      const result = importSave(invalidData);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('existence checks', () => {
    it('should check if save exists', () => {
      // Arrange - no save
      
      // Act
      let result = saveExists();
      
      // Assert
      expect(result).toBe(false);
      
      // Arrange - with save
      localStorageMock.setItem(SAVE_KEY, 'test data');
      
      // Act
      result = saveExists();
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should check if backup exists', () => {
      // Arrange - no backup
      
      // Act
      let result = backupExists();
      
      // Assert
      expect(result).toBe(false);
      
      // Arrange - with backup
      localStorageMock.setItem(BACKUP_SAVE_KEYS[0], 'test data');
      
      // Act
      result = backupExists();
      
      // Assert
      expect(result).toBe(true);
    });
  });
});