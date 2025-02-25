/**
 * Simplified component for tracking and displaying progression information
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentStage, 
  selectVisibleMilestones,
  selectCompletionPercentage
} from '../../redux/progressionSlice';
import MilestoneProgress from './MilestoneProgress';

/**
 * Stripped down component for tracking and displaying game progression
 */
const ProgressionTracker: React.FC = () => {
  const currentStage = useSelector(selectCurrentStage);
  const visibleMilestones = useSelector(selectVisibleMilestones);
  const completionPercentage = useSelector(selectCompletionPercentage);
  
  return (
    <div className="bare-progression-tracker">
      <h2>Progress</h2>
      
      <div className="stage-indicator">
        <span className="stage-label">Current Stage:</span>
        <span className="stage-value">{currentStage?.name || 'Starting Out'}</span>
      </div>
      
      <div className="completion-percentage">
        <span className="progress-label">Overall Progress:</span>
        <span className="progress-value">{completionPercentage}%</span>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <MilestoneProgress limit={2} />
    </div>
  );
};

export default ProgressionTracker;