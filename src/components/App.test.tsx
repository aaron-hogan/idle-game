import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import structuresReducer from '../state/structuresSlice';
import gameReducer from '../state/gameSlice';
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

describe('App component', () => {
  // Create a test store
  const store = configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
    },
  });
  
  // Reset mocks before each test
  beforeEach(() => {
    // Get the mock instance
    const mockInstance = ResourceManager.getInstance();
    // Clear all mock implementations
    (mockInstance.initializeResources as jest.Mock).mockClear();
    (mockInstance.initialize as jest.Mock).mockClear();
  });

  test('renders the title', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const titleElement = screen.getAllByText(/Anti-Capitalist Idle Game/i)[0]; // Use getAllByText to get the first match
    expect(titleElement).toBeInTheDocument();
  });

  test('has the correct CSS class', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const appElement = container.firstChild;
    expect(appElement).toHaveClass('game-layout'); // Updated to match actual class name
  });

  test('renders as a heading', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Anti-Capitalist Idle Game');
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
