import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { formatTime } from '../utils/timeUtils';
import { 
  selectTotalPlayTime, 
  selectIsGameRunning, 
  selectGameTimeScale 
} from '../state/selectors';
import { startGame, stopGame } from '../state/gameSlice';
import './GameTimer.css';

interface GameTimerProps {
  className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const totalPlayTime = useAppSelector(selectTotalPlayTime);
  const isRunning = useAppSelector(selectIsGameRunning);
  const gameTimeScale = useAppSelector(selectGameTimeScale);
  
  // Format the time value for display
  const formattedTime = formatTime(totalPlayTime);
  
  // Toggle game running state
  const toggleGameRunning = () => {
    if (isRunning) {
      dispatch(stopGame());
    } else {
      dispatch(startGame());
    }
  };

  // Debug logging for time changes is disabled in production
  // Uncomment for troubleshooting if needed
  /*
  useEffect(() => {
    console.log(`GameTimer: totalPlayTime updated to ${totalPlayTime.toFixed(2)}s`);
  }, [totalPlayTime]);
  */

  return (
    <div className={`game-timer ${className}`}>
      <div className="time-display">
        <span className="time-label">TIME:</span>
        <span className="time-value">{formattedTime}</span>
        
        {gameTimeScale !== 1 && (
          <span className="time-scale">(x{gameTimeScale})</span>
        )}
      </div>
      
      <button 
        className={`game-control-button ${isRunning ? 'pause' : 'play'}`}
        onClick={toggleGameRunning}
        aria-label={isRunning ? 'Pause Game' : 'Resume Game'}
      >
        {isRunning ? 'PAUSE' : 'PLAY'}
      </button>
    </div>
  );
};

export default GameTimer;