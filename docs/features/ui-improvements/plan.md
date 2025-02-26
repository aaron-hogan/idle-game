# UI Improvements Plan

## Overview

This document outlines planned UI improvements to enhance the game's visual consistency, introduce a day-based time concept, and create a more intuitive milestone progression system.

## Goals

1. Replace the hour/minute/second time display with a day-based system
2. Create consistent counter components across all game metrics
3. Implement a horizontal milestone progression strip
4. Improve dropdown visibility and interaction

## Implementation Details

### 1. Day-Based Time Counter

- **Day Concept**: Replace hours/minutes with days (1-999)
- **Duration**: Each day lasts 60 seconds of real time
- **Visual Indicator**: Counter background fills to show progress within the current day
- **Format**: "Day XXX" with consistent width
- **Layout**: ☀︎ Day 1 1x (matching power counter's layout)
- **Speed Controls**: 0x (paused), 1x, 2x, 5x, 10x in dropdown

### 2. Consistent Counter Components

- All counters follow the same layout pattern:
  - Left icon with specific meaning
  - Center value with consistent width
  - Right rate/speed indicator (clickable for options when applicable)
- Consistent font sizes, colors, and spacing
- Identical hover effects and tooltips
- Same background fill effect for progress indicators

### 3. Milestone Progression Strip

- Horizontal, center-justified strip above resource generators
- Current milestone always centered in view
- Completed milestones to the left (with completed styling)
- Upcoming milestones to the right (with locked styling)
- Smooth slide animation when progressing to next milestone
- Link to view the complete milestone list on a dedicated page
- Visual continuity to show progression history

### 4. Dropdown Improvements

- Portal-based rendering to ensure visibility regardless of container overflow
- Consistent styling across all dropdowns
- Improved positioning relative to trigger elements
- Enhanced click-outside behavior

## Technical Approach

1. **Unified Components**:
   - Create/update base counter component
   - Extract common dropdown functionality
   - Create milestone strip container and cards

2. **State Management**:
   - Update time tracking for day-based system
   - Create milestone progression state
   - Handle counter display consistency

3. **Visual Styling**:
   - Standardize counter dimensions and typography
   - Create consistent state indicators (active, completed, locked)
   - Implement progress indicators

## Implementation Sequence

1. Update time utilities and day concept
2. Create unified counter component
3. Update GameTimer to use day format
4. Standardize all resource counters
5. Implement milestone progression strip
6. Connect milestone logic to progression
7. Final testing and adjustments

## Design Mockup

```
Header:
☀︎ Day 1 1x    ⚡10.2 +0.1/s    $ 50.0 +5.0/s    etc...

Milestone Strip:
    [DONE]    [DONE]    [ACTIVE]    [LOCKED]    [LOCKED]
     ◀───────────┃─────────────▶
                 ▼
        Resource Generators
           [GENERATOR 1]
           [GENERATOR 2]
               etc...
```