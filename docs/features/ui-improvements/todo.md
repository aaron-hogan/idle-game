# UI Improvements - TODO List

## Time System Changes

- [x] Create day calculation utility function
- [x] Update time tracking to use day concept (1 day = 60s)
- [x] Create day progress calculation (percentage within current day)
- [x] Update GameTimer component with day format
- [x] Add sun icon (☀︎) to timer
- [x] Implement background fill progress indicator
- [x] Update speed controls to include 0x (pause) option
- [x] Ensure consistent width across day values (1-999)

## Counter Component Standardization

- [x] Create/update base counter component
- [x] Extract common styling into shared CSS classes
- [ ] Update all resource counters to use base component
- [x] Standardize all icon sizes and placements
- [x] Make all counters same height and layout
- [x] Implement tooltips for all counter elements
- [x] Create consistent hover effects
- [x] Ensure all text sizes match across counters
- [x] Make progress bar color match icon color
- [x] Increase text size for better readability

## Dropdown Improvements

- [x] Create portal-based Dropdown component
- [x] Implement proper positioning relative to trigger
- [x] Add consistent styling for all dropdowns
- [x] Fix z-index and visibility issues
- [x] Extend portal approach to all toolips
- [x] Ensure consistent animation for all dropdowns
- [x] Add tests to verify dropdown styling and functionality
- [x] Fix dropdown styling with inline styles as backup
- [ ] Add proper focus management for keyboard users

## Milestone Progression Strip

- [ ] Create horizontal milestone container
- [ ] Design milestone card components with states (completed, active, locked)
- [ ] Implement centering logic for active milestone
- [ ] Add smooth scroll/transition animations
- [ ] Connect milestone completion to state changes
- [ ] Create visual indicators for milestone states
- [ ] Add "View All" link to milestone list page
- [ ] Ensure responsive design for all screen sizes

## Testing Tasks

- [ ] Test day counter with different values (1, 99, 999)
- [ ] Verify consistent progress indicators
- [ ] Test all dropdown interactions
- [ ] Check tooltip visibility across interface
- [ ] Test milestone progression with multiple states
- [ ] Verify responsive layouts on different screen sizes
- [ ] Test keyboard navigation and accessibility

## Documentation

- [ ] ✅ Create feature plan document
- [ ] ✅ Create implementation summary
- [ ] ✅ Maintain todo list
- [ ] Update user documentation with new concepts
- [ ] Add comments explaining key implementation details
- [ ] Document component props and usage