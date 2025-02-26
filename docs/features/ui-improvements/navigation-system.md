# Navigation System Implementation

## Overview

The Navigation System provides a tabbed interface for moving between different game sections, improving user experience by organizing content into logical categories and reducing UI clutter.

## Features

- Bottom tab navigation for switching between game sections
- React Router integration for SPA (Single Page Application) experience
- Dedicated pages for different game features:
  - Main Game (generators)
  - Upgrades
  - Progression tracking
  - Settings

## Components

### TabNavigation

The `TabNavigation` component renders a fixed navigation bar at the bottom of the screen with tabs for each main section of the game.

```tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TabNavigation.css';

export interface NavTab {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

// Usage with DEFAULT_TABS
<TabNavigation tabs={DEFAULT_TABS} />
```

### Page Components

Each major section of the game has its own dedicated page component:

- **MainGame**: Displays resource generators and milestone progress
- **Upgrades**: Shows available upgrades for different resources
- **Progression**: Tracks overall game progress, achievements, and milestones
- **Settings**: Provides game configuration options and save management

## Implementation Details

### Routing System

React Router is used to handle navigation between different pages without page reloads:

```tsx
<Router>
  <div className="game-layout">
    {/* Top bar with timer and resources */}
    <div className="top-bar">...</div>
    
    {/* Main content area with routes */}
    <div className="main-content-container">
      <Routes>
        <Route path="/" element={<MainGame />} />
        <Route path="/upgrades" element={<Upgrades />} />
        <Route path="/progression" element={<Progression />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
    
    {/* Bottom navigation */}
    <TabNavigation tabs={DEFAULT_TABS} />
  </div>
</Router>
```

### CSS Structure

The navigation system uses a flex layout:

```css
/* Base layout */
.game-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Main content container for routes */
.main-content-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Bottom navigation */
.tab-navigation {
  background-color: #121212;
  border-top: 1px solid #333;
  padding: 5px 0;
  position: relative;
  z-index: 100;
}
```

## Benefits

1. **Improved Organization**: Content is logically separated into different sections
2. **Reduced Clutter**: Each page focuses on a specific aspect of gameplay
3. **Better Mobile Experience**: Tab navigation is familiar on mobile devices
4. **Scalability**: Easy to add new sections as the game expands
5. **Performance**: Only loads components for the current view

## Future Improvements

- Add animations when switching between tabs
- Implement tab badges for notifications (e.g., new upgrades available)
- Add swipe gestures for switching tabs on mobile devices
- Support keyboard navigation between tabs