import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from '../state/resourcesSlice';
import structuresReducer from '../state/structuresSlice';
import gameReducer from '../state/gameSlice';
import tasksReducer from '../state/tasksSlice';
import { formatTime } from '../utils/timeUtils';
import { addPlayTime } from '../state/gameSlice';

// Create a minimal test component to verify game time updates
export const ManualTest: React.FC = () => {
  // Create a test store
  const store = configureStore({
    reducer: {
      resources: resourcesReducer,
      structures: structuresReducer,
      game: gameReducer,
      tasks: tasksReducer,
    },
  });

  // State to track time
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  // Add to log
  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  // Effect to update time every second
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const state = store.getState();
      setCurrentTime(state.game.totalPlayTime);

      // Add 1 second
      store.dispatch(addPlayTime(1));
      addLog(`Added 1 second, total: ${state.game.totalPlayTime + 1}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, store]);

  // Start test
  const startTest = () => {
    setIsRunning(true);
    addLog('Test started');
  };

  // Stop test
  const stopTest = () => {
    setIsRunning(false);
    addLog('Test stopped');
  };

  // Reset test
  const resetTest = () => {
    store.dispatch({ type: 'game/resetGame' });
    setCurrentTime(0);
    setIsRunning(false);
    setLog(['Test reset']);
  };

  // Add time manually
  const addTimeManually = (seconds: number) => {
    store.dispatch(addPlayTime(seconds));
    const state = store.getState();
    setCurrentTime(state.game.totalPlayTime);
    addLog(`Manually added ${seconds}s, total: ${state.game.totalPlayTime}s`);
  };

  return (
    <Provider store={store}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          fontFamily: 'monospace',
          backgroundColor: '#27252D',
          color: '#B09E9E',
          borderRadius: '4px',
        }}
      >
        <h1 style={{ color: '#B195D8' }}>Game Time Test</h1>

        <div style={{ marginBottom: '20px' }}>
          <h2>Current Time: {formatTime(currentTime)}</h2>
          <p>Is Running: {isRunning ? 'Yes' : 'No'}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={startTest}
            disabled={isRunning}
            style={{
              backgroundColor: '#64A79F',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              marginRight: '10px',
              borderRadius: '4px',
              cursor: isRunning ? 'default' : 'pointer',
              opacity: isRunning ? 0.5 : 1,
            }}
          >
            Start Test
          </button>

          <button
            onClick={stopTest}
            disabled={!isRunning}
            style={{
              backgroundColor: '#ff5555',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              marginRight: '10px',
              borderRadius: '4px',
              cursor: !isRunning ? 'default' : 'pointer',
              opacity: !isRunning ? 0.5 : 1,
            }}
          >
            Stop Test
          </button>

          <button
            onClick={resetTest}
            style={{
              backgroundColor: '#B195D8',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
            }}
          >
            Reset Test
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Add Time Manually</h3>
          <button
            onClick={() => addTimeManually(1)}
            style={{
              backgroundColor: '#64A79F',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              marginRight: '10px',
              borderRadius: '4px',
            }}
          >
            Add 1s
          </button>

          <button
            onClick={() => addTimeManually(5)}
            style={{
              backgroundColor: '#64A79F',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              marginRight: '10px',
              borderRadius: '4px',
            }}
          >
            Add 5s
          </button>

          <button
            onClick={() => addTimeManually(30)}
            style={{
              backgroundColor: '#64A79F',
              color: '#15131A',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
            }}
          >
            Add 30s
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Test Log</h3>
          <div
            style={{
              height: '300px',
              overflowY: 'auto',
              backgroundColor: '#202020',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            {log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default ManualTest;
