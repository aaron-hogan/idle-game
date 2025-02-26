import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { formatTime } from '../utils/timeUtils';
import { 
  selectTotalPlayTime, 
  selectIsGameRunning, 
  selectGameTimeScale 
} from '../state/selectors';
import { startGame, stopGame, setGameTimeScale } from '../state/gameSlice';
import Dropdown from './ui/Dropdown';
import './GameTimer.css';
import './ui/Dropdown.css';

interface GameTimerProps {
  className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const totalPlayTime = useAppSelector(selectTotalPlayTime);
  const isRunning = useAppSelector(selectIsGameRunning);
  const gameTimeScale = useAppSelector(selectGameTimeScale);
  const [showControls, setShowControls] = useState(false);
  const timeRateRef = useRef<HTMLSpanElement>(null);
  const [timeRateRect, setTimeRateRect] = useState<DOMRect | null>(null);
  
  // Format the time value for display with consistent width
  const formattedTime = formatTime(totalPlayTime);
  
  // Ensure the timer display is consistent width
  const getConsistentTimeDisplay = (time: string) => {
    // Pad with monospace characters if needed to reduce layout shifts
    return time.padEnd(8, ' '); 
  };
  
  // Toggle game running state
  const toggleGameRunning = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to container
    if (isRunning) {
      dispatch(stopGame());
    } else {
      dispatch(startGame());
    }
  };

  // Handle time scale changes
  const handleTimeScaleChange = (newScale: number) => {
    dispatch(setGameTimeScale(newScale));
    // Keep dropdown open after changing speed
  };

  // Available time scales
  const timeScales = [1, 2, 5, 10];

  // Toggle controls visibility
  const toggleControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Get the dropdown trigger element's position for the portal
    if (timeRateRef.current) {
      setTimeRateRect(timeRateRef.current.getBoundingClientRect());
    }
    setShowControls(!showControls);
  };

  // Close controls
  const closeControls = () => {
    setShowControls(false);
  };

  return (
    <div className={`game-timer ${className}`}>
      <div className="time-container">
        <div className="time-display">
          {/* Pause/play icon replaces hourglass */}
          <button 
            className="play-pause-button"
            onClick={toggleGameRunning}
            aria-label={isRunning ? 'Pause Game' : 'Resume Game'}
          >
            {isRunning ? '⏸' : '▶'}
          </button>
          
          {/* Main time value */}
          <span className="time-value">{getConsistentTimeDisplay(formattedTime)}</span>
          
          {/* Speed indicator - clickable to show dropdown */}
          <span 
            ref={timeRateRef}
            className={`time-rate dropdown-trigger ${gameTimeScale > 1 ? 'active' : ''}`}
            onClick={toggleControls}
            title="Click to change game speed"
          >
            {gameTimeScale}x ⏱
          </span>
        </div>
        
        {/* Portal-based dropdown controls */}
        <Dropdown
          isOpen={showControls}
          onClose={closeControls}
          triggerRect={timeRateRect}
          position="bottom-right"
          className="time-controls-dropdown"
        >
          <div className="dropdown-header">Game Speed</div>
          <div className="dropdown-group">
            {timeScales.map(scale => (
              <button
                key={scale}
                className={`dropdown-item ${gameTimeScale === scale ? 'active' : ''}`}
                onClick={() => handleTimeScaleChange(scale)}
              >
                {scale}x
              </button>
            ))}
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default GameTimer;