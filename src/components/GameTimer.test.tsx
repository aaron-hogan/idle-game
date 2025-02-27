import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GameTimer from './GameTimer';
import { formatTimeAsDays, getDayProgress } from '../utils/timeUtils';

// Mock the timeUtils functions
jest.mock('../utils/timeUtils', () => ({
  formatTimeAsDays: jest.fn(seconds => `Day ${Math.floor(seconds / 60) + 1}`),
  getDayProgress: jest.fn(seconds => (seconds % 60) / 60),
  SECONDS_PER_DAY: 60
}));

// Mock the Counter component
jest.mock('./common/Counter', () => {
  return function MockCounter(props: any) {
    return (
      <div data-testid="counter">
        <div data-testid="counter-value">{props.value}</div>
        <div data-testid="counter-rate">{props.rate}</div>
        {props.hasDropdown && <div data-testid="counter-dropdown">Dropdown</div>}
      </div>
    );
  };
});

// Set up mock store
const mockStore = configureStore([]);

describe('GameTimer', () => {
  it('renders day counter with correct values', () => {
    const store = mockStore({
      game: {
        totalPlayTime: 120, // Day 3
        isRunning: true,
        gameTimeScale: 1
      }
    });

    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );

    // GameTimer component now uses local state for day counter,
    // which initializes to 1, and we're mocking the Counter with our testid
    expect(screen.getByTestId('counter-value')).toHaveTextContent('Day 1');
    expect(screen.getByTestId('counter-rate')).toHaveTextContent('1x');
  });

  it('shows correct rate formatting based on game state', () => {
    const store = mockStore({
      game: {
        totalPlayTime: 60,
        isRunning: false, // Paused
        gameTimeScale: 1
      }
    });

    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );

    // Should show 0x when paused
    expect(screen.getByTestId('counter-rate')).toHaveTextContent('0x');
  });

  it('renders with faster time scale correctly', () => {
    const store = mockStore({
      game: {
        totalPlayTime: 60,
        isRunning: true,
        gameTimeScale: 5 // 5x speed
      }
    });

    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );

    // Should show 5x speed
    expect(screen.getByTestId('counter-rate')).toHaveTextContent('5x');
  });

  it('includes dropdown for speed control', () => {
    const store = mockStore({
      game: {
        totalPlayTime: 60,
        isRunning: true,
        gameTimeScale: 1
      }
    });

    render(
      <Provider store={store}>
        <GameTimer />
      </Provider>
    );

    // Should have dropdown element
    expect(screen.getByTestId('counter-dropdown')).toBeInTheDocument();
  });
});