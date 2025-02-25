# Timer Fix Plan

## 1. Assessment Phase (COMPLETED)
- ✅ Map all time-related code components across the codebase
- ✅ Identify all timer implementations and execution paths
- ✅ Document how time propagates through the application
- ✅ Find all sources of time updates to game state
- ✅ Create assessment document outlining findings

## 2. Simplification Phase (COMPLETED)
- ✅ Design a single authoritative timer system
- ✅ Create isolation boundaries between timer and game systems
- ✅ Plan removal of redundant timer implementations
- ✅ Establish clear ownership of time propagation
- ✅ Research industry best practices for game timing
- ✅ Document comprehensive implementation strategy

## 3. Implementation Phase (NEXT)
- Build core timer components:
  - Update GameTimer to be single source of truth
  - Modify GameLoop to implement proper fixed timestep
  - Update GameManager to distribute time correctly
- Fix time propagation:
  - Ensure GameManager passes scaled time to systems
  - Update ResourceManager to use scaled time correctly
  - Fix Redux time updates to maintain consistency
- Disable legacy implementations:
  - Remove direct resource tick functionality
  - Ensure only one time path is active
- Add browser-specific improvements:
  - Implement tab visibility handling
  - Add safeguards for timer drift
  - Handle browser throttling scenarios

## 4. Verification Phase (PLANNED)
- Implement accurate measurement tools
- Test timing in various browser conditions
- Validate 1:1 time ratio consistency
- Create comprehensive tests for the timing system
- Document the final solution and architecture

## Key Architectural Decisions

1. **Single Source of Truth**: GameTimer is the authoritative source for time
2. **Fixed Timestep Pattern**: Following industry-standard pattern with accumulator
3. **Precise Timing**: Exclusive use of performance.now() for high-precision timing
4. **Consistent Units**: Seconds used throughout the codebase for time values
5. **Clear API Boundary**: Clean separation between timer and game systems
6. **Browser-Aware**: Handling tab visibility and browser throttling
7. **Explicit Scaling**: Time scale applied at a single point in the system

## Expected Outcome

Upon completion, the game will:
- Maintain accurate 1:1 time ratio between real and game time
- Properly handle browser-specific timing challenges
- Support time scaling through a controlled interface
- Prevent timing issues during tab switching or throttling
- Provide clear debugging tools for monitoring time behavior