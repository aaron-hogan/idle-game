# Debug Panel

## Overview
The debug panel provides a unified interface for all debugging functionality in the anti-capitalist idle game. It consolidates multiple debug tools and displays into a single GameDebugger component to improve the development workflow and reduce debugging clutter.

## Core Components

### Data Models
- **TabData Interface**: Defines the structure for debug tabs with properties like id, title, and component
- **MetricsData Interface**: Structures key-value pairs for displaying debug metrics
- **GameLoopStats Interface**: Contains performance metrics for the game loop

### State Management
- **Debug panel uses internal React state**:
  - `activeTab`: Tracks the currently selected tab
  - `isVisible`: Controls the visibility of the debug panel
  - `metrics`: Stores game performance metrics

### Components

#### Main Components
- **GameDebugger**: Container component that hosts the full debug interface
- **TabSystem**: Navigation system for switching between different debugging tools
- **MetricsPanel**: Displays key-value metrics with appropriate styling

#### Tab Components
- **GameLoopDebugTab**: Displays game timing metrics
- **ResourceDebugTab**: Shows resource state and manipulation controls
- **StateDebugTab**: Provides state inspection and modification tools

### Services
- **DebugService**: Singleton service that manages debug functionality:
  - Tracking metrics
  - Providing debug utilities
  - Enabling debug mode in different subsystems

## Usage Guide

### Adding a New Debug Tab

```typescript
// Example tab component
const MyDebugTab: React.FC = () => {
  return (
    <div className="debug-tab">
      <h3>My Debug Feature</h3>
      <div className="debug-content">
        {/* Debug controls and displays */}
      </div>
    </div>
  );
};

// Registering the tab in GameDebugger.tsx
const tabs: TabData[] = [
  { id: 'gameLoop', title: 'Game Loop', component: GameLoopDebugTab },
  { id: 'resources', title: 'Resources', component: ResourceDebugTab },
  { id: 'myTab', title: 'My Feature', component: MyDebugTab }, // New tab
  // ... other tabs
];
```

### Creating a Metrics Display

```typescript
import { MetricsPanel } from 'debug/components/MetricsPanel';

// In your debug tab component
const myMetrics = {
  'Feature Status': 'Active',
  'Processing Time': '0.25ms',
  'Elements': '143',
  'Error Rate': '0%'
};

return (
  <div className="debug-section">
    <h4>Feature Metrics</h4>
    <MetricsPanel metrics={myMetrics} />
  </div>
);
```

## Integration

The debug panel integrates with the game in the following ways:

1. **Game Loop Integration**:
   - Receives timing metrics from GameLoop
   - Displays FPS, frame time, and other performance data
   - Provides controls to adjust game speed

2. **React Components**:
   - Rendered conditionally in development mode
   - Positioned in the bottom-right corner
   - Can be toggled on/off to minimize screen space usage

3. **State Management**:
   - Debug tabs can access Redux state via selectors
   - Some tabs can dispatch actions to modify state
   - Provides real-time state monitoring

## Best Practices

- **Always register new tabs** in GameDebugger.tsx, not in individual components
- **Use MetricsPanel** for consistent metrics display across tabs
- **Group related debug functionality** into a single tab
- **Add clear headers** to organize sections within tabs
- **Include controls and displays** in each tab for interactive debugging
- **Keep debug components separated** from regular game components
- **Use conditional development rendering** for debug-only components
- **Style debug elements distinctly** from regular game UI