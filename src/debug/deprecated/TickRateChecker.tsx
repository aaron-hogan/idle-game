import React, { useEffect, useState } from 'react';
import { GameLoop } from '../core/GameLoop';
import { useAppSelector } from '../state/hooks';
import { selectTotalPlayTime, selectGameTimeScale } from '../state/selectors';

/**
 * A simple component that tracks and displays game loop metrics
 * to help debug timing issues.
 */
const TickRateChecker: React.FC = () => {
  // Use Redux selectors to get game state
  const gameTime = useAppSelector(selectTotalPlayTime);
  const gameTimeScale = useAppSelector(selectGameTimeScale);

  // Local state for loop stats
  const [stats, setStats] = useState({
    tickRate: 0,
    tickCount: 0,
    fps: 0,
    timeScale: 1.0,
    timeRatio: 1.0,
    realTime: 0,
    gameTime: 0,
  });

  useEffect(() => {
    // Set up interval to update stats every 500ms
    const intervalId = setInterval(() => {
      try {
        // Get stats directly from game loop
        const gameLoop = GameLoop.getInstance();
        const loopStats = gameLoop.getStats();

        // Get timer from game loop
        const gameTimer = gameLoop.getGameTimer();

        setStats({
          tickRate: loopStats.tickRate,
          tickCount: loopStats.tickCount,
          fps: loopStats.fps,
          timeScale: loopStats.timeScale,
          timeRatio: loopStats.timeRatio,
          realTime: gameTimer.getRealTimeSinceStart(),
          gameTime: gameTimer.getTotalGameTime(),
        });
      } catch (error) {
        console.error('Error updating tick rate stats', error);
      }
    }, 500);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000,
        maxWidth: '300px',
      }}
    >
      <div style={{ borderBottom: '1px solid #666', paddingBottom: '4px', marginBottom: '4px' }}>
        <strong>Game Timer Metrics</strong>
      </div>
      <div>Tick Rate: {stats.tickRate.toFixed(1)}Hz</div>
      <div>FPS: {stats.fps.toFixed(1)}</div>
      <div>Time Scale: {stats.timeScale.toFixed(2)}x</div>
      <div>Real Time: {stats.realTime.toFixed(1)}s</div>
      <div>Game Time: {stats.gameTime.toFixed(1)}s</div>
      <div>Redux Time: {gameTime.toFixed(1)}s</div>
      <div
        style={{
          color: stats.timeRatio > 0.95 && stats.timeRatio < 1.05 ? '#4caf50' : '#ff5252',
          fontWeight: 'bold',
        }}
      >
        Time Ratio: {stats.timeRatio.toFixed(2)}x {stats.timeRatio > 0 ? '(expected: 1.00x)' : ''}
      </div>
    </div>
  );
};

export default TickRateChecker;
