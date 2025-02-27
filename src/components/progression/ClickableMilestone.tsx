/**
 * Component that combines milestone progress display with clickable resource functionality
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useMemoSelector } from '../../state/hooks';
import { RootState } from '../../state/store';
import { Milestone } from '../../interfaces/progression';
import { allMilestones } from '../../data/progression/milestones';
import { ResourceManager } from '../../systems/resourceManager';
import { ResourceId } from '../../constants/resources';
import { ProgressionManager } from '../../managers/progression/ProgressionManager';
import './ClickableMilestone.css';

// Guard against invalid input and improve stability on small screens
const MAX_PROGRESS = 100;
const clamp = (value: number) => Math.min(Math.max(value, 0), MAX_PROGRESS);

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

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
  opacity: number;
}

interface ClickableMilestoneProps {
  /** Maximum number of milestones to show at once */
  limit?: number;
  /** Resource ID to generate when clicked */
  resourceId?: string;
}

/**
 * Component that combines milestone progress display with clickable resource functionality
 */
const ClickableMilestone: React.FC<ClickableMilestoneProps> = ({ 
  limit = 1,
  resourceId = ResourceId.COLLECTIVE_POWER
}) => {
  const dispatch = useAppDispatch();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [nextParticleId, setNextParticleId] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  
  // Get resources from state with our enhanced memoized selector
  const resources = useMemoSelector((state: RootState) => state.resources);
  const progression = useMemoSelector((state: RootState) => state.progression);
  
  // Track completed milestones for animations
  const [completedMilestones, setCompletedMilestones] = useState<{
    id: string;
    name: string;
    timeVisible: number;
  }[]>([]);
  
  // Previously completed milestone IDs to detect new completions
  const [prevCompletedIds, setPrevCompletedIds] = useState<string[]>([]);
  
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
        if (req.type === 'resourceAmount' && req.target && resources[req.target]) {
          const resource = resources[req.target];
          const currentAmount = resource.amount;
          const requiredAmount = typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());
          const progress = Math.min(100, (currentAmount / requiredAmount) * 100);
          
          // If resource generation rate is positive, calculate time to completion
          const timeToComplete = resource.perSecond > 0 
            ? Math.max(0, (requiredAmount - currentAmount) / resource.perSecond)
            : null;
          
          resourceReqs.push({
            resourceId: req.target || '',
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
  
  // Check for newly completed milestones and show notifications
  useEffect(() => {
    if (!progression?.milestones) return;
    
    // Get currently completed milestone IDs
    const currentCompletedIds = Object.keys(progression.milestones)
      .filter(id => progression.milestones[id]?.completed);
    
    // Find newly completed milestones (completed now but weren't before)
    const newlyCompletedIds = currentCompletedIds
      .filter(id => !prevCompletedIds.includes(id));
    
    // Add notifications for newly completed milestones
    if (newlyCompletedIds.length > 0) {
      const newCompletions = newlyCompletedIds.map(id => {
        // Find milestone details
        const milestone = allMilestones.find(m => m.id === id);
        return {
          id,
          name: milestone?.name || 'Unknown Milestone',
          timeVisible: Date.now(),
        };
      });
      
      // Add new completions to the list
      setCompletedMilestones(prev => [...prev, ...newCompletions]);
    }
    
    // Update previous completed IDs for next comparison
    setPrevCompletedIds(currentCompletedIds);
    
    // Clean up old notifications (older than 5 seconds)
    const currentTime = Date.now();
    setCompletedMilestones(prev => 
      prev.filter(m => currentTime - m.timeVisible < 5000));
  }, [progression?.milestones]);
  
  // Handle resource click
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    try {
      // Get click position relative to the element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Get manager instances here, where they should be initialized
      const resourceManager = ResourceManager.getInstance();
      
      // Generate the resource - safely handle errors if not initialized
      let amountAdded = 1;
      try {
        amountAdded = resourceManager.handleResourceClick(resourceId);
      } catch (error) {
        console.error("Error handling resource click:", error);
        // Default to 1 if there's an error
      }
      
      // Create a new particle at the click position
      const newParticle = {
        id: nextParticleId,
        x,
        y,
        value: amountAdded,
        opacity: 1,
      };
      
      // Add the new particle to the list
      setParticles(prevParticles => [...prevParticles, newParticle]);
      setNextParticleId(id => id + 1);
      
      // Set clicking state for button animation
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 100);
      
      // Try to check milestone progress after resource is added
      try {
        const progressionManager = ProgressionManager.getInstance();
        progressionManager.checkMilestoneProgress();
      } catch (error) {
        console.error("Error checking milestone progress:", error);
      }
    } catch (error) {
      console.error("Error in click handler:", error);
    }
  }, [resourceId, nextParticleId]);
  
  // Remove particles after they fade out
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setTimeout(() => {
      setParticles(prevParticles => 
        prevParticles.filter(particle => particle.opacity > 0.1)
          .map(particle => ({
            ...particle,
            y: particle.y - 2, // Move up
            opacity: particle.opacity - 0.02 // Fade out
          }))
      );
    }, 50);
    
    return () => clearTimeout(timer);
  }, [particles]);
  
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
  
  // When there are no milestones in progress
  if (milestonesWithProgress.length === 0) {
    return (
      <div 
        className={`clickable-milestone-container empty ${isClicking ? 'clicking' : ''}`}
        onClick={handleClick}
        style={{
          background: `linear-gradient(90deg, rgba(33, 150, 243, 0.3) 100%, rgba(34, 34, 34, 0.8) 100%)`,
          touchAction: 'manipulation' /* Prevent zoom on double-tap on mobile */
        }}
      >
        <div className="milestone-content">
          <h3>Click to Progress!</h3>
          <p>All current milestones completed</p>
        </div>
        
        {/* Milestone completion notifications */}
        <div className="milestone-notifications">
          {completedMilestones.map(milestone => (
            <div key={milestone.id} className="milestone-notification">
              <div className="notification-icon">[✓]</div>
              <div className="notification-content">
                <div className="notification-title">MILESTONE COMPLETED</div>
                <div className="notification-name">{milestone.name}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Particles that appear on click */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="click-particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
            }}
          >
            +{particle.value.toFixed(1)}
          </div>
        ))}
      </div>
    );
  }
  
  // With in-progress milestones
  const { milestone, resources: reqs, overallProgress } = milestonesWithProgress[0];
  
  // Find the primary resource requirement (for simplified display)
  const primaryReq = reqs.length > 0 ? reqs[0] : null;
  
  return (
    <div 
      className={`clickable-milestone-container ${isClicking ? 'clicking' : ''}`}
      onClick={handleClick}
      style={{
        background: `linear-gradient(90deg, rgba(76, 175, 80, 0.3) ${clamp(overallProgress)}%, rgba(34, 34, 34, 0.8) ${clamp(overallProgress)}%)`,
        touchAction: 'manipulation' /* Prevent zoom on double-tap on mobile */
      }}
    >
      <div className="milestone-content">
        <div className="milestone-header">
          <span className="milestone-name">{milestone.name}</span>
          <span className="milestone-percentage">{Math.floor(clamp(overallProgress))}%</span>
        </div>
        
        <div className="milestone-description">{milestone.description}</div>
        
        {primaryReq && (
          <div className="primary-requirement">
            <div className="requirement-label">
              {primaryReq.resourceName}: {primaryReq.currentAmount.toFixed(1)} / {primaryReq.requiredAmount.toFixed(1)}
            </div>
            {primaryReq.timeToComplete !== null && primaryReq.timeToComplete > 0 && (
              <div className="eta">
                ETA: {formatTimeRemaining(primaryReq.timeToComplete)}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Milestone completion notifications */}
      <div className="milestone-notifications">
        {completedMilestones.map(milestone => (
          <div key={milestone.id} className="milestone-notification">
            <div className="notification-icon">[✓]</div>
            <div className="notification-content">
              <div className="notification-title">MILESTONE COMPLETED</div>
              <div className="notification-name">{milestone.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Particles that appear on click */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="click-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
          }}
        >
          +{particle.value.toFixed(1)}
        </div>
      ))}
    </div>
  );
};

export default ClickableMilestone;