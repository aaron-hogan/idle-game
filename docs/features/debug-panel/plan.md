# Anti-Capitalist Idle Game: Debug Panel Plan

## Overview
This document outlines the plan for implementing a consolidated debug panel in our anti-capitalist idle game. The debug panel will combine all debugging tools into a single, organized interface to improve developer productivity and simplify testing.

## Goals
- Create a unified debug interface to replace scattered debugging components
- Implement a tab-based design for organizing different debugging tools
- Provide comprehensive game loop and timing metrics
- Make the debug panel toggleable to reduce UI clutter
- Design an extensible framework for future debugging needs

## Approach
We'll create a GameDebugger container component with a tab-based navigation system. Each tab will focus on different debugging aspects (game loop, resources, state). The panel will be toggleable and positioned to avoid interfering with gameplay. We'll migrate functionality from existing debug tools into this unified interface.

## Timeline
- Core Components and Structure: 1 day
- Game Loop Integration: 1 day
- Migration and UI Implementation: 1 day
- Testing and Documentation: 1 day

## Future Enhancements
- Advanced state visualization tools
- Performance profiling capabilities
- Automated testing tools in debug panel
- Visual debugging for game systems
- Save/load game state from debug panel
- Network request monitoring for future multiplayer features

## Implementation Prompt

```markdown
# Anti-Capitalist Idle Game: Debug Panel Consolidation

Let's implement a consolidated debug panel for our anti-capitalist idle game, following our defensive programming patterns and component architecture. Please create:

1. Create the Debug Panel data models first:
   - TabData interface with proper typing (id, title, component)
   - MetricsData interface for key-value metrics display
   - GameLoopStats interface for performance metrics
   - DebugSettings interface for debug configuration options

2. Develop core debug components:
   - GameDebugger container component with error boundaries
   - TabSystem navigation component with proper state management
   - MetricsPanel reusable display component with validation
   - DebugButton toggleable UI component with defensive rendering

3. Implement the GameLoopDebugTab:
   - FPS monitoring with proper performance API usage
   - Time scale display and controls with validation
   - Game/real time ratio calculation with error handling
   - Performance metrics with color-coded thresholds
   - Time synchronization tools with proper validation

4. Add functionality for analyzing existing debug tools:
   - Analyze current DebugPanel, TickRateTest, and TickRateChecker components
   - Extract unique functionality with proper isolation
   - Migrate time-related debugging features into GameLoopDebugTab
   - Implement better visualization of timing metrics

5. Create additional debug tabs:
   - ResourceDebugTab with resource manipulation controls
   - StateDebugTab with Redux state inspection
   - PlannerTab for resource allocation testing

6. Implement UI features with proper validation:
   - Toggleable visibility with state persistence
   - Draggable position with boundary checking
   - Collapsible sections with state memory
   - Clean styling that stands out from game UI
   - Keyboard shortcuts with proper event handling

7. Integrate with game systems:
   - Connect to GameLoop for performance metrics
   - Implement Redux state monitoring
   - Create resource manipulation hooks
   - Add game speed control integration

8. Write tests and documentation:
   - Component rendering tests
   - Tab switching functionality
   - Metrics accuracy verification
   - Documentation for adding new tabs
   - Examples of common debugging tasks
```