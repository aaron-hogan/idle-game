import { SaveManager } from '../saveManager';
import * as saveUtils from '../../utils/saveUtils';
import { RootState } from '../../state/store';
import { resetSingleton, createMockStore } from '../../utils/testUtils';

// Mock saveUtils module
jest.mock('../../utils/saveUtils', () => ({
  saveGame: jest.fn(() => true),
  loadGame: jest.fn(),
  deleteSave: jest.fn(() => true),
  restoreFromBackup: jest.fn(),
  SaveData: jest.requireActual('../../utils/saveUtils').SaveData
}));

// Sample game state for testing
const mockGameState: Partial<RootState> = {
  game: {
    gameStage: 1,
    lastSaveTime: 1612345678901,
    totalPlayTime: 3600,
    isRunning: true,
    tickRate: 1000,
    gameTimeScale: 1,
    startDate: 1612345000000,  // Required field
    gameEnded: false,          // Required fields from updated GameState
    gameWon: false,
    endReason: null
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
      category: 'primary'
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
      category: 'production'
    }
  }
};

describe('SaveManager', () => {
  let saveManager: SaveManager;
  let mockStore: any;
  let mockDispatch: jest.Mock;
  let mockGetState: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the singleton instance
    resetSingleton(SaveManager);
    
    // Set up mock store
    const mocks = createMockStore();
    mockStore = mocks.mockStore;
    mockDispatch = mocks.mockDispatch;
    mockGetState = mocks.mockGetState;
    
    // Mock getState to return our test game state
    mockGetState.mockReturnValue(mockGameState);
    
    // Get the singleton instance
    saveManager = SaveManager.getInstance();
    saveManager.initialize(mockStore);
    
    // Clear any intervals created
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Clean up
    saveManager.cleanup();
    jest.useRealTimers();
  });
  
  describe('initialization', () => {
    it('should initialize with default config', () => {
      // Verify the instance was created correctly
      expect(saveManager).toBeInstanceOf(SaveManager);
    });
    
    it('should start autosave by default', () => {
      // Reset to ensure clean test
      resetSingleton(SaveManager);
      saveManager = SaveManager.getInstance();
      saveManager.initialize(mockStore);
      
      jest.advanceTimersByTime(60000); // 1 minute
      
      // Assert
      expect(saveUtils.saveGame).toHaveBeenCalled();
    });
    
    it('should not start autosave if disabled in config', () => {
      // Reset for clean test
      resetSingleton(SaveManager);
      saveManager = SaveManager.getInstance();
      saveManager.initialize(mockStore, { autosaveEnabled: false });
      
      jest.advanceTimersByTime(60000); // 1 minute
      
      // Assert
      expect(saveUtils.saveGame).not.toHaveBeenCalled();
    });
  });
  
  describe('saveGame', () => {
    it('should call saveUtils.saveGame', () => {
      // Act
      saveManager.saveGame();
      
      // Assert
      expect(saveUtils.saveGame).toHaveBeenCalled();
    });
    
    it('should return true on success', () => {
      // Arrange
      (saveUtils.saveGame as jest.Mock).mockReturnValueOnce(true);
      
      // Act
      const result = saveManager.saveGame();
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false on failure', () => {
      // Arrange
      (saveUtils.saveGame as jest.Mock).mockReturnValueOnce(false);
      
      // Act
      const result = saveManager.saveGame();
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('loadGame', () => {
    it('should return false if no save data is found', () => {
      // Arrange
      (saveUtils.loadGame as jest.Mock).mockReturnValueOnce(null);
      
      // Act
      const result = saveManager.loadGame();
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should dispatch actions to restore game state', () => {
      // Arrange
      (saveUtils.loadGame as jest.Mock).mockReturnValueOnce({
        version: '1.0.0',
        timestamp: 1612345678901,
        state: mockGameState
      });
      
      // Act
      const result = saveManager.loadGame();
      
      // Assert
      expect(result).toBe(true);
      
      // Verify reset actions were dispatched
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('game/resetGame')
      }));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('resources/resetResources')
      }));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/resetStructures')
      }));
      
      // Verify game state was restored
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('game/setGameStage'),
        payload: mockGameState.game!.gameStage
      }));
      
      // Verify resources were restored
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('resources/addResource'),
        payload: mockGameState.resources!.resource1
      }));
      
      // Verify structures were restored
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/addStructure'),
        payload: mockGameState.structures!.structure1
      }));
    });
    
    it('should handle errors gracefully', () => {
      // Arrange
      (saveUtils.loadGame as jest.Mock).mockReturnValueOnce({
        version: '1.0.0',
        timestamp: 1612345678901,
        state: mockGameState
      });
      
      // Mock dispatch to throw an error
      mockDispatch.mockImplementationOnce(() => {
        throw new Error('Dispatch error');
      });
      
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      const result = saveManager.loadGame();
      
      // Assert
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      // Cleanup
      consoleSpy.mockRestore();
    });
  });
  
  describe('resetGame', () => {
    it('should dispatch reset actions for all state slices', () => {
      // Act
      saveManager.resetGame();
      
      // Assert
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('game/resetGame')
      }));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('resources/resetResources')
      }));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('structures/resetStructures')
      }));
    });
  });
  
  describe('deleteSaveAndReset', () => {
    it('should delete the save and reset the game', () => {
      // Arrange
      (saveUtils.deleteSave as jest.Mock).mockReturnValueOnce(true);
      
      // Act
      const result = saveManager.deleteSaveAndReset();
      
      // Assert
      expect(result).toBe(true);
      expect(saveUtils.deleteSave).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('game/resetGame')
      }));
    });
    
    it('should not reset if delete fails', () => {
      // Arrange
      (saveUtils.deleteSave as jest.Mock).mockReturnValueOnce(false);
      
      // Act
      const result = saveManager.deleteSaveAndReset();
      
      // Assert
      expect(result).toBe(false);
      expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('game/resetGame')
      }));
    });
  });
  
  describe('autosave functionality', () => {
    it('should save at regular intervals', () => {
      // First stop any default autosave from initialization
      saveManager.stopAutosave();
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Start autosave
      saveManager.startAutosave();
      
      // Advance time by multiple intervals
      jest.advanceTimersByTime(60000); // 1 minute
      expect(saveUtils.saveGame).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(60000); // Another minute
      expect(saveUtils.saveGame).toHaveBeenCalledTimes(2);
      
      jest.advanceTimersByTime(60000); // Another minute
      expect(saveUtils.saveGame).toHaveBeenCalledTimes(3);
    });
    
    it('should stop autosave when requested', () => {
      // Reset for clean test
      resetSingleton(SaveManager);
      saveManager = SaveManager.getInstance();
      saveManager.initialize(mockStore);
      
      // Act
      saveManager.stopAutosave();
      jest.advanceTimersByTime(180000); // 3 minutes
      
      // Assert
      expect(saveUtils.saveGame).not.toHaveBeenCalled();
    });
    
    it('should restart autosave when requested', () => {
      // Reset for clean test
      resetSingleton(SaveManager);
      saveManager = SaveManager.getInstance();
      saveManager.initialize(mockStore, { autosaveEnabled: false });
      
      // Act
      saveManager.startAutosave();
      jest.advanceTimersByTime(60000); // 1 minute
      
      // Assert
      expect(saveUtils.saveGame).toHaveBeenCalled();
    });
    
    it('should update the autosave interval when config changes', () => {
      // First stop any default autosave from initialization
      saveManager.stopAutosave();
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Start autosave with new interval
      const newInterval = 30000; // 30 seconds
      saveManager.setConfig({ autosaveInterval: newInterval });
      saveManager.startAutosave();
      
      // Fast-forward to just before the new interval
      jest.advanceTimersByTime(29999);
      expect(saveUtils.saveGame).not.toHaveBeenCalled();
      
      // Fast-forward the remaining time
      jest.advanceTimersByTime(1);
      expect(saveUtils.saveGame).toHaveBeenCalled();
    });
  });
  
  describe('cleanup', () => {
    it('should stop autosave interval on cleanup', () => {
      // Arrange
      saveManager.startAutosave();
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      
      // Act
      saveManager.cleanup();
      jest.advanceTimersByTime(60000); // 1 minute
      
      // Assert
      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(saveUtils.saveGame).not.toHaveBeenCalled();
    });
  });
});