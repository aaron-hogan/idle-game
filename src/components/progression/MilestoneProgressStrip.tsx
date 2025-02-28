/**
 * Horizontal milestone strip component that displays completed, active and locked milestones
 * Allows smooth scrolling with active milestone centered in the display
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useMemoSelector } from '../../state/hooks';
import { Milestone, GameStage } from '../../interfaces/progression';
import { allMilestones } from '../../data/progression/milestones';
import { Link } from 'react-router-dom';
import './MilestoneProgressStrip.css';

// Status types for visual styling
enum MilestoneStatus {
  COMPLETED = 'completed',
  ACTIVE = 'active',
  LOCKED = 'locked',
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
const MilestoneProgressStrip: React.FC<MilestoneProgressStripProps> = ({ sideCount = 2 }) => {
  // Get current game state from Redux using our enhanced memoized selector
  const resources = useMemoSelector((state: RootState) => state.resources);
  const progression = useMemoSelector((state: RootState) => state.progression);

  // Reference to the milestone container for scrolling
  const stripRef = useRef<HTMLDivElement>(null);

  // State to track the active milestone ID for centering
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Process all milestones and determine their status
  const milestoneCards = useMemo(() => {
    if (!progression?.milestones) return [];

    const result: MilestoneCardData[] = [];

    // For each milestone, determine its status and progress
    allMilestones.forEach((milestone) => {
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
          isVisible: true,
        });
        return;
      }

      // Calculate progress for incomplete milestone
      let totalProgress = 0;
      let requirementCount = 0;

      milestone.requirements.forEach((req) => {
        if (req.type === 'resourceAmount' && req.target && resources[req.target]) {
          const resource = resources[req.target];
          const currentAmount = resource.amount;
          const requiredAmount =
            typeof req.value === 'number' ? req.value : parseFloat(req.value.toString());
          const progress = Math.min(100, (currentAmount / requiredAmount) * 100);

          totalProgress += progress;
          requirementCount++;
        }
      });

      const overallProgress = requirementCount > 0 ? totalProgress / requirementCount : 0;

      // Add to results with appropriate status
      result.push({
        milestone,
        status: overallProgress > 0 ? MilestoneStatus.ACTIVE : MilestoneStatus.LOCKED,
        progress: overallProgress,
        isVisible: true,
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
    const activeMilestones = milestoneCards.filter(
      (card) => card.status === MilestoneStatus.ACTIVE
    );

    if (activeMilestones.length === 0) {
      // If no active milestones, find the first locked one
      const lockedMilestone = milestoneCards.find((card) => card.status === MilestoneStatus.LOCKED);

      // If no locked milestone, find the last completed one
      if (!lockedMilestone && milestoneCards.length > 0) {
        const completedMilestones = milestoneCards
          .filter((card) => card.status === MilestoneStatus.COMPLETED)
          .sort((a, b) => b.milestone.order - a.milestone.order);
        return completedMilestones.length > 0 ? completedMilestones[0] : milestoneCards[0];
      }

      return lockedMilestone || (milestoneCards.length > 0 ? milestoneCards[0] : null);
    }

    // Sort by progress descending to get the one closest to completion
    return activeMilestones.sort((a, b) => b.progress - a.progress)[0];
  }, [milestoneCards]);

  // Memoize the active milestone ID to prevent unnecessary updates
  const memoizedActiveMilestoneId = useMemo(() => {
    return activeMilestone?.milestone.id || null;
  }, [activeMilestone]);

  // Update active milestone when it changes - use the memoized value
  useEffect(() => {
    if (memoizedActiveMilestoneId) {
      setActiveMilestoneId(memoizedActiveMilestoneId);
    }
  }, [memoizedActiveMilestoneId]);

  // TEST FUNCTION: Log card positions for debugging
  const logCardPositions = () => {
    if (!stripRef.current) return;

    console.log('DEBUG: Container width', stripRef.current.offsetWidth);
    console.log('DEBUG: Container scrollWidth', stripRef.current.scrollWidth);
    console.log('DEBUG: Current scrollLeft', stripRef.current.scrollLeft);

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
        offsetWidth: element.offsetWidth,
      });
    });

    console.log('DEBUG: Card positions', positions);

    if (activeMilestoneId) {
      const activeCard = stripRef.current.querySelector(
        `[data-milestone-id="${activeMilestoneId}"]`
      ) as HTMLElement;
      if (activeCard) {
        console.log('DEBUG: Active card position', {
          id: activeMilestoneId,
          offsetLeft: activeCard.offsetLeft,
          offsetWidth: activeCard.offsetWidth,
          idealScrollLeft:
            activeCard.offsetLeft - stripRef.current.offsetWidth / 2 + activeCard.offsetWidth / 2,
        });
      }
    }
  };

  // Simplified centering logic with fixed dimensions
  useEffect(() => {
    // Use a reasonable delay to ensure DOM elements have rendered
    const timer = setTimeout(() => {
      if (!stripRef.current) return;

      // Find active milestone by ID
      let targetElement: HTMLElement | null = null;

      if (memoizedActiveMilestoneId) {
        targetElement = stripRef.current.querySelector(
          `.milestone-card[data-milestone-id="${memoizedActiveMilestoneId}"]`
        ) as HTMLElement;
      }

      // Fallback to first milestone if no active one found
      if (!targetElement) {
        targetElement = stripRef.current.querySelector(
          '.milestone-card:not(.milestone-card-spacer)'
        ) as HTMLElement;
      }

      if (targetElement && stripRef.current) {
        // Get actual measurements rather than using fixed values
        const containerWidth = stripRef.current.offsetWidth;
        const targetWidth = targetElement.offsetWidth;
        const targetLeft = targetElement.offsetLeft;

        // Calculate how far from center
        const scrollToCenter = Math.max(0, targetLeft - containerWidth / 2 + targetWidth / 2);

        // Apply scroll directly
        stripRef.current.scrollLeft = scrollToCenter;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [memoizedActiveMilestoneId]); // Run when memoized active milestone changes

  // Re-center after user stops scrolling
  useEffect(() => {
    if (!stripRef.current) return;

    // Create a debounced function to recenter after scrolling stops
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a new timeout for 2 seconds of inactivity
      scrollTimeout = setTimeout(() => {
        if (!stripRef.current || !memoizedActiveMilestoneId) return;

        // Find the active milestone element
        const targetElement = stripRef.current.querySelector(
          `.milestone-card[data-milestone-id="${memoizedActiveMilestoneId}"]`
        ) as HTMLElement;

        if (targetElement) {
          // Calculate scroll position to center the active milestone
          const containerWidth = stripRef.current.offsetWidth;
          const targetWidth = targetElement.offsetWidth;
          const targetLeft = targetElement.offsetLeft;

          const scrollToCenter = Math.max(0, targetLeft - containerWidth / 2 + targetWidth / 2);

          // Animate scroll back to center
          stripRef.current.scrollTo({
            left: scrollToCenter,
            behavior: 'smooth',
          });
        }
      }, 2000); // 2 seconds delay
    };

    // Add scroll event listener
    stripRef.current.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      if (stripRef.current) {
        stripRef.current.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [memoizedActiveMilestoneId]); // Use memoized ID instead

  // Animation for milestone changes with fixed dimensions
  useEffect(() => {
    // Skip initial render since the main centering effect handles that
    if (!memoizedActiveMilestoneId || !stripRef.current) return;

    // Use a short delay to avoid competing with the main centering logic
    const animationTimer = setTimeout(() => {
      if (!stripRef.current) return;

      // Get the target element
      const targetElement = stripRef.current.querySelector(
        `.milestone-card[data-milestone-id="${memoizedActiveMilestoneId}"]`
      ) as HTMLElement;

      if (!targetElement) return;

      // Get actual measurements
      const containerWidth = stripRef.current.offsetWidth;
      const targetWidth = targetElement.offsetWidth;
      const targetLeft = targetElement.offsetLeft;

      // Calculate scroll position
      const scrollTo = Math.max(0, targetLeft - containerWidth / 2 + targetWidth / 2);

      // Animate scroll
      stripRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }, 600); // Longer delay to ensure it doesn't compete with initial centering

    return () => clearTimeout(animationTimer);
  }, [memoizedActiveMilestoneId]); // Only trigger on memoized milestone ID change

  // If no milestones to display
  if (milestoneCards.length === 0) {
    return (
      <div className="milestone-progress-strip empty">
        <h3>Milestones</h3>
        <p>No milestones available yet</p>
      </div>
    );
  }

  // Calculate scroll limit to prevent scrolling too far
  useEffect(() => {
    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!stripRef.current) return;

      const container = stripRef.current;
      const cards = container.querySelectorAll('.milestone-card:not(.milestone-card-spacer)');

      // If no cards, nothing to do
      if (cards.length === 0) return;

      // Get the rightmost card
      const lastCard = cards[cards.length - 1] as HTMLElement;

      // Calculate maximum scrollable area (account for container width)
      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth - 16); // 16px buffer

      // Prevent scrolling past the end by adding a scroll event listener
      const handleScroll = () => {
        if (container.scrollLeft > maxScrollLeft) {
          container.scrollLeft = maxScrollLeft;
        }

        if (container.scrollLeft < 0) {
          container.scrollLeft = 0;
        }
      };

      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }, 1000); // Longer delay to ensure everything is rendered

    return () => clearTimeout(timer);
  }, [milestoneCards.length]);

  // Memoize the find index operation to reduce calculations
  const activeMilestoneIndex = useMemo(() => {
    return activeMilestone
      ? milestoneCards.findIndex((card) => card.milestone.id === activeMilestone.milestone.id)
      : 0;
  }, [activeMilestone, milestoneCards]);

  // Define a constant for how many milestones to display
  // This limits the scroll length without completely hiding milestones
  const MILESTONES_TO_SHOW = 10;

  // Calculate which milestones should be visible based on some basic rules
  // This ensures the player has a more focused view while still allowing exploration
  const visibleMilestones = useMemo(() => {
    // If we have 10 or fewer milestones total, just show them all
    if (milestoneCards.length <= MILESTONES_TO_SHOW) {
      return milestoneCards;
    }

    // Find the index of the active milestone - use the memoized ID to prevent dependencies on state
    const activeIndex = milestoneCards.findIndex(
      (card) => card.milestone.id === memoizedActiveMilestoneId
    );

    // If no active milestone found, show the first few milestones
    if (activeIndex === -1) {
      return milestoneCards.slice(0, MILESTONES_TO_SHOW);
    }

    // Calculate how many milestones to show on each side of the active one
    const halfRange = Math.floor((MILESTONES_TO_SHOW - 1) / 2);

    // Calculate the start and end indices, ensuring we always show MILESTONES_TO_SHOW total cards
    let startIndex = Math.max(0, activeIndex - halfRange);
    const endIndex = Math.min(milestoneCards.length - 1, startIndex + MILESTONES_TO_SHOW - 1);

    // If we hit the end, adjust the start to ensure we always show MILESTONES_TO_SHOW cards
    if (endIndex - startIndex + 1 < MILESTONES_TO_SHOW) {
      startIndex = Math.max(0, endIndex - MILESTONES_TO_SHOW + 1);
    }

    // Return the slice of milestones that are within our visible range
    return milestoneCards.slice(startIndex, endIndex + 1);
  }, [milestoneCards, memoizedActiveMilestoneId]);

  return (
    <div className="milestone-progress-strip">
      <div className="milestone-cards-container" ref={stripRef}>
        {/* Milestone cards */}
        <div className="milestone-cards">
          {/* Start spacers - add enough to push content right */}
          <div className="milestone-scroll-bounds start-bounds">
            {[...Array(3)].map((_, i) => (
              <div key={`spacer-start-${i}`} className="milestone-card-spacer"></div>
            ))}
          </div>

          {/* Actual milestone cards */}
          <div className="milestone-scroll-bounds milestone-cards-content">
            {visibleMilestones.map((card) => (
              <div
                key={card.milestone.id}
                data-milestone-id={card.milestone.id}
                className={`milestone-card ${card.status} ${card.milestone.id === memoizedActiveMilestoneId ? 'active-center' : ''}`}
              >
                <div className="milestone-state-indicator"></div>

                <div className="milestone-content">
                  <div className="milestone-header">
                    <span className="milestone-name">{card.milestone.name}</span>
                    {card.status !== MilestoneStatus.COMPLETED && (
                      <span className="milestone-percentage">{Math.floor(card.progress)}%</span>
                    )}
                  </div>

                  <div className="milestone-description">{card.milestone.description}</div>

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

          {/* End spacers - match start spacers */}
          <div className="milestone-scroll-bounds end-bounds">
            {[...Array(3)].map((_, i) => (
              <div key={`spacer-end-${i}`} className="milestone-card-spacer"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressStrip;
