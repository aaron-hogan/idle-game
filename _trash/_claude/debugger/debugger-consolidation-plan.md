# Debug Panel Consolidation Plan

## Plan

We need to reorganize our debugging interface by:

1. Creating a comprehensive, unified "Game Debugger Panel" that replaces the current implementations
2. Moving the panel to the bottom-right corner with a toggle-able interface (already implemented)
3. Organizing the debug functionality into tabs, with "Game Loop" being the first tab
4. Incorporating functionality from both existing debug panels, prioritizing the bottom-right panel

The existing debug system has two parts:
- A top-right fixed DebugPanel (metrics only)
- A bottom-right toggle-able iframe panel via the debug button

We want to keep the bottom-right toggle-able panel approach, but enhance it with proper tabs and consolidate all debugging functionality there.

## Task-Track

1. **Create New GameDebugger Component**
   - Create a new React component to replace both existing debug panels
   - Set up tab system for different debugging categories
   - Start with "Game Loop" tab that includes all timing metrics

2. **Organize UI Elements**
   - Style the component to appear at bottom-right with toggle button
   - Create tabs system for future expandability
   - Create info panels for metrics with appropriate styling 

3. **Migrate Functionality**
   - Move timer statistics from existing debug panels to new component
   - Keep critical features like "Reset Scale" and "Sync Time" buttons
   - Potentially add new debugging functions for game loop (timeline view, rate adjustment)

4. **Integration**
   - Remove existing debug panels from App.tsx
   - Integrate new GameDebugger component
   - Update debug/index.ts to handle new component

5. **Future Extensions**
   - Design tabs for: Resources, Buildings, Tasks
   - Add placeholders for planned debugging sections

## Documentation

The Game Debugger Panel will follow these design principles:

1. **Modular**: Using a tab-based interface to expand with new debug sections
2. **Togglable**: Hidden by default with a button to toggle visibility
3. **Comprehensive**: All game metrics in one place
4. **Developer-focused**: Clear data visualization with debug controls

The first implementation will include:
- Game Loop stats (FPS, time ratio, scale)
- Time control tools (reset scale, sync time)
- React component-based implementation (not iframe)
- Positioned in the bottom-right corner with toggle button

Future tabs will include:
- Resources tab (view/modify resources)
- Buildings tab (view/modify buildings)
- Tasks tab (view/trigger tasks)
- Game State tab (view/edit Redux state)