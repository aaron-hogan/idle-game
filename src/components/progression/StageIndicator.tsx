/**
 * Component for displaying the current game stage
 */
import React, { memo, useMemo } from 'react';
import { GameStage } from '../../interfaces/progression';

/**
 * Mapping of game stages to display names
 */
const stageNames: Record<GameStage, string> = {
  [GameStage.EARLY]: 'Early Organizing',
  [GameStage.MID]: 'Movement Building',
  [GameStage.LATE]: 'System Challenge',
  [GameStage.END_GAME]: 'Transformation',
};

/**
 * Mapping of game stages to descriptions
 */
const stageDescriptions: Record<GameStage, string> = {
  [GameStage.EARLY]: 'Building awareness and initial community connections',
  [GameStage.MID]: 'Creating alternative institutions and organized resistance',
  [GameStage.LATE]: 'Challenging existing structures and building alternatives',
  [GameStage.END_GAME]: 'Fundamental transformation of social relations',
};

/**
 * Props for the StageIndicator component
 */
interface StageIndicatorProps {
  /** Current game stage */
  currentStage: GameStage;
  /** Class name for additional styling */
  className?: string;
}

/**
 * Component to display the current game stage and progress
 * Wrapped in memo to prevent unnecessary re-renders
 */
const StageIndicator: React.FC<StageIndicatorProps> = memo(({ currentStage, className = '' }) => {
  // Calculate how many stages have been completed
  const stageValues = {
    [GameStage.EARLY]: 1,
    [GameStage.MID]: 2,
    [GameStage.LATE]: 3,
    [GameStage.END_GAME]: 4,
  };

  const currentStageValue = stageValues[currentStage];
  const totalStages = Object.keys(GameStage).length;

  return (
    <div className={`stage-indicator ${className}`}>
      <h3>Current Stage: {stageNames[currentStage]}</h3>
      <p className="stage-description">{stageDescriptions[currentStage]}</p>

      <div className="stage-progress">
        {Object.values(GameStage).map((stage) => (
          <div
            key={stage}
            className={`stage-marker ${stageValues[stage as GameStage] <= currentStageValue ? 'completed' : 'incomplete'}`}
          >
            <div className="stage-dot" />
            <span className="stage-label">{stageNames[stage as GameStage]}</span>
          </div>
        ))}
        <div className="stage-connector">
          <div
            className="stage-progress-fill"
            style={{
              width: `${((currentStageValue - 1) / (totalStages - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
StageIndicator.displayName = 'StageIndicator';

export default StageIndicator;
