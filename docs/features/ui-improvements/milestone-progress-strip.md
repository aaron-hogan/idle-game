# Milestone Progress Strip

## Overview

The Milestone Progress Strip provides a visual timeline of the player's progression through the game, showing completed milestones, the current active milestone, and upcoming locked milestones in a horizontal scrollable format.

## Key Features

- **Timeline Visualization**: Displays milestones as a connected sequence of achievements
- **State Indicators**: Visual indicators for completed, active, and locked milestones
- **Auto-centering**: Active milestone is automatically centered in the viewport
- **Smooth Scrolling**: Animated transitions when moving between milestones
- **Progress Tracking**: Shows percentage completion for in-progress milestones
- **Navigation Dots**: Visual reference for overall position in milestone sequence
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Limited Scrolling**: Shows only 10 milestones at a time to prevent infinite scrolling
- **Auto-recenter**: Automatically returns to the active milestone after 2 seconds of inactivity
- **Scroll Snapping**: Milestones snap into place during slow scrolling for better positioning

## Implementation Details

### Component Structure

The `MilestoneProgressStrip` component processes milestone data from the Redux store and organizes it into a visual timeline:

```tsx
const MilestoneProgressStrip: React.FC<MilestoneProgressStripProps> = ({ 
  sideCount = 2
}) => {
  // State from Redux
  const resources = useSelector((state: RootState) => state.resources);
  const progression = useSelector((state: RootState) => state.progression);
  
  // Refs and state for scrolling behavior
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  
  // Process milestones and determine their status
  const milestoneCards = useMemo(() => {
    // Logic to process milestones and determine completion status
    // Returns array of MilestoneCardData objects
  }, [resources, progression]);
  
  // Find the active milestone
  const activeMilestone = useMemo(() => {
    // Logic to find active milestone
  }, [milestoneCards]);
  
  // Effect to center the active milestone
  useEffect(() => {
    // Scrolling logic
  }, [activeMilestoneId]);

  return (
    <div className="milestone-progress-strip">
      {/* Header with title and View All link */}
      
      {/* Timeline connector with status dots */}
      
      {/* Milestone cards */}
      
      {/* Navigation indicators */}
    </div>
  );
};
```

### Status Tracking

Milestones are categorized into three status types:

1. **Completed**: Milestones that have been achieved (stored in game state)
2. **Active**: In-progress milestones with some progress made
3. **Locked**: Future milestones with no progress

Each status has distinct visual styling to provide clear feedback to the player.

### Visual Timeline

The component includes a connecting line between milestones with dots representing each milestone's status:

```tsx
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
```

### Auto-Centering Logic

When the active milestone changes, the component automatically scrolls to center it in the viewport:

```tsx
// Initial centering when active milestone changes
useEffect(() => {
  // Use a reasonable delay to ensure DOM elements have rendered
  const timer = setTimeout(() => {
    if (!stripRef.current) return;
    
    // Find active milestone by ID
    let targetElement: HTMLElement | null = null;
    
    if (activeMilestoneId) {
      targetElement = stripRef.current.querySelector(
        `.milestone-card[data-milestone-id="${activeMilestoneId}"]`
      ) as HTMLElement;
    }
    
    // Fallback to first milestone if no active one found
    if (!targetElement) {
      targetElement = stripRef.current.querySelector('.milestone-card:not(.milestone-card-spacer)') as HTMLElement;
    }
    
    if (targetElement && stripRef.current) {
      // Get actual measurements rather than using fixed values
      const containerWidth = stripRef.current.offsetWidth;
      const targetWidth = targetElement.offsetWidth;
      const targetLeft = targetElement.offsetLeft;
      
      // Calculate how far from center
      const scrollToCenter = Math.max(0, targetLeft - (containerWidth / 2) + (targetWidth / 2));
      
      // Apply scroll directly
      stripRef.current.scrollLeft = scrollToCenter;
    }
  }, 500);
  
  return () => clearTimeout(timer);
}, [activeMilestoneId]);

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
      if (!stripRef.current || !activeMilestoneId) return;
      
      // Find the active milestone element
      const targetElement = stripRef.current.querySelector(
        `.milestone-card[data-milestone-id="${activeMilestoneId}"]`
      ) as HTMLElement;
      
      if (targetElement) {
        // Calculate scroll position to center the active milestone
        const containerWidth = stripRef.current.offsetWidth;
        const targetWidth = targetElement.offsetWidth;
        const targetLeft = targetElement.offsetLeft;
        
        const scrollToCenter = Math.max(0, targetLeft - (containerWidth / 2) + (targetWidth / 2));
        
        // Animate scroll back to center
        stripRef.current.scrollTo({
          left: scrollToCenter,
          behavior: 'smooth'
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
}, [stripRef.current, activeMilestoneId]);
```

## Component Integration

The component is integrated into the MainGame page to provide a persistent view of progression:

```tsx
const MainGame: React.FC = () => {
  return (
    <div className="page-content">
      {/* Horizontal milestone strip above generators */}
      <div className="horizontal-milestone-strip">
        <MilestoneProgressStrip sideCount={2} />
      </div>
      
      {/* Resource generators */}
      <ResourceGenerators />
    </div>
  );
};
```

## Visual Design

The component uses a consistent color scheme and design language:

- **Completed Milestones**: Green accents with check mark indicators
- **Active Milestones**: Blue accents with progress percentage
- **Locked Milestones**: Gray styling with locked status indicator
- **Timeline Connector**: Horizontal line connecting all milestones
- **Status Dots**: Colored dots on the timeline indicating milestone status

## Responsive Behavior

The component adapts to different screen sizes:

- **Desktop**: Shows multiple milestones with detailed descriptions
- **Tablet**: Maintains visibility of multiple milestones with slightly reduced content
- **Mobile**: Focuses on active milestone with reduced width cards
- **Small Screens**: Truncates description text and simplifies layout

### Visible Milestone Limiting

To prevent infinite scrolling, the component limits the number of visible milestones:

```tsx
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
  
  // Find the index of the active milestone
  const activeIndex = milestoneCards.findIndex(
    card => card.milestone.id === activeMilestoneId
  );
  
  // If no active milestone found, show the first few milestones
  if (activeIndex === -1) {
    return milestoneCards.slice(0, MILESTONES_TO_SHOW);
  }
  
  // Calculate how many milestones to show on each side of the active one
  const halfRange = Math.floor((MILESTONES_TO_SHOW - 1) / 2);
  
  // Calculate the start and end indices, ensuring we always show MILESTONES_TO_SHOW total cards
  let startIndex = Math.max(0, activeIndex - halfRange);
  let endIndex = Math.min(milestoneCards.length - 1, startIndex + MILESTONES_TO_SHOW - 1);
  
  // If we hit the end, adjust the start to ensure we always show MILESTONES_TO_SHOW cards
  if (endIndex - startIndex + 1 < MILESTONES_TO_SHOW) {
    startIndex = Math.max(0, endIndex - MILESTONES_TO_SHOW + 1);
  }
  
  // Return the slice of milestones that are within our visible range
  return milestoneCards.slice(startIndex, endIndex + 1);
}, [milestoneCards, activeMilestoneId]);
```

### Scroll Snapping

CSS is used to implement scroll snapping for better positioning:

```css
.milestone-cards-container {
  /* Other properties */
  scroll-snap-type: x proximity; /* Enable scroll snapping */
}

.milestone-card {
  /* Other properties */
  scroll-snap-align: center; /* Snap cards to center when scrolling */
}
```

## Future Improvements

Potential future enhancements include:

1. Touch gestures for swiping between milestones on mobile
2. Animated transitions between milestone states
3. Milestone category filtering or grouping
4. Notification badges for newly unlocked milestones
5. Hover tooltips with additional milestone details
6. Filter view options (completed only, upcoming only, etc.)
7. Zoom controls for viewing more or fewer milestones at once