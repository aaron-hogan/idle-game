# Milestone Tracking System - TODO List

## Completed Tasks
- [x] Updated early game milestones to use "collective-power" resource
- [x] Created "First Collective Power" milestone requiring 10 collective power
- [x] Created "Growing Power" milestone requiring 50 collective power
- [x] Updated achievements to match milestone changes
- [x] Verified milestone progress tracking in debug panel
- [x] Documented the implementation and fixes

## Pending Improvements
- [ ] Add visual notification when milestones are completed
- [ ] Implement a dedicated UI component for milestone progress outside debug panel
- [ ] Create more varied milestone requirements beyond simple resource thresholds
- [ ] Add milestone rewards that provide gameplay benefits
- [ ] Create transition animations for milestone completion
- [ ] Implement sound effects for milestone achievements

## Bug Fixes Needed
- [ ] Fix TypeScript errors in milestone progress calculations
- [ ] Address undefined property access in ResourceDebugTab
- [ ] Resolve React warnings related to milestone component rendering
- [ ] Fix progression gameStage property reference in ProgressionDebugTab
- [ ] Ensure consistent Redux state shape between test and production environments

## Future Enhancements
- [ ] Add milestone categories for better organization
- [ ] Implement milestone progress persistence between game sessions
- [ ] Create a milestone tree visualization showing dependencies
- [ ] Add tooltips explaining milestone requirements and rewards
- [ ] Implement conditional milestone visibility based on player progress
- [ ] Create achievement popups with social sharing options