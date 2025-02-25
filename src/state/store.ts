import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './resourcesSlice';
import structuresReducer from './structuresSlice';
import gameReducer from './gameSlice';
import tasksReducer from './tasksSlice';
import eventsReducer from './eventsSlice';
import progressionReducer from '../redux/progressionSlice';
import { stateValidationMiddleware } from '../utils/stateValidation';
import { trackingMiddleware } from './middleware/trackingMiddleware';
import { taskMiddleware } from './middleware/taskMiddleware';
import { attachErrorMonitoring } from '../utils/errorUtils';

// Type for our reducers
type AppReducer = {
  resources: typeof resourcesReducer,
  structures: typeof structuresReducer,
  game: typeof gameReducer,
  tasks: typeof tasksReducer,
  events: typeof eventsReducer,
  progression: typeof progressionReducer,
};

// Configure store with all reducers and middleware
export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    structures: structuresReducer,
    game: gameReducer,
    tasks: tasksReducer,
    events: eventsReducer,
    progression: progressionReducer,
  } as AppReducer,
  // Add custom middleware for validation and tracking
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(stateValidationMiddleware)
      .concat(trackingMiddleware)
      .concat(taskMiddleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Set up error monitoring for the store
attachErrorMonitoring(store);

// Define RootState first, without referencing store directly
// This avoids the circular reference error
export type RootState = {
  resources: ReturnType<typeof resourcesReducer>,
  structures: ReturnType<typeof structuresReducer>,
  game: ReturnType<typeof gameReducer>,
  tasks: ReturnType<typeof tasksReducer>,
  events: ReturnType<typeof eventsReducer>,
  progression: ReturnType<typeof progressionReducer>,
};
export type AppDispatch = typeof store.dispatch;

// Define AppThunk type for async actions
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;