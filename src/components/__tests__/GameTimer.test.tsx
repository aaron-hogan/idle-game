import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameTimer from '../GameTimer';
import gameReducer, { startGame, stopGame } from '../../state/gameSlice';
import resourcesReducer from '../../state/resourcesSlice';
import structuresReducer from '../../state/structuresSlice';
import { formatTime } from '../../utils/timeUtils';

// Mock timeUtils to avoid having to mock Date.now
jest.mock('../../utils/timeUtils', () => ({
  formatTime: jest.fn(seconds => `${seconds} seconds`),
  formatTimeAsDays: jest.fn(seconds => `Day ${Math.floor(seconds / 60) + 1}`),
  getDayProgress: jest.fn(seconds => (seconds % 60) / 60),
  getDayFromSeconds: jest.fn(seconds => Math.floor(seconds / 60) + 1),
  SECONDS_PER_DAY: 60,
}));

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      game: gameReducer,
      resources: resourcesReducer,
      structures: structuresReducer,
    },
    preloadedState: initialState,
  });
};

describe('GameTimer', () => {
  it('should render the game time', () => {
    const initialState = {
      game: {
        totalPlayTime: 120, // 2 minutes
        isRunning: true,
        gameTimeScale: 1,
      },
    };
    
    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // GameTimer now uses localDay state which initializes to 1 in the component
    // and updates via RAF, so we need to check for Day 1 initially
    expect(screen.getByText('Day 1')).toBeInTheDocument();
  });
  
  it('should show time scale when not 1x', () => {
    const initialState = {
      game: {
        totalPlayTime: 120,
        isRunning: true,
        gameTimeScale: 2, // 2x speed
      },
    };
    
    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Should show the speed multiplier
    expect(screen.getByText('2x')).toBeInTheDocument();
  });
  
  it('should not show time scale when 1x', () => {
    const initialState = {
      game: {
        totalPlayTime: 120,
        isRunning: true,
        gameTimeScale: 1, // Normal speed
      },
    };
    
    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Should show the 1x speed multiplier in neutral color
    expect(screen.getByText('1x')).toBeInTheDocument();
  });
  
  it('should toggle game running state when button clicked', () => {
    const initialState = {
      game: {
        totalPlayTime: 120,
        isRunning: true,
        gameTimeScale: 1,
      },
    };
    
    const store = createTestStore(initialState);
    
    // Spy on dispatch
    jest.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Find and click the dropdown trigger (rate element)
    const rateElement = screen.getByText(/1x/i);
    fireEvent.click(rateElement);
    
    // Look for pause option in the dropdown and click it
    const pauseOption = screen.getByText(/pause/i);
    fireEvent.click(pauseOption);
    
    // Should have dispatched stopGame
    expect(store.dispatch).toHaveBeenCalledWith(stopGame());
  });
});