/**
 * Horizontal milestone strip component that displays completed, active and locked milestones
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Milestone } from '../../interfaces/progression';
import { allMilestones } from '../../data/progression/milestones';
import { Link } from 'react-router-dom';
import './MilestoneProgressStrip.css';

// Status types for visual styling
enum MilestoneStatus {
  COMPLETED = 'completed',
  ACTIVE = 'active',
  LOCKED = 'locked'
}

// Milestone card with processed data for display
interface MilestoneCardData {
  milestone: Milestone;
  status: MilestoneStatus;
  progress: number;
  isVisible: boolean;
}

interface MilestoneProgressStripProps {
  /** Number of milestones to show on each side of the active milestone */
  sideCount?: number;
}

/**
 * Horizontal milestone progression strip that displays the player's journey
 * Shows completed milestones to the left, active in center, and upcoming to the right
 */
const MilestoneProgressStrip: React.FC<MilestoneProgressStripProps> = ({ 
  sideCount = 2
}) => {
  // Get current game state from Redux
  const resources = useSelector((state: RootState) => state.resources);
  const progression = useSelector((state: RootState) => state.progression);
  
  // Reference to the milestone container for scrolling
  const stripRef = useRef<HTMLDivElement>(null);
  
  // State to track the active milestone ID for centering
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  
  // Process all milestones and determine their status
  const milestoneCards = useMemo(() => {
    if (!progression?.milestones) return [];
    
    const result: MilestoneCardData[] = [];
    
    // For each milestone, determine its status and progress
    allMilestones.forEach(milestone => {
      // Skip if not visible yet
      if (!milestone.visible && !progression.milestones[milestone.id]?.completed) {
        return;
      }
      
      // Get completion status from game state
      const isCompleted = progression.milestones[milestone.id]?.completed || false;
      
      // If completed, add with completed status
      if (isCompleted) {
        result.push({
          milestone,
          status: MilestoneStatus.COMPLETED,
          progress: 100,
          isVisible: true
        });
        return;
      }
      
      // Calculate progress for incomplete milestone
      let totalProgress = 0;
      let requirementCount = 0;
      
      milestone.requirements.forEach(req => {
        if (req.type === 'resourceAmount' && req.target && resources[req.target]) {
          const resource = resources[req.target];
          const currentAmount = resource.amount;
          const requiredAmount = typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());
          const progress = Math.min(100, (currentAmount / requiredAmount) * 100);
          
          totalProgress += progress;
          requirementCount++;
        }
      });
      
      const overallProgress = requirementCount > 0 
        ? totalProgress / requirementCount 
        : 0;
      
      // Add to results with appropriate status
      result.push({
        milestone,
        status: overallProgress > 0 ? MilestoneStatus.ACTIVE : MilestoneStatus.LOCKED,
        progress: overallProgress,
        isVisible: true
      });
    });
    
    // Sort by completion status and then by order
    return result.sort((a, b) => {
      // First sort by completion status
      if (a.status === MilestoneStatus.COMPLETED && b.status !== MilestoneStatus.COMPLETED) {
        return -1;
      }
      if (a.status !== MilestoneStatus.COMPLETED && b.status === MilestoneStatus.COMPLETED) {
        return 1;
      }
      
      // Then sort by progress (for active milestones)
      if (a.status === MilestoneStatus.ACTIVE && b.status === MilestoneStatus.ACTIVE) {
        return b.progress - a.progress;
      }
      
      // Finally sort by order
      return a.milestone.order - b.milestone.order;
    });
  }, [resources, progression]);
  
  // Find the active milestone (first non-completed with highest progress)
  const activeMilestone = useMemo(() => {
    const active = milestoneCards.find(card => card.status === MilestoneStatus.ACTIVE);
    return active || null;
  }, [milestoneCards]);
  
  // Update active milestone when it changes
  useEffect(() => {
    if (activeMilestone) {
      setActiveMilestoneId(activeMilestone.milestone.id);
    }
  }, [activeMilestone]);
  
  // Scroll to center active milestone when it changes
  useEffect(() => {
    if (!stripRef.current || !activeMilestoneId) return;
    
    // Find the active milestone element
    const activeMilestoneElement = stripRef.current.querySelector(
      `[data-milestone-id="${activeMilestoneId}"]`
    ) as HTMLElement;
    
    if (activeMilestoneElement) {
      // Calculate the center position
      const containerWidth = stripRef.current.offsetWidth;
      const cardWidth = activeMilestoneElement.offsetWidth;
      const cardLeft = activeMilestoneElement.offsetLeft;
      
      // Scroll to center the card
      stripRef.current.scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    }
  }, [activeMilestoneId]);
  
  // If no milestones to display
  if (milestoneCards.length === 0) {
    return (
      <div className="milestone-progress-strip empty">
        <h3>Milestones</h3>
        <p>No milestones available yet</p>
      </div>
    );
  }
  
  // Find index of active milestone to determine which cards to show
  const activeMilestoneIndex = activeMilestone 
    ? milestoneCards.findIndex(card => card.milestone.id === activeMilestone.milestone.id)
    : 0;
  
  // Calculate range of milestones to display (with side count on each side)
  const startIndex = Math.max(0, activeMilestoneIndex - sideCount);
  const endIndex = Math.min(milestoneCards.length - 1, activeMilestoneIndex + sideCount);
  
  // Get the visible milestone cards
  const visibleMilestones = milestoneCards.slice(startIndex, endIndex + 1);
  
  return (
    <div className="milestone-progress-strip">
      <div className="milestone-strip-header">
        <h3>Community Progress</h3>
        <Link to="/progression" className="view-all-link">View All</Link>
      </div>
      
      <div className="milestone-cards-container" ref={stripRef}>
        {/* Timeline connector line with indicators */}
        <div className="milestone-timeline">
          <div className="timeline-connector"></div>
          {visibleMilestones.map((card, index) => (
            <div 
              key={`dot-${card.milestone.id}`}
              className={`timeline-dot ${card.status}`}
              style={{ left: `${(index / (visibleMilestones.length - 1)) * 100}%` }}
            ></div>
          ))}
        </div>
        
        {/* Milestone cards */}
        <div className="milestone-cards">
          {visibleMilestones.map(card => (
            <div 
              key={card.milestone.id}
              data-milestone-id={card.milestone.id}
              className={`milestone-card ${card.status}`}
            >
              <div className="milestone-state-indicator"></div>
              
              <div className="milestone-content">
                <div className="milestone-header">
                  <span className="milestone-name">{card.milestone.name}</span>
                  {card.status !== MilestoneStatus.COMPLETED && (
                    <span className="milestone-percentage">
                      {Math.floor(card.progress)}%
                    </span>
                  )}
                </div>
                
                <div className="milestone-description">
                  {card.milestone.description}
                </div>
                
                {card.status !== MilestoneStatus.COMPLETED && (
                  <div className="milestone-progress-bar">
                    <div 
                      className="milestone-progress-fill" 
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="milestone-footer">
                  {card.status === MilestoneStatus.COMPLETED && (
                    <span className="milestone-completed-badge">✓ Completed</span>
                  )}
                  
                  {card.status === MilestoneStatus.ACTIVE && (
                    <span className="milestone-active-badge">In Progress</span>
                  )}
                  
                  {card.status === MilestoneStatus.LOCKED && (
                    <span className="milestone-locked-badge">Locked</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation indicators */}
      <div className="milestone-navigation-indicators">
        <div className="navigation-dots">
          {milestoneCards.length > 1 && Array.from({ length: milestoneCards.length }).map((_, idx) => (
            <div 
              key={`nav-${idx}`}
              className={`navigation-dot ${idx === activeMilestoneIndex ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressStrip;