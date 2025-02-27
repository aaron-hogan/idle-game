/**
 * Horizontal milestone strip component that displays completed, active and locked milestones
 * Allows smooth scrolling with active milestone centered in the display
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
    
    // Sort by game progression order (not by completion status)
    // This ensures a consistent left-to-right timeline view
    return result.sort((a, b) => {
      return a.milestone.order - b.milestone.order;
    });
  }, [resources, progression]);
  
  // Find the active milestone (first non-completed with highest progress)
  const activeMilestone = useMemo(() => {
    // Filter to only active milestones
    const activeMilestones = milestoneCards.filter(card => card.status === MilestoneStatus.ACTIVE);
    
    if (activeMilestones.length === 0) {
      // If no active milestones, find the first locked one
      const lockedMilestone = milestoneCards.find(card => card.status === MilestoneStatus.LOCKED);
      return lockedMilestone || null;
    }
    
    // Sort by progress descending to get the one closest to completion
    return activeMilestones.sort((a, b) => b.progress - a.progress)[0];
  }, [milestoneCards]);
  
  // Update active milestone when it changes
  useEffect(() => {
    if (activeMilestone) {
      setActiveMilestoneId(activeMilestone.milestone.id);
    }
  }, [activeMilestone]);
  
  // Scroll to center active milestone when it changes
  // Initial position and center the active milestone whenever it changes
  useEffect(() => {
    if (!stripRef.current || !activeMilestoneId) return;
    
    // Find the active milestone element
    const activeMilestoneElement = stripRef.current.querySelector(
      `[data-milestone-id="${activeMilestoneId}"]`
    ) as HTMLElement;
    
    if (activeMilestoneElement) {
      // Always center the active milestone (exact center positioning)
      const containerWidth = stripRef.current.offsetWidth;
      const cardWidth = activeMilestoneElement.offsetWidth;
      const cardLeft = activeMilestoneElement.offsetLeft;
      
      // Calculate center position
      const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      
      // Scroll to center the card
      stripRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeMilestoneId]);
  
  // Find the first active milestone and center it
  useEffect(() => {
    // Immediately reset scroll position to ensure we're starting fresh
    if (stripRef.current) {
      stripRef.current.scrollLeft = 0;
    }
    
    // Wait for the DOM to be fully ready
    const initialCenterTimer = setTimeout(() => {
      if (!stripRef.current) return;
      
      console.log("Finding active milestone to center...");
      
      // Get the first active milestone, or first milestone if none active
      let targetMilestoneElement: HTMLElement | null = null;
      
      if (activeMilestoneId) {
        targetMilestoneElement = stripRef.current.querySelector(
          `[data-milestone-id="${activeMilestoneId}"]`
        ) as HTMLElement;
      } else {
        // If no active milestone, find the first visible one
        const firstMilestone = stripRef.current.querySelector('.milestone-card') as HTMLElement;
        if (firstMilestone) {
          targetMilestoneElement = firstMilestone;
        }
      }
      
      if (targetMilestoneElement) {
        const containerWidth = stripRef.current.offsetWidth;
        const cardWidth = targetMilestoneElement.offsetWidth;
        const cardLeft = targetMilestoneElement.offsetLeft;
        
        // Calculate position to center the target milestone
        const scrollPosition = Math.max(0, cardLeft - (containerWidth / 2) + (cardWidth / 2));
        
        console.log("Initial positioning values:", {
          containerWidth,
          cardWidth,
          cardLeft,
          scrollPosition
        });
        
        // Force immediate positioning
        stripRef.current.scrollLeft = scrollPosition;
        
        // Double-check with a further delay
        setTimeout(() => {
          if (stripRef.current && targetMilestoneElement) {
            // Re-calculate in case of any layout shifts
            const updatedCardLeft = targetMilestoneElement.offsetLeft;
            const updatedPosition = updatedCardLeft - (containerWidth / 2) + (cardWidth / 2);
            
            console.log("Double-check position:", {
              currentScroll: stripRef.current.scrollLeft,
              calculatedIdeal: updatedPosition
            });
            
            if (Math.abs(stripRef.current.scrollLeft - updatedPosition) > 10) {
              stripRef.current.scrollLeft = updatedPosition;
            }
          }
        }, 300);
      }
    }, 300); // Longer delay to ensure complete layout
    
    return () => clearTimeout(initialCenterTimer);
  }, []); // Empty dependency array to run once on mount
  
  // Listen for milestone completion events to trigger animation to the next active milestone
  useEffect(() => {
    const handleMilestoneComplete = () => {
      // Find the previously completed milestone (if any)
      const previouslyCompletedMilestones = Object.entries(progression?.milestones || {})
        .filter(([_, data]) => data.completed)
        .map(([id]) => id);
      
      // Store previous active milestone ID for comparison
      const prevActiveMilestoneId = activeMilestoneId;
      
      // After a slight delay to allow state updates, animate to the new active milestone
      setTimeout(() => {
        if (activeMilestone && stripRef.current && activeMilestoneId !== prevActiveMilestoneId) {
          const newActiveMilestoneElement = stripRef.current.querySelector(
            `[data-milestone-id="${activeMilestone.milestone.id}"]`
          ) as HTMLElement;
          
          if (newActiveMilestoneElement) {
            const containerWidth = stripRef.current.offsetWidth;
            const cardWidth = newActiveMilestoneElement.offsetWidth;
            const cardLeft = newActiveMilestoneElement.offsetLeft;
            
            // Smooth scroll animation to center the new active milestone
            stripRef.current.scrollTo({
              left: cardLeft - (containerWidth / 2) + (cardWidth / 2),
              behavior: 'smooth'
            });
          }
        }
      }, 500); // Slightly longer delay to ensure smooth transition
    };

    // Check for milestone completion by monitoring progression state changes
    if (progression?.milestones) {
      handleMilestoneComplete();
    }
  }, [progression?.milestones, activeMilestone, activeMilestoneId]);
  
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
  
  // Display all milestones in a horizontal strip to allow smooth scrolling
  // This ensures we can scroll through the complete milestone history 
  const visibleMilestones = milestoneCards;
  
  return (
    <div className="milestone-progress-strip">
      <div className="milestone-cards-container" ref={stripRef}>
        {/* Milestone cards */}
        <div className="milestone-cards">
          {/* Start spacers */}
          {[...Array(5)].map((_, i) => (
            <div key={`spacer-start-${i}`} className="milestone-card-spacer"></div>
          ))}
          
          {/* Actual milestone cards */}
          {visibleMilestones.map(card => (
            <div 
              key={card.milestone.id}
              data-milestone-id={card.milestone.id}
              className={`milestone-card ${card.status} ${card.milestone.id === activeMilestoneId ? 'active-center' : ''}`}
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
          
          {/* End spacers */}
          {[...Array(5)].map((_, i) => (
            <div key={`spacer-end-${i}`} className="milestone-card-spacer"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressStrip;