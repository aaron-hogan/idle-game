# Timer System Assessment

## Game Loop Implementations

1. **GameLoop (Active)** - `/src/core/GameLoop.ts`
   - Primary implementation using fixed timestep pattern
   - Uses requestAnimationFrame with fixed delta (1.0/tickRate)
   - Default tickRate = 1 Hz (1 update per second)
   - Caps max frame time to 100ms
   - Uses performance.now() for precision timing
   - Properly processes fixed updates with consistent time steps

2. **GameLoopManager (Disabled)** - `/src/managers/GameLoopManager.ts`
   - Legacy implementation marked as "DISABLED"
   - Uses similar approach to GameLoop but without accumulator pattern
   - Would have dispatched actions to Redux store

3. **systems/gameLoop (Disabled)** - `/src/systems/gameLoop.ts`
   - More complex legacy implementation marked as "DISABLED"
   - Would have integrated with Redux and offline progression

4. **GameTimer (New)** - `/src/core/GameTimer.ts`
   - Recently created implementation
   - Handles game time tracking with time scale support
   - Uses performance.now() for precision timing
   - Properly tracks elapsed real time vs. game time

5. **Direct Resource Tick (Alternative)** - `/src/patches/resourceTickFix.ts`
   - Direct setInterval approach bypassing game loop
   - Directly updates resources every 1 second
   - Updates Redux store game time
   - Not clear if this is currently active or used as a fallback

## Time Propagation Flow

1. **Time Source**
   - `GameLoop` processes requestAnimationFrame
   - Fixed timestep of 1.0 / tickRate seconds (default 1.0s)
   - Calls registered handlers with consistent deltaTime

2. **Time Processing**
   - `GameManager.update()` receives deltaTime from GameLoop
   - Gets gameTimeScale from Redux store
   - Calculates scaledDeltaTime = deltaTime * gameTimeScale
   - Updates Redux game time with unscaled deltaTime
   - Passes unscaled deltaTime to ResourceManager

3. **Time Consumers**
   - ResourceManager.updateResources() receives deltaTime
   - Multiplies resource production rates by deltaTime
   - Redux store maintains totalPlayTime updated by GameManager
   - TaskManager uses absolute timestamps rather than deltas

## Time Storage

1. **Game Time State (Redux)**
   - totalPlayTime: Accumulated game time in seconds
   - lastSaveTime: Timestamp of last save in milliseconds
   - tickRate: Milliseconds per tick (default 1000ms)
   - gameTimeScale: Multiplier for game time (default 1.0)

2. **Debug Measurement**
   - TickRateChecker monitors elapsed real time vs. game time
   - Calculates ratio that should be 1.0 for correct timing

## Identified Issues

1. **Inconsistent Time Scaling**
   - GameManager calculates scaledDeltaTime but appears to use unscaled time for both:
     - addPlayTime (Redux game time update)
     - updateResourceSystem (resource generation)
   - Time scale not consistently applied when intended

2. **Multiple Time Sources**
   - Some code uses Date.now() while other uses performance.now()
   - Time sources not always consistent across the codebase

3. **Mixed Time Units**
   - Some functions use milliseconds, others use seconds
   - Transitions between units could introduce error

4. **Potential Active Patches**
   - resourceTickFix potentially providing a parallel time update path
   - Not clear if both GameLoop and resourceTickFix are actively updating time

5. **Debug Tools**
   - TickRateChecker comparing incorrect time points
   - Possible inaccurate time ratio calculations

6. **Time Update Frequency**
   - GameManager updates play time on every tick (1Hz)
   - Idle games typically require much higher precision
   - 5x speed could result from accumulated rounding errors

## The 5x Speed Bug Root Cause Candidates

1. **Time Duplication in Handlers**
   - If multiple systems are updating time for the same frame, 
     multiple time updates could occur

2. **Time Unit Confusion**
   - Potential conversion errors between milliseconds and seconds

3. **Double Time Processing**
   - GameLoop and direct resource tick might both be active

4. **Inaccurate Measuring**
   - Debug components could be measuring incorrectly

5. **Missing Time Scale Application**
   - Time scale calculated but not consistently applied
   
6. **Rounding/Precision Issues**
   - 5x being close to π²/2 (4.934) suggests a possible mathematical error
   - Potentially related to requestAnimationFrame inconsistencies

## Next Steps

1. **Simplify Time Architecture**
   - Create a single authoritative time source
   - Ensure consistent time units throughout the codebase
   - Implement proper time scaling in a single location

2. **Disable Legacy Systems**
   - Ensure only one time system is active
   - Remove or clearly disable alternative time systems

3. **Build Comprehensive Tests**
   - Test time accuracy with external references
   - Validate 1:1 time ratio under different conditions

4. **Create Better Monitoring**
   - Improve TickRateChecker for accurate measurements
   - Add logging of all time-related operations