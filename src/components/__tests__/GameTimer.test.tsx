import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameTimer from '../GameTimer';
import gameReducer, { startGame, stopGame } from '../../state/gameSlice';
import resourcesReducer from '../../state/resourcesSlice';
import structuresReducer from '../../state/structuresSlice';
import { formatTime } from '../../utils/timeUtils';

// Mock formatTime to avoid having to mock Date.now
jest.mock('../../utils/timeUtils', () => ({
  formatTime: jest.fn(seconds => `${seconds} seconds`),
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
    
    // formatTime should have been called with the totalPlayTime
    expect(formatTime).toHaveBeenCalledWith(120);
    
    // Check the rendered output
    expect(screen.getByText('TIME:')).toBeInTheDocument();
    expect(screen.getByText('120 seconds')).toBeInTheDocument();
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
    expect(screen.getByText('(x2)')).toBeInTheDocument();
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
    
    // Should not show the speed multiplier
    expect(screen.queryByText('(x1)')).not.toBeInTheDocument();
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
    
    // Find and click the pause button
    const pauseButton = screen.getByRole('button', { name: /pause game/i });
    fireEvent.click(pauseButton);
    
    // Should have dispatched stopGame
    expect(store.dispatch).toHaveBeenCalledWith(stopGame());
    
    // Update the state to paused
    store.dispatch(stopGame());
    
    // Find and click the play button
    const playButton = screen.getByRole('button', { name: /resume game/i });
    fireEvent.click(playButton);
    
    // Should have dispatched startGame
    expect(store.dispatch).toHaveBeenCalledWith(startGame());
  });
});