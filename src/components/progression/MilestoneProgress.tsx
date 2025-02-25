/**
 * Simplified component for displaying milestone progress with resource contributions
 */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Milestone } from '../../interfaces/progression';
import { allMilestones } from '../../data/progression/milestones';

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
}

/**
 * Component to display detailed milestone progress with resource contributions
 */
const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ limit = 3 }) => {
  // Get resources from state
  const resources = useSelector((state: RootState) => state.resources);
  const progression = useSelector((state: RootState) => state.progression);
  
  // Calculate progress for each milestone
  const milestonesWithProgress = useMemo(() => {
    const result: MilestoneRequirements[] = [];
    
    // Process each milestone
    allMilestones.forEach(milestone => {
      // Skip if already completed
      if (progression?.milestones?.[milestone.id]?.completed) {
        return;
      }
      
      const resourceReqs: ResourceRequirement[] = [];
      let totalProgress = 0;
      
      // Process each requirement in the milestone
      milestone.requirements.forEach(req => {
        if (req.type === 'resourceAmount' && resources[req.target]) {
          const resource = resources[req.target];
          const currentAmount = resource.amount;
          const requiredAmount = req.value;
          const progress = Math.min(100, (currentAmount / requiredAmount) * 100);
          
          // If resource generation rate is positive, calculate time to completion
          const timeToComplete = resource.perSecond > 0 
            ? Math.max(0, (requiredAmount - currentAmount) / resource.perSecond)
            : null;
          
          resourceReqs.push({
            resourceId: req.target,
            resourceName: resource.name,
            currentAmount,
            requiredAmount,
            progress,
            perSecond: resource.perSecond,
            timeToComplete
          });
          
          // Add to total progress calculation
          totalProgress += progress;
        }
      });
      
      // Calculate overall progress as average of all requirements
      const overallProgress = resourceReqs.length > 0 
        ? totalProgress / resourceReqs.length 
        : 0;
      
      result.push({
        milestone,
        resources: resourceReqs,
        overallProgress
      });
    });
    
    // Sort by progress (highest first) and limit results
    return result
      .sort((a, b) => b.overallProgress - a.overallProgress)
      .slice(0, limit);
  }, [resources, progression, limit]);
  
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
      <div className="bare-milestone-progress empty">
        <h3>Next Milestones</h3>
        <p>No available milestones</p>
      </div>
    );
  }
  
  return (
    <div className="bare-milestone-progress">
      <h3>Next Milestones</h3>
      {milestonesWithProgress.map(({ milestone, resources: reqs, overallProgress }) => (
        <div key={milestone.id} className="milestone-card">
          <div className="milestone-header">
            <span className="milestone-name">{milestone.name}</span>
            <span className="milestone-percentage">{Math.floor(overallProgress)}%</span>
          </div>
          
          <div className="milestone-progress-bar">
            <div 
              className="milestone-progress-fill" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          <ul className="milestone-requirements">
            {reqs.map(req => (
              <li key={req.resourceId} className="resource-requirement">
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
                  <span>{req.perSecond > 0 ? '+' : ''}{req.perSecond.toFixed(2)}/sec</span>
                  {req.timeToComplete !== null && (
                    <span>ETA: {formatTimeRemaining(req.timeToComplete)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MilestoneProgress;