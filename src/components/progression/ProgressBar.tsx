import React from 'react';
import { useSelector } from 'react-redux';
import { useMemoSelector } from '../../state/hooks';
import { 
  selectCurrentStage, 
  selectCompletionPercentage 
} from '../../redux/progressionSlice';
import './ProgressBar.css';

interface ProgressBarProps {
  /** Optional custom completion percentage (overrides state value) */
  completionPercentage?: number;
  /** Optional custom stage name (overrides state value) */
  currentStage?: string;
  /** Whether to show a decreasing (negative) progress */
  isNegative?: boolean;
}

/**
 * Thin progress bar showing overall game completion or victory progress
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  completionPercentage: customPercentage,
  currentStage: customStage,
  isNegative = false
}) => {
  // Get values from Redux state if not provided as props, using our enhanced memoized selector
  const stateCompletionPercentage = useMemoSelector(selectCompletionPercentage);
  const stateCurrentStage = useMemoSelector(selectCurrentStage);
  
  // Use custom values if provided, otherwise use state values
  const completionPercentage = customPercentage !== undefined 
    ? customPercentage 
    : stateCompletionPercentage;
    
  const currentStage = customStage || stateCurrentStage || 'Starting Out';
  const formattedStage = currentStage.charAt(0).toUpperCase() + currentStage.slice(1);
  
  // Ensure percentage is within bounds
  const clampedPercentage = Math.min(Math.max(completionPercentage, 0), 100);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div 
          className={`progress-bar-fill ${isNegative ? 'negative' : 'positive'}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      <div className="progress-text">
        <span className="progress-label">{isNegative ? 'Oppression' : 'Progress'}</span>
        <span className="progress-percentage">{clampedPercentage.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;