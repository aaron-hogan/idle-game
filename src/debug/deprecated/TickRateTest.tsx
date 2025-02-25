import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { selectTotalPlayTime } from '../state/selectors';
import { formatTime } from '../utils/timeUtils';
import { GameLoop } from '../core/GameLoop';

/**
 * TickRateTest component for verifying the game loop runs at the expected rate
 */
const TickRateTest: React.FC = () => {
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [localTimer, setLocalTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testDuration, setTestDuration] = useState<number>(0);
  const [tickRate, setTickRate] = useState<number>(1);
  
  // Get game time from store for comparison
  const gameTime = useAppSelector(selectTotalPlayTime);
  
  // Start a test
  const startTest = () => {
    setTestStartTime(performance.now() / 1000);
    setLocalTimer(0);
    setIsRunning(true);
    setTestDuration(0);
    
    // Get the GameLoop instance and update tick rate
    try {
      const gameLoop = GameLoop.getInstance();
      gameLoop.setTickRate(tickRate);
      
      // Restart the game loop to apply the new tick rate
      if (gameLoop.isRunning()) {
        gameLoop.stop();
        gameLoop.start();
      }
    } catch (error) {
      console.error("Failed to set tick rate:", error);
    }
  };
  
  // Stop the test
  const stopTest = () => {
    setIsRunning(false);
    setTestDuration((performance.now() / 1000) - testStartTime);
  };
  
  // Update local timer when running
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setLocalTimer(prev => prev + 0.1);
    }, 100); // Update 10 times per second
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  // Specify tick rates to test
  const tickRateOptions = [0.5, 1, 2, 5, 10];
  
  return (
    <div style={{ 
      padding: '1rem', 
      margin: '1rem 0', 
      backgroundColor: '#f0f0f0',
      borderRadius: '0.5rem',
      border: '1px solid #ddd' 
    }}>
      <h3>Game Loop Tick Rate Test</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="tickRate">Tick Rate (Hz): </label>
        <select 
          id="tickRate" 
          value={tickRate} 
          onChange={(e) => setTickRate(Number(e.target.value))}
          disabled={isRunning}
        >
          {tickRateOptions.map(rate => (
            <option key={rate} value={rate}>{rate} Hz</option>
          ))}
        </select>
        
        <div style={{ marginTop: '0.5rem' }}>
          <button 
            onClick={isRunning ? stopTest : startTest}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: isRunning ? '#ff4d4d' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            {isRunning ? 'Stop Test' : 'Start Test'}
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <div><strong>Real Time:</strong></div>
          <div>{localTimer.toFixed(1)}s</div>
        </div>
        <div>
          <div><strong>Game Time:</strong></div>
          <div>{gameTime.toFixed(1)}s</div>
        </div>
        <div>
          <div><strong>Ratio:</strong></div>
          <div>{localTimer > 0 ? (gameTime / localTimer).toFixed(2) : '0.00'}</div>
        </div>
      </div>
      
      {!isRunning && testDuration > 0 && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#e0f7fa', borderRadius: '0.25rem' }}>
          <h4>Test Results:</h4>
          <p>Test duration: {testDuration.toFixed(2)}s</p>
          <p>Game time elapsed: {gameTime.toFixed(2)}s</p>
          <p>Expected game time: {(testDuration * tickRate).toFixed(2)}s</p>
          <p>Accuracy: {Math.min(100, (gameTime / (testDuration * tickRate) * 100)).toFixed(1)}%</p>
        </div>
      )}
      
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        <p>
          This test verifies that the game loop is running at the expected tick rate.
          At {tickRate}Hz, game time should progress {tickRate}x faster than real time.
        </p>
      </div>
    </div>
  );
};

export default TickRateTest;