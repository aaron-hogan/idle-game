# Milestone Tracking Fix

## Summary
The milestone tracking system was updated to properly track progress of the "collective-power" resource toward game milestones. Previously, milestones were configured to track non-existent resources, resulting in no progress being shown in the debug panel.

## Changes Made
1. Updated `/src/data/progression/milestones.ts` to include milestones tracking "collective-power":
   - Added "First Collective Power" milestone requiring 10 collective power
   - Added "Growing Power" milestone requiring 50 collective power
   - Replaced references to placeholder resources with the actual implemented "collective-power" resource

2. Updated `/src/data/progression/achievements.ts` to match the milestone changes:
   - Added "Power in Numbers" achievement for collecting 5 collective power
   - Adjusted achievement rewards to provide collective power resources

## Implementation Details
The milestone tracking system works through the ProgressionManager which:
1. Pulls resource values from the Redux store
2. Compares current resource values against milestone requirements
3. Calculates progress percentages for display in the debug panel
4. Triggers milestone completion when requirements are met

The ResourceDebugTab in the debug panel shows:
- Current resource amounts
- Next milestone requirements for each resource
- Progress bars visualizing progress toward the next milestone

## Testing Results
- Verified that the "collective-power" resource now shows progress toward milestones in the debug panel
- Confirmed that the debug panel correctly displays "First Collective Power" as the next milestone
- Progress percentage calculation is working correctly
- Milestone completion triggers correctly when reaching the required values

## Next Steps
- Consider adding more varied milestone requirements beyond basic resource thresholds
- Improve milestone completion notifications and rewards
- Add visual feedback when milestones are achieved outside the debug panel