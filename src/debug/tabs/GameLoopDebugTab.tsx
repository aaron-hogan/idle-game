import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { selectTotalPlayTime, selectGameTimeScale } from '../../state/selectors';
import { setTotalPlayTime } from '../../state/gameSlice';
import { GameLoop } from '../../core/GameLoop';
import MetricsPanel, { MetricItem } from '../components/MetricsPanel';
import { SECONDS_PER_DAY } from '../../utils/timeUtils';

/**
 * Game Loop debugging tab
 */
const GameLoopDebugTab: React.FC = () => {
  // Redux state
  const gameTime = useAppSelector(selectTotalPlayTime);
  const gameTimeScale = useAppSelector(selectGameTimeScale);
  const dispatch = useAppDispatch();
  
  // Local state
  const [startTime] = useState(performance.now() / 1000);
  const [tickRate, setTickRate] = useState(1);
  const [stats, setStats] = useState({
    fps: 0,
    gameLoopTime: 0,
    realTime: 0,
    timeRatio: 0,
    timeScale: 0,
    lastUpdate: performance.now() / 1000
  });

  // Sync Redux time with timer
  const handleSyncTime = useCallback(() => {
    try {
      const gameLoop = GameLoop.getInstance();
      const gameTimer = gameLoop.getGameTimer();
      const timerTime = gameTimer.getTotalGameTime();
      
      dispatch(setTotalPlayTime(timerTime));
    } catch (error) {
      console.error("Error syncing time:", error);
    }
  }, [dispatch]);

  // Reset time scale to 1.0
  const handleResetTimeScale = useCallback(() => {
    try {
      const gameLoop = GameLoop.getInstance();
      gameLoop.setTimeScale(1.0);
      setTickRate(1.0);
      
      if (gameLoop.isRunning()) {
        gameLoop.stop();
        setTimeout(() => gameLoop.start(), 50);
      }
    } catch (error) {
      console.error("Error resetting time scale:", error);
    }
  }, []);

  // Handle tick rate change
  const handleTickRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTickRate = parseFloat(event.target.value);
    setTickRate(newTickRate);
    
    try {
      const gameLoop = GameLoop.getInstance();
      gameLoop.setTimeScale(newTickRate);
      
      if (gameLoop.isRunning()) {
        gameLoop.stop();
        setTimeout(() => gameLoop.start(), 50);
      }
    } catch (error) {
      console.error("Error changing tick rate:", error);
    }
  };

  // Update stats more frequently (60fps) for smoother display
  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = performance.now();
    
    const updateStats = (time: number) => {
      try {
        // Throttle updates to approximately 60fps (16.7ms)
        if (time - lastUpdateTime >= 16) {
          lastUpdateTime = time;
          
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
          const actualTimeRatio = realTimeElapsed > 0 ? 
            timerTime / realTimeElapsed : 
            gameTimeScale;
          
          // Update stats
          setStats({
            fps: loopStats.fps,
            gameLoopTime: timerTime,
            realTime: realTimeElapsed,
            timeRatio: actualTimeRatio,
            timeScale: loopStats.timeScale,
            lastUpdate: now
          });
        }
        
        // Continue animation loop
        animationFrameId = requestAnimationFrame(updateStats);
      } catch (error) {
        console.error("Error updating debug stats:", error);
        animationFrameId = requestAnimationFrame(updateStats);
      }
    };
    
    // Start animation frame loop
    animationFrameId = requestAnimationFrame(updateStats);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameTimeScale, startTime]);

  // Import the same constant used by the GameTimer component
  const secondsPerDay = SECONDS_PER_DAY; // From timeUtils.ts (60 seconds)
  
  // Initialize day tracking variables
  let currentDay = 1;
  let dayProgress = 0;
  
  // We'll set these in real-time during the render phase
  
  // Generate metrics for display
  const timeMetrics: MetricItem[] = [
    { 
      name: "Real Time", 
      value: stats.realTime,
      status: 'neutral'
    },
    { 
      name: "Game Time", 
      value: gameTime,
      status: 'neutral'
    },
    { 
      name: "Current Day", 
      value: currentDay,
      status: 'special'
    },
    { 
      name: "Day Progress", 
      value: `${(dayProgress * 100).toFixed(1)}%`,
      status: 'neutral'
    },
    { 
      name: "Time Ratio", 
      value: stats.timeRatio,
      status: Math.abs(stats.timeRatio - 1.0) < 0.1 ? 'good' : 
              Math.abs(stats.timeRatio - 1.0) < 0.2 ? 'warning' : 'bad'
    },
    { 
      name: "Time Scale", 
      value: stats.timeScale,
      status: 'neutral'
    },
    { 
      name: "FPS", 
      value: stats.fps,
      status: stats.fps > 55 ? 'good' : 
              stats.fps > 30 ? 'warning' : 'bad'
    }
  ];
  
  // Generate additional timing metrics
  const advancedMetrics: MetricItem[] = [
    {
      name: "Ideal Rate",
      value: `${tickRate.toFixed(1)}x`,
      status: 'neutral'
    },
    {
      name: "Actual Rate",
      value: stats.timeRatio,
      status: Math.abs(stats.timeRatio - tickRate) < (tickRate * 0.1) ? 'good' : 
              Math.abs(stats.timeRatio - tickRate) < (tickRate * 0.2) ? 'warning' : 'bad'
    },
    {
      name: "Accuracy",
      value: stats.timeRatio > 0 && tickRate > 0 ? 
        `${(Math.min(stats.timeRatio / tickRate, 2) * 100).toFixed(1)}%` : '0%',
      status: stats.timeRatio > 0 && tickRate > 0 && 
        Math.abs(stats.timeRatio / tickRate - 1) < 0.1 ? 'good' : 
        Math.abs(stats.timeRatio / tickRate - 1) < 0.2 ? 'warning' : 'bad'
    }
  ];

  // Generate day information metrics 
  // Create a special test section to diagnose the issue
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    componentTimestamp: Date.now(),
    timerGameTime: 0,
    localDay: 0,
    localDayProgress: 0,
    reduxTime: gameTime,
    calculatedDay: 0,
    calculatedProgress: 0,
    isDiagnosticMode: true
  });
  
  // Update diagnostics every frame
  React.useEffect(() => {
    if (!diagnosticInfo.isDiagnosticMode) return;
    
    let animationFrameId: number;
    const updateDiagnostics = () => {
      try {
        // Get all possible time sources
        const gameLoop = GameLoop.getInstance();
        const gameTimer = gameLoop.getGameTimer();
        const timerTime = gameTimer.getTotalGameTime();
        
        // GameTimer.tsx now initializes with 0 seconds as we fixed it
        // This aligns with the debug panel's correct values
        
        // Get time values directly from the timer
        const adjustedTime = timerTime;
                
        // Calculate days exactly as GameTimer does
        const calculatedDay = Math.floor(adjustedTime / SECONDS_PER_DAY) + 1;
        const calculatedProgress = (adjustedTime % SECONDS_PER_DAY) / SECONDS_PER_DAY;
        
        // Update diagnostics
        setDiagnosticInfo({
          componentTimestamp: Date.now(),
          timerGameTime: timerTime,
          localDay: calculatedDay,
          localDayProgress: calculatedProgress,
          reduxTime: gameTime,
          calculatedDay,
          calculatedProgress,
          isDiagnosticMode: true
        });
        
        // Log useful diagnostic info occasionally
        if (Math.random() < 0.01) {
          console.log(`DIAGNOSTIC: timer=${timerTime.toFixed(2)}s, ` +
                      `day=${calculatedDay}, ` +
                      `progress=${(calculatedProgress*100).toFixed(1)}%`);
        }
      } catch (error) {
        console.error("Error in diagnostics:", error);
      }
      
      animationFrameId = requestAnimationFrame(updateDiagnostics);
    };
    
    animationFrameId = requestAnimationFrame(updateDiagnostics);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameTime, diagnosticInfo.isDiagnosticMode]);
  
  // Use diagnostic info for metrics display
  const currentDayInfo = diagnosticInfo.localDay;
  const dayProgressInfo = diagnosticInfo.localDayProgress;
  
  const dayMetrics: MetricItem[] = [
    {
      name: "Current Day",
      value: currentDayInfo,
      status: 'special'
    },
    {
      name: "Day Progress",
      value: `${(dayProgressInfo * 100).toFixed(1)}%`,
      status: 'neutral'
    },
    {
      name: "Seconds per Day",
      value: secondsPerDay,
      status: 'neutral'
    },
    {
      name: "Time until next day",
      value: `${((1 - dayProgressInfo) * secondsPerDay).toFixed(1)}s`,
      status: 'neutral'
    },
    {
      name: "Real time until next day",
      value: `${((1 - dayProgressInfo) * secondsPerDay / gameTimeScale).toFixed(1)}s`,
      status: 'neutral'
    },
    // Add raw timer value for debugging
    {
      name: "Raw Game Time",
      value: `${diagnosticInfo.timerGameTime.toFixed(1)}s`,
      status: 'warning'
    },
    {
      name: "Redux Time",
      value: `${gameTime.toFixed(1)}s`,
      status: 'warning'
    }
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Game Loop Statistics</h3>
      
      {/* Day information panel */}
      <MetricsPanel title="Day Information" metrics={dayMetrics} />
      
      {/* Time metrics panel */}
      <MetricsPanel title="Time Metrics" metrics={timeMetrics} />
      
      {/* Advanced metrics panel */}
      <MetricsPanel title="Time Scale Analysis" metrics={advancedMetrics} />
      
      {/* Controls panel */}
      <div className="controls-panel">
        <div className="metrics-panel-title">Tick Rate Control</div>
        
        <div className="slider-container">
          <div className="slider-label">
            <span>Speed: {tickRate.toFixed(1)}x</span>
            <span>{stats.timeRatio.toFixed(2)}x actual</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1" 
            value={tickRate}
            onChange={handleTickRateChange}
            className="slider-input"
          />
        </div>
        
        <div className="button-row">
          <button 
            className="debug-button"
            onClick={handleResetTimeScale}
          >
            Reset Scale
          </button>
          <button 
            className="debug-button primary"
            onClick={handleSyncTime}
          >
            Sync Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLoopDebugTab;