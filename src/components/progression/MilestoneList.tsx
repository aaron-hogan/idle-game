/**
 * Component for displaying a list of milestones
 */
import React, { memo, useMemo } from 'react';
import { Milestone, GameStage, MilestoneType } from '../../interfaces/progression';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';

/**
 * Mapping of milestone types to display names
 */
const milestoneTypeNames: Record<MilestoneType, string> = {
  [MilestoneType.RESOURCE]: 'Resource',
  [MilestoneType.ORGANIZATION]: 'Organization',
  [MilestoneType.MOVEMENT]: 'Movement',
  [MilestoneType.AWARENESS]: 'Awareness',
  [MilestoneType.RESISTANCE]: 'Resistance',
  [MilestoneType.TRANSFORMATION]: 'Transformation',
  [MilestoneType.SPECIAL]: 'Special',
};

/**
 * Props for the MilestoneList component
 */
interface MilestoneListProps {
  /** List of milestones to display */
  milestones: Milestone[];
  /** Current game stage */
  currentStage: GameStage;
  /** Class name for additional styling */
  className?: string;
}

/**
 * Component to display a list of milestones with completion status
 * Wrapped in memo to prevent unnecessary re-renders
 */
const MilestoneList: React.FC<MilestoneListProps> = memo(
  ({ milestones, currentStage, className = '' }) => {
    // Sort milestones by stage and then by order
    // Use useMemo to avoid re-sorting on every render
    const sortedMilestones = useMemo(() => {
      return [...milestones].sort((a, b) => {
        if (a.stage !== b.stage) {
          // Sort by stage first (EARLY, MID, LATE, END_GAME)
          const stageOrder = {
            [GameStage.EARLY]: 1,
            [GameStage.MID]: 2,
            [GameStage.LATE]: 3,
            [GameStage.END_GAME]: 4,
          };
          return stageOrder[a.stage] - stageOrder[b.stage];
        }

        // If same stage, sort by order property
        return a.order - b.order;
      });
    }, [milestones]);

    // Get current stage milestones and future milestones
    // Use useMemo to avoid re-filtering on every render
    const { currentStageMilestones, futureMilestones } = useMemo(() => {
      const currentStageItems = sortedMilestones.filter(
        (milestone) => milestone.stage === currentStage
      );

      const stageOrder = {
        [GameStage.EARLY]: 1,
        [GameStage.MID]: 2,
        [GameStage.LATE]: 3,
        [GameStage.END_GAME]: 4,
      };

      const futureItems = sortedMilestones.filter(
        (milestone) => stageOrder[milestone.stage] > stageOrder[currentStage]
      );

      return {
        currentStageMilestones: currentStageItems,
        futureMilestones: futureItems,
      };
    }, [sortedMilestones, currentStage]);

    // Get progression manager instance
    const progressionManager = ProgressionManager.getInstance();

    // Handle clicking on a milestone to attempt to complete it
    const handleMilestoneClick = (milestone: Milestone) => {
      if (milestone.completed) return;

      const canComplete = progressionManager.canCompleteMilestone(milestone.id);

      if (canComplete) {
        progressionManager.completeMilestone(milestone.id);
      } else {
        // TODO: Show a notification explaining why the milestone can't be completed
        console.log(`Cannot complete milestone: ${milestone.name} - requirements not met`);
      }
    };

    // Get completion percentage for current stage
    const currentStageCompletionPercentage =
      progressionManager.getCurrentStageCompletionPercentage();

    if (milestones.length === 0) {
      return (
        <div className={`milestone-list empty ${className}`}>
          <h3>Milestones</h3>
          <p>No milestones available yet.</p>
        </div>
      );
    }

    return (
      <div className={`milestone-list ${className}`}>
        <h3>Milestones</h3>

        <div className="stage-progress">
          <p>Current Stage Progress: {currentStageCompletionPercentage}%</p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${currentStageCompletionPercentage}%` }}
            />
          </div>
        </div>

        <div className="milestone-section">
          <h4>Current Stage Milestones</h4>
          {currentStageMilestones.length === 0 ? (
            <p>No milestones available for the current stage.</p>
          ) : (
            <ul className="milestone-list-items">
              {currentStageMilestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className={`milestone-item ${milestone.completed ? 'completed' : ''}`}
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="milestone-header">
                    <h5>{milestone.name}</h5>
                    <span className="milestone-type">{milestoneTypeNames[milestone.type]}</span>
                  </div>
                  <p className="milestone-description">{milestone.description}</p>
                  <div className="milestone-status">
                    {milestone.completed ? (
                      <span className="completed-badge">Completed</span>
                    ) : (
                      <span className="incomplete-badge">In Progress</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {futureMilestones.length > 0 && (
          <div className="milestone-section future">
            <h4>Future Milestones</h4>
            <ul className="milestone-list-items">
              {futureMilestones.map((milestone) => (
                <li key={milestone.id} className="milestone-item future">
                  <div className="milestone-header">
                    <h5>{milestone.name}</h5>
                    <span className="milestone-type">{milestoneTypeNames[milestone.type]}</span>
                  </div>
                  <p className="milestone-description">{milestone.description}</p>
                  <div className="milestone-status">
                    <span className="future-badge">Future Milestone</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

// Add display name for debugging
MilestoneList.displayName = 'MilestoneList';

export default MilestoneList;
