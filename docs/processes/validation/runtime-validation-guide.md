# Runtime Validation Guide

This guide provides specific steps for validating runtime behavior in our codebase, based on critical lessons learned from the Dependency Injection implementation.

## Why Runtime Validation Matters

TypeScript compilation and unit tests provide build-time validation but cannot catch many runtime issues:

1. Race conditions
2. Initialization order problems
3. State access before initialization
4. Redux state structure issues
5. Component lifecycle bugs
6. Asynchronous logic failures
7. Event timing problems

## Essential Validation Steps

### 1. Console Error Monitoring

The most critical validation step is checking for console errors during:

```bash
# Start the application in development mode
npm start

# Watch the console during normal operation
# Look for red error messages or yellow warnings
```

**Check these critical moments:**
- Initial application load
- Component mounting and unmounting
- User interactions (clicks, form submissions)
- Resource production and consumption
- State transitions (game stage changes)
- Timer ticks and day changes

### 2. Critical User Flows Validation

After confirming no console errors, validate these essential flows:

| Flow | Validation Steps |
|------|------------------|
| Game Start | 1. Game loads without errors<br>2. Initial resources display correctly<br>3. Timer starts running<br>4. Day counter advances |
| Resource Production | 1. Resources increase at expected rate<br>2. Workers generate resources correctly<br>3. Click actions produce expected resources<br>4. Resource counters update in real-time |
| Building Purchase | 1. Building costs display correctly<br>2. Purchase reduces resources appropriately<br>3. Building appears in building list<br>4. Workers can be assigned to building |
| Stage Progression | 1. Milestone progress updates correctly<br>2. Stage transitions when milestones complete<br>3. New game elements unlock as expected<br>4. UI updates to reflect stage change |
| Win/Lose Conditions | 1. Game recognizes win condition<br>2. Game recognizes lose condition<br>3. Appropriate end game modal displays<br>4. Restart option works correctly |

### 3. Component-Specific Validation

Each major component should be tested individually:

| Component | Validation Steps |
|-----------|------------------|
| ResourceDisplay | 1. All resources display correctly<br>2. Rates update with production changes<br>3. Values update in real-time<br>4. Format correctly for large numbers |
| BuildingPanel | 1. Shows correct buildings<br>2. Displays accurate costs<br>3. Updates worker assignments<br>4. Calculates production correctly |
| MilestoneProgress | 1. Shows current milestones<br>2. Progress updates as resources change<br>3. Completed milestones display correctly<br>4. Active milestone centers in view |
| EventPanel | 1. Events display in proper order<br>2. New events add to list<br>3. Events fire at appropriate times<br>4. Event effects apply correctly |
| GameTimer | 1. Timer advances correctly<br>2. Day counter increments properly<br>3. Day transition events fire<br>4. Offline progress calculates correctly |

### 4. Edge Case Testing

These edge cases have historically caused issues:

1. **Page Refresh**
   - Save state before refresh
   - Reload page
   - Verify state restores correctly

2. **Initial Load Sequence**
   - Check Redux store initialization
   - Verify manager initialization order
   - Ensure no race conditions in setup

3. **State Access Timing**
   - Check for null state access
   - Verify nested state properties exist before access
   - Check subscription timing

4. **Resource Calculation Edge Cases**
   - Zero workers assigned
   - Maximum workers assigned
   - Negative resource production
   - Resource caps reached

5. **Animation Frame Timing**
   - Test with throttled CPU
   - Check for missed frames
   - Verify timer keeps correct time

## Common Runtime Issues

Be vigilant for these common runtime issues:

1. **Uncaught Type Errors**
   - `Cannot read property 'X' of undefined/null`
   - `X is not a function`
   - `undefined is not an object`

2. **Redux State Issues**
   - Missing state properties
   - Incorrect state structure
   - Selector returning new reference each call

3. **React Component Issues**
   - Infinite re-render loops
   - Missing dependency arrays
   - Stale closures in callbacks

4. **Resource Calculation Issues**
   - Incorrect resource rates
   - Resource values not updating
   - Unexpected resource behavior

5. **Timer Problems**
   - Timer not advancing
   - Incorrect day calculation
   - Day counter and progress bar mismatched

## Validation Checklist

Use this checklist before considering any PR complete:

- [ ] **No console errors during normal operation**
- [ ] **All critical user flows work correctly**
- [ ] **Component-specific behaviors validated**
- [ ] **Edge cases tested and working**
- [ ] **Time-based features work correctly**
- [ ] **Visual elements render properly**
- [ ] **Performance is acceptable**
- [ ] **State persistence works between refreshes**

## Reporting Issues

When runtime issues are found:

1. Document the exact steps to reproduce
2. Note the console error messages
3. Capture the Redux state at time of error
4. Fix issues before declaring work complete

## Conclusion

The most important lesson from our dependency injection implementation: **TypeScript and unit tests are NOT enough.**

Runtime validation in the actual application is essential before any PR can be considered ready for review. This guide provides a structured approach to ensure we catch runtime issues early.