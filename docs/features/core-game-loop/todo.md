# Core Game Loop Todo List

## Resource Click Mechanics
- [ ] Create ClickableResource component in `/src/components/resources/`
- [ ] Add click power property to Resource interface
- [ ] Implement handleResourceClick method in ResourceManager
- [ ] Add visual feedback animations for clicking
- [ ] Update resourcesSlice with click-related actions

## Milestone Integration
- [ ] Update MilestoneProgress component to show clearer feedback
- [ ] Add visual effects for milestone completion
- [ ] Ensure milestone requirements are clearly displayed
- [ ] Connect resource clicks to milestone progress checks

## Upgrade System
- [ ] Create UpgradePanel component for resource production
- [ ] Implement upgradeClickPower method in ResourceManager
- [ ] Design upgrade cost scaling algorithm
- [ ] Add upgrade-related state to Redux store

## Progression UI Improvements
- [ ] Evaluate current "Current Stage: Early Stage" display
- [ ] Fix or remove progression display if not needed
- [ ] Add visual indicators for stage progression
- [ ] Ensure progression system correctly updates with milestones

## Testing
- [ ] Unit tests for ClickableResource component
- [ ] Unit tests for ResourceManager click methods
- [ ] Integration tests for milestone completion via clicks
- [ ] Integration tests for upgrade system

## Polishing
- [ ] Add tooltips explaining game mechanics
- [ ] Improve visual design of clickable elements
- [ ] Add satisfaction effects (particles, sounds) to clicks
- [ ] Ensure mobile-friendly interactions

## Documentation
- [ ] Update summary document with implementation details
- [ ] Document the upgrade system calculations
- [ ] Create user guide explaining core game loop
- [ ] Document integration with existing systems