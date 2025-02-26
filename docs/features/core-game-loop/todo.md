# Core Game Loop Todo List

## Resource Click Mechanics
- [x] Create ClickableResource component in `/src/components/resources/`
- [x] Add click power property to Resource interface
- [x] Implement handleResourceClick method in ResourceManager
- [x] Add visual feedback animations for clicking
- [x] Update resourcesSlice with click-related actions

## Milestone Integration
- [x] Update MilestoneProgress component to show clearer feedback
- [x] Add visual effects for milestone completion
- [x] Ensure milestone requirements are clearly displayed
- [x] Connect resource clicks to milestone progress checks

## Upgrade System
- [x] Create UpgradePanel component for resource production
- [x] Implement upgradeClickPower method in ResourceManager
- [x] Design upgrade cost scaling algorithm
- [x] Add upgrade-related state to Redux store

## Progression UI Improvements
- [x] Evaluate current "Current Stage: Early Stage" display
- [x] Fix or remove progression display if not needed
- [x] Add visual indicators for stage progression
- [x] Ensure progression system correctly updates with milestones

## Testing
- [ ] Unit tests for ClickableResource component
- [ ] Unit tests for ResourceManager click methods
- [ ] Integration tests for milestone completion via clicks
- [ ] Integration tests for upgrade system

## Polishing
- [x] Add tooltips explaining game mechanics
- [x] Improve visual design of clickable elements
- [x] Add satisfaction effects (particles) to clicks
- [x] Ensure mobile-friendly interactions

## Documentation
- [x] Update summary document with implementation details
- [x] Document the upgrade system calculations
- [x] Create user guide explaining core game loop
- [x] Document integration with existing systems