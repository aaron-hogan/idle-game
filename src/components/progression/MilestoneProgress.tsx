/**
 * Enhanced component for displaying milestone progress with resource contributions and visual feedback
 */
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useMemoSelector } from '../../state/hooks';
import { Milestone, RewardType } from '../../interfaces/progression';
import { allMilestones } from '../../data/progression/milestones';
import './MilestoneProgress.css';
import { Resource } from '../../models/resource';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';

interface ResourceRequirement {
  resourceId: string;
  resourceName: string;
  currentAmount: number;
  requiredAmount: number;
  progress: number;
  perSecond: number;
  timeToComplete: number | null;
}

interface MilestoneRequirements {
  milestone: Milestone;
  resources: ResourceRequirement[];
  overallProgress: number;
}

interface MilestoneProgressProps {
  /** Maximum number of milestones to show at once */
  limit?: number;
  /** Whether to display milestones in a horizontal layout */
  horizontalLayout?: boolean;
}

interface CompletedMilestone {
  id: string;
  name: string;
  timeVisible: number;
}

/**
 * Component to display detailed milestone progress with resource contributions
 * and visual feedback for milestone completion
 */
const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  limit = 3,
  horizontalLayout = false,
}) => {
  // Track completed milestones for animations
  const [completedMilestones, setCompletedMilestones] = useState<CompletedMilestone[]>([]);
  // Previously completed milestone IDs to detect new completions
  const [prevCompletedIds, setPrevCompletedIds] = useState<string[]>([]);
  // Get resources from state with our enhanced memoized selector
  const resources = useMemoSelector((state: RootState) => state.resources);
  const progression = useMemoSelector((state: RootState) => state.progression);

  // Check for newly completed milestones and show notifications
  useEffect(() => {
    if (!progression?.milestones) return;

    // Get currently completed milestone IDs
    const currentCompletedIds = Object.keys(progression.milestones).filter(
      (id) => progression.milestones[id]?.completed
    );

    // Find newly completed milestones (completed now but weren't before)
    const newlyCompletedIds = currentCompletedIds.filter((id) => !prevCompletedIds.includes(id));

    // Add notifications for newly completed milestones
    if (newlyCompletedIds.length > 0) {
      const newCompletions = newlyCompletedIds.map((id) => {
        // Find milestone details
        const milestone = allMilestones.find((m) => m.id === id);
        return {
          id,
          name: milestone?.name || 'Unknown Milestone',
          timeVisible: Date.now(),
        };
      });

      // Add new completions to the list
      setCompletedMilestones((prev) => [...prev, ...newCompletions]);
    }

    // Update previous completed IDs for next comparison
    setPrevCompletedIds(currentCompletedIds);

    // Clean up old notifications (older than 5 seconds)
    const currentTime = Date.now();
    setCompletedMilestones((prev) => prev.filter((m) => currentTime - m.timeVisible < 5000));
  }, [progression?.milestones]);

  // Get the progression manager instance
  const progressionManager = useMemo(() => {
    return ProgressionManager.getInstance();
  }, []);

  // Helper function to get icon for reward type
  const getRewardIcon = (rewardType: RewardType) => {
    switch (rewardType) {
      case 'resource':
        return '📦';
      case 'boost':
        return '🚀';
      case 'multiplier':
        return '✖️';
      case 'unlockFeature':
        return '🔓';
      default:
        return '🎁';
    }
  };

  // Calculate progress for each milestone using the progression manager
  const milestonesWithProgress = useMemo(() => {
    const result: MilestoneRequirements[] = [];

    // Process each milestone
    allMilestones.forEach((milestone) => {
      // Skip if already completed
      if (progression?.milestones?.[milestone.id]?.completed) {
        return;
      }

      const resourceReqs: ResourceRequirement[] = [];

      // Process each requirement in the milestone for display
      milestone.requirements.forEach((req) => {
        // Only display resource amount requirements, not maintenance requirements
        if (
          req.type === 'resourceAmount' &&
          !req.maintenance &&
          req.target &&
          resources[req.target]
        ) {
          const resource = resources[req.target] as Resource;
          const currentAmount = resource.amount;
          const requiredAmount =
            typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());

          // Calculate progress using the standard formula
          const rawProgress = Math.min(100, (currentAmount / requiredAmount) * 100);

          // If resource generation rate is positive, calculate time to completion
          const timeToComplete =
            resource.perSecond > 0
              ? Math.max(0, (requiredAmount - currentAmount) / resource.perSecond)
              : null;

          resourceReqs.push({
            resourceId: req.target || '',
            resourceName: resource.name,
            currentAmount,
            requiredAmount,
            progress: rawProgress,
            perSecond: resource.perSecond,
            timeToComplete,
          });
        }
      });

      // Use the progression manager to calculate overall progress with oppression effects
      const overallProgress = progressionManager.calculateMilestoneProgress(milestone.id);

      result.push({
        milestone,
        resources: resourceReqs,
        overallProgress,
      });
    });

    // Sort by progress (highest first) and limit results
    return result.sort((a, b) => b.overallProgress - a.overallProgress).slice(0, limit);
  }, [resources, progression, progressionManager, limit]);

  // Format time remaining (seconds to HH:MM:SS or MM:SS)
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds === Infinity || isNaN(seconds)) return 'N/A';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  if (milestonesWithProgress.length === 0) {
    return (
      <div className="milestone-progress empty">
        <h3>Next Milestones</h3>
        <p>No available milestones</p>

        {/* Milestone completion notifications */}
        <div className="milestone-notifications">
          {completedMilestones.map((milestone) => (
            <div key={milestone.id} className="milestone-notification">
              <div className="notification-icon">[✓]</div>
              <div className="notification-content">
                <div className="notification-title">MILESTONE COMPLETED</div>
                <div className="notification-name">{milestone.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`milestone-progress ${horizontalLayout ? 'horizontal' : 'vertical'}`}>
      <h3>Next Milestones</h3>

      {/* Milestone list container with layout */}
      <div className="milestone-list-container">
        {/* In-progress milestones */}
        {milestonesWithProgress.map(({ milestone, resources: reqs, overallProgress }) => (
          <div key={milestone.id} className="milestone-card">
            <div className="milestone-header">
              <span className="milestone-name">{milestone.name}</span>
              <span className="milestone-percentage">{Math.floor(overallProgress)}%</span>
            </div>

            <div className="milestone-description">{milestone.description}</div>

            <div className="milestone-progress-bar">
              <div className="milestone-progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>

            {/* Resource requirements with tooltips */}
            <ul className="milestone-requirements">
              {reqs.map((req) => (
                <li
                  key={req.resourceId}
                  className={`resource-requirement ${req.progress >= 100 ? 'completed' : ''}`}
                >
                  <div className="requirement-header">
                    <span>{req.resourceName}</span>
                    <span>
                      {req.currentAmount.toFixed(1)} / {req.requiredAmount.toFixed(1)}
                    </span>
                  </div>

                  <div className="requirement-progress-bar">
                    <div
                      className="requirement-progress-fill"
                      style={{ width: `${req.progress}%` }}
                    />
                  </div>

                  <div className="requirement-info">
                    <span>
                      {req.perSecond > 0 ? '+' : ''}
                      {req.perSecond.toFixed(2)}/sec
                    </span>
                    {req.timeToComplete !== null && (
                      <span>ETA: {formatTimeRemaining(req.timeToComplete)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Display milestone rewards if available */}
            {milestone.rewards && milestone.rewards.length > 0 && (
              <div className="milestone-rewards">
                <h4>Rewards:</h4>
                <ul className="rewards-list">
                  {milestone.rewards.map((reward, index) => (
                    <li key={index} className="reward-item">
                      {getRewardIcon(reward.type)} {reward.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Maintenance requirements warning */}
            {milestone.requirements.some((req) => req.maintenance) && (
              <div className="maintenance-requirements">
                <p className="maintenance-note">
                  ⚠️ Requires minimum resource generation rates to progress
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Milestone completion notifications */}
      <div className="milestone-notifications">
        {completedMilestones.map((milestone) => (
          <div key={milestone.id} className="milestone-notification">
            <div className="notification-icon">[✓]</div>
            <div className="notification-content">
              <div className="notification-title">MILESTONE COMPLETED</div>
              <div className="notification-name">{milestone.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneProgress;
