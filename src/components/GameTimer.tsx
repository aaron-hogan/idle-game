import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { 
  formatTimeAsDays, 
  getDayProgress, 
  formatDayWithPadding 
} from '../utils/timeUtils';
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
  
  // Calculate day progress for progress bar
  const dayProgress = getDayProgress(totalPlayTime);
  const progressWidth = `${dayProgress * 100}%`;
  
  // Format the day value with consistent width
  const formattedDay = formatDayWithPadding(totalPlayTime);
  
  // Create tooltip content for the day counter
  const tooltipContent = {
    title: formatTimeAsDays(totalPlayTime),
    description: 'Game time progresses based on real-time and speed setting.',
    details: [
      { label: 'Day Cycle', value: '60 seconds' },
      { label: 'Progress', value: `${Math.floor(dayProgress * 100)}%` },
      { label: 'Time Scale', value: `${gameTimeScale}x` },
      { label: 'Status', value: isRunning ? 'Running' : 'Paused' }
    ]
  };
  
  // Toggle game running state
  const toggleGameRunning = () => {
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

  // Available time scales including pause (0x)
  const timeScales = [0, 1, 2, 5, 10];

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
          {/* Day progress background */}
          <div 
            className="time-progress" 
            style={{ width: progressWidth }}
            aria-hidden="true"
          />
          
          {/* Sun icon for day counter */}
          <span className="day-icon" title="Game Day">☀</span>
          
          {/* Day counter value */}
          <span className="time-value">Day {formattedDay}</span>
          
          {/* Speed indicator - clickable to show dropdown */}
          <span 
            ref={timeRateRef}
            className={`time-rate dropdown-trigger ${!isRunning ? 'negative' : gameTimeScale > 1 ? 'active' : ''}`}
            onClick={toggleControls}
            title="Click to change game speed"
          >
            {isRunning ? `${gameTimeScale}x` : '0x'}
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
            {/* Special pause button */}
            <button
              className={`dropdown-item ${!isRunning ? 'active' : ''}`}
              onClick={() => {
                if (isRunning) toggleGameRunning();
                // Don't close dropdown
              }}
            >
              Pause (0x)
            </button>
            
            {/* Play buttons at different speeds */}
            {timeScales.filter(scale => scale > 0).map(scale => (
              <button
                key={scale}
                className={`dropdown-item ${isRunning && gameTimeScale === scale ? 'active' : ''}`}
                onClick={() => {
                  handleTimeScaleChange(scale);
                  if (!isRunning) toggleGameRunning();
                  // Don't close dropdown
                }}
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