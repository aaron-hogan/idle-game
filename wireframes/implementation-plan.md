# UI Redesign Implementation Plan

## Overview
This plan outlines the steps to implement the new UI design with a resource bar at the top, progress indicator, and tabbed navigation system.

## Phase 1: Core Components

### 1. Create `ProgressBar` Component
**Files:**
- `/src/components/progression/ProgressBar.tsx`
- `/src/components/progression/ProgressBar.css`

**Functionality:**
- Display overall game progress as a thin bar
- Support positive/negative progress with different colors
- Show text indicator of current game stage
- Fetch data from progression state

**Implementation Details:**
- Use existing redux selectors for game progress
- Create responsive design with proper mobile support
- Add color coding for progress state

### 2. Create `TopResourceBar` Component
**Files:**
- `/src/components/resources/TopResourceBar.tsx`
- `/src/components/resources/TopResourceBar.css`

**Functionality:**
- Display resources as compact icons with counts
- Support "current/max" display for limited resources
- Automatically adjust based on available screen width
- Show only unlocked resources
- Optional rate indicators (+X/sec)

**Implementation Details:**
- Map resources from state to compact display items
- Create resource item sub-component for icons + numbers
- Add wrap behavior for smaller screens
- Use flexbox for consistent spacing
- Add tooltips with more details on hover/tap

### 3. Create `TabNavigation` Component
**Files:**
- `/src/components/navigation/TabNavigation.tsx`
- `/src/components/navigation/TabNavigation.css`

**Functionality:**
- Navigation tabs for switching between pages
- Highlight active tab
- Support mobile and desktop layouts
- Handle page switching logic

**Implementation Details:**
- Use React Router for page navigation
- Store active tab in local state
- Create tabs that scale appropriately on mobile

## Phase 2: Page Structure

### 1. Create Page Components
**Files:**
- `/src/pages/MainGame.tsx`
- `/src/pages/Upgrades.tsx`
- `/src/pages/Progression.tsx`
- `/src/pages/Settings.tsx`

**Functionality:**
- Each page maintains consistent header components
- Page-specific content renders in main area
- Proper routing between pages

**Implementation Details:**
- Use React Router for defining routes
- Extract shared layout components
- Implement responsive design for all pages

### 2. Update Main Layout Component
**Files:**
- `/src/components/App.tsx`
- `/src/components/App.css`

**Functionality:**
- Implement new layout structure
- Include shared top components on all pages
- Handle routing between different pages
- Maintain debug panel toggling

**Implementation Details:**
- Restructure app component to use React Router
- Move existing components to appropriate pages
- Create shared layout wrapper

### 3. Refactor Resource Generator Area
**Files:**
- `/src/components/resources/ResourceGenerators.tsx`
- `/src/components/resources/ResourceGenerators.css`
- `/src/components/resources/ResourceGenerator.tsx` (individual generator)

**Functionality:**
- Expandable area for resource generators
- New generators appear as they are unlocked
- Each generator has its own click interaction
- Display appropriate stats for each generator

**Implementation Details:**
- List of generators derived from state
- Component for individual generators
- Create grid/flex layout that can expand as needed
- Implement scrolling for overflow on mobile

## Phase 3: Integration and Polish

### 1. Connect Components to State
- Update selectors and hooks to provide data to new components
- Ensure proper state updates when interacting with UI
- Optimize render performance for resource updates

### 2. Add Animations and Visual Feedback
- Add transitions between tabs
- Animate resource count changes
- Visual feedback on interactions
- Progress bar animations

### 3. Mobile Optimizations
- Test and refine responsive behavior
- Add touch-specific interactions
- Optimize layout for various screen sizes
- Ensure tap targets are appropriate sizes

### 4. Implement Tooltips and Help Elements
- Add informational tooltips to resources
- Create help system for new players
- Add visual indicators for new/unlocked content

## Implementation Order

1. **Foundation (Week 1)**
   - Create ProgressBar component
   - Create TopResourceBar component
   - Setup basic routing structure

2. **Core Navigation (Week 1)**
   - Implement TabNavigation component
   - Create page component shells
   - Update App component with new layout

3. **Feature Pages (Week 2)**
   - Implement MainGame page with generators
   - Move existing Upgrades to dedicated page
   - Move Progression tracking to dedicated page
   - Create minimal Settings page

4. **Polish & Testing (Week 3)**
   - Add animations and transitions
   - Implement responsive design refinements
   - Add tooltips and help elements
   - Comprehensive testing across devices

## Technical Considerations

1. **State Management**
   - Maintain Redux for core game state
   - Use local component state for UI-specific state
   - Consider context for shared UI state

2. **Performance**
   - Use React.memo for resource display components
   - Implement virtualization for long lists of generators
   - Optimize render cycles for frequently changing values

3. **Accessibility**
   - Ensure proper keyboard navigation
   - Add appropriate ARIA attributes
   - Test color contrast for progress indicators

4. **Compatibility**
   - Test on various browsers and devices
   - Implement fallbacks for older browsers
   - Ensure graceful degradation on limited devices

## Testing Strategy

1. **Component Tests**
   - Unit tests for individual components
   - Integration tests for page layouts
   - Snapshot tests for UI consistency

2. **Responsive Testing**
   - Test on multiple screen sizes
   - Verify layouts on mobile devices
   - Test orientation changes

3. **User Testing**
   - Gather feedback on usability
   - Test with new and experienced players
   - Verify intuitive navigation