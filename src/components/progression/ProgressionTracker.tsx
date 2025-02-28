/**
 * Simplified component for tracking and displaying progression information
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { useMemoSelector } from '../../state/hooks';
import { selectCurrentStage, selectCompletionPercentage } from '../../redux/progressionSlice';
import './ProgressionTracker.css';
import { GameStage } from '../../interfaces/progression';
import MilestoneProgress from './MilestoneProgress';

// Helper to get readable stage names
const getStageDisplayName = (stage: GameStage): string => {
  const stageNames = {
    [GameStage.EARLY]: 'Early Stage',
    [GameStage.MID]: 'Mid Stage',
    [GameStage.LATE]: 'Late Stage',
    [GameStage.END_GAME]: 'End Game',
  };
  return stageNames[stage] || 'Starting Out';
};

/**
 * Streamlined component for tracking and displaying overall game progression
 */
const ProgressionTracker: React.FC = () => {
  const currentStage = useMemoSelector(selectCurrentStage);
  const completionPercentage = useMemoSelector(selectCompletionPercentage);

  return (
    <div className="progression-tracker">
      <h3>Overall Progress</h3>

      <div className="stage-indicator">
        <span className="stage-label">Current Stage:</span>
        <span className="stage-value">
          {currentStage ? getStageDisplayName(currentStage) : 'Starting Out'}
        </span>
      </div>

      <div className="completion-percentage">
        <span className="progress-label">Game Completion:</span>
        <span className="progress-value">{completionPercentage}%</span>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProgressionTracker;
