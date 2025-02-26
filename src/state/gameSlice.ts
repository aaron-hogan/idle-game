import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as timeUtils from '../utils/timeUtils';

// Use explicit function reference to avoid import issues in tests
const getCurrentTime = () => {
  try {
    return timeUtils.getCurrentTime();
  } catch (e) {
    // Fallback for tests
    return Date.now();
  }
};

interface GameState {
  gameStage: number;
  lastSaveTime: number;
  totalPlayTime: number;
  isRunning: boolean;
  tickRate: number; // milliseconds per tick
  gameTimeScale: number; // how much faster game time runs compared to real time
  startDate: number; // when the game was first started
}

const initialState: GameState = {
  gameStage: 0,
  lastSaveTime: getCurrentTime(), // Use centralized time function
  startDate: getCurrentTime(), // Use centralized time function
  totalPlayTime: 0,
  isRunning: true,
  tickRate: 1000, // 1 second per tick
  gameTimeScale: 1, // real time
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Update game stage
    setGameStage: (state, action: PayloadAction<number>) => {
      state.gameStage = action.payload;
    },
    
    // Update last save time
    updateLastSaveTime: (state) => {
      state.lastSaveTime = getCurrentTime(); // Use centralized time function
    },
    
    // Update total play time
    addPlayTime: (state, action: PayloadAction<number>) => {
      // Ensure we're adding a positive value
      const timeToAdd = Math.max(0, action.payload);
      
      if (timeToAdd > 0) {
        const oldTime = state.totalPlayTime;
        state.totalPlayTime += timeToAdd;
        console.log(`gameSlice.addPlayTime: Adding ${timeToAdd.toFixed(2)}s, old=${oldTime.toFixed(2)}, new=${state.totalPlayTime.toFixed(2)}`);
      }
    },
    
    // Set specific play time (used for loading saves)
    setTotalPlayTime: (state, action: PayloadAction<number>) => {
      const oldTime = state.totalPlayTime;
      state.totalPlayTime = action.payload;
      console.log(`gameSlice.setTotalPlayTime: Setting time from ${oldTime.toFixed(2)}s to ${state.totalPlayTime.toFixed(2)}s`);
    },
    
    // Start the game loop
    startGame: (state) => {
      state.isRunning = true;
    },
    
    // Stop the game loop
    stopGame: (state) => {
      state.isRunning = false;
    },
    
    // Change tick rate
    setTickRate: (state, action: PayloadAction<number>) => {
      state.tickRate = action.payload;
    },
    
    // Change game time scale
    setGameTimeScale: (state, action: PayloadAction<number>) => {
      state.gameTimeScale = action.payload;
    },
    
    // Process offline progress
    processOfflineProgress: (state, action: PayloadAction<number>) => {
      // This is mostly a marker action for middleware/sagas to handle
      // The actual logic is in the game loop system
    },
    
    // Reset game state
    resetGame: () => initialState,
  },
});

export const {
  setGameStage,
  updateLastSaveTime,
  addPlayTime,
  setTotalPlayTime,
  startGame,
  stopGame,
  setTickRate,
  setGameTimeScale,
  processOfflineProgress,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;