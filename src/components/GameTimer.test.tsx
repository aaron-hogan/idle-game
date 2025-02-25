import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GameTimer from './GameTimer';
import { formatTime } from '../utils/timeUtils';
import { addPlayTime } from '../state/gameSlice';

// Set up mock store
const mockStore = configureStore([]);

describe('GameTimer', () => {
  let store: any;
  
  beforeEach(() => {
    // Create initial mock state
    store = mockStore({
      game: {
        totalPlayTime: 0,
        isRunning: true,
        gameTimeScale: 1
      }
    });
    
    // Mock store.getState to be accessible within the component
    store.getState = () => ({
      game: {
        totalPlayTime: store.getActions().reduce((time: number, action: any) => {
          if (action.type === 'game/addPlayTime') {
            return time + action.payload;
          }
          return time;
        }, 0),
        isRunning: true,
        gameTimeScale: 1
      }
    });
  });
  
  test('displays initial time of 0s', () => {
    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Check if "0s" is displayed
    expect(screen.getByText(/0s/i)).toBeInTheDocument();
  });
  
  test('updates display when total play time changes', () => {
    // Render with initial time
    const { rerender } = render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Update store to simulate time passing
    store.dispatch(addPlayTime(65)); // 1m 5s
    
    // Re-render with updated time
    rerender(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Check if time display is updated (should now show "1m 5s")
    const formattedTime = formatTime(65);
    expect(screen.getByText(new RegExp(formattedTime, 'i'))).toBeInTheDocument();
  });
  
  test('shows pause/play button based on game state', () => {
    // Start with game running
    store = mockStore({
      game: {
        totalPlayTime: 0,
        isRunning: true,
        gameTimeScale: 1
      }
    });
    
    const { rerender } = render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Should show pause button when game is running
    expect(screen.getByText('PAUSE')).toBeInTheDocument();
    
    // Update store to paused state
    store = mockStore({
      game: {
        totalPlayTime: 0,
        isRunning: false,
        gameTimeScale: 1
      }
    });
    
    // Re-render with game paused
    rerender(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );
    
    // Should show play button when game is paused
    expect(screen.getByText('PLAY')).toBeInTheDocument();
  });
});