/**
 * Simplified component for tracking and displaying progression information
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentStage, 
  selectCompletionPercentage
} from '../../redux/progressionSlice';
import './ProgressionTracker.css';

/**
 * Streamlined component for tracking and displaying overall game progression
 */
const ProgressionTracker: React.FC = () => {
  const currentStage = useSelector(selectCurrentStage);
  const completionPercentage = useSelector(selectCompletionPercentage);
  
  return (
    <div className="progression-tracker">
      <h3>Overall Progress</h3>
      
      <div className="stage-indicator">
        <span className="stage-label">Current Stage:</span>
        <span className="stage-value">{currentStage ? currentStage.charAt(0).toUpperCase() + currentStage.slice(1) : 'Starting Out'}</span>
      </div>
      
      <div className="completion-percentage">
        <span className="progress-label">Game Completion:</span>
        <span className="progress-value">{completionPercentage}%</span>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressionTracker;