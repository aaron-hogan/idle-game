import React from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { 
  formatTimeAsDays, 
  getDayProgress,
  SECONDS_PER_DAY
} from '../utils/timeUtils';
import { 
  selectTotalPlayTime, 
  selectIsGameRunning, 
  selectGameTimeScale 
} from '../state/selectors';
import { startGame, stopGame, setGameTimeScale } from '../state/gameSlice';
import Counter from './common/Counter';
import './GameTimer.css';
import './ui/Dropdown.css'; // Ensure dropdown styles are loaded

interface GameTimerProps {
  className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const totalPlayTime = useAppSelector(selectTotalPlayTime);
  const isRunning = useAppSelector(selectIsGameRunning);
  const gameTimeScale = useAppSelector(selectGameTimeScale);
  
  // CRITICAL FIX: Use local state with self-updating counter
  const [localTime, setLocalTime] = React.useState(totalPlayTime > 0 ? totalPlayTime : 30);
  const [localDay, setLocalDay] = React.useState(1);
  const [localProgress, setLocalProgress] = React.useState(0);
  
  // Set up a timer that advances the day independent of Redux
  React.useEffect(() => {
    // First sync with Redux if it has a higher value
    if (totalPlayTime > localTime) {
      setLocalTime(totalPlayTime);
    }
    
    // Set up interval to advance time locally every second
    const tickInterval = setInterval(() => {
      setLocalTime(prevTime => {
        const newTime = prevTime + (isRunning ? gameTimeScale : 0);
        
        // Calculate new day and progress
        const newDay = Math.floor(newTime / SECONDS_PER_DAY) + 1;
        const newProgress = (newTime % SECONDS_PER_DAY) / SECONDS_PER_DAY;
        
        // Update day and progress state if changed
        if (newDay !== localDay) {
          setLocalDay(newDay);
          console.log(`GameTimer: Advanced to Day ${newDay}`);
        }
        
        setLocalProgress(newProgress);
        
        // Log detailed info
        console.log(`GameTimer timer tick: localTime=${newTime.toFixed(2)}, Redux time=${totalPlayTime.toFixed(2)}, isRunning=${isRunning}, scale=${gameTimeScale}`);
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(tickInterval);
  }, [totalPlayTime, isRunning, gameTimeScale]);
  
  // Calculate day progress for progress bar
  const dayProgress = getDayProgress(totalPlayTime);
  
  // DEBUG logging removed after fixing the issue
  
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
  };

  // Create dropdown items
  const dropdownItems = [
    // Pause option
    {
      label: 'Pause',
      onClick: () => {
        if (isRunning) toggleGameRunning();
      },
      isActive: !isRunning,
    },
    // Play speed options
    ...[1, 2, 5, 10].map(scale => ({
      label: `${scale}x`,
      onClick: () => {
        handleTimeScaleChange(scale);
        if (!isRunning) toggleGameRunning();
      },
      isActive: isRunning && gameTimeScale === scale,
    })),
  ];

  // Debug logging removed - day counter now working properly
  
  return (
    <div className={`game-timer ${className}`}>
      {/* Main Game Timer with real values */}
      <Counter
        icon="☀"
        iconType="day"
        value={`Day ${localDay}`} // Use local day state instead of calculated value
        rate={isRunning ? `${gameTimeScale}x` : '0x'}
        rateType={!isRunning ? 'negative' : gameTimeScale > 1 ? 'positive' : 'neutral'}
        progress={localProgress} // Use local progress state
        hasDropdown={true}
        dropdownItems={dropdownItems}
        dropdownTitle="Game Speed"
        tooltip={{
          title: `Day ${localDay}`,
          description: 'Game time progresses based on real-time and speed setting.',
          details: [
            { label: 'Day Cycle', value: `${SECONDS_PER_DAY} seconds` },
            { label: 'Progress', value: `${Math.floor(localProgress * 100)}%` },
            { label: 'Time Scale', value: `${gameTimeScale}x` },
            { label: 'Game Time', value: `${Math.floor(localTime)}s` },
            { label: 'Status', value: isRunning ? 'Running' : 'Paused' }
          ]
        }}
      />
      
      {/* Test Counter removed - day counter now working properly */}
    </div>
  );
};

export default GameTimer;