# Milestone Tracking Implementation Plan

## Overview
Our game already has resource generation for "collective-power" working correctly, but these resources aren't being tracked toward any milestones. The debug panel shows resource amounts but no progress toward milestones. This plan outlines the approach to fix this issue.

## Objectives
- Ensure that "collective-power" resources count toward appropriate milestones
- Display milestone progress correctly in the debug panel
- Create meaningful milestones that match our game's anti-capitalist theme

## Implementation Approach

### 1. Resource and Milestone Review
- Review the existing resources implementation in `/src/constants/resources.ts`
- Examine milestone definitions in `/src/data/progression/milestones.ts`
- Identify mismatches between resource IDs and milestone requirements

### 2. Milestone Updates
- Update early game milestones to track "collective-power" resources
- Create appropriate progression thresholds (10, 50, etc.)
- Ensure milestone definitions follow the correct schema

### 3. Achievement Updates
- Update achievements in `/src/data/progression/achievements.ts` to match new milestone design
- Verify that achievement requirements and rewards reference valid resources

### 4. Testing
- Test resource accumulation and milestone progress tracking
- Verify correct display in the debug panel's Resource tab
- Confirm milestone completion when thresholds are reached

## Tasks
- [ ] Review current milestone implementation
- [ ] Update milestone definitions to use "collective-power"
- [ ] Update achievement definitions to match
- [ ] Test progress tracking in the debug panel
- [ ] Document changes and fixes

## Implementation Prompt
"Update the milestone tracking system to properly track the 'collective-power' resource toward milestones. Replace placeholder resources with 'collective-power' in the milestone definitions, create appropriate thresholds, and ensure the debug panel correctly displays progress. Also update achievements to match the new milestone design."