/**
 * A simple test script to verify the game tick functionality
 */
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import structuresReducer from '../state/structuresSlice';
import gameReducer from '../state/gameSlice';
import tasksReducer from '../state/tasksSlice';
import { addPlayTime } from '../state/gameSlice';

// Create a simple test function to run manually
export function runTickingTest() {
  console.log('---------------');
  console.log('TICKING TEST');
  console.log('---------------');

  // Create a test store
  const store = configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
      tasks: tasksReducer,
    },
  });

  // Get initial state
  const initialState = store.getState();
  console.log('Initial play time:', initialState.game.totalPlayTime);

  // Simulate ticks by adding time
  console.log('Adding 1 second...');
  store.dispatch(addPlayTime(1));

  // Get state after first tick
  const stateAfterTick1 = store.getState();
  console.log('Play time after 1 tick:', stateAfterTick1.game.totalPlayTime);

  // Simulate more ticks
  console.log('Adding 5 more seconds...');
  store.dispatch(addPlayTime(5));

  // Get state after more ticks
  const stateAfterTick2 = store.getState();
  console.log('Play time after more ticks:', stateAfterTick2.game.totalPlayTime);

  // Report the results
  console.log('---------------');
  console.log('TEST RESULTS:');

  const test1Success = stateAfterTick1.game.totalPlayTime === 1;
  const test2Success = stateAfterTick2.game.totalPlayTime === 6;

  console.log(`Test 1 (Adding 1 second): ${test1Success ? 'PASSED' : 'FAILED'}`);
  console.log(`Test 2 (Adding 5 seconds): ${test2Success ? 'PASSED' : 'FAILED'}`);
  console.log('---------------');

  return { test1Success, test2Success };
}

// Extend the Window interface
declare global {
  interface Window {
    runTickingTest: typeof runTickingTest;
  }
}

// Optional: Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  (window as any).runTickingTest = runTickingTest;
  console.log('Test function available as window.runTickingTest()');
}
