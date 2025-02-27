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
    // For testing, we can force a specific milestone to be active
    // const forcedActiveMilestone = milestoneCards.find(card => card.milestone.order === 0);
    // if (forcedActiveMilestone) return forcedActiveMilestone;
    
    // Filter to only active milestones
    const activeMilestones = milestoneCards.filter(card => card.status === MilestoneStatus.ACTIVE);
    
    if (activeMilestones.length === 0) {
      // If no active milestones, find the first locked one
      const lockedMilestone = milestoneCards.find(card => card.status === MilestoneStatus.LOCKED);
      
      // If no locked milestone, find the last completed one
      if (!lockedMilestone && milestoneCards.length > 0) {
        const completedMilestones = milestoneCards.filter(card => 
          card.status === MilestoneStatus.COMPLETED).sort((a, b) => 
          b.milestone.order - a.milestone.order
        );
        return completedMilestones.length > 0 ? completedMilestones[0] : milestoneCards[0];
      }
      
      return lockedMilestone || (milestoneCards.length > 0 ? milestoneCards[0] : null);
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
  // Removed duplicate effect - consolidated into the simplified version below
  
  // TEST FUNCTION: Log card positions for debugging
  const logCardPositions = () => {
    if (!stripRef.current) return;
    
    console.log("DEBUG: Container width", stripRef.current.offsetWidth);
    console.log("DEBUG: Container scrollWidth", stripRef.current.scrollWidth);
    console.log("DEBUG: Current scrollLeft", stripRef.current.scrollLeft);
    
    const cards = stripRef.current.querySelectorAll('.milestone-card');
    const positions: any[] = [];
    
    cards.forEach((card, index) => {
      const element = card as HTMLElement;
      const id = element.getAttribute('data-milestone-id');
      const isActive = element.classList.contains('active-center');
      
      positions.push({
        index,
        id,
        isActive,
        offsetLeft: element.offsetLeft,
        offsetWidth: element.offsetWidth
      });
    });
    
    console.log("DEBUG: Card positions", positions);
    
    if (activeMilestoneId) {
      const activeCard = stripRef.current.querySelector(`[data-milestone-id="${activeMilestoneId}"]`) as HTMLElement;
      if (activeCard) {
        console.log("DEBUG: Active card position", {
          id: activeMilestoneId,
          offsetLeft: activeCard.offsetLeft,
          offsetWidth: activeCard.offsetWidth,
          idealScrollLeft: activeCard.offsetLeft - (stripRef.current.offsetWidth / 2) + (activeCard.offsetWidth / 2)
        });
      }
    }
  };
  
  // Super-simplified centering logic with direct approach
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!stripRef.current) return;
      
      // Start with a clean slate
      stripRef.current.scrollLeft = 0;
      
      console.log("SIMPLIFIED TEST: Finding target milestone");
      
      // Find active milestone by ID
      let targetElement: HTMLElement | null = null;
      
      if (activeMilestoneId) {
        targetElement = stripRef.current.querySelector(
          `.milestone-card[data-milestone-id="${activeMilestoneId}"]`
        ) as HTMLElement;
        
        if (targetElement) {
          console.log("Found active milestone by ID:", activeMilestoneId);
        }
      }
      
      // Fallback to first milestone if no active one
      if (!targetElement) {
        targetElement = stripRef.current.querySelector('.milestone-card:not(.milestone-card-spacer)') as HTMLElement;
        console.log("Using first milestone as fallback");
      }
      
      if (targetElement) {
        // Get measurements
        const containerWidth = stripRef.current.offsetWidth;
        const targetWidth = targetElement.offsetWidth;
        const targetLeft = targetElement.offsetLeft;
        
        // Calculate how far from center
        const scrollToCenter = targetLeft - (containerWidth / 2) + (targetWidth / 2);
        
        console.log("Centering calculation:", {
          containerWidth,
          targetWidth,
          targetLeft,
          scrollToCenter
        });
        
        // Apply scroll directly
        stripRef.current.scrollLeft = scrollToCenter;
        
        // Verify final position
        setTimeout(() => {
          if (!stripRef.current) return;
          console.log("Final scroll position:", stripRef.current.scrollLeft);
          
          // For debugging - mark a centered card visually
          const currentCenterX = stripRef.current.scrollLeft + (stripRef.current.offsetWidth / 2);
          console.log("Current center point X:", currentCenterX);
          
          // Find elements that overlap with the center point
          const cards = stripRef.current.querySelectorAll('.milestone-card:not(.milestone-card-spacer)');
          cards.forEach((card) => {
            const element = card as HTMLElement;
            const cardLeft = element.offsetLeft;
            const cardRight = cardLeft + element.offsetWidth;
            
            // Check if card spans the center point
            if (cardLeft <= currentCenterX && cardRight >= currentCenterX) {
              console.log("Card at center:", element.getAttribute('data-milestone-id'));
            }
          });
        }, 100);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeMilestoneId]); // Run when active milestone changes
  
  // Simple animation when active milestone changes
  useEffect(() => {
    // Skip initial render
    if (!activeMilestone || !stripRef.current) return;
    
    // Find the element to center on
    const milestoneElement = stripRef.current.querySelector(
      `[data-milestone-id="${activeMilestone.milestone.id}"]`
    ) as HTMLElement;
    
    if (!milestoneElement) return;
    
    // Calculate center position 
    const containerWidth = stripRef.current.offsetWidth;
    const elementWidth = milestoneElement.offsetWidth;
    const elementLeft = milestoneElement.offsetLeft;
    
    // Smooth scroll to center the element with animation
    console.log("Animating to new active milestone:", {
      id: activeMilestone.milestone.id,
      scrollTo: elementLeft - (containerWidth / 2) + (elementWidth / 2)
    });
    
    stripRef.current.scrollTo({
      left: elementLeft - (containerWidth / 2) + (elementWidth / 2),
      behavior: 'smooth'
    });
    
  }, [activeMilestone?.milestone.id]); // Only trigger on actual milestone ID change
  
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
          {/* Start spacers - add enough to push content right */}
          {[...Array(10)].map((_, i) => (
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
          
          {/* End spacers - match start spacers */}
          {[...Array(10)].map((_, i) => (
            <div key={`spacer-end-${i}`} className="milestone-card-spacer"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressStrip;