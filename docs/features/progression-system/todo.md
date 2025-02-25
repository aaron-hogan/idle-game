# Progression System - Todo List

## System Integration

- [ ] Connect progression system with Event system
  - [ ] Trigger milestone completion based on story events
  - [ ] Unlock story events based on milestone completion
  
- [ ] Add save/load support
  - [ ] Include progression state in save data
  - [ ] Restore progression state on game load
  - [ ] Verify milestone/achievement restoration
  
- [ ] Add hooks for Opposition system (future feature)
  - [ ] Create API for tracking opposition to player progress
  - [ ] Add opposition-related milestones and achievements

## Test Infrastructure

- [x] Fix Resource interface string indexing issues
  - [x] Update Resource interface to support string indexing
  - [ ] Update related utility functions and tests (ResourceUtils)
  
- [x] Update GameState interface
  - [x] Align interface with actual usage
  - [ ] Update test fixtures to match new interface (Add startDate property to mocks)
  
- [ ] Fix Redux store integration
  - [ ] Include progression slice in test stores
  - [ ] Update mock store configurations
  - [ ] Fix gameStage test fixtures missing `startDate` property
  
- [ ] Fix typing issues in tests
  - [ ] Fix string indexing in resourceUtils.test.ts
  - [ ] Fix GameState mock objects to include startDate property
  - [ ] Fix RootState mocks to include progression slice
  
- [ ] Add comprehensive test suite
  - [ ] Unit tests for ProgressionManager
  - [ ] Integration tests for progression system
  - [ ] UI component tests

## UI Enhancements

- [ ] Add visual effects for milestone completion
  - [ ] Create animation for newly completed milestones
  - [ ] Add celebratory effect for stage advancement
  
- [ ] Implement notification system
  - [ ] Show toast notifications for milestone completion
  - [ ] Create achievement unlock notification
  - [ ] Add stage advancement celebration
  
- [ ] Improve UX with tooltips and help text
  - [ ] Add requirement tooltips for incomplete milestones
  - [ ] Create help section explaining progression system
  - [ ] Add tooltips for achievement categories

## Feature Extensions

- [ ] Implement branching progression paths
  - [ ] Add choice-based milestones
  - [ ] Create alternative progression branches
  - [ ] Allow multiple solution paths
  
- [ ] Create player-defined goals system
  - [ ] Allow players to set custom milestones
  - [ ] Track progress toward player goals
  - [ ] Reward completion of custom goals
  
- [ ] Add social movement growth mechanics
  - [ ] Tie progression to movement size and power
  - [ ] Create movement-building milestones
  - [ ] Link stage advancement to movement growth

## Bug Fixes

- [x] Fix core functionality issues
  - [x] Fix React hooks imports in ProgressionTracker
  - [x] Re-enable ProgressionTracker component in App.tsx
  - [x] Re-enable progression checking in GameManager.ts

- [x] Fix type safety issues
  - [x] Correct Resource interface to use proper string indexing
  - [x] Fix resource access in ProgressionManager
  - [x] Update GameState interface to match usage

- [ ] Fix milestone requirement evaluation
  - [ ] Address edge cases in requirement checking
  - [ ] Improve error handling for invalid requirements
  
- [ ] Resolve achievement reward issues
  - [ ] Ensure all rewards apply correctly
  - [ ] Add logging for reward application
  
- [ ] Fix stage advancement edge cases
  - [ ] Handle rapid milestone completion
  - [ ] Ensure proper milestone visibility on stage change

## Performance Optimizations

- [x] Optimize UI rendering
  - [x] Implement improved throttling to prevent UI flickering
  - [x] Add proper memoization for better component rendering
  
- [ ] Optimize requirement checking
  - [ ] Cache requirement evaluation results
  - [ ] Only re-evaluate when dependencies change
  
- [ ] Improve progression state structure
  - [ ] Enhance normalization for faster lookups
  - [ ] Minimize state updates
  
- [ ] Further UI rendering optimizations
  - [ ] Implement progressive loading for achievement lists
  - [ ] Add virtualization for long milestone lists