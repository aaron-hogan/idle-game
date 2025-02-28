import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import structuresReducer from '../state/structuresSlice';
import gameReducer from '../state/gameSlice';
import eventsReducer from '../state/eventsSlice';
import progressionReducer from '../redux/progressionSlice';
import tasksReducer from '../state/tasksSlice';
import App from './App';
import { ResourceManager } from '../systems/resourceManager';

// Create a mock for ResourceManager
jest.mock('../systems/resourceManager', () => {
  // Mock implementation of the ResourceManager
  const mockResourceManager = {
    initializeResources: jest.fn(),
    updateResources: jest.fn(),
    calculateResourceGeneration: jest.fn(),
    canAfford: jest.fn(),
    applyResourceCost: jest.fn(),
    unlockResource: jest.fn(),
    addResourceAmount: jest.fn(),
    setResourceAmount: jest.fn(),
    initialize: jest.fn(),
  };
  
  return {
    ResourceManager: {
      getInstance: jest.fn(() => mockResourceManager),
    }
  };
});

// Mock EventManager to fix missing events state
jest.mock('../systems/eventManager', () => {
  return {
    EventManager: {
      getInstance: jest.fn().mockReturnValue({
        initialize: jest.fn(),
        registerDefaultEvents: jest.fn(),
        checkForNewEvents: jest.fn(),
        resolveEvents: jest.fn()
      })
    }
  };
});

describe('App component', () => {
  // Create a test store with all required reducers
  const store = configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
      events: eventsReducer,
      progression: progressionReducer,
      tasks: tasksReducer,
    },
    preloadedState: {
      // Add required initial state to prevent errors with events
      events: {
        activeEvents: [],
        eventHistory: [],
        availableEvents: {}
      }
    }
  });
  
  // Reset mocks before each test
  beforeEach(() => {
    // Get the mock instance
    const mockInstance = ResourceManager.getInstance();
    // Clear all mock implementations
    (mockInstance.initializeResources as jest.Mock).mockClear();
    (mockInstance.initialize as jest.Mock).mockClear();
  });

  test('initializes resources on mount', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Get the mock instance
    const mockInstance = ResourceManager.getInstance();
    
    // Check that initialize was called with the store
    expect(mockInstance.initialize).toHaveBeenCalled();
    
    // Check that initializeResources was called
    expect(mockInstance.initializeResources).toHaveBeenCalledTimes(1);
  });
});
