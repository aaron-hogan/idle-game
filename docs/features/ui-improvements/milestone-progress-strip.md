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

## Future Improvements

Potential future enhancements include:

1. Touch gestures for swiping between milestones on mobile
2. Animated transitions between milestone states
3. Milestone category filtering or grouping
4. Notification badges for newly unlocked milestones
5. Hover tooltips with additional milestone details