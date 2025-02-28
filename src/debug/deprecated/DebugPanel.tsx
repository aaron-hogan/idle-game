import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { selectTotalPlayTime, selectGameTimeScale } from '../state/selectors';
import { GameLoop } from '../core/GameLoop';
import { setTotalPlayTime } from '../state/gameSlice';

/**
 * Debug panel for game development
 */
const DebugPanel: React.FC = () => {
  // Get data from Redux store
  const gameTime = useAppSelector(selectTotalPlayTime);
  const gameTimeScale = useAppSelector(selectGameTimeScale);
  const dispatch = useAppDispatch();

  // Local state
  const [startTime] = useState(performance.now() / 1000);
  const [stats, setStats] = useState({
    fps: 0,
    gameLoopTime: 0,
    realTime: 0,
    timeRatio: 0,
    timeScale: 0,
    lastUpdate: performance.now() / 1000,
  });

  // Sync Redux time with timer
  const handleSyncTime = useCallback(() => {
    try {
      const gameLoop = GameLoop.getInstance();
      const gameTimer = gameLoop.getGameTimer();
      const timerTime = gameTimer.getTotalGameTime();

      dispatch(setTotalPlayTime(timerTime));
    } catch (error) {
      console.error('Error syncing time:', error);
    }
  }, [dispatch]);

  // Reset time scale to 1.0
  const handleResetTimeScale = useCallback(() => {
    try {
      const gameLoop = GameLoop.getInstance();
      gameLoop.setTimeScale(1.0);

      if (gameLoop.isRunning()) {
        gameLoop.stop();
        setTimeout(() => gameLoop.start(), 50);
      }
    } catch (error) {
      console.error('Error resetting time scale:', error);
    }
  }, []);

  // Update stats every 200ms
  useEffect(() => {
    const updateInterval = setInterval(() => {
      try {
        // Get current time
        const now = performance.now() / 1000;
        const realTimeElapsed = now - startTime;

        // Get GameLoop stats
        const gameLoop = GameLoop.getInstance();
        const loopStats = gameLoop.getStats();
        const gameTimer = gameLoop.getGameTimer();

        // Get timer time from game timer directly
        const timerTime = gameTimer.getTotalGameTime();

        // Calculate time ratio using timer time instead of game time
        const actualTimeRatio = realTimeElapsed > 0 ? timerTime / realTimeElapsed : gameTimeScale;

        // Update stats
        setStats({
          fps: loopStats.fps,
          gameLoopTime: timerTime,
          realTime: realTimeElapsed,
          timeRatio: actualTimeRatio,
          timeScale: loopStats.timeScale,
          lastUpdate: now,
        });
      } catch (error) {
        console.error('Error updating debug stats:', error);
      }
    }, 200);

    return () => clearInterval(updateInterval);
  }, [gameTimeScale, startTime]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        width: '240px',
      }}
    >
      <div style={{ marginBottom: '8px', borderBottom: '1px solid #555', paddingBottom: '5px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Game Debug</span>
        <span
          style={{
            float: 'right',
            color: Math.abs(stats.timeRatio - 1.0) < 0.1 ? '#4caf50' : '#ff5252',
            fontWeight: 'bold',
          }}
        >
          {stats.timeRatio.toFixed(3)}x
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', rowGap: '4px' }}>
        <div>Real Time:</div>
        <div>{stats.realTime.toFixed(1)}s</div>

        <div>Game Time:</div>
        <div>{gameTime.toFixed(1)}s</div>

        <div>Time Scale:</div>
        <div>{stats.timeScale.toFixed(2)}x</div>

        <div>FPS:</div>
        <div>{stats.fps.toFixed(1)}</div>
      </div>

      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={handleResetTimeScale}
          style={{
            padding: '3px 8px',
            fontSize: '11px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Reset Scale
        </button>

        <button
          onClick={handleSyncTime}
          style={{
            padding: '3px 8px',
            fontSize: '11px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Sync Time
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;
