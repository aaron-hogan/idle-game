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
  
  // Calculate day progress for progress bar
  const dayProgress = getDayProgress(totalPlayTime);
  
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

  return (
    <div className={`game-timer ${className}`}>
      <Counter
        icon="☀"
        iconType="day"
        value={`Day ${formatTimeAsDays(totalPlayTime).replace('Day ', '')}`}
        rate={isRunning ? `${gameTimeScale}x` : '0x'}
        rateType={!isRunning ? 'negative' : gameTimeScale > 1 ? 'positive' : 'neutral'}
        progress={dayProgress}
        hasDropdown={true}
        dropdownItems={dropdownItems}
        dropdownTitle="Game Speed"
        tooltip={{
          title: formatTimeAsDays(totalPlayTime),
          description: 'Game time progresses based on real-time and speed setting.',
          details: [
            { label: 'Day Cycle', value: `${SECONDS_PER_DAY} seconds` },
            { label: 'Progress', value: `${Math.floor(dayProgress * 100)}%` },
            { label: 'Time Scale', value: `${gameTimeScale}x` },
            { label: 'Status', value: isRunning ? 'Running' : 'Paused' }
          ]
        }}
      />
    </div>
  );
};

export default GameTimer;